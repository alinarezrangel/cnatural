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
#include "cmdline.h"
#include "utilfcn.h"

/* Forward declarations for cmdline handlers */
int cmdline_help(int argc, char** argv);
int cmdline_pass(int argc, char** argv);
int cmdline_rand(int argc, char** argv);
int cmdline_secr(int argc, char** argv);
int cmdline_port(int argc, char** argv);
int cmdline_conf(int argc, char** argv);
int cmdline_logl(int argc, char** argv);

#if defined(CNATURAL_USE_ANSI_COLOR)
int cmdline_colr(int argc, char** argv);
#endif

void generate_random_field(void);
void generate_salt(char* salt);

cnatural_cmdline_argument_t options[] =
{
	{"-c", "--conf", 1, cmdline_conf, "Sets the configuration file"},
	{"-a", "--password", 0, cmdline_pass, "Ask the user for an username to authenticate"},
	{"-r", "--random", 0, cmdline_rand, "Ask the user for a random string to authenticate"},
	{"-s", "--secret", 0, cmdline_secr, "Ask the user for a secret to encrypt"},
	{"-p", "--port", 1, cmdline_port, "Sets the port where the server will be executed"},
	{"-v", "--verbose", 1, cmdline_logl, "Sets the global log level from 1 (ALL) to 4 (ERRORS)"},
#if defined(CNATURAL_USE_ANSI_COLOR)
	{"-l", "--no-color", 0, cmdline_colr, "Disables colored output"},
#endif
	{NULL, NULL, 0, NULL, NULL}
};

cnatural_system_data_t systdt;

const char* configfile_name = "cnatural.conf";

struct
{
	int port;
	int ask_password;
	int ask_secret;
	int ask_random;
} preset_config_data =
{
	.port = -1,
	.ask_password = -1,
	.ask_secret = -1,
	.ask_random = -1
};

cnatural_system_data_t* get_global_system_data(void);

