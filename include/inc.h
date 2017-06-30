/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Basic macros that will be used in all files.
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

#if !defined(_CNATURAL_BASIC_MACROS_H_)
#define _CNATURAL_BASIC_MACROS_H_ 1

#include <stdbool.h> /* For bool */

/**
* @brief Is the CNatural version in a string macro.
*
* It's something like "1.0.2", for example.
*
* Note that this version may not be the same than CNATURAL_SERVER_VERSION.
*/
#define CNATURAL_VERSION "0.1.0"

/**
* @brief Is the CNatural Server version in a string macro.
*
* It's something like "1.0.2", for example.
*
* Note that this version may not be the same than CNATURAL_VERSION.
*/
#define CNATURAL_SERVER_VERSION "1.0.0"

#if !defined(__cplusplus)
#	define CNATURAL_BEGIN_DECLRS /**/
#	define CNATURAL_END_DECLRS /**/
#
#	if defined(__STDC_VERSION__)
#		if __STDC_VERSION__ == 201112L
#			define CNATURAL_LANG_11 1
#		endif
#	else
#		error "Error: __STDC_VERSION__ undefined"
#	endif
#else
#	define CNATURAL_BEGIN_DECLRS extern "C" {
#	define CNATURAL_END_DECLRS }
#
#	define CNATURAL_USING_CPP 1
#
#	if __cplusplus >= 201103L
#		define CNATURAL_LANG_11 1
#	endif
#endif

#if defined(CNATURAL_NOT_USE_RESTRICT_KEYWORD)
#	define CNATURAL_RESTRICT /**/
#else
#	define CNATURAL_RESTRICT restrict
#endif

#endif /* ~_CNATURAL_BASIC_MACROS_H_ */
