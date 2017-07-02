/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Command Line Arguments parsing APIs.
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

#include "cmdline.h"

/* Implementation headers: */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "utilfcn.h"

int cnatural_cmdline_parse(
	int argc,
	char** argv,
	cnatural_cmdline_argument_t* opts,
	cnatural_cmdline_argument_handler_t help_handler
)
{
	int i = 0, j = 0, w = 0, cc = 0, wc = 0, mx = 0, rt = 0, cln = 0;
	bool x = false;

	for(j = 0; ; ++j)
	{
		if((opts[j].short_option == NULL)
			&& (opts[j].long_option == NULL)
			&& (opts[j].nth_args == 0)
			&& (opts[j].handler == NULL)
			&& (opts[j].doc_option == NULL))
		{
			mx = j;
			break;
		}
	}

	for(i = 0; i < argc; ++i)
	{
		if((strcmp(argv[i], "-h") == 0)
			|| (strcmp(argv[i], "--help") == 0))
		{
			rt = (*help_handler)(0, argv + i);

			if(rt != 0)
			{
				fprintf(stderr,
					"Executing command error:\n");
				fprintf(stderr,
					"    Returned non-zero value\n");
				fprintf(stderr,
					"abort()\n");

				return -1;
			}

			for(j = 0; j < mx; ++j)
			{
				/* Column to start to write the docstring */
				cln = 35;

				cc = printf("    ");

				if(opts[j].short_option != NULL)
				{
					wc = printf("%s  ", opts[j].short_option);

					if(wc <= 0)
					{
						perror("Error writing the data");
						return -1;
					}

					cc += wc;
				}

				if(opts[j].long_option != NULL)
				{
					wc = printf("%s  ", opts[j].long_option);

					if(wc <= 0)
					{
						perror("Error writing the data");
						return -1;
					}

					cc += wc;
				}

				if(opts[j].nth_args > 0)
				{
					for(w = 0; w < opts[j].nth_args; ++w)
					{
						wc = printf("<arg%d> ", w);

						if(wc <= 0)
						{
							perror("Error writing the data");
							return -1;
						}

						cc += wc;
					}

					wc = printf("  ");

					if(wc <= 0)
					{
						perror("Error writing the data");
						return -1;
					}

					cc += wc;
				}

				if(opts[j].doc_option != NULL)
				{
					wc = printf("    ");

					if(wc <= 0)
					{
						perror("Error writing the data");
						return -1;
					}

					cc += wc;

					/* Print spaces until reaches column cln */

					while(cc < cln)
					{
						fputc(' ', stdout);
						++cc;
					}

					printf("%s", opts[j].doc_option);
				}

				printf("\n");
			}

			return 1;
		}

		for(j = 0; j < mx; j++)
		{
			if((opts[j].short_option != NULL)
				&& (strcmp(opts[j].short_option, argv[i]) == 0))
			{
				x = true;
			}

			if((opts[j].long_option != NULL)
				&& (strcmp(opts[j].long_option, argv[i]) == 0))
			{
				x = true;
			}

			if(!x)
				continue;

			if((i + opts[j].nth_args) >= argc)
			{
				/* Invalid argument list */

				fprintf(stderr,
					"Parsing command error:\n");
				fprintf(stderr,
					"    Argument requires %d arguments, but only %d are given\n",
					opts[j].nth_args,
					mx - j);
				fprintf(stderr,
					"abort()\n");

				return -1;
			}

			if(opts[j].handler == NULL)
			{
				i += opts[j].nth_args + 1;
				break;
			}

			rt = (*opts[j].handler)(opts[j].nth_args, argv + i);

			if(rt < 0)
			{
				fprintf(stderr,
					"Executing command error:\n");
				fprintf(stderr,
					"    Returned non-zero value\n");
				fprintf(stderr,
					"abort()\n");

				return -1;
			}

			if(rt == 1)
			{
				return 1;
			}

			i += opts[j].nth_args + 1;

			break;
		}
	}

	return 0;
}
