/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Command Line Arguments parsing APIs.
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

#if !defined(_CNATURAL_CMDLINE_H_)
#define _CNATURAL_CMDLINE_H_ 1

/**
* @file cmdline.h
* Command Line Arguments parsing APIs.
*/

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @brief Type handler for command line options.
*
* A function pointer to a command line option handler.
*
* @arg argc The argument counter.
* @arg argv The arguments passed to the handlers.
*/
typedef int (*cnatural_cmdline_argument_handler_t)(int argc, char** argv);

/**
* @brief The command-line option.
*
* To declare a command line option, use brace-initializers, the order is:
*
* - `short_option`: a string containing the short-option form or NULL.
* - `long_option`: a string containing the long-option form or NULL.
* - `nth_args`: an integer containing the number of arguments to be passed
* to the handler.
* - `handler`: the function handler.
* - `doc_option`: the help string for the option.
*/
typedef struct cnatural_cmdline_argument
{
	const char* short_option;
	const char* long_option;
	int nth_args;
	cnatural_cmdline_argument_handler_t handler;
	const char* doc_option;
} cnatural_cmdline_argument_t;

/**
* @brief Parses all command line options.
*
* The `help_handler` will be called with the `-h` or `--help` flags without
* arguments.
*
* @arg argc The argument count.
* @arg argv The argument values, an array of at least `argc` strings.
* @arg opts An array of all options.
* @arg help_handler The handler function for the help option.
* @return -1 on error, 0 on success or 1 if the help handler was called.
*/
int cnatural_cmdline_parse(
	int argc,
	char** argv,
	cnatural_cmdline_argument_t* opts,
	cnatural_cmdline_argument_handler_t help_handler
);

CNATURAL_END_DECLRS

#endif /* ~_CNATURAL_CMDLINE_H_ */
