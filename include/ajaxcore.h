/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for the AJAX core.
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

#if !defined(__CNATURAL_AJAX_CORE_H__)
#define __CNATURAL_AJAX_CORE_H__ 1

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>

#include <microhttpd.h>

#include "ajaxtypes.h"

/* NOTE: These headers are included for it's usage in the cnatural_try_ajax */

#include "coreutils/import.h"

/* End of custom AJAX functions */

int cnatural_basic_post_data_handler(
	void*,
	enum MHD_ValueKind,
	const char*,
	const char*,
	const char*,
	const char*,
	const char*,
	uint64_t,
	size_t
);
int cnatural_create_post_data(
	struct MHD_Connection*,
	int,
	cnatural_post_processor_data_t**
);
int cnatural_destroy_post_data(cnatural_post_processor_data_t**);
void cnatural_basic_post_destroy(
	void*,
	struct MHD_Connection*,
	void**,
	enum MHD_RequestTerminationCode
);

/**
* @brief A simple AJAX handler.
* The availables return codes are:
*  -1: An error occours and ERRNO is set.
*  0: Good.
*  1: This path not matches with this AJAX handler path.
* bufferout and outmime can be NULL.
* @param path String with the AJAX path.
* @param inout Arguments for the AJAX.
* @return Any of the return codes.
*/
typedef int (*cnatural_ajax_handler_t)(
	const char* path,
	cnatural_ajax_argument_t* inout
);

int cnatural_ajax_test(const char*, cnatural_ajax_argument_t*);
int cnatural_ajax_login(const char*, cnatural_ajax_argument_t*);

int cnatural_try_ajax(const char*, cnatural_ajax_argument_t*);

#endif /* ~__CNATURAL_AJAX_CORE_H__ */
