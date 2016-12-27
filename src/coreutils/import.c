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
	cnatural_post_processor_node_t* it = NULL;
	int ofile = -1;

	if(strcmp(path, "/api/ajax/coreutils/import") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/import...\n");

	/*
	it = cnatural_get_arg(&args->arguments->data, "file");
	if(it == NULL)
	{
		printf("Cant get the path");
		return -1;
	}
	*/

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		printf("At %s = %s\n", it->key, it->value);
		if(strcmp(it->key, "file") == 0)
		{
			break;
		}
	}

	if(it == NULL)
	{
		printf("Cant get the path\n");
		return -1;
	}

	printf("Getting the path at %s\n", it->value);

	return 0;
}
