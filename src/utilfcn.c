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
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <time.h>

#include <unistd.h>
#if !defined(CNATURAL_PASSWD_CRYPT_MTH) || (CNATURAL_PASSWD_CRYPT_MTH == 0)
#include <crypt.h>
#endif /* !defined(CNATURAL_PASSWD_CRYPT_MTH) \
	|| (CNATURAL_PASSWD_CRYPT_MTH == 0) */

static struct cnatural_utilfcn_rdstate cnatural_utilfcn_global_state = {
	.sum = INT64_C(0xB),
	.mul = INT64_C(0x5DEECE66D),
	.mod = INT64_C(281474976710656),
	.xsubi = INT64_C(1)
};

#if defined(CNATURAL_DEFAULT_LOG_LEVEL) && !defined(CNATURAL_DEBUG)
static int cnatural_utilfcn_global_log_level = CNATURAL_DEFAULT_LOG_LEVEL;
#else /* defined(CNATURAL_DEFAULT_LOG_LEVEL) */
/* Log all */
static int cnatural_utilfcn_global_log_level = 0;
#endif /* defined(CNATURAL_DEFAULT_LOG_LEVEL) */

#if defined(CNATURAL_USE_ANSI_COLOR)
static bool cnatural_utilfcn_global_log_use_ansi_color = true;
#endif /* defined(CNATURAL_USE_ANSI_COLOR) */

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

cnatural_utilfcn_rdstate cnatural_srandom(int_least64_t seed)
{
	const int_least64_t p2t48 = INT64_C(281474976710656);

#ifdef CNATURAL_RDC_SAFE_MODE
#if defined(CNATURAL_RDC_ARG1) \
	&& defined(CNATURAL_RDC_ARG2) \
	&& defined(CNATURAL_RDC_ARG3)
	cnatural_utilfcn_global_state = (cnatural_utilfcn_rdstate) {
		.sum = INT64_C(CNATURAL_RDC_ARG2) + (seed / INT64_C(2)),
		.mul = INT64_C(CNATURAL_RDC_ARG1) + INT64_C(1),
		.mod = (INT64_C(CNATURAL_RDC_ARG3) < p2t48)?
			p2t48
			: INT64_C(CNATURAL_RDC_ARG3),
		.xsubi = seed
	};
#else /* defined(CNATURAL_RDC_ARG1) \
	&& defined(CNATURAL_RDC_ARG2) \
	&& defined(CNATURAL_RDC_ARG3) */
#error "CNatural " __FILE__ " " __LINE__ ": macros CNATURAL_RDC_ARG* are bad \
defined"
#endif /* defined(CNATURAL_RDC_ARG1) \
	&& defined(CNATURAL_RDC_ARG2) \
	&& defined(CNATURAL_RDC_ARG3) */
#else /* CNATURAL_RDC_SAFE_MODE */
	cnatural_utilfcn_global_state = (cnatural_utilfcn_rdstate) {
		.sum = INT64_C(0xB),
		.mul = INT64_C(0x5DEECE66D),
		.mod = p2t48,
		.xsubi = seed
	};
#endif /* CNATURAL_RDC_SAFE_MODE */

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

int_least64_t cnatural_random_r(cnatural_utilfcn_rdstate* state)
{
	state->xsubi = (
			state->mul
			* state->xsubi
			+ state->sum
		) % state->mod;

	return state->xsubi;
}

char cnatural_asciify(char chr)
{
	if(chr < 0)
		chr = -(chr + 1);
	if(chr < 0x21)
		chr += 0x23;
	if(chr > 0x7E)
		chr -= 0x05;

	return chr;
}

void cnatural_fill_random(
	char* str,
	size_t len,
	cnatural_utilfcn_rdstate* state
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
			btc = cnatural_asciify(*bt);

			str[i * sizeof(uint_least64_t) + j] = btc;

			bt ++;
		}
	}
}

