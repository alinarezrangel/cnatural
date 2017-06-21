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

#include <time.h>
#include <jwt.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

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

/**
* @brief Creates a new token.
* The tokens have a timestamp, a random data and the username.
*
* @param token Token to create.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_create(cnatural_natural_token_t** token);

/**
* @brief Destroyes a token.
* The associated data (username, random bytes, etc) will be destroyed.
*
* @param token Token to destroy.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_destroy(cnatural_natural_token_t** token);

/**
* @brief Clones (copy) a token.
* The result is a token with all members sharing the same value (but not indentity)
* that the source operand. The two tokens need to be created with
* cnatural_natural_token_create.
*
* The dest token may not be deallocated: if the dest token contains data, this
* function deallocates them and then proceed.
*
* @param src Source token, will not be modified.
* @param dest Destiny token, will be modified.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_copy(cnatural_natural_token_t* src, cnatural_natural_token_t* dest);

/**
* @brief Sets the username of a token.
* The token must be created (non NULL pointer).
*
* @param token Token where the username will be setted.
* @param username New username.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_set_username(cnatural_natural_token_t* token, const char* username);

/**
* @brief Sets the random bytes of a token.
* The token must be created (non NULL pointer).
*
* @param token Token where the random bytes will be setted.
* @param random_bytes New random bytes.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_set_random_bytes(cnatural_natural_token_t* token, const char* random_bytes);

/**
* @brief Sets the timestamp of a token.
* The token must be created (non NULL pointer).
*
* @param token Token where the timestamp will be setted.
* @param timestamp New timestamp.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_set_timestamp(cnatural_natural_token_t* token, cnatural_natural_timestamp_t* timestamp);

/**
* @brief Gets the username of a token.
* The token must be created (non NULL pointer).
*
* The result must never be destroyed: if you modify the result, the username
* of the token will be modified with it. If you need a clone of the username
* you should clone the string directly (cnatural_strdup).
*
* @param token Token where the username will be getted.
* @param username Pointer to the string where the username will be setted.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_get_username(cnatural_natural_token_t* token, char** username);

/**
* @brief Gets the random bytes of a token.
* The token must be created (non NULL pointer).
*
* The result must never be destroyed: if you modify the result, the random bytes
* of the token will be modified with it. If you need a clone of the random bytes
* you should clone the string directly (cnatural_strdup).
*
* @param token Token where the random bytes will be getted.
* @param random_bytes Pointer to the string where the random bytes will be setted.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_get_random_bytes(cnatural_natural_token_t* token, char** random_bytes);

/**
* @brief Gets the timestamp of a token.
* The token must be created (non NULL pointer).
*
* The result must never be destroyed: if you modify the result, the timestamp
* of the token will be modified with it. If you need a clone of the timestamp
* you should clone the object directly.
*
* @param token Token where the timestamp will be getted.
* @param timestamp Pointer to the object where the timestamp will be setted.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_get_timestamp(cnatural_natural_token_t* token, cnatural_natural_timestamp_t** timestamp);

/**
* @brief Determines if the two tokens are equals.
* If any of the tokens are invalid, always return false.
*
* @param token1 Token to compare.
* @param token2 Token to compare.
* @returns true if the tokens are equal, false otherwise.
*/
bool cnatural_natural_token_are_equals(cnatural_natural_token_t* token1, cnatural_natural_token_t* token2);

/**
* @brief Serializes a token in a JWT.
* The JWT (JSON Web Token / JSON Web Signature) object can be used
* later with the cnatural_natural_token_load_from_jwt.
*
* @param token Token to serialize.
* @param jwt JWT Object where the token will be serialized.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_save_in_jwt(cnatural_natural_token_t* token, jwt_t* jwt);

/**
* @brief Deserializes a token in a JWT.
* The JWT (JSON Web Token / JSON Web Signature) object can be used
* later with the cnatural_natural_token_save_in_jwt.
*
* @param token Token to deserialize.
* @param jwt JWT Object where the token will be deserialize.
* @returns 0 on success, 1 when the action cannot be executed and -1 on error.
*/
int cnatural_natural_token_load_from_jwt(cnatural_natural_token_t* token, jwt_t* jwt);

CNATURAL_END_DECLRS

#endif /* ~__CNATURAL_NATURAL_TOKENS_FUNCTIONS_H__ */
