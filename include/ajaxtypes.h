/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Types and functions for handling AJAX.
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


#if !defined(_CNATURAL_AJAX_TYPES_H_)
#define _CNATURAL_AJAX_TYPES_H_ 1

/**
* @file ajaxtypes.h
* Contains the basic types for the AJAX API.
*/

#include <stdlib.h>

#include <microhttpd.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief The size of a HTTP POST request.
* Required for MicroHTTPd for allocate the POST request buffer.
*
* It's only a chunk, not the total request size.
*/
#define CNATURAL_POST_BUFFER_SIZE 512

/**
* @brief POST type enum, value HTTP GET.
*/
#define CNATURAL_POST_TYPE_GET 0

/**
* @brief POST type enum, value HTTP POST.
*/
#define CNATURAL_POST_TYPE_POST 1

/**
* @brief Is the CNatural Server version in a string macro.
*
* It's something like "1.0.2", for example.
*
* Note that this version may not be the same than CNATURAL_VERSION.
*/
#define CNATURAL_SERVER_VERSION "1.0.0"

/**
* @brief (alias cnatural_post_processor_node_T) Node of data of a POST request.
* The key attribute is a NULL terminated string containig the key of the
* POST parameter and the value is also a NULL terminated string with the value:
* the string "hello=world" have a key "hello" and a value "world". It's a simple
* double-linked list, where back is NULL if this is the first node and next is
* NULL if this is the last node. By default, the POST HTTP parser adds a
* void argument "_=_", this should be ignored.
*/
typedef struct cnatural_post_processor_node
{
	struct cnatural_post_processor_node* back;
	struct cnatural_post_processor_node* next;
	char* key;
	char* value;
} cnatural_post_processor_node_t;

/**
* @brief (alias cnatural_post_processor_data_t) Is a HTTP POST processor (parser) state.
* type if CNATURAL_POST_TYPE_GET or CNATURAL_POST_TYPE_POST, data points to the
* arguments linked list (may be NULL) and postprocessor it's the MicroHTTPd POST
* processor.
*/
typedef struct cnatural_post_processor_data
{
	struct MHD_PostProcessor* postprocessor;
	int type;
	cnatural_post_processor_node_t* data;
} cnatural_post_processor_data_t;

/**
* @brief Is the system data and configuration.
*/
typedef struct cnatural_system_data
{
	char* username;
	char* password;
	char* secret;
	char* random;
	int port;
} cnatural_system_data_t;

/**
* @brief (alias cnatural_ajax_argument_t) Contains all argument, data and output values passed to a AJAX function.
* Any AJAX function will need at least these parameters (some are output arguments):
*
* - "attached_data" is the requested attached data (input).
* - "attached_data_size" is the size of "attached_data" in bytes (input).
* - "output_buffer" is a pointer to the non NULL terminated string output
* of the AJAX request, useful for sending plain text responses. It should
* be allocated using malloc and will be deallocated using free. It's an
* output parameter and if no text data will be send by the AJAX function
* it should not be modified (the default value it's NULL, and changing from
* NULL will try to use-and-free that pointer).
* - "output_buffer_size" is the size (in bytes) of "output_buffer" (output).
* - "output_mimetype" is a NULL terminated string containing the response MIME-type (output, required).
* - "output_filedesc" is a UNIX file descriptor (created by open) containing the file to be
* sended. If no file data will be sended by the AJAX function, this value should not be modified
* (it's default value is -1). Changing it's value from -1 will use-and-close that file descriptor (output).
* - "arguments" is a pointer to the cnatural_post_processor_data_t containig the arguments (input).
*/
typedef struct cnatural_ajax_argument
{
	const char* attached_data;
	long unsigned int attached_data_size;
	char* output_buffer;
	size_t output_buffer_size;
	char* output_mimetype;
	int output_filedesc;
	cnatural_post_processor_data_t* arguments;
	cnatural_system_data_t* systdt;
} cnatural_ajax_argument_t;

/**
* @brief Duplicates a string.
* Like strdup, but is universal.
*/
char* cnatural_strdup(const char*);

/**
* @brief Gets an argument.
*/
cnatural_post_processor_node_t* cnatural_get_arg(
	cnatural_post_processor_node_t**,
	const char*
);

CNATURAL_END_DECLRS

#endif /* ~_CNATURAL_AJAX_TYPES_H_ */
