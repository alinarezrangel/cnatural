/************************************************
**********************
*** CNatural: Remote embed systems controll.
*** * main file for the server.
**********************

Copyright 2016 Alejandro Linarez Rangel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**********************
************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#include <microhttpd.h>

#include "ajaxcore.h"

#define PORT 8888

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	size_t upload_data_size,
	void** conn_klass
);
char* mystrdup(const char* str);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;

	daemon = MHD_start_daemon(
		MHD_USE_SELECT_INTERNALLY,
		PORT,
		NULL,
		NULL,
		&request_handler,
		NULL,
		MHD_OPTION_END
	);
	if(daemon == NULL)
	{
		perror("Error getting the daemon");
		exit(EXIT_FAILURE);
	}

	getchar();

	MHD_stop_daemon(daemon);
	exit(EXIT_SUCCESS);
}

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	size_t upload_data_size,
	void** conn_klass
)
{
	int ret = 0;
	struct MHD_Response* res = NULL;
	FILE* resc = NULL;
	char* ufile = NULL;
	char* final_file_name = NULL;
	size_t i = 0;
	int urlsize = 0;
	cnatural_ajax_argument_t arg;
	int use_ajax = -1;
	char* ext = NULL;
	int filedesc = 0;
	struct stat fdstat;

	if(strcmp(method, "POST") == 0)
	{
		printf("Handling AJAX to %s\n", url);
		arg.attached_data = upload_data;
		arg.attached_data_size = upload_data_size;
		arg.output_buffer = NULL;
		arg.output_mimetype = NULL;
		arg.output_buffer_size = 0;
		use_ajax = cnatural_try_ajax(url, &arg);

		if(use_ajax == -1)
		{
			perror("Using ajax");
			return MHD_NO;
		}
		if(use_ajax == 1)
		{
			printf("The AJAX method %s not exist\n", url);
			return MHD_NO;
		}

		res = MHD_create_response_from_buffer(
			arg.output_buffer_size,
			(void*) arg.output_buffer,
			MHD_RESPMEM_PERSISTENT
		);
		MHD_add_response_header(res, "Content-Security-Policy", "default-src 'self'");
		MHD_add_response_header(res, "X-Frame-Options", "DENY");
		MHD_add_response_header(res, "X-XSS-Protection", "0");
		MHD_add_response_header(res, "X-Content-Type-Options", "nosniff");
		MHD_add_response_header(res, "X-Permitted-Cross-Domain-Policies", "none");
		MHD_add_response_header(res, "Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");

		ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
		MHD_destroy_response(res);
		return ret;
	}

	if(strcmp(method, "GET") != 0)
		return MHD_NO;

	urlsize = strlen(url);

	/* Remove the first '/' character */
	ufile = malloc(sizeof(char) * (urlsize + 1));
	if(ufile == NULL)
	{
		perror("Error malloc(ufile)");
		return MHD_NO;
	}

	memset(ufile, '\0', urlsize);
	for(i = 1; i < urlsize; i++)
	{
		ufile[i - 1] = url[i];
	}

	/* If the path is / replace with /htdocs/index.html */
	if(urlsize == 1)
	{
		free(ufile);
		ufile = mystrdup("htcore/index.html");
	}

	/* Prefix the public_http/ to the filepath */
	final_file_name = malloc(
		sizeof(char) *
		(
			strlen("public_http/") +
			strlen(ufile) + 1
		)
	);
	if(final_file_name == NULL)
	{
		perror("final_file_name = malloc()");
		free(ufile);
		return MHD_NO;
	}
	sprintf(final_file_name, "public_http/%s", ufile);

	printf("Handling URL %s with the method %s and the version %s.\n", final_file_name, method, version);
	/* Open the file */
	filedesc = open(final_file_name, O_RDONLY);
	if(filedesc == -1)
	{
		perror("Opening the resource");
		free(ufile);
		free(final_file_name);
		return MHD_NO;
	}

	ret = fstat(filedesc, &fdstat);
	if(ret == -1)
	{
		perror("stating the file");
		free(ufile);
		free(final_file_name);
		close(filedesc);
		return MHD_NO;
	}

	res = MHD_create_response_from_fd(
		fdstat.st_size,
		filedesc
	);
	if(res == NULL)
	{
		close(filedesc);
		free(ufile);
		free(final_file_name);
	}

	MHD_add_response_header(res, "Content-Security-Policy", "default-src 'self'");
	MHD_add_response_header(res, "X-Frame-Options", "DENY");
	MHD_add_response_header(res, "X-XSS-Protection", "0");
	MHD_add_response_header(res, "X-Content-Type-Options", "nosniff");
	MHD_add_response_header(res, "X-Permitted-Cross-Domain-Policies", "none");
	MHD_add_response_header(res, "Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");

	ext = strrchr(final_file_name, '.');

	printf("Detected MIME type is %s\n", ext);

	if(strcmp(ext, ".html") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/html");
		printf("HiperText Markup Language\n");
	}
	else if(strcmp(ext, ".js") == 0)
	{
		MHD_add_response_header(res, "Content-type", "application/javascript");
		printf("JavaScript / ECMAScript\n");
	}
	else if(strcmp(ext, ".css") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/css");
		printf("Cascading Style Sheets\n");
	}
	else if(strcmp(ext, ".svg") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/svg+xml");
		printf("Scalable Vector Graphics\n");
	}
	else if(strcmp(ext, ".png") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/png");
		printf("Portable Network Graphics\n");
	}
	else
	{
		MHD_add_response_header(res, "Content-type", "text/plain");
		printf("Plain Text\n");
	}

	ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
	MHD_destroy_response(res);

	free(ufile);
	free(final_file_name);

	return ret;
}

char* mystrdup(const char* str)
{
	char* res = malloc(strlen(str) * sizeof(char));
	if(res == NULL)
		return NULL;
	return strcpy(res, str);
}
