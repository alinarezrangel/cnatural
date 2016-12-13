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


#if !defined(__CNATURAL_AJAX_TYPES_H__)
#define __CNATURAL_AJAX_TYPES_H__ 1

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>

#include <microhttpd.h>

#define CNATURAL_POST_BUFFER_SIZE 512
#define CNATURAL_POST_TYPE_GET 0
#define CNATURAL_POST_TYPE_POST 1

struct cnatural_post_processor_node
{
	struct cnatural_post_processor_node* back;
	struct cnatural_post_processor_node* next;
	char* key;
	char* value;
};
typedef struct cnatural_post_processor_node cnatural_post_processor_node_t;

typedef struct
{
	struct MHD_PostProcessor* postprocessor;
	int type;
	cnatural_post_processor_node_t* data;
} cnatural_post_processor_data_t;

typedef struct
{
	const char* attached_data;
	long unsigned int attached_data_size;
	char* output_buffer;
	size_t output_buffer_size;
	char* output_mimetype;
	int output_filedesc;
	cnatural_post_processor_data_t* arguments;
} cnatural_ajax_argument_t;

char* cnatural_strdup(const char*);
cnatural_post_processor_data_t* cnatural_get_arg(
	cnatural_post_processor_data_t**,
	const char*
);

#endif /* ~__CNATURAL_AJAX_TYPES_H__ */
