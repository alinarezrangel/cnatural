/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Core functions for the HTTPd server
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

#include "servercore.h"

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <locale.h>
#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>

#include "tokens.h"
#include "ajaxcore.h"
#include "authcall.h"
#include "utilfcn.h"

/* Global handler */
cnatural_servercore_cll_systdt cnatural_servercore_get_systdt_handler = NULL;

/* These are private macros that only exists on this file */
#define FILE_TYPE_ANY 0
#define FILE_TYPE_SVG 1

cnatural_system_data* cnatural_servercore_get_systdt(void)
{
	if(cnatural_servercore_get_systdt_handler == NULL)
		return NULL;

	return (*cnatural_servercore_get_systdt_handler)();
}

void cnatural_servercore_set_systdt(cnatural_servercore_cll_systdt handler)
{
	cnatural_servercore_get_systdt_handler = handler;
}

/* The core functions: */

int cnatural_servercore_request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	unsigned long int* upload_data_size,
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
	cnatural_ajax_argument arg;
	struct stat fdstat;
	cnatural_post_processor_data* data = NULL;
	jwt_t* jwt = NULL;

	cnatural_log_info(
		"Reading POST data %lu...",
		*upload_data_size
	);
	cnatural_log_info(
		"> Processing the URL %s with the method %s %s",
		url,
		method,
		version
	);
	fflush(stdout);

	if(*conn_klass == NULL)
	{
		data = *conn_klass;
		ret = cnatural_create_post_data(conn, strcmp(method, MHD_HTTP_METHOD_POST), &data);
		cnatural_log_debug("Created POST data");
		fflush(stdout);
		*conn_klass = (void*) data;
		return ret;
	}

	cnatural_log_debug("Successfull created POST data");
	fflush(stdout);

	if(strcmp(method, MHD_HTTP_METHOD_POST) == 0)
	{
		cnatural_log_info("Handling AJAX to %s", url);

		if(*upload_data_size)
		{
			cnatural_log_debug("Uploaded data size");
			fflush(stdout);
			data = *conn_klass;
			MHD_post_process(data->postprocessor, upload_data, *upload_data_size);
			*upload_data_size = 0;
			return MHD_YES;
		}

		arg.systdt = cnatural_servercore_get_systdt();
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
			cnatural_perror("Using ajax");
			return MHD_NO;
		}

		if(use_ajax == 1)
		{
			cnatural_log_error("The AJAX method %s not exist", url);
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
				cnatural_perror("Unable to alloc the response buffer");
				return MHD_NO;
			}
		}
		else if(arg.output_filedesc != -1)
		{
			ret = fstat(arg.output_filedesc, &fdstat);

			if(ret == -1)
			{
				cnatural_perror("stating the file");
				close(arg.output_filedesc);
				return MHD_NO;
			}

			res = MHD_create_response_from_fd(
				fdstat.st_size,
				arg.output_filedesc
			);

			if(res == NULL)
			{
				cnatural_perror("Unable to alloc the response filedesc");
				close(arg.output_filedesc);
				return MHD_NO;
			}
		}
		else
		{
			cnatural_log_error("Error in the AJAX call: not response provided");
			return MHD_NO;
		}

		cnatural_servercore_set_response_headers(&res, FILE_TYPE_ANY);
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
		cnatural_perror("Error malloc(ufile)");
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
			cnatural_log_error("Invalid HTTP API request");
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

		cnatural_log_debug(
			"Length of token/path/url: %lu/%lu/%d",
			length_http_api_token,
			length_http_api_path,
			urlsize
		);

		http_api_token = malloc(sizeof(char) * (length_http_api_token + 2));

		if(http_api_token == NULL)
		{
			cnatural_perror("Unable to alloc the /api/private token");
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
			cnatural_perror("Unable to alloc the /api/private path");
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

		cnatural_log_debug(
			"Token: %s\nPath %s\nURL %s",
			http_api_token,
			http_api_path,
			url
		);

		if((errno = jwt_decode(
				&jwt,
				http_api_token,
				(const unsigned char*) cnatural_servercore_get_systdt()->secret,
				strlen(cnatural_servercore_get_systdt()->secret)))
			!= 0)
		{
			cnatural_perror("Unable to decode the token");

			free(http_api_path);
			free(http_api_token);
			free(ufile);

			return MHD_NO;
		}

		if(jwt_get_alg(jwt) != CNATURAL_AUTH_METHOD)
		{
			cnatural_log_error(
				"Error: the JWT token algorithm is not CNATURAL_AUTH_METHOD: "
				"aborting"
			);

			free(http_api_path);
			free(http_api_token);
			free(ufile);

			return MHD_NO;
		}

		if(strcmp(
				jwt_get_grant(jwt, "un"),
				cnatural_servercore_get_systdt()->username)
			!= 0)
		{
			cnatural_log_error(
				"Error: the JWT token's username is not the same of this system "
				"(but have the same secret, this can be an attack!)"
			);

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
		cnatural_perror("final_file_name = malloc()");
		free(ufile);
		return MHD_NO;
	}

	sprintf(final_file_name, "%s%s", prefix, ufile);

	cnatural_log_info(
		"Handling URL %s with the method %s and the HTTP version %s.",
		final_file_name,
		method,
		version
	);

	/* Open the file */
	filedesc = open(final_file_name, O_RDONLY);
	if(filedesc == -1)
	{
		cnatural_perror("Opening the resource");
		free(ufile);
		free(final_file_name);
		return MHD_NO;
	}

	ret = fstat(filedesc, &fdstat);
	if(ret == -1)
	{
		cnatural_perror("stating the file");
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
		cnatural_perror("Unable to alloc the response filedesc system");
		close(filedesc);
		free(ufile);
		free(final_file_name);
		return MHD_NO;
	}

	ext = strrchr(final_file_name, '.');

	cnatural_log_info("Detected extension is %s", ext);

	if(strcoll(ext, ".html") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/html");
		cnatural_log_info("HyperText Markup Language");
	}
	else if(strcoll(ext, ".js") == 0)
	{
		MHD_add_response_header(res, "Content-type", "application/javascript");
		cnatural_log_info("JavaScript / ECMAScript");
	}
	else if(strcoll(ext, ".css") == 0)
	{
		MHD_add_response_header(res, "Content-type", "text/css");
		cnatural_log_info("Cascading Style Sheets");
	}
	else if(strcoll(ext, ".svg") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/svg+xml");
		filetype = FILE_TYPE_SVG;
		cnatural_log_info("Scalable Vector Graphics");
	}
	else if(strcoll(ext, ".png") == 0)
	{
		MHD_add_response_header(res, "Content-type", "image/png");
		cnatural_log_info("Portable Network Graphics");
	}
	else if(strcoll(ext, ".woff") == 0)
	{
		MHD_add_response_header(res, "Content-type", "application/font-woff");
		cnatural_log_info("WOFF Font");
	}
	else
	{
		MHD_add_response_header(res, "Content-type", "text/plain");
		cnatural_log_info("Plain Text");
	}

	cnatural_servercore_set_response_headers(&res, filetype);

	ret = MHD_queue_response(conn, MHD_HTTP_OK, res);
	MHD_destroy_response(res);

	free(ufile);
	free(final_file_name);

	return ret;
}

