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

/* Implementation headers: */

#include <stdio.h>
#include <string.h>
#include <errno.h>

#include "utilfcn.h"

/* NOTE: These headers are included for it's usage in the cnatural_try_ajax */

#include "coreutils/login.h"
#include "coreutils/import.h"
#include "coreutils/timefcn.h"
#include "basicio/readfile.h"
#include "basicio/openf.h"
#include "basicio/closef.h"

int cnatural_basic_post_data_handler(
	void* conn_klass,
	enum MHD_ValueKind kind,
	const char* key,
	const char* filename,
	const char* content_type,
	const char* transfer_encoding,
	const char* sdata,
	uint64_t off,
	size_t size
)
{
	size_t cursz = 0, newsz = 0, cnt = 0;

	if((conn_klass == NULL) || (sdata == NULL) || (key == NULL))
	{
		cnatural_log_error("The POST data not exist");
		return MHD_YES;
	}

	cnatural_post_processor_data_t* data = conn_klass;
	cnatural_post_processor_node_t* it = data->data;

	cnatural_log_debug("Handling POST data %s %li", key, strlen(sdata));
	fflush(stdout);

	if(strlen(sdata) == 0)
	{
		cnatural_log_error("Zero-length value: prevent null data");
		return MHD_NO;
	}

	/* Go to the last element in the list
	** Note that if a POST request exceeds the POST_BUFFER_SIZE, it will
	** split into more request, so we need to stop on the first token
	** with equal key and append to it: */
	for(;it->next != NULL; it = it->next)
		cnatural_log_debug("Advanced %li %s=%s", ++cnt, it->key, it->value);

	cnatural_log_debug("TAdvanced %li", cnt);

	cnatural_log_debug("At POST %s=%s", it->key, it->value);
	fflush(stdout);

	if(strcmp(it->key, key) == 0)
	{
		cnatural_log_debug("Appending to %s=%s", key, sdata);
		fflush(stdout);

		cursz = strlen(it->value);
		newsz = cursz + strlen(sdata);

		char* newvl = malloc(sizeof(char) * newsz + 1);

		if(newvl == NULL)
		{
			cnatural_perror("Error apending a value to the existing key");
			return MHD_NO;
		}

		cnatural_log_debug("Look at %li %li", newsz, cursz);

		strncpy(newvl, it->value, newsz);
		strncat(newvl, sdata, strlen(sdata));

		it->value = newvl;

		cnatural_log_debug(
			"Created APPEND %s=%s %li",
			key,
			it->value,
			strlen(it->value)
		);
		fflush(stdout);

		return MHD_YES;
	}

	cnatural_post_processor_node_t* kl =
		malloc(sizeof(cnatural_post_processor_node_t));
	if(kl == NULL)
	{
		cnatural_perror("Error appending a key to the keylist");
		return MHD_NO;
	}

	kl->back = it;
	kl->next = NULL;
	it->next = kl;

	/* Fill with data */
	kl->key = cnatural_strdup(key);
	kl->value = cnatural_strdup(sdata);

	cnatural_log_debug("Created %s=%s", key, sdata);
	fflush(stdout);

	return MHD_YES;
}

int cnatural_create_post_data(
	struct MHD_Connection* conn,
	int create_post,
	cnatural_post_processor_data_t** data
)
{
	cnatural_post_processor_node_t* kl;

	cnatural_log_debug("Creating POST data");

	(*data) = malloc(sizeof(cnatural_post_processor_data_t));
	if((*data) == NULL)
	{
		cnatural_perror("Error creating the data");
		return MHD_NO;
	}
	kl = malloc(sizeof(cnatural_post_processor_node_t));
	if(kl == NULL)
	{
		cnatural_perror("Error making the main list chain");
		return MHD_NO;
	}

	(*data)->type =
		(create_post == 0)?
			CNATURAL_POST_TYPE_POST :
			CNATURAL_POST_TYPE_GET;

	kl->back = NULL;
	kl->next = NULL;

	kl->key = cnatural_strdup("_");
	kl->value = cnatural_strdup("_");

	(*data)->data = kl;

	if(create_post == 0)
	{
		(*data)->postprocessor = MHD_create_post_processor(
			conn,
			CNATURAL_POST_BUFFER_SIZE,
			cnatural_basic_post_data_handler,
			(void*) (*data)
		);
		if((*data)->postprocessor == NULL)
		{
			cnatural_perror("Error creating a new PP");
			free(kl);
			free(*data);
			return MHD_NO;
		}
	}
	else
	{
		(*data)->postprocessor = NULL;
	}

	cnatural_log_debug("Done (creating)");
	fflush(stdout);
	return MHD_YES;
}

int cnatural_destroy_post_data(cnatural_post_processor_data_t** data)
{
	cnatural_post_processor_node_t* it = (*data)->data;

	/* Go to list end */
	for(;it->next != NULL; it = it->next);
	/* Iterate in reverse */
	for(;it != NULL;)
	{
		cnatural_post_processor_node_t* bc = it->back;

		if(it->key != NULL)
			free(it->key);
		if(it->value != NULL)
			free(it->value);

		free(it); /* Delete current node and go back */
		it = bc;
	}

	if((*data)->postprocessor != NULL)
		MHD_destroy_post_processor((*data)->postprocessor);

	free(*data);

	cnatural_log_debug("Destroyed POST data");
	fflush(stdout);
	return MHD_YES;
}

void cnatural_basic_post_destroy(
	void* cls,
	struct MHD_Connection* conn,
	void** conn_klass,
	enum MHD_RequestTerminationCode toe
)
{
	cnatural_post_processor_data_t* data = *conn_klass;

	cnatural_log_debug("Destroying POST request DATA");

	if(data == NULL)
	{
		return;
	}

	cnatural_log_debug("Destroy...");

	cnatural_destroy_post_data(&data);

	data = NULL;

	conn_klass = NULL;
}

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
	cnatural_log_debug("Catched /api/ajax/coreutils/test AJAX");
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

int cnatural_try_ajax(const char* path, cnatural_ajax_argument_t* inout)
{
	int ret = 0;

	/* Try with all ajax methods */

	ret = cnatural_ajax_test(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_coreutils_login(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_coreutils_import(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_coreutils_time_get(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_basicio_readfile(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_basicio_openfile(path, inout);
	if(ret <= 0)
		return ret;
	ret = cnatural_ajax_basicio_closefile(path, inout);
	if(ret <= 0)
		return ret;
	return 1;
}
