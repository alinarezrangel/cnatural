/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX CoreUtils module: import function.
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

#include "coreutils/import.h"

int cnatural_ajax_coreutils_import(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	const char* privatepath = "private_http/";

	cnatural_post_processor_node_t* it = NULL;
	int ofile = -1;
	int jres = 0;
	char* token = "";
	char* uname = "";
	char* fname = "";
	char* mimetype = "";
	char* realpath = NULL;
	char* rdbytes = "";
	jwt_t* jwt = NULL;
	cnatural_natural_token_t* tkobj = NULL;

	if(strcmp(path, "/api/ajax/coreutils/import") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/import...\n");

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
	}

	args->output_mimetype = cnatural_strdup(mimetype);

	if((errno = jwt_decode(&jwt, token, (unsigned char*) args->systdt->secret, strlen(args->systdt->secret))) != 0)
	{
		perror("Error decoding the token");
		return -1;
	}

	if(cnatural_natural_token_create(&tkobj) != 0)
	{
		fprintf(stdout, "Error creating the token\n");
		return -1;
	}

	if(cnatural_natural_token_load_from_jwt(tkobj, jwt) != 0)
	{
		fprintf(stdout, "Error loading the token\n");
		return -1;
	}

	jwt_free(jwt);

	cnatural_natural_token_get_username(tkobj, &uname);
	cnatural_natural_token_get_random_bytes(tkobj, &rdbytes);

	printf("Loaded the token: %s <%s>\n", uname, rdbytes);

	if((jres = cnatural_natural_global_tokens_verify(tkobj)) < 0)
	{
		fprintf(stdout, "Error verifing the token\n");
		return -1;
	}

	if(jres != 0)
	{
		// Invalid token
		printf("Invalid token\n");

		args->output_buffer = cnatural_strdup("enotoken");
		args->output_buffer_size = strlen(args->output_buffer);
		return 0;
	}

	realpath = malloc(strlen(fname) + strlen(privatepath) + 1);
	if(realpath == NULL)
	{
		perror("Error allocating the realpath");
		return -1;
	}

	memset(realpath, '\0', strlen(fname) + strlen(privatepath) + 1);

	sprintf(realpath, "%s%s", privatepath, fname);

	printf("Sended file at %s (%s + %s + 1)\n", realpath, privatepath, fname);

	ofile = open(realpath, O_RDONLY);
	args->output_filedesc = ofile;

	cnatural_natural_token_destroy(&tkobj);
	free(realpath);

	return 0;
}
