/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Utility functions for authentication of API calls.
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

#include "authcall.h"

/* Implementation headers: */

#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include "utilfcn.h"

int cnatural_authcall_authenticate(
	char* CNATURAL_RESTRICT rawtk,
	cnatural_authcall_token_t** CNATURAL_RESTRICT token,
	cnatural_system_data_t* CNATURAL_RESTRICT systdt
)
{
	jwt_t* jwt = NULL;
	int serrno = 0;
	char* uname = NULL;
	char* rdbytes = NULL;

	if((rawtk == NULL) || (systdt == NULL))
		return -1;

	/* Create and authenticate the token */

	*token = malloc(sizeof(cnatural_authcall_token_t));

	if(*token == NULL)
		return -1;

	/* First, decode the JWT string `rawtk` into a JWT object */
	if((errno = jwt_decode(
			&jwt,
			rawtk,
			(unsigned char*) systdt->secret,
			strlen(systdt->secret)))
		!= 0)
	{
		serrno = errno;
		free(*token);
		errno = serrno;

		return -1;
	}

	/* Now, create the Natural token and use it to extract the authdata
	** from the JWT object */

	if(cnatural_natural_token_create(&(*token)->token) != 0)
	{
		serrno = errno;
		cnatural_natural_token_destroy(&(*token)->token);
		free(*token);
		errno = serrno;

		return -1;
	}

	if(cnatural_natural_token_load_from_jwt((*token)->token, jwt) != 0)
	{
		serrno = errno;
		cnatural_natural_token_destroy(&(*token)->token);
		free(*token);
		errno = serrno;

		return -1;
	}

	/* Authenticate algorithm and systdt data */

	if(jwt_get_alg(jwt) != CNATURAL_AUTH_METHOD)
	{
		return 0;
	}

	jwt_free(jwt);

	cnatural_natural_token_get_username((*token)->token, &uname);
	cnatural_natural_token_get_random_bytes((*token)->token, &rdbytes);

	if((strcmp(uname, systdt->username) != 0)
		|| (strcmp(rdbytes, systdt->random) != 0))
	{
		return 0;
	}

	return 1;
}

int cnatural_authcall_destroy(cnatural_authcall_token_t** token)
{
	if((token == NULL) || (*token == NULL))
		return -1;

	cnatural_natural_token_destroy(&(*token)->token);
	free(*token);

	return 0;
}
