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

#if !defined(H_CNATURAL_BASIC_MACROS_H_)
#define H_CNATURAL_BASIC_MACROS_H_ 1

#include <stdbool.h> /* For bool */

/**
* @brief Is the CNatural Server version in a string macro.
*
* It's something like "1.0.2", for example.
*/
#define CNATURAL_SERVER_VERSION "1.0.0"

/* If this is C, not C++ */
#if !defined(__cplusplus)
/* These macros are used only in C++ */
#define CNATURAL_BEGIN_DECLRS
#define CNATURAL_END_DECLRS

/* Detect if this is C11 */
#if defined(__STDC_VERSION__)
#if __STDC_VERSION__ == 201112L
#define CNATURAL_LANG_11 1
#endif /* __STDC_VERSION__ == 201112L */
#else /* defined(__STDC_VERSION__) */
#error "Error: __STDC_VERSION__ undefined"
#endif /* defined(__STDC_VERSION__) */
#else /* !defined(__cplusplus) */
/* This is C++, so we need to wrap the C-code */
#define CNATURAL_BEGIN_DECLRS extern "C" {
#define CNATURAL_END_DECLRS }

/* To make easy in other headers to detect C++ */
#define CNATURAL_USING_CPP 1

/* Detect if this is C++11 */
#if __cplusplus >= 201103L
#define CNATURAL_LANG_11 1
#endif /* __cplusplus >= 201103L */
#endif /* !defined(__cplusplus) */

#if defined(CNATURAL_NOT_USE_RESTRICT_KEYWORD)
#define CNATURAL_RESTRICT
#else /* defined(CNATURAL_NOT_USE_RESTRICT_KEYWORD) */
#define CNATURAL_RESTRICT restrict
#endif /* defined(CNATURAL_NOT_USE_RESTRICT_KEYWORD) */

#endif /* ~H_CNATURAL_BASIC_MACROS_H_ */
