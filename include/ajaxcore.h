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

#if !defined(H_CNATURAL_AJAX_CORE_H_)
#define H_CNATURAL_AJAX_CORE_H_ 1

/**
* @file ajaxcore.h
* Core of the AJAX API.
*/

#include <stdlib.h>
#include <stdint.h>

#include <microhttpd.h>

#include "ajaxtypes.h"

/* NOTE: These headers are included for it's usage in the cnatural_try_ajax */

#include "coreutils/login.h"
#include "coreutils/import.h"
#include "coreutils/timefcn.h"
#include "basicio/readfile.h"

/* End of custom AJAX functions */

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief Handles a POST request using the provided data.
*/
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

/**
* @brief Creates a HTTP POST processor (parser).
*/
int cnatural_create_post_data(
	struct MHD_Connection*,
	int,
	cnatural_post_processor_data_t**
);

/**
* @brief Destroyes a HTTP POST processor (parser).
*/
int cnatural_destroy_post_data(cnatural_post_processor_data_t**);

/**
* @brief Destroyes a HTTP POST data with the provided arguments.
*/
void cnatural_basic_post_destroy(
	void*,
	struct MHD_Connection*,
	void**,
	enum MHD_RequestTerminationCode
);

/**
* @brief A simple AJAX handler.
* The availables return codes are:
*
*  -1: An error occours and ERRNO is set.
*  0: Good.
*  1: This path not matches with this AJAX handler path.
*
* @param path String with the AJAX path.
* @param inout Arguments for the AJAX.
* @return Any of the return codes.
*/
typedef int (*cnatural_ajax_handler_t)(
	const char* path,
	cnatural_ajax_argument_t* inout
);

int cnatural_ajax_test(const char*, cnatural_ajax_argument_t*);

/**
* @brief Tries to execute the specified AJAX path with the provided arguments.
*/
int cnatural_try_ajax(const char*, cnatural_ajax_argument_t*);

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_AJAX_CORE_H_ */
