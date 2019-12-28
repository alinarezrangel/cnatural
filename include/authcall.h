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

#if !defined(H_CNATURAL_AUTHENTICATION_CALLS_H_)
#define H_CNATURAL_AUTHENTICATION_CALLS_H_ 1

/**
* @file
* Utility functions for authentication of API calls.
*
* These calls are simply wrappers around more complex calls.
*/

#include "ajaxtypes.h"
#include "tokens.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @addtogroup authcall Authentication Library
* @{
*/

/**
* @brief The JWT encrypton method used to authenticate the tokens.
*/
#define CNATURAL_AUTH_METHOD JWT_ALG_HS512

/**
* @brief An authenticate call token.
*
* Basicly a wrapper around cnatural_token_t, but useful to provede
* a single-call authenticate method.
*
* The public attributes of this struct are:
*
* - `cnatural_token_t* token`: The natural token used.
*/
typedef struct cnatural_authcall_token
{
	cnatural_token* token;
} cnatural_authcall_token;

/**
* @brief Authenticates a raw token string and gets useful data.
*
* The token should be a pointer to a pointer where the uninitialized token
* is.
*
* @param rawtk The raw token string
* @param[out] token The token.
* @param systdt Pointer to a valid system data.
* @return -1 on error, 0 if the token is valid and 1 otherwise.
*/
int cnatural_authcall_authenticate(
	char* CNATURAL_RESTRICT rawtk,
	cnatural_authcall_token** CNATURAL_RESTRICT token,
	cnatural_system_data* CNATURAL_RESTRICT systdt
);

/**
* @brief Destroyes a call to authenticate.
*
* @param token The call to authenticate to destroy.
* @return -1 on error, 0 on sucess.
*/
int cnatural_authcall_destroy(cnatural_authcall_token** token);

/**
* @}
*/

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_AUTHENTICATION_CALLS_H_ */
