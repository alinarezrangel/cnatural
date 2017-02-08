/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Reader and parser of configuration files.
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

#if !defined(__CNATURAL_CONFIGURATION_FILE_READER_H__)
#define __CNATURAL_CONFIGURATION_FILE_READER_H__ 1

/**
* @file configfile.h
* Simple Configuration file reader.
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <stdint.h>
#include <time.h>

#include "ajaxtypes.h"
#include "list.h"

/**
* @brief Reads a file and saves the configuration into a systdt.
*
* All resulting string members of systdt need to be free'ded.
*
* @arg file FILE where the configuration will be readed.
* @arg systdt Pointer where the readed configuration will be saved.
* @return -1 on error, 0 on success.
*/
int cnatural_configfile_read_systdt_from_file(FILE* file, cnatural_system_data_t* systdt);

#endif /* ~__CNATURAL_CONFIGURATION_FILE_READER_H__ */
