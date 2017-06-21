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
	cnatural_natural_token_t* tkobj = NULL;
	jwt_t* jwt = NULL;
	char* fname = "";
	char* mimetype = "";
	char* token = "";
	char* uname = "";
	char* rdbytes = "";
	char* chunksize = "";
	char* chunk = "";
	int rt = 0;
	long int pos = 0;
	long int siz = 0;
	FILE* fh = NULL;

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

	args->output_mimetype = cnatural_strdup(mimetype);

	if((errno = jwt_decode(&jwt, token, (unsigned char*) args->systdt->secret, strlen(args->systdt->secret))) != 0)
	{
		perror("Error decoding the token");

		args->output_buffer = cnatural_strdup("enotoken");
		args->output_buffer_size = strlen(args->output_buffer);
		return -1;
	}

	if(cnatural_natural_token_create(&tkobj) != 0)
	{
		fprintf(stderr, "Error creating the token\n");
		return -1;
	}

	if(cnatural_natural_token_load_from_jwt(tkobj, jwt) != 0)
	{
		fprintf(stderr, "Error loading the token\n");
		return -1;
	}

	if(jwt_get_alg(jwt) != JWT_ALG_HS512)
	{
		fprintf(stderr, "Error decrypting the token: the algorithm is not JWT_ALG_HS512\n");

		args->output_buffer = cnatural_strdup("enotoken");
		args->output_buffer_size = strlen(args->output_buffer);
		return -1;
	}

	jwt_free(jwt);

	cnatural_natural_token_get_username(tkobj, &uname);
	cnatural_natural_token_get_random_bytes(tkobj, &rdbytes);

	printf("Loaded the token: %s <%s>\n", uname, rdbytes);

	if((strcmp(uname, args->systdt->username) != 0) || (strcmp(rdbytes, args->systdt->random) != 0))
	{
		printf("Error: the token is not the current systdt\n");
		free(args->output_mimetype);
		cnatural_natural_token_destroy(&tkobj);
		return -1;
	}

	if(!valid_fpos(chunk, strlen(chunk)))
	{
		printf("Error: the chunk position is not an valid integer\n");
		free(args->output_mimetype);
		cnatural_natural_token_destroy(&tkobj);
		return -1;
	}

	if(!valid_fpos(chunksize, strlen(chunksize)))
	{
		printf("Error: the chunk size is not an valid integer\n");
		free(args->output_mimetype);
		cnatural_natural_token_destroy(&tkobj);
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
		cnatural_natural_token_destroy(&tkobj);
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
		cnatural_natural_token_destroy(&tkobj);
		return -1;
	}

	siz = strtol(chunksize, NULL, 10);

	args->output_buffer_size = siz + 1;
	args->output_buffer = malloc(sizeof(char) * siz + 1);

	memset(args->output_buffer, '\0', siz);

	fread(args->output_buffer, sizeof(char), siz, fh);

	rt = errno;

	if(ferror(fh))
	{
		errno = rt;

		perror("Error reading the chunk");
		rt = fclose(fh);

		if(rt != 0)
		{
			perror("Error closing the file");
		}

		free(args->output_mimetype);
		cnatural_natural_token_destroy(&tkobj);
		return -1;
	}

	rt = fclose(fh);

	if(rt != 0)
	{
		perror("closing the file");

		free(args->output_mimetype);
		cnatural_natural_token_destroy(&tkobj);
		return -1;
	}

	cnatural_natural_token_destroy(&tkobj);

	return 0;
}
