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

#if !defined(H_CNATURAL_NATURAL_LIST_FUNCTIONS_H_)
#define H_CNATURAL_NATURAL_LIST_FUNCTIONS_H_ 1

/**
* @file
* Double linked list functions and type.
*/

#include <stdlib.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @addtogroup dlist List utilities
* @{
*/

/**
* @brief Is a circular linked list.
*/
typedef struct cnatural_natural_list
{
	/**
	* @brief The next node.
	*
	* If there is no next node (this is the last node), is NULL.
	*/
	struct cnatural_natural_list* next;

	/**
	* @brief The previous node.
	*
	* If there is no previous node (this is the first node), is NULL.
	*/
	struct cnatural_natural_list* back;

	/**
	* @brief The node value.
	*
	* You can set it with cnatural_natural_list_set_at() or get it with
	* cnatural_natural_list_get_at().
	*/
	void* value;
} cnatural_natural_list;

/**
* @brief Creates a node.
*
* Any node can be a head node, but the head is not touched in search, get or
* set operations.
*
* @param node Node to create.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_create(cnatural_natural_list** node);

/**
* @brief Destroyes a node.
*
* Any node can be a head node, but the head is not touched in search, get or
* set operations.
*
* @param node Node to destroy.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_destroy(cnatural_natural_list** node);

/**
* @brief Gets the value at position.
*
* The value is a void pointer, so you should cast it. The index 0
* is the first node passed the head, so the head is unaccesible from
* this function.
*
* @param head The head of the list.
* @param at Index of the node to access.
* @param res Pointer to the `void*` where the node value will be saved.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_get_at(
	cnatural_natural_list* head,
	size_t at,
	void** res
);

/**
* @brief Sets the value at position.
*
* The value is a void pointer, so you should cast it. The index 0
* is the first node passed the head, so the head is unaccesible from
* this function.
*
* @param head The head of the list.
* @param at Index of the node to access.
* @param value Void pointer which contains the new node value.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_set_at(
	cnatural_natural_list* head,
	size_t at,
	void* value
);

/**
* @brief Removes this node from the list.
*
* After this, the node will not be in the list but it will be not destroyed,
* so you should call cnatural_natural_list_destroy() in this node.
*
* @param node Node to remove from the list.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_remove(cnatural_natural_list* node);

/**
* @brief Removes and destroyes this node from the list.
*
* After this, the node will not be in the list and in memory.
*
* Equivalent to call cnatural_natural_list_remove() and
* cnatural_natural_list_destroy().
*
* @param node Pointer to the node to remove and destroy from the list.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_remove_and_destroy(cnatural_natural_list** node);

/**
* @brief Push a node at the front.
*
* The inserted node will be at the index 0.
*
* @param head The head of the list.
* @param node Node to insert.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_push_front(
	cnatural_natural_list* head,
	cnatural_natural_list* node
);

/**
* @brief Push a node at the back.
*
* The inserted node will be at the index "size - 1".
*
* @param head The head of the list.
* @param node Node to insert.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_push_back(
	cnatural_natural_list* head,
	cnatural_natural_list* node
);

/**
* @brief Removes a node from the front.
*
* It's like call cnatural_natural_list_remove() on the first element.
*
* @param head The head of the list.
* @param node Pointer where the removed node will be.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_pop_front(
	cnatural_natural_list* head,
	cnatural_natural_list** node
);


/**
* @brief Removes a node from the back.
*
* It's like call cnatural_natural_list_remove() on the last element.
*
* @param head The head of the list.
* @param node Pointer where the removed node will be.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_pop_back(
	cnatural_natural_list* head,
	cnatural_natural_list** node
);

/**
* @brief Gets the list size.
*
* @param head The head of the list.
* @param size Pointer (reference) where the size will be stored.
* @return 0 on sucess, -1 on failure or 1 if the action cannot be done.
*/
int cnatural_natural_list_size(cnatural_natural_list* head, size_t* size);

/**
* @}
*/

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_NATURAL_LIST_FUNCTIONS_H_ */
