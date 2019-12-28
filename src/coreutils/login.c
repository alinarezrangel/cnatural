/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX CoreUtils module: login function.
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

#include "coreutils/login.h"

/* Implementation headers: */

#include <stdio.h>
#include <string.h>
#include <errno.h>

#include <jwt.h>

#include "tokens.h"
#include "authcall.h"
#include "utilfcn.h"

int cnatural_ajax_coreutils_login(
	const char* path,
	cnatural_ajax_argument* args
)
{
	cnatural_post_processor_node* it = NULL;
	cnatural_post_processor_node* passwd = NULL;
	cnatural_token* tk = NULL;
	char* uname = "";
	char* upass = "";
	char* sr = "";
	jwt_t* jwt = NULL;
	cnatural_token_timestamp tms;
	const char* rd = args->systdt->random;

	tms.bdata = time(NULL);

	if(strcmp(path, "/api/ajax/coreutils/login") != 0)
		return 1;
	cnatural_log_debug("Catched /api/ajax/coreutils/login...");

	/*
	it = cnatural_get_arg(&args->arguments->data, "file");
	if(it == NULL)
	{
		printf("Cant get the path");
		return -1;
	}
	*/

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		if(strcmp(it->key, "uname") == 0)
		{
			uname = it->value;
			continue;
		}
		if(strcmp(it->key, "upass") == 0)
		{
			upass = it->value;
			passwd = it;
			continue;
		}
	}

	cnatural_log_info("Getting the udata at uname:<%s>", uname);

	if((strcmp(args->systdt->username, uname) != 0)
		|| (cnatural_passwd_verify(args->systdt->password, upass) != 1))
	{
		cnatural_log_error("Invalid login");

		args->output_buffer = cnatural_strdup("enopass");
		args->output_buffer_size = strlen(args->output_buffer);
		args->output_mimetype = cnatural_strdup("text/plain");

		return 0;
	}

	/* Destroy the uncrypted pass fast as possible */
	free(passwd->value);
	passwd->value = NULL;

	cnatural_log_info("Logged, creating token...");

	/* Create and fill a JWT */
	if(jwt_new(&jwt) != 0)
	{
		cnatural_perror(
			"Unable to create the JWT (JSON Web Tokens/Signature) object"
		);

		return -1;
	}

	if(jwt_add_grant(jwt, "iss", "cnatural_client_default") != 0)
	{
		cnatural_perror(
			"Unable to set the JWT (JSON Web Tokens/Signature) object: iss"
		);

		jwt_free(jwt);

		return -1;
	}

	if(jwt_add_grant_int(jwt, "exp", 9999999L) != 0)
	{
		cnatural_perror(
			"Unable to set the JWT (JSON Web Tokens/Signature) object: exp"
		);

		jwt_free(jwt);

		return -1;
	}

	if(jwt_add_grant(jwt, "nt_svr", "CNatural " CNATURAL_SERVER_VERSION) != 0)
	{
		cnatural_perror(
			"Unable to set the JWT (JSON Web Tokens/Signature) object: nt_svr"
		);

		jwt_free(jwt);

		return -1;
	}

	if(jwt_set_alg(
			jwt,
			CNATURAL_AUTH_METHOD,
			(unsigned char*) args->systdt->secret,
			strlen(args->systdt->secret))
		!= 0)
	{
		cnatural_perror(
			"Unable to set the JWT (JSON Web Tokens/Signature) algorithm"
		);

		jwt_free(jwt);

		return -1;
	}

	/* Create a Natural token and save it in the JWT */
	if(cnatural_token_create(&tk) != 0)
	{
		cnatural_log_error("Error creating the token");

		jwt_free(jwt);

		return -1;
	}

	if(cnatural_token_set_username(tk, (const char*) uname) != 0)
	{
		cnatural_log_error("Error setting the token data: username");

		jwt_free(jwt);

		return -1;
	}

	if(cnatural_token_set_random_bytes(tk, rd) != 0)
	{
		cnatural_log_error("Error setting the token data: random bytes");

		jwt_free(jwt);

		return -1;
	}

	if(cnatural_token_set_timestamp(tk, &tms) != 0)
	{
		cnatural_log_error("Error setting the token data: timestamp");

		jwt_free(jwt);

		return -1;
	}

	if(cnatural_token_save_in_jwt(tk, jwt) != 0)
	{
		cnatural_perror("Serializing the token");

		jwt_free(jwt);

		return -1;
	}

	if(cnatural_token_destroy(&tk) != 0)
	{
		cnatural_log_error("Error destroying the token");

		jwt_free(jwt);

		return -1;
	}

	sr = jwt_encode_str(jwt);
	if(sr == NULL)
	{
		cnatural_perror("Unable to encode the JWT");
		return -1;
	}

	args->output_mimetype = cnatural_strdup("text/plain");

	args->output_buffer = sr;
	args->output_buffer_size = strlen(sr);

	jwt_free(jwt);

	return 0;
}