char* cnatural_passwd_crypt(const char* salt, const char* pass)
{
	char* r = NULL;

#if defined(CNATURAL_PASSWD_CRYPT_MTH)
	r = crypt(pass, salt);
#else
	/* No password encryption method was selected, what I should do?
	** The docs says: "if no password encryption method was selected,
	** it will return a copy of the password" */
	r = pass;
#endif

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

#if defined(CNATURAL_PASSWD_CRYPT_MTH)
	r = crypt(vpass, epass);
#else
	r = vpass;
#endif

	if(r == NULL)
		return -1;

	if(strcmp(r, epass) == 0)
		return 1;
	else
		return 0;
}

int cnatural_log_level(int level)
{
	if(level >= 0)
	{
		cnatural_utilfcn_global_log_level = level;
	}

	return cnatural_utilfcn_global_log_level;
}

bool cnatural_log_color(bool use_color)
{
#if defined(CNATURAL_USE_ANSI_COLOR)
	return cnatural_utilfcn_global_log_use_ansi_color = use_color;
#else
	return false;
#endif
}

int cnatural_log_base(
	int level,
	const char* fmt,
	va_list args,
	const char* fmt2,
	...
)
{
	char strbuf[50];
	int c = 0;
	int ansicolor = 0;

	va_list vargs;

	if(level < cnatural_utilfcn_global_log_level)
		return 0;

	strftime(strbuf, 50, "%F %T 000", localtime(&(time_t) { time(NULL) }));

	switch(level)
	{
		case CNATURAL_LOG_DEBUG:
			c += printf("DEBG");
			ansicolor = 6; /* cyan */
			break;
		case CNATURAL_LOG_INFO:
			c += printf("INFO");
			ansicolor = 2; /* green */
			break;
		case CNATURAL_LOG_WARNING:
			c += printf("WARN");
			ansicolor = 3; /* yellow */
			break;
		case CNATURAL_LOG_ERROR:
			c += printf("ERRR");
			ansicolor = 1; /* red */
			break;
	}

#if defined(CNATURAL_USE_ANSI_COLOR)
	if(cnatural_utilfcn_global_log_use_ansi_color)
		c += printf("\x1B[%dm", 30 + ansicolor);
#endif

	va_start(vargs, fmt2);

	c += printf(" {%d} [%s] ", level, strbuf);
	c += vprintf(fmt, args);
	c += vprintf(fmt2, vargs);

	va_end(vargs);

#if defined(CNATURAL_USE_ANSI_COLOR)
	//if(cnatural_utilfcn_global_log_use_ansi_color)
		c += printf("\x1B[0m");
#endif

	return c;
}

int cnatural_log_debug(const char* fmt, ...)
{
	va_list args;
	int c = 0;

	va_start(args, fmt);

	c = cnatural_log_base(CNATURAL_LOG_DEBUG, fmt, args, "\n");

	va_end(args);

	return c;
}

int cnatural_log_info(const char* fmt, ...)
{
	va_list args;
	int c = 0;

	va_start(args, fmt);

	c = cnatural_log_base(CNATURAL_LOG_INFO, fmt, args, "\n");

	va_end(args);

	return c;
}

int cnatural_log_warning(const char* fmt, ...)
{
	va_list args;
	int c = 0;

	va_start(args, fmt);

	c = cnatural_log_base(CNATURAL_LOG_WARNING, fmt, args, "\n");

	va_end(args);

	return c;
}

int cnatural_log_error(const char* fmt, ...)
{
	va_list args;
	int c = 0;

	va_start(args, fmt);

	c = cnatural_log_base(CNATURAL_LOG_ERROR, fmt, args, "\n");

	va_end(args);

	return c;
}

int cnatural_perror(const char* fmt, ...)
{
	va_list args;
	int c = 0;

	int err = errno;

	va_start(args, fmt);

	c = cnatural_log_base(CNATURAL_LOG_ERROR, fmt, args, ": %s\n", strerror(err));

	va_end(args);

	return c;
}
