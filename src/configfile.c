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

#include "configfile.h"

/* Implementation headers: */

#include <string.h>

#include "utilfcn.h"

int cnatural_read_config_from_file(
	FILE* file,
	cnatural_system_data* systdt,
	const char* salt
)
{
	char chr = '\0';
	char name[255];
	char value[255];
	int name_it = 0;
	int value_it = 0;
	bool at_name = true;

	memset(name, '\0', 254);
	memset(value, '\0', 254);

	if(file == NULL)
		return -1;

	if(systdt == NULL)
		return -1;

	while(!feof(file))
	{
		chr = fgetc(file);

		switch(chr)
		{
			case '=':
				at_name = false;
				break;
			case '\"':
				break;
			case '\n':
				at_name = true;

				if(strcmp(name, "username") == 0)
				{
					systdt->username = cnatural_strdup(value);
				}
				if(strcmp(name, "password") == 0)
				{
					systdt->password = cnatural_passwd_crypt(salt, value);

					if(systdt->password == NULL)
					{
						perror("Error crypting the password");
					}
				}
				if(strcmp(name, "secret") == 0)
				{
					systdt->secret = cnatural_strdup(value);
				}
				if(strcmp(name, "random") == 0)
				{
					systdt->random = cnatural_strdup(value);
				}
				if(strcmp(name, "port") == 0)
				{
					systdt->port = strtol(value, NULL, 10);
				}
				if(strcmp(name, "useLivePassword") == 0)
				{
					systdt->use_live_password = strcmp(value, "true") == 0;
				}
				if(strcmp(name, "useLiveSecret") == 0)
				{
					systdt->use_live_secret = strcmp(value, "true") == 0;
				}
				if(strcmp(name, "useLiveRandom") == 0)
				{
					systdt->use_live_random = strcmp(value, "true") == 0;
				}

				name_it = 0;
				value_it = 0;
				memset(name, '\0', 254);
				memset(value, '\0', 254);
				break;
			default:
				if(at_name)
				{
					name[name_it++] = chr;
				}
				else
				{
					value[value_it++] = chr;
				}
		}
	}

	return 0;
}
