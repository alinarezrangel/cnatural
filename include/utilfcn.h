/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * General purpose utility functions.
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

#if !defined(H_CNATURAL_UTILFCN_H_)
#define H_CNATURAL_UTILFCN_H_ 1

/**
* @file utilfcn.h
* General purpose utility functions.
*/

#include <stddef.h>
#include <stdint.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief Uses the drand48 functions as random generation engine.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_RD_DRAND48 0

/**
* @brief Uses the internal algorithm as random generation engine.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_RD_LCE 1

/**
* @brief Uses the standard rand function as random generation engine.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_RD_STDRAND 2

/**
* @brief Uses the GNU extension for the crypt function.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_CRYPTO_GNU_CRYPT 1

/**
* @brief Uses the POSIX API for the crypt function.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_CRYPTO_POSIX_CRYPT 0

/**
* @brief The random engine state.
*
* You should use this type as an opaque struct, because the algorithm
* and state of the random engine may change in incompatible-ways between
* compatible versions of CNatural.
*/
typedef struct cnatural_utilfcn_rdstate
{
	int_least64_t sum;
	int_least64_t mul;
	int_least64_t mod;
	int_least64_t xsubi;
} cnatural_utilfcn_rdstate_t;


/**
* @brief Duplicates a string.
*
* Like strdup, but is portable.
*
* @arg str String to duplicate (is not modified).
* @return A malloc-created copy of str.
*/
char* cnatural_strdup(const char* str);

/**
* @brief Seeds the random number engine.
*
* For help about the random number engine, see the cnatural_random function.
*
* This function is not reentrant and is not thread-safe. The default seed
* is 1.
*
* @arg seed The new seed.
* @return A copy of the new global state.
*/
cnatural_utilfcn_rdstate_t cnatural_srandom(int_least64_t seed);

/**
* @brief Gets a random number and updates the global random state.
*
* Really, it returns an uniform pseudo-random number picked from the
* global random state and updates it. This uses an unespecified algorithm
* to do that.
*
* This function uses the global state and is not thread safe. For a reentrant
* aproach, see the cnatural_random_r function.
*
* @return The next pseudo-random number generated.
*/
int_least64_t cnatural_random(void);

/**
* @brief Gets a random number and updates a local random state.
*
* Like cnatural_random, but reentrant.
*
* @arg state The random state.
* @return The next pseudo-random number generated.
*/
int_least64_t cnatural_random_r(cnatural_utilfcn_rdstate_t* state);

/**
* @brief ASCIIifies a byte.
*
* The input byte can contain any valid value, but the returned byte always
* is a valid graphical ASCII character.
*
* @arg chr The character to ASCIIify
* @return The ACIIfied character.
*/
char cnatural_asciify(char chr);

/**
* @brief Gets a random ASCII string.
*
* To get random bytes, it uses cnatural_random if state is NULL or
* cnatural_random_r otherwise.
*
* str always is NULL-terminated after calling this function.
*
* Notes: The size of the string should be at least `sizeof(uint_least64_t)`
* or nothing will be written. Also, the string will be written in sections
* of `sizeof(uint_least64_t)` bytes each, so the string will not be fully
* used unless it size is a multiplo of `sizeof(uint_least64_t)`.
*
* This may be a problem with strings with size less than
* `sizeof(uint_least64_t)`, in which nothing will be written but they will
* be cleaned (filled with zeros).
*
* @arg str The string to fill.
* @arg len The length of the string, in bytes including the terminating
* NULL-byte.
* @arg state The random state or NULL.
*/
void cnatural_fill_random(
	char* str,
	size_t len,
	cnatural_utilfcn_rdstate_t* state
);

/**
* @brief Encrypts a password using the specified salt.
*
* This uses the crypt(3) function if possible, if no encryption method
* was selected by using the macro CNATURAL_PASSWD_CRYPT_MTH, a copy of
* password is returned (this is a security risk).
*
* @arg salt The salt to use.
* @arg pass The password.
* @return NULL on error, a malloc-created string on success.
*/
char* cnatural_passwd_crypt(const char* salt, const char* pass);

/**
* @brief Verifies a encrypted password.
*
* The password should be encrypted by using cnatural_passwd_crypt.
*
* @arg epass The encrypted password.
* @arg vpass The password to verify.
* @return -1 if error, 0 if the passwords not match or 1 if their match.
*/
int cnatural_passwd_verify(const char* epass, const char* vpass);

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_UTILFCN_H_ */
