/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX CoreUtils module: time (all) function.
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

int cnatural_ajax_coreutils_time_get(
	const char* path,
	cnatural_ajax_argument_t* args
)
{
	struct tm current_server_time;
	int sz = 0;
	time_t t;

	if(strcmp(path, "/api/ajax/coreutils/time/get") != 0)
		return 1;
	printf("Catched /api/ajax/coreutils/time/get...\n");

	args->output_mimetype = cnatural_strdup("text/plain");

	t = time(NULL);
	current_server_time = *gmtime(&t);

	sz = snprintf(
		NULL,
		0,
		"%d-%d-%dT%d:%d:%d.00Z",
		current_server_time.tm_year + 1900,
		current_server_time.tm_mon + 1,
		current_server_time.tm_mday,
		current_server_time.tm_hour,
		current_server_time.tm_min,
		current_server_time.tm_sec
	);

	if(sz <= 0)
	{
		perror("Error snprintfing the current time");
		return -1;
	}

	args->output_buffer_size = sz;
	args->output_buffer = malloc(sz + 1);

	snprintf(
		args->output_buffer,
		sz + 1,
		"%d-%d-%dT%d:%d:%d.00Z",
		current_server_time.tm_year + 1900,
		current_server_time.tm_mon + 1,
		current_server_time.tm_mday,
		current_server_time.tm_hour,
		current_server_time.tm_min,
		current_server_time.tm_sec
	);

	return 0;
}
