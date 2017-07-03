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

#include "utilfcn.h"

/* Implementation headers: */
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include <unistd.h>
#if !defined(CNATURAL_PASSWD_CRYPT_MTH) || (CNATURAL_PASSWD_CRYPT_MTH == 0)
#	include <crypt.h>
#endif

static struct cnatural_utilfcn_rdstate cnatural_utilfcn_global_state = {
	.sum = INT64_C(0xB),
	.mul = INT64_C(0x5DEECE66D),
	.mod = INT64_C(281474976710656),
	.xsubi = INT64_C(1)
};

char* cnatural_strdup(const char* str)
{
	char* res = malloc((strlen(str) + 1) * sizeof(char));
	if(res == NULL)
		return NULL;
	/*
	strcpy(res, str);
	res[strlen(str)] = '\0';
	return res;
	*/
	return strcpy(res, str);
}

cnatural_utilfcn_rdstate_t cnatural_srandom(int_least64_t seed)
{
	const int_least64_t p2t48 = INT64_C(281474976710656);

#ifdef CNATURAL_RDC_SAFE_MODE
#	if defined(CNATURAL_RDC_ARG1) && defined(CNATURAL_RDC_ARG2) && defined(CNATURAL_RDC_ARG3)
	cnatural_utilfcn_global_state = (cnatural_utilfcn_rdstate_t) {
		.sum = INT64_C(CNATURAL_RDC_ARG2) + (seed / INT64_C(2)),
		.mul = INT64_C(CNATURAL_RDC_ARG1) + INT64_C(1),
		.mod = (INT64_C(CNATURAL_RDC_ARG3) < p2t48)? p2t48 : INT64_C(CNATURAL_RDC_ARG3),
		.xsubi = seed
	};
#	else
#		error "CNatural " __FILE__ " " __LINE__ ": macros CNATURAL_RDC_ARG* are bad defined"
#	endif
#else
	cnatural_utilfcn_global_state = (cnatural_utilfcn_rdstate_t) {
		.sum = INT64_C(0xB),
		.mul = INT64_C(0x5DEECE66D),
		.mod = p2t48,
		.xsubi = seed
	};
#endif

	return cnatural_utilfcn_global_state;
}

int_least64_t cnatural_random(void)
{
	cnatural_utilfcn_global_state.xsubi = (
			cnatural_utilfcn_global_state.mul
			* cnatural_utilfcn_global_state.xsubi
			+ cnatural_utilfcn_global_state.sum
		) % cnatural_utilfcn_global_state.mod;

	return cnatural_utilfcn_global_state.xsubi;
}

int_least64_t cnatural_random_r(cnatural_utilfcn_rdstate_t* state)
{
	state->xsubi = (
			state->mul
			* state->xsubi
			+ state->sum
		) % state->mod;

	return state->xsubi;
}

void cnatural_fill_random(
	char* str,
	size_t len,
	cnatural_utilfcn_rdstate_t* state
)
{
	size_t n = 0, i = 0, j = 0;
	uint_least64_t rd = 0;
	char btc = '\0', *bt = NULL;

	memset(str, '\0', len - 1);

	/* n is the 1/WSIZE part of the final size */
	n = lldiv(len - 1, sizeof(uint_least64_t)).quot;

	for(i = 0; i < n; ++i)
	{
		if(state == NULL)
			rd = cnatural_random();
		else
			rd = cnatural_random_r(state);

		/* Now separe rd into ~WSIZE bytes */

		bt = (char*) &rd;

		for(j = 0; j < sizeof(uint_least64_t); ++j)
		{
			btc = *bt;

			if(btc < 0)
				btc = -(btc + 1);
			if(btc < 0x21)
				btc += 0x23;
			if(btc > 0x7E)
				btc -= 0x3;

			str[i * sizeof(uint_least64_t) + j] = btc;

			bt ++;
		}
	}
}

char* cnatural_passwd_crypt(const char* salt, const char* pass)
{
	char* r = NULL;

	r = crypt(pass, salt);

	if(r == NULL)
	{
		/* Should perror the error? */
		return NULL;
	}

	return cnatural_strdup(r);
}

int cnatural_passwd_verify(const char* epass, const char* vpass)
{
	char* r = NULL;

	r = crypt(vpass, epass);

	if(r == NULL)
		return -1;

	if(strcmp(r, epass) == 0)
		return 1;
	else
		return 0;
}
