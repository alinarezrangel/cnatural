/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX CoreUtils module: login function.
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

#if !defined(__CNATURAL_MODULE_COREUTILS_LOGIN_H__)
#define __CNATURAL_MODULE_COREUTILS_LOGIN_H__ 1

/**
* @file login.h
* CoreUtils login function.
*/

#include "ajaxtypes.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/*
* @brief returns a file in the private_http directory.
* Is needed a valid token, maked by coreutils.createToken
*/
int cnatural_ajax_coreutils_login(const char*, cnatural_ajax_argument_t*);

CNATURAL_END_DECLRS

#endif /* ~__CNATURAL_MODULE_COREUTILS_LOGIN_H__ */
