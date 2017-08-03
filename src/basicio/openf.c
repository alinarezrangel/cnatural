/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX BasicIO module: OpenFile function.
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

#include "basicio/readfile.h"

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#include "tokens.h"
#include "authcall.h"
#include "utilfcn.h"

int cnatural_ajax_basicio_openfile(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	cnatural_post_processor_node_t* it = NULL;
	char* fname = NULL;
	char* token = NULL;
	char* mode = NULL;
	int sz = 0;
	int err = 0;
	int autherr = 0;
	int fhandler = -1;
	int flags = 0;
	int postype = 0;
	cnatural_authcall_token_t* tkobj = NULL;

	const char* error_json_format =
		"{\"type\": \"error\", \"errno\": %d, \"error\": \"%s\"}";

	if(strcmp(path, "/api/ajax/basicio/openfile") != 0)
		return 1;
	cnatural_log_debug("Catched /api/ajax/basicio/openfile...");

	for(it = args->arguments->data; it != NULL; it = it->next)
	{
		cnatural_log_debug("At %s = %s", it->key, it->value);

		if(strcmp(it->key, "file") == 0)
		{
			fname = it->value;
			continue;
		}
		if(strcmp(it->key, "token") == 0)
		{
			token = it->value;
			continue;
		}
		if(strcmp(it->key, "mode") == 0)
		{
			mode = it->value;
			continue;
		}
	}

	/* Authenticate */
	if((autherr = cnatural_authcall_authenticate(token, &tkobj, args->systdt)) != 1)
	{
		if(autherr == 0)
		{
			cnatural_authcall_destroy(&tkobj);
		}

		cnatural_log_error("Error authenticating the user");

		return -1;
	}

	/* Parse the mode string in a fopen-like form
	* The valid strings (modes) are (with their respective opening modes):
	*
	* - `r`: Read.
	* - `r+`: Read and write, an error is raised if the file does not exists.
	* - `w`: Write.
	* - `w+`: Read and write, the file is created if not exists and truncated.
	* - `a`: Append (write at the end).
	* - `a+`: Read and write, all write operations are maded at the end, the
	* file is created if not exists but not trucated.
	* - `x`: Write, if the file already exists this will raise an error, if not
	* then will create it.
	* - `x+`: Read and write, like `x` but you can also read from the created
	* file descriptor.
	* - `c`: Write, if the file not exists is created, if exists, will be opened
	* for reading without truncating.
	* - `c+`: Read and write, like `c` but you can also read from the created
	* file descriptor.
	*
	* All of those position at the beginning except for `a` and `a+`.
	*
	* Like `fopen` and `open`, a file position modification call is required
	* between successive `read` and `write` operations.
	*
	* postype is 0 to position at the beginning or 1 for the end.
	*/

	postype = 0;

	if(strcmp(mode, "r") == 0)
	{
		flags = O_RDONLY;
	}
	if(strcmp(mode, "r+") == 0)
	{
		flags = O_RDWR;
	}
	if(strcmp(mode, "w") == 0)
	{
		flags = O_WRONLY | O_CREAT | O_TRUNC;
	}
	if(strcmp(mode, "w+") == 0)
	{
		flags = O_RDWR | O_CREAT | O_TRUNC;
	}
	if(strcmp(mode, "a") == 0)
	{
		flags = O_WRONLY | O_APPEND;
		postype = 1;
	}
	if(strcmp(mode, "a+") == 0)
	{
		flags = O_RDWR | O_APPEND;
		postype = 1;
	}
	if(strcmp(mode, "x") == 0)
	{
		flags = O_WRONLY | O_EXCL | O_CREAT;
	}
	if(strcmp(mode, "x+") == 0)
	{
		flags = O_RDWR | O_EXCL | O_CREAT;
	}
	if(strcmp(mode, "c") == 0)
	{
		flags = O_WRONLY | O_CREAT;
	}
	if(strcmp(mode, "c+") == 0)
	{
		flags = O_RDWR | O_CREAT;
	}

	fhandler = open(
		fname,
		flags,
		S_IRUSR | S_IWUSR | S_IRGRP | S_IWGRP | S_IROTH | S_IWOTH
	);

	if(fhandler < 0)
	{
		cnatural_perror("Error opening the file");

		err = errno;

		/* This error should be notified to the client */

		sz = snprintf(
			NULL,
			0,
			error_json_format,
			err,
			strerror(err)
		);

		if(sz <= 0)
		{
			cnatural_perror("Error calculating the size of the error string");

			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		args->output_mimetype = cnatural_strdup("application/json");

		args->output_buffer_size = sz;
		args->output_buffer = malloc(sz + 1);

		if(args->output_buffer == NULL)
		{
			cnatural_perror("Error allocating the error string");

			free(args->output_mimetype);
			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		sz = snprintf(
			args->output_buffer,
			sz + 1,
			error_json_format,
			err,
			strerror(err)
		);

		if(sz <= 0)
		{
			cnatural_perror("Error printing the error string");

			free(args->output_mimetype);
			free(args->output_buffer);
			cnatural_authcall_destroy(&tkobj);

			return -1;
		}

		cnatural_authcall_destroy(&tkobj);

		return 0;
	}

	sz = snprintf(
		NULL,
		0,
		"%d",
		fhandler
	);

	if(sz <= 0)
	{
		cnatural_perror("Error snprintfing the file descriptor");

		close(fhandler);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	args->output_mimetype = cnatural_strdup("text/plain");

	args->output_buffer_size = sz;
	args->output_buffer = malloc(sz + 1);

	if(args->output_buffer == NULL)
	{
		cnatural_perror("Error allocating the file descriptor string");

		free(args->output_mimetype);
		close(fhandler);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	sz = snprintf(
		args->output_buffer,
		sz + 1,
		"%d",
		fhandler
	);

	if(sz <= 0)
	{
		cnatural_perror("Error snprintfing the real file descriptor");

		free(args->output_mimetype);
		free(args->output_buffer);
		close(fhandler);
		cnatural_authcall_destroy(&tkobj);

		return -1;
	}

	cnatural_authcall_destroy(&tkobj);

	return 0;
}