void cnatural_servercore_set_response_headers(
	struct MHD_Response** res,
	int type
)
{
	const char* csp =
		"default-src 'self'; script-src 'self'; connect-src "
		"'self'; child-src: 'self'; img-src: 'self'; style-src: 'self' "
		"'unsafe-inline'";

	if(type == FILE_TYPE_SVG)
	{
		csp =
			"default-src 'none'; frame-ancestors 'none'; style-src 'self' "
			"'unsafe-inline'";
	}

	MHD_add_response_header(*res, "X-Content-Type-Options", "nosniff");
	MHD_add_response_header(*res, "X-Permitted-Cross-Domain-Policies", "none");
	MHD_add_response_header(*res, "X-Frame-Options", "SAMEORIGIN");
	MHD_add_response_header(*res, "X-XSS-Protection", "0");
	MHD_add_response_header(
		*res,
		"Strict-Transport-Security",
		"max-age=31536000 ; includeSubDomains"
	);
	MHD_add_response_header(*res, "Content-Security-Policy", csp);
	MHD_add_response_header(*res, "X-Content-Security-Policy", csp);
	MHD_add_response_header(*res, "X-Webkit-CSP", csp);
}

/* Undef the macros (is this required?) */
#undef FILE_TYPE_ANY
#undef FILE_TYPE_SVG
