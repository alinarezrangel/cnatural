/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * AJAX BasicIO module: ReadFile function.
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

#if !defined(__CNATURAL_MODULE_COREUTILS_IMPORT_H__)
#define __CNATURAL_MODULE_COREUTILS_IMPORT_H__ 1

/**
* @file readfile.h
* BasicIO ReadFile function.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>
#include <ctype.h>

#include <jwt.h>

#include "tokens.h"
#include "ajaxtypes.h"

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>


/*
* @brief returns a file in the private_http directory.
* Is needed a valid token, maked by coreutils.createToken
*/
int cnatural_ajax_basicio_readfile(const char*, cnatural_ajax_argument_t*);

#endif /* ~__CNATURAL_MODULE_COREUTILS_IMPORT_H__ */