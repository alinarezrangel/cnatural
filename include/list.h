/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural List functions.
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

#if !defined(__CNATURAL_NATURAL_LIST_FUNCTIONS_H__)
#define __CNATURAL_NATURAL_LIST_FUNCTIONS_H__ 1

/**
* @file list.h
* list functions and type.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>
#include <time.h>

typedef struct cnatural_natural_list
{
	struct cnatural_natural_list* next;
	struct cnatural_natural_list* back;
	void* value;
} cnatural_natural_list_t;

int cnatural_natural_list_create(cnatural_natural_list_t**);
int cnatural_natural_list_destroy(cnatural_natural_list_t**);
int cnatural_natural_list_get_at(cnatural_natural_list_t*, size_t, void**);
int cnatural_natural_list_set_at(cnatural_natural_list_t*, size_t, void*);
int cnatural_natural_list_remove(cnatural_natural_list_t*);
int cnatural_natural_list_remove_and_destroy(cnatural_natural_list_t**);
int cnatural_natural_list_push_front(cnatural_natural_list_t*, cnatural_natural_list_t*);
int cnatural_natural_list_push_back(cnatural_natural_list_t*, cnatural_natural_list_t*);
int cnatural_natural_list_pop_front(cnatural_natural_list_t*, cnatural_natural_list_t**);
int cnatural_natural_list_pop_back(cnatural_natural_list_t*, cnatural_natural_list_t**);
int cnatural_natural_list_size(cnatural_natural_list_t*, size_t*);

#endif /* ~__CNATURAL_NATURAL_LIST_FUNCTIONS_H__ */
