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

#include "tokens.h"

cnatural_natural_list_t* cnatural_natural_token_list = NULL;

int cnatural_natural_token_create(cnatural_natural_token_t** token)
{
	if(token == NULL)
		return -1;

	*token = malloc(sizeof(cnatural_natural_token_t));

	if(*token == NULL)
		return -1;

	(*token)->timestamp.bdata = time(NULL);
	(*token)->username = NULL;
	(*token)->random_bytes = NULL;

	return 0;
}

int cnatural_natural_token_destroy(cnatural_natural_token_t** token)
{
	if(token == NULL)
		return -1;

	free((*token)->username);
	free((*token)->random_bytes);

	free(*token);

	return 0;
}

int cnatural_natural_token_copy(cnatural_natural_token_t* src, cnatural_natural_token_t* dest)
{
	if((src == NULL) || (dest == NULL))
		return -1;

	free(dest->username);
	free(dest->random_bytes);

	dest->timestamp.bdata = src->timestamp.bdata;
	dest->username = cnatural_strdup(src->username);
	dest->random_bytes = cnatural_strdup(src->random_bytes);

	return 0;
}

int cnatural_natural_token_set_username(cnatural_natural_token_t* token, const char* username)
{
	if(token == NULL)
		return -1;

	free(token->username);
	token->username = cnatural_strdup(username);

	return 0;
}

int cnatural_natural_token_set_random_bytes(cnatural_natural_token_t* token, const char* random_bytes)
{
	if(token == NULL)
		return -1;

	free(token->random_bytes);
	token->random_bytes = cnatural_strdup(random_bytes);

	return 0;
}

int cnatural_natural_token_set_timestamp(cnatural_natural_token_t* token, cnatural_natural_timestamp_t* timestamp)
{
	if(token == NULL)
		return -1;

	token->timestamp.bdata = timestamp->bdata;

	return 0;
}

int cnatural_natural_token_get_username(cnatural_natural_token_t* token, char** username)
{
	if(token == NULL)
		return -1;

	*username = token->username;

	return 0;
}

int cnatural_natural_token_get_random_bytes(cnatural_natural_token_t* token, char** random_bytes)
{
	if(token == NULL)
		return -1;

	*random_bytes = token->random_bytes;

	return 0;
}

int cnatural_natural_token_get_timestamp(cnatural_natural_token_t* token, cnatural_natural_timestamp_t** timestamp)
{
	if(token == NULL)
		return -1;

	(*timestamp)->bdata = token->timestamp.bdata;

	return 0;
}

bool cnatural_natural_token_are_equals(cnatural_natural_token_t* token1, cnatural_natural_token_t* token2)
{
	if((token1 == NULL) || (token2 == NULL))
		return false;

	if(token1->timestamp.bdata != token2->timestamp.bdata)
	{
		return false;
	}

	if(strcoll(token1->username, token2->username) != 0)
	{
		return false;
	}

	if(strcmp(token1->random_bytes, token2->random_bytes) != 0)
	{
		return false;
	}

	return true;
}

int cnatural_natural_token_save_in_jwt(cnatural_natural_token_t* token, jwt_t* jwt)
{
	if(token == NULL)
		return -1;

	if((errno = jwt_add_grant_int(jwt, "tm", (long int) token->timestamp.bdata)) != 0)
		return -1;

	if((errno = jwt_add_grant(jwt, "un", (const char*) token->username)) != 0)
		return -1;

	if((errno = jwt_add_grant(jwt, "rd", (const char*) token->random_bytes)) != 0)
		return -1;

	return 0;
}

int cnatural_natural_token_load_from_jwt(cnatural_natural_token_t* token, jwt_t* jwt)
{
	char* bf = NULL;
	if(token == NULL)
		return -1;

	token->timestamp.bdata = (time_t) jwt_get_grant_int(jwt, "tm");

#ifdef CNATURAL_TOKEN_NO_IGNORE_ZERO
	if(token->timestamp.bdata == 0)
	{
		return -1;
	}
#endif

	free(token->username);

	bf = (char*) jwt_get_grant(jwt, "un");

	if(bf == NULL)
		return -1;

	token->username = cnatural_strdup(bf);

	free(token->random_bytes);

	bf = (char*) jwt_get_grant(jwt, "rd");

	if(bf == NULL)
		return -1;

	token->random_bytes = cnatural_strdup(bf);

	return 0;
}

int cnatural_natural_global_tokens_init(void)
{
#ifndef CNATURAL_IGNORE_REINIT
	if(cnatural_natural_token_list != NULL)
	{
		return 1;
	}
#endif

	return cnatural_natural_list_create(&cnatural_natural_token_list);
}

int cnatural_natural_global_tokens_deinit(void)
{
	cnatural_natural_list_t* it = NULL;

	if(cnatural_natural_token_list == NULL)
		return -1;

	for(it = cnatural_natural_token_list->next; it != cnatural_natural_token_list; it = it->next)
	{
		if(cnatural_natural_token_destroy((cnatural_natural_token_t**) &it->value) != 0)
			return -1;

		it->value = NULL;
	}

	return cnatural_natural_list_destroy(&cnatural_natural_token_list);
}

int cnatural_natural_global_tokens_add(cnatural_natural_token_t* token)
{
	cnatural_natural_list_t* node = NULL;
	int ret = 0;

	if((token == NULL) || (cnatural_natural_token_list == NULL))
		return -1;

	ret = cnatural_natural_list_create(&node);
	if(ret != 0)
		return ret;

	ret = cnatural_natural_token_create((cnatural_natural_token_t**) &node->value);
	if(ret != 0)
		return ret;

	ret = cnatural_natural_token_copy(token, node->value);
	if(ret != 0)
		return ret;

	ret = cnatural_natural_list_push_front(cnatural_natural_token_list, node);
	if(ret != 0)
		return ret;

	return 0;
}

int cnatural_natural_global_tokens_remove(cnatural_natural_token_t* token)
{
	cnatural_natural_list_t* it = NULL;
	int ret = 0;

	if((token == NULL) || (cnatural_natural_token_list == NULL))
		return -1;

	for(
		it = cnatural_natural_token_list->next;
		!cnatural_natural_token_are_equals(it->value, token)
		&& (it != cnatural_natural_token_list);
		it = it->next);

	if(it == cnatural_natural_token_list)
	{
		return 1;
	}

	ret = cnatural_natural_list_remove(it);
	if(ret != 0)
		return ret;

	ret = cnatural_natural_token_destroy((cnatural_natural_token_t**) &it->value);
	if(ret != 0)
		return ret;

	it->value = NULL;

	ret = cnatural_natural_list_destroy(&it);
	if(ret != 0)
		return ret;

	return 0;
}

int cnatural_natural_global_tokens_verify(cnatural_natural_token_t* token)
{
	cnatural_natural_list_t* it = NULL;

	if((cnatural_natural_token_list == NULL) || (token == NULL))
		return -1;

	for(it = cnatural_natural_token_list->next; it != cnatural_natural_token_list; it = it->next)
	{
		if(cnatural_natural_token_are_equals(it->value, token))
			return 0;
	}

	return 1;
}
