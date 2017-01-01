/************************************************
**********************
*** CNatural: Remote embed systems control.
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

#include "tokens.h"
#include "ajaxcore.h"

#define PORT 8888

static cnatural_system_data_t dt;

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	long unsigned int* upload_data_size,
	void** conn_klass
);
void set_response_headers(struct MHD_Response** res);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;

	dt.username = "hola";
	dt.password = "mundo";
	dt.secret = "fewnfieufonfewFWEQBEWIFNGrng";

	setlocale(LC_ALL, "");
	if(cnatural_natural_global_tokens_init() != 0)
	{
		fprintf(stderr, "Error on " __FILE__ ": The global token engine cannot be initialized correctly\n");
		exit(EXIT_FAILURE);
	}

	daemon = MHD_start_daemon(
		MHD_USE_SELECT_INTERNALLY,
		PORT,
		NULL,
		NULL,
		&request_handler,
		NULL,
		MHD_OPTION_NOTIFY_COMPLETED,
		cnatural_basic_post_destroy,
		NULL,
		MHD_OPTION_END
	);
	if(daemon == NULL)
	{
		perror("Error getting the daemon");
		if(cnatural_natural_global_tokens_init() != 0)
		{
			fprintf(stderr, "Error on " __FILE__ ": The global token engine cannot be initialized correctly\n");
		}
		exit(EXIT_FAILURE);
	}

	getchar();

	MHD_stop_daemon(daemon);
	if(cnatural_natural_global_tokens_deinit() != 0)
	{
		fprintf(stderr, "Error on " __FILE__ ": The global token engine cannot be deinitialized correctly\n");
		exit(EXIT_FAILURE);
	}
	exit(EXIT_SUCCESS);
}

int request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	long unsigned int* upload_data_size,
	void** conn_klass
)
{
	int ret = 0;
	struct MHD_Response* res = NULL;
	char* ufile = NULL;
	char* final_file_name = NULL;
	size_t i = 0;
	int urlsize = 0;
	cnatural_ajax_argument_t arg;
	int use_ajax = -1;
	char* ext = NULL;
	int filedesc = 0;
	struct stat fdstat;
	cnatural_post_processor_data_t* data = NULL;

	printf("Reading POST data %lu...\n", *upload_data_size);
	fflush(stdout);

	if(*conn_klass == NULL)
	{
		data = *conn_klass;
		ret = cnatural_create_post_data(conn, strcmp(method, "POST"), &data);
		printf("Exiting C!\n");
		fflush(stdout);
		*conn_klass = (void*) data;
		return ret;
	}

	printf("Successfull created POST data\n");
	fflush(stdout);

	if(strcmp(method, "POST") == 0)
	{
		printf("Handling AJAX to %s\n", url);

		if(*upload_data_size)
		{
			printf("Uploaded data size\n");
			fflush(stdout);
			data = *conn_klass;
			MHD_post_process(data->postprocessor, upload_data, *upload_data_size);
			*upload_data_size = 0;
			return MHD_YES;
		}

		arg.systdt = &dt;
		arg.attached_data = upload_data;
		arg.attached_data_size = *upload_data_size;
		arg.output_buffer = NULL;
		arg.output_mimetype = NULL;
		arg.output_buffer_size = 0;
		arg.output_filedesc = -1;
		arg.arguments = *conn_klass;

		use_ajax = cnatural_try_ajax(url, &arg);

		fflush(stdout);

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

		if(arg.output_buffer != NULL)
		{
			res = MHD_create_response_from_buffer(
				arg.output_buffer_size,
				(void*) arg.output_buffer,
				MHD_RESPMEM_PERSISTENT
			);
			if(res == NULL)
			{
				perror("Unable to alloc the response buffer");
				return MHD_NO;
			}
		}
		else if(arg.output_filedesc != -1)
		{
			ret = fstat(arg.output_filedesc, &fdstat);
			if(ret == -1)
			{
				perror("stating the file");
				close(arg.output_filedesc);
				return MHD_NO;
			}

			res = MHD_create_response_from_fd(
				fdstat.st_size,
				arg.output_filedesc
			);
			if(res == NULL)
			{
				perror("Unable to alloc the response filedesc");
				close(arg.output_filedesc);
				return MHD_NO;
			}
			else
			{
				fprintf(stderr, "Error in the AJAX call: not response provided\n");
				return MHD_NO;
			}
		}

		set_response_headers(&res);

		ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
		MHD_destroy_response(res);

		// free(arg.output_buffer);
		// free(arg.output_mimetype);
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
		ufile = cnatural_strdup("htcore/index.html");
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
		perror("Unable to alloc the response filedesc system");
		close(filedesc);
		free(ufile);
		free(final_file_name);
		return MHD_NO;
	}

	set_response_headers(&res);

	ext = strrchr(final_file_name, '.');

	printf("Detected MIME type is %s\n", ext);

	if(strcoll(ext, ".html") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/html");
		printf("HiperText Markup Language\n");
	}
	else if(strcoll(ext, ".js") == 0)
	{
		MHD_add_response_header(res, "Content-type", "application/javascript");
		printf("JavaScript / ECMAScript\n");
	}
	else if(strcoll(ext, ".css") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/css");
		printf("Cascading Style Sheets\n");
	}
	else if(strcoll(ext, ".svg") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/svg+xml");
		printf("Scalable Vector Graphics\n");
	}
	else if(strcoll(ext, ".png") == 0)
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

void set_response_headers(struct MHD_Response** res)
{
	MHD_add_response_header(*res, "Content-Security-Policy", "default-src 'self'");
	MHD_add_response_header(*res, "X-Frame-Options", "SAMEORIGIN");
	MHD_add_response_header(*res, "X-XSS-Protection", "0");
	MHD_add_response_header(*res, "X-Content-Type-Options", "nosniff");
	MHD_add_response_header(*res, "X-Permitted-Cross-Domain-Policies", "none");
	MHD_add_response_header(*res, "Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");
}