int main(int argc, char** argv)
{
	struct MHD_Daemon* daemon;
	FILE* configfile = NULL;
	int n = 0, i = 0;
	char* salt = NULL;

	setlocale(LC_ALL, "");

	cnatural_srandom((long int) time(NULL));

	errno = 0;

	cnatural_servercore_set_systdt(&get_global_system_data);

	n = cnatural_cmdline_parse(
		argc,
		argv,
		options,
		cmdline_help
	);

	if(n < 0)
	{
		/* n < 0 = error */
		cnatural_perror("Error reading the cmdline options");
		exit(EXIT_FAILURE);
	}

	if(n == 1)
	{
		/* n == 1 = help function called */
		exit(EXIT_SUCCESS);
	}

	printf("CNatural Server version " CNATURAL_SERVER_VERSION "\n");
	printf("Starting...\n");
	printf("Reading configuration file (%s)\n\n", configfile_name);

	configfile = fopen(configfile_name, "r");

	if(configfile == NULL)
	{
		cnatural_perror("Error opening the configuration file");
		exit(EXIT_FAILURE);
	}

	systdt.username = NULL;
	systdt.password = NULL;
	systdt.random = NULL;
	systdt.secret = NULL;
	systdt.use_live_password = false;
	systdt.use_live_secret = false;
	systdt.use_live_random = false;
	systdt.port = 0;

	/* Generate a salt, use it to fill the NULL data and crypt the password,
	** destroy the salt (and the unencrypted password) fast as possible */

	cnatural_log_warning("Danger zone: generating salt...");

	/* 3 bytes: 2 for the salt and the NULL byte: */
	salt = malloc(sizeof(char) * 3);

	if(salt == NULL)
	{
		cnatural_perror("allocating the salt");
		exit(EXIT_FAILURE);
	}

	/* Generate a random salt */
	generate_salt(salt);

	/* The following code is safe? */
	/* printf("Using salt %s\n", salt); */

	printf("\nParsing configuration file\n");

	if(cnatural_configfile_read_systdt_from_file(configfile, &systdt, salt) != 0)
	{
		cnatural_log_error("Error reading the configuration file");
		fclose(configfile);
		exit(EXIT_FAILURE);
	}

	if(fclose(configfile) != 0)
	{
		cnatural_perror("Error closing the configuration file");
		free(systdt.username);
		free(systdt.password);
		free(systdt.random);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	printf("Importing global preset data (settings in the command line options)...\n");

	if(preset_config_data.port > 0)
	{
		cnatural_log_info("Imported port");
		systdt.port = preset_config_data.port;
	}

	if(preset_config_data.ask_secret >= 0)
	{
		cnatural_log_info("Imported use secret");
		systdt.use_live_secret = preset_config_data.ask_secret;
	}

	if(preset_config_data.ask_password >= 0)
	{
		cnatural_log_info("Imported use password");
		systdt.use_live_password = preset_config_data.ask_password;
	}

	if(preset_config_data.ask_random >= 0)
	{
		cnatural_log_info("Imported use random");
		systdt.use_live_random = preset_config_data.ask_random;
	}

	printf("Scaning for NULL data...\n\n");

	if(systdt.username == NULL)
	{
		systdt.username = cnatural_strdup("cnatural");
		cnatural_log_warning(
			"Warning: The configuration file does not have a username field, "
			"setting to it's default: cnatural");
	}
	if(systdt.password == NULL)
	{
		systdt.password = cnatural_passwd_crypt(salt, "a123b456");
		cnatural_log_warning(
			"The configuration file does not have a password field, "
			"setting to it's default: a123b456");
	}
	if(systdt.random == NULL)
	{
		systdt.random = cnatural_strdup("not random");
		cnatural_log_warning(
			"The configuration file does not have a random field, setting "
			"to it's default: not random");
	}
	if(systdt.secret == NULL)
	{
		systdt.secret = cnatural_strdup("not secret");
		cnatural_log_warning(
			"The configuration file does not have a secret field, setting "
			"to it's default: not secret");
	}
	if(systdt.port == 0)
	{
		systdt.port = 8888;
		cnatural_log_warning(
			"The configuration file does not have a port field, setting "
			"to it's default: 8888");
	}

	if(systdt.use_live_password)
	{
		/*
		** TODO: Read the characters but without display them.
		*/
		cnatural_log_error(
			"Aborting: the useLivePassword field is not implemented for security reasons");

		free(systdt.username);
		free(systdt.password);
		free(systdt.random);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	/* Now we can destroy the salt */
	free(salt);
	cnatural_log_warning("Exiting danger zone: destroying the salt...");

	if(systdt.use_live_secret)
	{
		/*
		** TODO: Read the characters but without display them.
		*/
		cnatural_log_error(
			"Aborting: the useLiveSecret field is not implemented for security reasons");

		free(systdt.username);
		free(systdt.password);
		free(systdt.random);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	if(systdt.use_live_random)
	{
		printf("useLiveRandom is active:\n\n");
		printf("Requirements: max-size 255, set ASCII letters and numbers\n\n");
		printf("Please introduce a random string or \"-\" for a generated one\n");
		printf("> ");
		fflush(stdout);

		free(systdt.random);

#ifndef CNATURAL_USE_POSIX_STDIO
		systdt.random = malloc(sizeof(char) * 255);

		if(systdt.random == NULL)
		{
			cnatural_perror("Initializing memory for the random field");
			free(systdt.username);
			free(systdt.password);
			free(systdt.secret);
			exit(EXIT_FAILURE);
		}

		memset(systdt.random, '\0', 254);

		if(fgets(systdt.random, 254, stdin) == NULL)
		{
			cnatural_perror("Reading the random bytes");
			free(systdt.username);
			free(systdt.password);
			free(systdt.secret);
			exit(EXIT_FAILURE);
		}
#else
		errno = 0;
		n = scanf("%ms", &systdt.random);

		if((n != 1) || (errno != 0))
		{
			cnatural_perror("Reading the random bytes");
			free(systdt.username);
			free(systdt.password);
			free(systdt.secret);
			exit(EXIT_FAILURE);
		}

		/* FIXME: %ms always leaves one character on stdin,
		** because the server stops on the first character readed,
		** this prevents the server from start */

		/* Just ignore */
		fgetc(stdin);
#endif

		n = strlen(systdt.random);

		if((n == 1) && (strcmp("-", systdt.random) == 0))
		{
			/* Generate a random */
			generate_random_field();

			n = strlen(systdt.random);
		}

		if(n > 4)
		{
			printf("< ");
			fputc(systdt.random[0], stdout);
			fputc(systdt.random[1], stdout);

			for(i = 1; i < (n - 3); ++i)
				fputc('*', stdout);

			fputc(systdt.random[n - 2], stdout);
			fputc(systdt.random[n - 1], stdout);
			fputc('\n', stdout);
		}
		else
		{
			cnatural_log_warning("The random is too small (< 4)");
		}
	}
	else if(strcmp(systdt.random, "random") == 0)
	{
		/* Generate a random */
		fputc('\n', stdout);
		generate_random_field();
		fputc('\n', stdout);
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
		cnatural_perror("Error getting the HTTP daemon");
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

int cmdline_help(int argc, char** argv)
{
	printf(
		"CNatural server v" CNATURAL_SERVER_VERSION "\n"
		"\n"
		"This is the CNatural Server, use it to open a server in which the\n"
		"CNatural client can be accessed by using a web browser with javascript\n"
		"and CSS.\n"
		"\n"
		"You can get more information about the project at:\n"
		"\n"
		"- <https://github.com/alinarezrangel/cnatural>\n"
		"- <https://cnatural.sourceforge.io/>\n"
		"\n"
		"To configure the server, see the <cnatural.conf> file.\n"
		"\n"
		"Warning: this program can only be executed at the cnatural installation\n"
		"directory.\n"
		"\n"
		"The options available are:\n"
		"\n"
	);

	return 0;
}

int cmdline_pass(int argc, char** argv)
{
	printf("Warning: `password` and `useLivePassword` overrided by `--pass` option");

	preset_config_data.ask_password = true;

	return 0;
}

int cmdline_rand(int argc, char** argv)
{
	printf("Warning: `random` and `useLiveRandom` overrided by `--rand` option");

	preset_config_data.ask_random = true;

	return 0;
}

int cmdline_secr(int argc, char** argv)
{
	printf("Warning: `secret` and `useLiveSecret` overrided by `--secr` option");

	preset_config_data.ask_secret = true;

	return 0;
}

int cmdline_port(int argc, char** argv)
{
	cnatural_log_warning("Warning: `port` overrided by `--port` option");

	preset_config_data.port = strtol(argv[1], NULL, 10);

	return 0;
}

int cmdline_conf(int argc, char** argv)
{
	configfile_name = argv[1];

	return 0;
}

int cmdline_logl(int argc, char** argv)
{
	int level = CNATURAL_LOG_DEBUG;

	switch(strtol(argv[1], NULL, 10))
	{
		case 1:
			level = CNATURAL_LOG_DEBUG;
			break;
		case 2:
			level = CNATURAL_LOG_INFO;
			break;
		case 3:
			level = CNATURAL_LOG_WARNING;
			break;
		case 4:
			level = CNATURAL_LOG_ERROR;
			break;
	}

	cnatural_log_level(level);

	return 0;
}

#if defined(CNATURAL_USE_ANSI_COLOR)
int cmdline_colr(int argc, char** argv)
{
	cnatural_log_color(false);

	return 0;
}
#endif

void generate_random_field(void)
{
	/* Generate a random */
	free(systdt.random);

	printf("Generating random bytes\n");

	systdt.random = malloc(sizeof(char) * 255);

	if(systdt.random == NULL)
	{
		perror("Allocating the random string");
		free(systdt.username);
		free(systdt.password);
		free(systdt.secret);
		exit(EXIT_FAILURE);
	}

	cnatural_fill_random(systdt.random, 255, NULL);
}

void generate_salt(char* salt)
{
	char* salt_bp = NULL;
	uint_least64_t salt_rd = 0;

	/*
	** We cannot use fill_random because the size of the salt is lesser than
	** sizeof(uint_least64_t) (at least 64 bits is at least 8 bytes)
	*/

	/* This function is a danger zone! */

	/*
	** Notes: we cannot use cnatural_asciify to make the bytes ASCII characters
	** because the cnatural_passwd_crypt function uses `crypt` which requires
	** the salt to be in the range [a-zA-Z0-9./]
	*/

	salt_rd = cnatural_random();
	salt_bp = (char*) &salt_rd;

	if(*salt_bp < 0)
		*salt_bp = -(*salt_bp + 1);
	if(*salt_bp < 0x30)
		*salt_bp += 0x30;
	if(*salt_bp > 0x7B)
		*salt_bp -= 0x07;
	if((*salt_bp > 0x39) && (*salt_bp < 0x41))
		*salt_bp += 0x08;
	if((*salt_bp > 0x5A) && (*salt_bp < 0x61))
		*salt_bp += 0x07;

	salt[0] = *salt_bp;

	++salt_bp;

	if(*salt_bp < 0)
		*salt_bp = -(*salt_bp + 1);
	if(*salt_bp < 0x30)
		*salt_bp += 0x30;
	if(*salt_bp > 0x7B)
		*salt_bp -= 0x07;
	if((*salt_bp > 0x39) && (*salt_bp < 0x41))
		*salt_bp += 0x08;
	if((*salt_bp > 0x5A) && (*salt_bp < 0x61))
		*salt_bp += 0x07;

	salt[1] = *salt_bp;

	salt[2] = '\0';

	salt_bp = NULL;
}
