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

#if !defined(H_CNATURAL_CONFIGURATION_FILE_READER_H_)
#define H_CNATURAL_CONFIGURATION_FILE_READER_H_ 1

/**
* @file
* Simple Configuration file reader.
*/

#include <stdio.h>

#include "ajaxtypes.h"

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @addtogroup configfile Configuration Files Parsing
* @{
*/

/**
* @brief Reads a file and saves the configuration into a systdt.
*
* All resulting string members of systdt need to be free'ded.
*
* @param file FILE where the configuration will be readed.
* @param systdt Pointer where the readed configuration will be saved.
* @param salt The salt to use when encrypting the password.
* @return -1 on error, 0 on success.
*/
int cnatural_read_config_from_file(
	FILE* file,
	cnatural_system_data* systdt,
	const char* salt
);

/**
* @}
*/

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_CONFIGURATION_FILE_READER_H_ */
