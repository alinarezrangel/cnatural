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

/* Implementation headers: */

#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include "ajaxtypes.h"
#include "utilfcn.h"

int cnatural_token_create(cnatural_token** token)
{
	if(token == NULL)
		return -1;

	*token = malloc(sizeof(cnatural_token));

	if(*token == NULL)
		return -1;

	(*token)->timestamp.bdata = time(NULL);
	(*token)->username = NULL;
	(*token)->random_bytes = NULL;

	return 0;
}

int cnatural_token_destroy(cnatural_token** token)
{
	if(token == NULL)
		return -1;

	free((*token)->username);
	free((*token)->random_bytes);

	free(*token);

	return 0;
}

int cnatural_token_copy(
	cnatural_token* src,
	cnatural_token* dest
)
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

int cnatural_token_set_username(
	cnatural_token* token,
	const char* username
)
{
	if(token == NULL)
		return -1;

	free(token->username);
	token->username = cnatural_strdup(username);

	return 0;
}

int cnatural_token_set_random_bytes(
	cnatural_token* token,
	const char* random_bytes
)
{
	if(token == NULL)
		return -1;

	free(token->random_bytes);
	token->random_bytes = cnatural_strdup(random_bytes);

	return 0;
}

int cnatural_token_set_timestamp(
	cnatural_token* token,
	cnatural_token_timestamp* timestamp
)
{
	if(token == NULL)
		return -1;

	token->timestamp.bdata = timestamp->bdata;

	return 0;
}

int cnatural_token_get_username(
	cnatural_token* token,
	char** username
)
{
	if(token == NULL)
		return -1;

	*username = token->username;

	return 0;
}

int cnatural_token_get_random_bytes(
	cnatural_token* token,
	char** random_bytes
)
{
	if(token == NULL)
		return -1;

	*random_bytes = token->random_bytes;

	return 0;
}

int cnatural_token_get_timestamp(
	cnatural_token* token,
	cnatural_token_timestamp** timestamp
)
{
	if(token == NULL)
		return -1;

	(*timestamp)->bdata = token->timestamp.bdata;

	return 0;
}

bool cnatural_token_are_equals(
	cnatural_token* token1,
	cnatural_token* token2
)
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

int cnatural_token_save_in_jwt(
	cnatural_token* token,
	jwt_t* jwt
)
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

int cnatural_token_load_from_jwt(
	cnatural_token* token,
	jwt_t* jwt
)
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
