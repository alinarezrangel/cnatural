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

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include <jwt.h>

#include "tokens.h"
#include "authcall.h"
#include "utilfcn.h"

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int cnatural_ajax_coreutils_import(
	const char* path,
	cnatural_ajax_argument* args
)
{
	const char* privatepath = "private_http/";

	cnatural_post_processor_node* it = NULL;
	int autherr = 0;
	int ofile = -1;
	char* token = "";
	char* fname = "";
	char* mimetype = "";
	char* realpath = NULL;
	cnatural_authcall_token* tkobj = NULL;

	if(strcmp(path, "/api/ajax/coreutils/import") != 0)
		return 1;
	cnatural_log_debug("Catched /api/ajax/coreutils/import...");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		cnatural_log_debug("At %s = %s", it->key, it->value);

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

	/* Authenticate */
	if((autherr = cnatural_authcall_authenticate(token, &tkobj, args->systdt)) != 1)
	{
		if(autherr == 0)
		{
			cnatural_authcall_destroy(&tkobj);
		}

		cnatural_log_error("Error authenticating the user");

		return -1;
	}

	realpath = malloc(strlen(fname) + strlen(privatepath) + 1);

	if(realpath == NULL)
	{
		cnatural_perror("Error allocating the realpath");

		return -1;
	}

	args->output_mimetype = cnatural_strdup(mimetype);

	memset(realpath, '\0', strlen(fname) + strlen(privatepath) + 1);

	sprintf(realpath, "%s%s", privatepath, fname);

	cnatural_log_debug(
		"Sended file at %s (%s + %s + 1)",
		realpath,
		privatepath,
		fname
	);

	ofile = open(realpath, O_RDONLY);
	args->output_filedesc = ofile;

	cnatural_authcall_destroy(&tkobj);

	return 0;
}
