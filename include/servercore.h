/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Core functions for the HTTPd server
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

#if !defined(_CNATURAL_SERVER_CORE_H_)
#define _CNATURAL_SERVER_CORE_H_ 1

/**
* @file servercore.h
* HTTPd server core functions.
*/

#include <microhttpd.h>

#include "ajaxtypes.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief This callback is used to get a systdt.
*/
typedef cnatural_system_data_t* (*cnatural_servercore_cll_systdt_t)(void);

/**
* @brief Global handler to get a systdt.
*/
extern cnatural_servercore_cll_systdt_t cnatural_servercore_get_systdt_handler;

/**
* @brief Gets the global systdt by calling `cnatural_servercore_get_systdt_handler`.
*
* @return The global systdt or NULL if no handler was attached.
*/
cnatural_system_data_t* cnatural_servercore_get_systdt(void);

/**
* @brief Sets the global systdt callback.
*
* @arg handler The new systdt get handler.
*/
void cnatural_servercore_set_systdt(cnatural_servercore_cll_systdt_t handler);

/**
* @brief Handles a HTTP request.
* Designed to be used ONLY by the MicroHTTPd library.
*/
int cnatural_servercore_request_handler(
	void* klass,
	struct MHD_Connection* conn,
	const char* url,
	const char* method,
	const char* version,
	const char* upload_data,
	long unsigned int* upload_data_size,
	void** conn_klass
);

/**
* @brief Sets the HTTP headers.
* Designed to be used ONLY by the MicroHTTPd library.
*/
void cnatural_servercore_set_response_headers(
	struct MHD_Response** res,
	int type
);

CNATURAL_END_DECLRS

#endif /* ~_CNATURAL_SERVER_CORE_H_ */
