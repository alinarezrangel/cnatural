/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for the AJAX core.
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

#include "ajaxcore.h"

/*
 * AJAX paths structure:
 *  + All paths starts with "/api/ajax/"
 *  + If the AJAX method is "foo" and the service "bar, then append "/bar/foo"
 *  + For example: "/api/ajax/control/powerOff"
 * A service is the "class" container of the method.
 * The method can take arguments from it's URL like GET method,
 * but all AJAX calls are always HTTP POST requests.
*/

int cnatural_ajax_test(const char* path, cnatural_ajax_argument_t* inout)
{
	const char* msg = "Hello World";
	size_t msglen = strlen(msg) + 1; /* strlen not includes the NULL byte */
	const char* mime = "text/plain";
	size_t mimelen = strlen(mime) + 1;
	int ecpy = 0;
	if(strcmp(path, "/api/ajax/coreutils/test") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/test AJAX: sending Hello World");
	inout->output_buffer = malloc(sizeof(char) * msglen);
	if(inout->output_buffer == NULL)
	{
		return -1;
	}
	inout->output_buffer_size = msglen - 1;
	strcpy(inout->output_buffer, msg);
	inout->output_buffer[msglen - 1] = '\0';
	inout->output_mimetype = malloc(sizeof(char) * mimelen);
	if(inout->output_mimetype == NULL)
	{
		ecpy = errno;
		free(inout->output_buffer);
		errno = ecpy;
		return -1;
	}
	strcpy(inout->output_mimetype, mime);
	inout->output_mimetype[mimelen - 1] = '\0';
	return 0;
}

int cnatural_ajax_login(const char* path, cnatural_ajax_argument_t* inout)
{
	const char* msg = "Hola Mundo";
	size_t msglen = strlen(msg) + 1; /* strlen not includes the NULL byte */
	const char* mime = "text/plain";
	size_t mimelen = strlen(mime) + 1;
	int ecpy = 0;
	size_t i = 0;
	if(strcmp(path, "/api/ajax/coreutils/login") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/login AJAX: sending Hola Mundo");
	printf("Uploaded data %d: ", inout->attached_data_size);
	for(i = 0; i < inout->attached_data_size; i++)
	{
		printf("%c", inout->attached_data[i]);
	}
	printf("\n");
	fflush(stdout);
	inout->output_buffer = malloc(sizeof(char) * msglen);
	if(inout->output_buffer == NULL)
	{
		return -1;
	}
	inout->output_buffer_size = msglen - 1;
	memcpy(inout->output_buffer, msg, msglen - 1);
	inout->output_buffer[msglen - 1] = '\0';
	inout->output_mimetype = malloc(sizeof(char) * mimelen);
	if(inout->output_mimetype == NULL)
	{
		ecpy = errno;
		free(inout->output_buffer);
		errno = ecpy;
		return -1;
	}
	memcpy(inout->output_mimetype, mime, mimelen - 1);
	inout->output_mimetype[mimelen - 1] = '\0';
	return 0;
}

int cnatural_try_ajax(const char* path, cnatural_ajax_argument_t* inout)
{
	int ret = 0;
	ret = cnatural_ajax_test(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_login(path, inout);
	if(ret <= 0)
		return ret;
	return 1;
}
