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

#include "ajaxtypes.h"

char* cnatural_strdup(const char* str)
{
	char* res = malloc((strlen(str) + 1) * sizeof(char));
	if(res == NULL)
		return NULL;
	/*
	strcpy(res, str);
	res[strlen(str)] = '\0';
	return res;
	*/
	return strcpy(res, str);
}

cnatural_post_processor_node_t* cnatural_get_arg(
	cnatural_post_processor_node_t** list,
	const char* key
)
{
	cnatural_post_processor_node_t* it = NULL;

	if(list == NULL)
		return NULL;

	for(it = *list; it != NULL; it = it->next)
	{
		if(strcmp(it->key, key) == 0)
		{
			return it;
		}
	}

	return NULL;
}
