/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX BasicIO module: OpenFile function.
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

#include "basicio/readfile.h"

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "tokens.h"
#include "authcall.h"
#include "utilfcn.h"

int cnatural_ajax_basicio_closefile(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	cnatural_post_processor_node_t* it = NULL;
	char* fhdn = NULL;
	char* token = NULL;
	int sz = 0;
	int err = 0;
	int autherr = 0;
	int fhandler = -1;
	cnatural_authcall_token_t* tkobj = NULL;

	const char* error_json_format =
		"{\"type\": \"error\", \"errno\": %d, \"error\": \"%s\"}";

	if(strcmp(path, "/api/ajax/basicio/closefile") != 0)
		return 1;
	printf("Catched /api/ajax/basicio/closefile...\n");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		printf("At %s = %s\n", it->key, it->value);

		if(strcmp(it->key, "handler") == 0)
		{
			fhdn = it->value;
			continue;
		}
		if(strcmp(it->key, "token") == 0)
		{
			token = it->value;
			continue;
		}
	}

	/* Authenticate */
	if((autherr = cnatural_authcall_authenticate(token, &tkobj, args->systdt)) != 1)
	{
		if(autherr == 0)
		{
			cnatural_authcall_destroy(&tkobj);
		}

		fprintf(stderr, "Error authenticating the user\n");

		return -1;
	}

	errno = 0;
	fhandler = strtol(fhdn, NULL, 10);

	if((errno != 0) || (fhandler < 0))
	{
		if((errno == 0) && (fhandler < 0))
		{
			errno = ERANGE;
		}

		perror("Error converting the file handler to string");

		err = errno;

		/* This error should be notified to the client */

		sz = snprintf(
			NULL,
			0,
			error_json_format,
			err,
			strerror(err)
		);

		if(sz <= 0)
		{
			perror("Error calculating the size of the error string");

			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		args->output_mimetype = cnatural_strdup("application/json");

		args->output_buffer_size = sz;
		args->output_buffer = malloc(sz + 1);

		if(args->output_buffer == NULL)
		{
			perror("Error allocating the error string");

			free(args->output_mimetype);
			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		sz = snprintf(
			args->output_buffer,
			sz + 1,
			error_json_format,
			err,
			strerror(err)
		);

		if(sz <= 0)
		{
			perror("Error printing the error string");

			free(args->output_mimetype);
			free(args->output_buffer);
			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		cnatural_authcall_destroy(&tkobj);

		return 0;
	}

	if(close(fhandler) < 0)
	{
		perror("Error closing the file");

		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	args->output_mimetype = cnatural_strdup("text/plain");
	args->output_buffer = cnatural_strdup("done");
	args->output_buffer_size = 4;

	cnatural_authcall_destroy(&tkobj);

	return 0;
}
