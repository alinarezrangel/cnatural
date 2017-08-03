/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Types and functions for handling AJAX.
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

#if !defined(H_CNATURAL_AJAX_TYPES_H_)
#define H_CNATURAL_AJAX_TYPES_H_ 1

/**
* @file
* Contains the basic types for the AJAX API.
*/

#include <stdlib.h>

#include <microhttpd.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @addtogroup ajax AJAX Bridge API
* @{
*/

/**
* @brief The size of a HTTP POST request.
*
* Required for MicroHTTPd for allocate the POST request buffer.
*
* It's only a chunk, not the total request size.
*/
#define CNATURAL_POST_BUFFER_SIZE 512

/**
* @brief POST type enum, value HTTP GET.
*/
#define CNATURAL_POST_TYPE_GET 0

/**
* @brief POST type enum, value HTTP POST.
*/
#define CNATURAL_POST_TYPE_POST 1

/**
* @brief Node of data of a POST request.
*
* @note
*   The POST HTTP parser adds a void argument "_=_", this should be ignored.
*/
typedef struct cnatural_post_processor_node
{
	/**
	* @brief The previous node (or NULL if this is the first).
	*/
	struct cnatural_post_processor_node* back;

	/**
	* @brief The next node (or NULL if this is the last).
	*/
	struct cnatural_post_processor_node* next;

	/**
	* @brief The name (or key) of the POST parameter.
	*
	* A NULL-terminated string.
	*/
	char* key;

	/**
	* @brief The value of the POST parameter.
	*
	* A NULL-terminated string.
	*/
	char* value;
} cnatural_post_processor_node_t;

/**
* @brief Is a HTTP POST processor (parser) state.
*/
typedef struct cnatural_post_processor_data
{
	/**
	* @brief the libmicrohttpd POST Processor.
	*/
	struct MHD_PostProcessor* postprocessor;

	/**
	* @brief The type of the request.
	*
	* Can be CNATURAL_POST_TYPE_GET or CNATURAL_POST_TYPE_POST.
	*/
	int type;

	/**
	* @brief The head node of the doble linked list containing the POST data.
	*/
	cnatural_post_processor_node_t* data;
} cnatural_post_processor_data_t;

/**
* @brief Is the system data and configuration.
*
* This is commonly referred as *"systdt"* or *"sysdt"*.
*/
typedef struct cnatural_system_data
{
	/**
	* @brief The login username.
	*
	* The username used to authenticate users, is **not** the username
	* who is running CNatural.
	*/
	char* username;

	/**
	* @brief The password of the server.
	*
	* This contains the encrypted password used to authenticate users.
	*/
	char* password;

	/**
	* @brief The secret of the server.
	*
	* This contains the "secret" used to encrypt the JWT / JWS (JSON Web Tokens).
	*/
	char* secret;

	/**
	* @brief The random bytes.
	*
	* Used to prevent tokens generated in other server sessions to work in
	* newer ones.
	*/
	char* random;

	/**
	* @brief Configuration field `useLivePassword`.
	*
	* If this is true at the start of the program, CNatural will ask the user
	* for a password.
	*/
	bool use_live_password;

	/**
	* @brief Configuration field `useLiveSecret`.
	*
	* If this is true at the start of the program, CNatural will ask the user
	* for a secret.
	*/
	bool use_live_secret;

	/**
	* @brief Configuration field `useLiveRandom`.
	*
	* If this is true at the start of the program, CNatural will ask the user
	* for a random bytes or will generate them.
	*/
	bool use_live_random;

	/**
	* @brief The server's port.
	*
	* Contains an integer in which the HTTP server will listen.
	*/
	int port;
} cnatural_system_data_t;

/**
* @brief Contains all argument, data and output values passed to an AJAX
* function.
*
* Any AJAX function will need at least these parameters (some are output
* arguments).
*/
typedef struct cnatural_ajax_argument
{
	/**
	* @brief The attached data.
	*
	* If a file or other form data was sended, it will be on this attribute.
	*/
	const char* attached_data;

	/**
	* @brief The size in bytes of the attached data.
	*/
	unsigned long int attached_data_size;

	/**
	* @brief The output buffer.
	*
	* It contains the raw data to send (if any). In general, when not sending
	* files, you should write in this field the raw data to send. It's default
	* value is NULL.
	*/
	char* output_buffer;

	/**
	* @brief Specified which amount of raw data to send.
	*
	* If output_filedesc is `-1` the servercore will assume than a raw output
	* is used instead, sending the first output_buffer_size of the string
	* output_buffer. Note that output_buffer does not need to be NULL-terminated
	* but is recommended. When sending text-based data, is recommended to not
	* include the terminating NULL byte as a character, because the JavaScript
	* core (at client side) will interpret a NULL byte as a transmission error.
	*
	* When working with binary data, is not required output_buffer to be
	* NULL-terminated and any amount of NULL bytes can be included on the
	* output.
	*/
	size_t output_buffer_size;

	/**
	* @brief The mimetype of the output.
	*
	* This is required both when using raw output and when using output files.
	*
	* Should be a NULL-terminated string containing a valid MIME-type.
	*/
	char* output_mimetype;

	/**
	* @brief The output file descriptor.
	*
	* If this is not `-1`, then the servercore will use this file descriptor
	* (opened by any of the open() family of functions) read all it's content
	* (the read can block) and send it. Use this instead of reading manually
	* all the file contents and puting it on the output_buffer member.
	*/
	int output_filedesc;

	/**
	* @brief The POST arguments.
	*
	* Contains all arguments passed via the POST method, see the specific
	* cnatural_post_processor_data_t documentation for the specific methods to
	* access the data.
	*/
	cnatural_post_processor_data_t* arguments;

	/**
	* @brief The global systdt.
	*
	* Just a pointer to the systdt copied when the AJAX method was received.
	*/
	cnatural_system_data_t* systdt;
} cnatural_ajax_argument_t;

/**
* @brief Gets an argument.
*/
cnatural_post_processor_node_t* cnatural_get_arg(
	cnatural_post_processor_node_t**,
	const char*
);

/**
* @}
*/

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_AJAX_TYPES_H_ */
