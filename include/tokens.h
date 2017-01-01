/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural Token functions.
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

#if !defined(__CNATURAL_NATURAL_TOKENS_FUNCTIONS_H__)
#define __CNATURAL_NATURAL_TOKENS_FUNCTIONS_H__ 1

/**
* @file tokens.h
* CoreUtils token management.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>
#include <time.h>

#ifndef __STDC_NO_THREADS__
#	include <threads.h>
#	define CNATURAL_NATURAL_USE_THREADS 1
#endif

#include <jwt.h>

#include "list.h"
#include "ajaxtypes.h"

/**
* @brief Represents a timestamp.
* You should never access to it's attributes: the interface of this struct
* is not registered into the API changes, it may have incompatible API
* changes between compatible versions.
*/
typedef struct cnatural_natural_timestamp
{
	time_t bdata;
} cnatural_natural_timestamp_t;

/**
* @brief Represents a token.
* The token have a timestamp, the username and some random bytes.
*
* Is used with the server auth system (by default JWS) for
* authenticate the clients.
*/
typedef struct cnatural_natural_token
{
	cnatural_natural_timestamp_t timestamp;
	char* username;
	char* random_bytes;
} cnatural_natural_token_t;

#ifdef CNATURAL_NATURAL_USE_THREADS
extern mtx_t cnatural_natural_tokens_mutex;
#else
#warning "Warning: unable to search a way for provide locks to the server tokens"
#endif

extern cnatural_natural_list_t* cnatural_natural_token_list;

int cnatural_natural_token_create(cnatural_natural_token_t*);
int cnatural_natural_token_destroy(cnatural_natural_token_t*);
int cnatural_natural_token_copy(cnatural_natural_token_t*, cnatural_natural_token_t*);
int cnatural_natural_token_set_username(cnatural_natural_token_t*, char*);
int cnatural_natural_token_set_random_bytes(cnatural_natural_token_t*, char*);
int cnatural_natural_token_set_timestamp(cnatural_natural_token_t*, cnatural_natural_timestamp_t*);
int cnatural_natural_token_get_username(cnatural_natural_token_t*, char**);
int cnatural_natural_token_get_random_bytes(cnatural_natural_token_t*, char**);
int cnatural_natural_token_get_timestamp(cnatural_natural_token_t*, cnatural_natural_timestamp_t**);

bool cnatural_natural_token_are_equals(cnatural_natural_token_t*, cnatural_natural_token_t*);

int cnatural_natural_token_save_in_jwt(cnatural_natural_token_t*, jwt_t*);
int cnatural_natural_token_load_from_jwt(cnatural_natural_token_t*, jwt_t*);

int cnatural_natural_global_tokens_init(void);
int cnatural_natural_global_tokens_deinit(void);
int cnatural_natural_global_tokens_add(cnatural_natural_token_t*);
int cnatural_natural_global_tokens_remove(cnatural_natural_token_t*);
int cnatural_natural_global_tokens_verify(cnatural_natural_token_t*);

#endif /* ~__CNATURAL_NATURAL_TOKENS_FUNCTIONS_H__ */
