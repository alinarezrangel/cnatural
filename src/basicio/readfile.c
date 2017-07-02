/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX BasicIO module: ReadFile function.
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
#include <ctype.h>

#include <jwt.h>

#include "tokens.h"
#include "authcall.h"
#include "utilfcn.h"

/*
* Determines if a string can be safetly converted to an integer.
*/
static int valid_fpos(const char* s, size_t z)
{
	size_t j = 0;

	for(j = 0; j < z; j++)
	{
		if(!isdigit(s[j]))
			return 0;
	}

	return 1;
}

int cnatural_ajax_basicio_readfile(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	cnatural_post_processor_node_t* it = NULL;
	char* fname = "";
	char* mimetype = "";
	char* token = "";
	char* chunksize = "";
	char* chunk = "";
	int rt = 0;
	long int pos = 0;
	long int siz = 0;
	int autherr = 0;
	FILE* fh = NULL;
	cnatural_authcall_token_t* tkobj = NULL;

	if(strcmp(path, "/api/ajax/basicio/readfile") != 0)
		return 1;
	printf("Catched /api/ajax/basicio/readfile...\n");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		printf("At %s = %s\n", it->key, it->value);

		if(strcmp(it->key, "file") == 0)
		{
			fname = it->value;
			continue;
		}
		if(strcmp(it->key, "expected") == 0)
		{
			mimetype = it->value;
			continue;
		}
		if(strcmp(it->key, "token") == 0)
		{
			token = it->value;
			continue;
		}
		if(strcmp(it->key, "chunk_size") == 0)
		{
			chunksize = it->value;
			continue;
		}
		if(strcmp(it->key, "chunk_position") == 0)
		{
			chunk = it->value;
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

	args->output_mimetype = cnatural_strdup(mimetype);

	if(!valid_fpos(chunk, strlen(chunk)))
	{
		printf("Error: the chunk position is not an valid integer\n");

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	if(!valid_fpos(chunksize, strlen(chunksize)))
	{
		printf("Error: the chunk size is not an valid integer\n");

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	/*
	* Algorithm:
	* * Detect if the file exists
	* * Read it in chunks
	* * Send the specified chunk
	*/

	fh = fopen(fname, "rb");

	if(fh == NULL)
	{
		perror("Error opening the file");

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	pos = strtol(chunk, NULL, 10);

	rt = fseek(fh, pos, SEEK_SET);

	if(rt != 0)
	{
		perror("Error setting the chunk position");

		rt = fclose(fh);

		if(rt != 0)
		{
			perror("Error closing the file");
		}

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	siz = strtol(chunksize, NULL, 10);

	args->output_buffer_size = siz + 1;
	args->output_buffer = malloc(sizeof(char) * siz + 1);

	memset(args->output_buffer, '\0', siz);

	fread(args->output_buffer, sizeof(char), siz, fh);

	/* Save errno because ferror can reset it */
	rt = errno;

	if(ferror(fh))
	{
		/* An error, restore errno: */
		errno = rt;

		perror("Error reading the chunk");

		rt = fclose(fh);

		if(rt != 0)
		{
			perror("Error closing the file");
		}

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	rt = fclose(fh);

	if(rt != 0)
	{
		perror("closing the file");

		free(args->output_mimetype);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	cnatural_authcall_destroy(&tkobj);

	return 0;
}
