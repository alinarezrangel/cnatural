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
#include <errno.h>
#include <locale.h>
#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#include <microhttpd.h>

#include "tokens.h"
#include "ajaxcore.h"
#include "authcall.h"
#include "configfile.h"

#define FILE_TYPE_ANY 0
#define FILE_TYPE_SVG 1

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
void set_response_headers(struct MHD_Response** res, int type);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;
	FILE* configfile = NULL;
	char* configfile_name = "cnatural.conf";

	setlocale(LC_ALL, "");

	if(argc > 1)
	{
		configfile_name = argv[1];
	}

	printf("CNatural Server version %s\n", CNATURAL_SERVER_VERSION);
	printf("Starting...\n");
	printf("Reading configuration file (%s)\n\n", configfile_name);

	configfile = fopen(configfile_name, "r");

	if(configfile == NULL)
	{
		perror("Error opening the configuration file");
		exit(EXIT_FAILURE);
	}

	dt.username = NULL;
	dt.password = NULL;
	dt.random = NULL;
	dt.secret = NULL;
	dt.port = 0;

	if(cnatural_configfile_read_systdt_from_file(configfile, &dt) != 0)
	{
		printf("Error reading the configuration file\n");
		fclose(configfile);
		exit(EXIT_FAILURE);
	}

	if(fclose(configfile) != 0)
	{
		perror("Error closing the configuration file\n");
		free(dt.username);
		free(dt.password);
		free(dt.random);
		free(dt.secret);
		exit(EXIT_FAILURE);
	}

	printf("Scaning for NULL data...\n");

	if(dt.username == NULL)
	{
		dt.username = cnatural_strdup("cnatural");
		fprintf(stderr, "Warning: The configuration file does not have a username field, setting to it's default: cnatural\n");
	}
	if(dt.password == NULL)
	{
		dt.password = cnatural_strdup("a123b456");
		fprintf(stderr, "Warning: The configuration file does not have a password field, setting to it's default: a123b456\n");
	}
	if(dt.random == NULL)
	{
		dt.random = cnatural_strdup("not random");
		fprintf(stderr, "Warning: The configuration file does not have a random field, setting to it's default: not random\n");
	}
	if(dt.secret == NULL)
	{
		dt.secret = cnatural_strdup("not secret");
		fprintf(stderr, "Warning: The configuration file does not have a secret field, setting to it's default: not secret\n");
	}
	if(dt.port == 0)
	{
		dt.port = 8888;
		fprintf(stderr, "Warning: The configuration file does not have a port field, setting to it's default: 8888\n");
	}

	printf("Starting the HTTP daemon...\n");

	daemon = MHD_start_daemon(
		MHD_USE_SELECT_INTERNALLY,
		dt.port,
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
		perror("Error getting the HTTP daemon");
		free(dt.username);
		free(dt.password);
		free(dt.random);
		free(dt.secret);
		exit(EXIT_FAILURE);
	}

	printf("HTTP daemon started at port %d, press any key to stop the server\n", dt.port);

	getchar();

	printf("Stopping HTTP daemon...\n");

	MHD_stop_daemon(daemon);

	printf("Freeing the configurartion members...\n");

	free(dt.username);
	free(dt.password);
	free(dt.random);
	free(dt.secret);

	printf("All done, exiting\n");

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
	int
		ret = 0,
		urlsize = 0,
		use_ajax = -1,
		filedesc = 0,
		filetype = FILE_TYPE_ANY;
	const char* pfx_public = "public_http/";
	const char* pfx_private = "private_http/";
	const char* prefix = pfx_public;
	struct MHD_Response* res = NULL;
	char
		*ufile = NULL,
		*http_api_token = NULL,
		*http_api_path = NULL,
		*final_file_name = NULL,
		*ext = NULL,
		*http_api_token_charat = NULL;
	size_t
		i = 0,
		length_http_api_token = 0,
		length_http_api_path = 0;
	cnatural_ajax_argument_t arg;
	struct stat fdstat;
	cnatural_post_processor_data_t* data = NULL;
	jwt_t* jwt = NULL;

	printf("Reading POST data %lu...\n> Processing the URL %s with the method %s %s\n", *upload_data_size, url, method, version);
	fflush(stdout);

	if(*conn_klass == NULL)
	{
		data = *conn_klass;
		ret = cnatural_create_post_data(conn, strcmp(method, MHD_HTTP_METHOD_POST), &data);
		printf("Exiting C!\n");
		fflush(stdout);
		*conn_klass = (void*) data;
		return ret;
	}

	printf("Successfull created POST data\n");
	fflush(stdout);

	if(strcmp(method, MHD_HTTP_METHOD_POST) == 0)
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
				MHD_RESPMEM_MUST_FREE
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
		}
		else
		{
			fprintf(stderr, "Error in the AJAX call: not response provided\n");
			return MHD_NO;
		}

		set_response_headers(&res, FILE_TYPE_ANY);
		MHD_add_response_header(res, "Content-type", arg.output_mimetype);

		ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
		MHD_destroy_response(res);

		// free(arg.output_buffer);
		free(arg.output_mimetype);

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

	urlsize--;

	/* If starts with /api/private/... */
	if(strstr(url, "/api/private/") == url)
	{
		/* The format is /api/private/[urlencoded-token]/[resource] */

		/* NOTE: 13 = strlen("/api/private/") */
		http_api_token_charat = strchr(url + 13, '/');

		if(http_api_token_charat == NULL)
		{
			fprintf(stderr, "Invalid HTTP API request\n");
			free(ufile);
			return MHD_NO;
		}

		for(i = 0; i < urlsize; i++)
		{
			if(&url[i] == http_api_token_charat)
			{
				length_http_api_token = i - 13;
			}
		}

		length_http_api_path = strlen(url) - 13 - length_http_api_token;

		printf("Length of token/path/url: %lu/%lu/%d\n", length_http_api_token, length_http_api_path, urlsize);

		http_api_token = malloc(sizeof(char) * (length_http_api_token + 2));

		if(http_api_token == NULL)
		{
			perror("Unable to alloc the /api/private token");
			free(ufile);
			return MHD_NO;
		}

		memset(http_api_token, '\0', length_http_api_token + 1);

		for(i = 0; i < length_http_api_token; i++)
		{
			http_api_token[i] = url[i + 13];
		}

		http_api_path = malloc(sizeof(char) * (length_http_api_path + 1));

		if(http_api_path == NULL)
		{
			perror("Unable to alloc the /api/private path");
			free(ufile);
			free(http_api_token);
			return MHD_NO;
		}

		/* strlen(url) - 13 <strlen("/api/private/")> - length_http_api_token */
		memset(http_api_path, '\0', length_http_api_path);

		for(i = 0; i < length_http_api_path; i++)
		{
			/* We adds 1 for skip the trailing '/' (slash) */
			http_api_path[i] = url[14 + length_http_api_token + i];
		}

		printf("Token: %s\nPath %s\nURL %s\n", http_api_token, http_api_path, url);

		if((errno = jwt_decode(&jwt, http_api_token, (const unsigned char*) dt.secret, strlen(dt.secret))) != 0)
		{
			perror("Unable to decode the token");

			free(http_api_path);
			free(http_api_token);
			free(ufile);

			return MHD_NO;
		}

		if(jwt_get_alg(jwt) != CNATURAL_AUTH_METHOD)
		{
			fprintf(stderr, "Error: the JWT token algorithm is not CNATURAL_AUTH_METHOD: aborting\n");

			free(http_api_path);
			free(http_api_token);
			free(ufile);

			return MHD_NO;
		}

		if(strcmp(jwt_get_grant(jwt, "un"), dt.username) != 0)
		{
			fprintf(stderr, "Error: the JWT token's username is not of this system (but have the same secret? ALERT)\n");

			free(http_api_path);
			free(http_api_token);
			free(ufile);

			return MHD_NO;
		}

		prefix = pfx_private;

		free(ufile);
		ufile = http_api_path;

		free(http_api_token);
		jwt_free(jwt);
	}

	/* Prefix the public_http/ to the filepath */
	final_file_name = malloc(
		sizeof(char) *
		(
			strlen(prefix) +
			strlen(ufile) + 1
		)
	);
	if(final_file_name == NULL)
	{
		perror("final_file_name = malloc()");
		free(ufile);
		return MHD_NO;
	}
	sprintf(final_file_name, "%s%s", prefix, ufile);

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
		filetype = FILE_TYPE_SVG;
		printf("Scalable Vector Graphics\n");
	}
	else if(strcoll(ext, ".png") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/png");
		printf("Portable Network Graphics\n");
	}
	else if(strcoll(ext, ".woff") == 0)
	{
		MHD_add_response_header(res, "Content-type", "application/font-woff");
		printf("WOFF Font\n");
	}
	else
	{
		MHD_add_response_header(res, "Content-type", "text/plain");
		printf("Plain Text\n");
	}

	set_response_headers(&res, filetype);

	ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
	MHD_destroy_response(res);

	free(ufile);
	free(final_file_name);

	return ret;
}

void set_response_headers(struct MHD_Response** res, int type)
{
	const char* csp = "default-src 'self'; script-src 'self'; connect-src 'self'; child-src: 'self'; img-src: 'self'; style-src: 'self' 'unsafe-inline'";

	if(type == FILE_TYPE_SVG)
	{
		csp = "default-src 'none'; frame-ancestors 'none'; style-src 'self' 'unsafe-inline'";
	}

	MHD_add_response_header(*res, "X-Content-Type-Options", "nosniff");
	MHD_add_response_header(*res, "X-Permitted-Cross-Domain-Policies", "none");
	MHD_add_response_header(*res, "X-Frame-Options", "SAMEORIGIN");
	MHD_add_response_header(*res, "X-XSS-Protection", "0");
	MHD_add_response_header(*res, "Strict-Transport-Security", "max-age=31536000 ; includeSubDomains");
	MHD_add_response_header(*res, "Content-Security-Policy", csp);
	MHD_add_response_header(*res, "X-Content-Security-Policy", csp);
	MHD_add_response_header(*res, "X-Webkit-CSP", csp);
}
