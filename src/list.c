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

#include "list.h"

/* Implementation headers: */

/* none */

/* This file implements a double-linked list for AJAX modules usage */

int cnatural_natural_list_create(cnatural_natural_list_t** head)
{
	if(head == NULL)
		return -1;
	*head = malloc(sizeof(cnatural_natural_list_t));
	if(*head == NULL)
		return -1;

	(*head)->next = *head;
	(*head)->back = *head;

	return 0;
}

int cnatural_natural_list_destroy(cnatural_natural_list_t** head)
{
	cnatural_natural_list_t *it = NULL, *cp = NULL;

	if((head == NULL) || (*head == NULL))
		return -1;

	it = (*head)->next;

	for(; it != *head; it = cp)
	{
		cp = it->next;
		free(it);
	}

	free(*head);

	return 0;
}

int cnatural_natural_list_get_at(cnatural_natural_list_t* head, size_t at, void** result)
{
	cnatural_natural_list_t* it = NULL;
	size_t i = 0;

	if(head == NULL)
		return -1;

	it = head->next;

	for(i = 0; it != head; i++, it = it->next)
	{
		if(i == at)
		{
			result = &it->value;
			return 0;
		}
	}

	/* This code will never execute because the precond. is
	** at >= 0 && at < len(list) */
	return 1;
}

int cnatural_natural_list_set_at(cnatural_natural_list_t* head, size_t at, void* value)
{
	cnatural_natural_list_t* it = NULL;
	size_t i = 0;

	if(head == NULL)
		return -1;

	it = head->next;

	for(i = 0; it != head; i++, it = it->next)
	{
		if(i == at)
		{
			it->value = value;
			return 0;
		}
	}

	/* This code will never execute because the precond. is
	** at >= 0 && at < len(list) */
	return 1;
}

int cnatural_natural_list_remove(cnatural_natural_list_t* node)
{
	if(node == NULL)
		return -1;

	node->back->next = node->next;
	node->next->back = node->back;
	node->back = node;
	node->next = node;

	return 0;
}

int cnatural_natural_list_remove_and_destroy(cnatural_natural_list_t** node)
{
	int ret = 0;

	if((node == NULL) || (*node == NULL))
		return -1;

	ret = cnatural_natural_list_remove(*node);
	if(ret != 0)
		return ret;
	ret = cnatural_natural_list_destroy(node);
	if(ret != 0)
		return ret;

	return 0;
}

int cnatural_natural_list_push_front(cnatural_natural_list_t* head, cnatural_natural_list_t* node)
{
	if(head == NULL)
		return -1;

	node->next = head->next;
	node->back = head;
	head->next->back = node;
	head->next = node;

	return 0;
}

int cnatural_natural_list_push_back(cnatural_natural_list_t* head, cnatural_natural_list_t* node)
{
	if(head == NULL)
		return -1;

	node->next = head;
	node->back = head->back;
	head->back->next = node;
	head->back = node;

	return 0;
}

int cnatural_natural_list_pop_front(cnatural_natural_list_t* head, cnatural_natural_list_t** node)
{
	int ret = 0;

	if(head == NULL)
		return -1;

	if(head->next == head)
		return 1;

	node = &head->next;

	ret = cnatural_natural_list_remove(head->next);
	if(ret != 0)
		return ret;

	return 0;
}

int cnatural_natural_list_pop_back(cnatural_natural_list_t* head, cnatural_natural_list_t** node)
{
	int ret = 0;

	if(head == NULL)
		return -1;

	if(head->back == head)
		return 1;

	node = &head->back;

	ret = cnatural_natural_list_remove(head->back);
	if(ret != 0)
		return ret;

	return 0;
}

int cnatural_natural_list_size(cnatural_natural_list_t* head, size_t* s)
{
	cnatural_natural_list_t* it = NULL;
	size_t i = 0;

	if(head == NULL)
		return -1;

	if(head->next == head)
	{
		*s = 0;
		return 0;
	}

	it = head->next;

	for(i = 1; it != head; it = it->next)
		i++;

	*s = i;

	return 0;
}
