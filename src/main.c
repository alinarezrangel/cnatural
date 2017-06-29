/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for the server.
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

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <locale.h>
#include <sys/types.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

#include <microhttpd.h>

#include "tokens.h"
#include "ajaxcore.h"
#include "authcall.h"
#include "configfile.h"
#include "servercore.h"

cnatural_system_data_t systdt;

cnatural_system_data_t* get_global_system_data(void);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;
	FILE* configfile = NULL;
	char* configfile_name = "cnatural.conf";

	setlocale(LC_ALL, "");

	cnatural_servercore_set_systdt(&get_global_system_data);

	if(argc > 1)
	{
		configfile_name = argv[1];
	}

	printf("CNatural Server version %s\n", CNATURAL_SERVER_VERSION);
	printf("Starting...\n");
	printf("Reading configuration file (%s)\n\n", configfile_name);

	configfile = fopen(configfile_name, "r");

	if(configfile == NULL)
	{
		perror("Error opening the configuration file");
		exit(EXIT_FAILURE);
	}

	systdt.username = NULL;
	systdt.password = NULL;
	systdt.random = NULL;
	systdt.secret = NULL;
	systdt.port = 0;

	if(cnatural_configfile_read_systdt_from_file(configfile, &systdt) != 0)
	{
		printf("Error reading the configuration file\n");
		fclose(configfile);
		exit(EXIT_FAILURE);
	}

	if(fclose(configfile) != 0)
	{
		perror("Error closing the configuration file\n");
		free(systdt.username);
		free(systdt.password);
		free(systdt.random);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	printf("Scaning for NULL data...\n");

	if(systdt.username == NULL)
	{
		systdt.username = cnatural_strdup("cnatural");
		fprintf(stderr, "Warning: The configuration file does not have a username field, setting to it's default: cnatural\n");
	}
	if(systdt.password == NULL)
	{
		systdt.password = cnatural_strdup("a123b456");
		fprintf(stderr, "Warning: The configuration file does not have a password field, setting to it's default: a123b456\n");
	}
	if(systdt.random == NULL)
	{
		systdt.random = cnatural_strdup("not random");
		fprintf(stderr, "Warning: The configuration file does not have a random field, setting to it's default: not random\n");
	}
	if(systdt.secret == NULL)
	{
		systdt.secret = cnatural_strdup("not secret");
		fprintf(stderr, "Warning: The configuration file does not have a secret field, setting to it's default: not secret\n");
	}
	if(systdt.port == 0)
	{
		systdt.port = 8888;
		fprintf(stderr, "Warning: The configuration file does not have a port field, setting to it's default: 8888\n");
	}

	printf("Starting the HTTP daemon...\n");

	daemon = MHD_start_daemon(
		MHD_USE_SELECT_INTERNALLY,
		systdt.port,
		NULL,
		NULL,
		&cnatural_servercore_request_handler,
		NULL,
		MHD_OPTION_NOTIFY_COMPLETED,
		cnatural_basic_post_destroy,
		NULL,
		MHD_OPTION_END
	);
	if(daemon == NULL)
	{
		perror("Error getting the HTTP daemon");
		free(systdt.username);
		free(systdt.password);
		free(systdt.random);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	printf("HTTP daemon started at port %d, press any key to stop the server\n", systdt.port);

	getchar();

	printf("Stopping HTTP daemon...\n");

	MHD_stop_daemon(daemon);

	printf("Freeing the configurartion members...\n");

	free(systdt.username);
	free(systdt.password);
	free(systdt.random);
	free(systdt.secret);

	printf("All done, exiting\n");

	exit(EXIT_SUCCESS);
}

cnatural_system_data_t* get_global_system_data(void)
{
	return &systdt;
}
