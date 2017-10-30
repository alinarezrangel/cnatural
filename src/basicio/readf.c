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

#include "basicio/readf.h"

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

int cnatural_ajax_basicio_readfile(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	cnatural_post_processor_node_t* it = NULL;
	char* handler = NULL;
	char* token = NULL;
	char* chunksize = NULL;
	cnatural_authcall_token_t* tkobj = NULL;

	const char* error_json_format =
		"{\"type\": \"error\", \"errno\": %d, \"error\": \"%s\"}";

	if(strcmp(path, "/api/ajax/basicio/readfile") != 0)
		return 1;
	cnatural_log_debug("Catched /api/ajax/basicio/readfile...");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		cnatural_log_debug("At %s = %s", it->key, it->value);

		if(strcmp(it->key, "handler") == 0)
		{
			handler = it->value;
			continue;
		}
		if(strcmp(it->key, "token") == 0)
		{
			token = it->value;
			continue;
		}
		if(strcmp(it->key, "chunksize") == 0)
		{
			chunksize = it->value;
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

	//

	cnatural_authcall_destroy(&tkobj);

	return 0;
}
