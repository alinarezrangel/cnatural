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

#if !defined(H_CNATURAL_MODULE_COREUTILS_TIME_H_)
#define H_CNATURAL_MODULE_COREUTILS_TIME_H_ 1

/**
* @file time.h
* CoreUtils time (all) function.
*/

#include "ajaxtypes.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/*
* @brief gets the current server time in ISO 8601 format.
*/
int cnatural_ajax_coreutils_time_get(const char*, cnatural_ajax_argument_t*);

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_MODULE_COREUTILS_TIME_H_ */
