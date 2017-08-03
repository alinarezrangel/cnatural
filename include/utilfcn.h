/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * General purpose utility functions.
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

#if !defined(H_CNATURAL_UTILFCN_H_)
#define H_CNATURAL_UTILFCN_H_ 1

/**
* @file
* General purpose utility functions.
*/

#include <stddef.h>
#include <stdint.h>
#include <stdarg.h>

#include "inc.h"

CNATURAL_BEGIN_DECLRS

/**
* @addtogroup utilfcn Utility Functions
* @{
*/

/**
* @brief Uses the GNU extension for the crypt function.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_CRYPTO_GNU_CRYPT 1

/**
* @brief Uses the POSIX API for the crypt function.
*
* When programming with macros, you can use both the macro name or
* value, CNatural will not change the values of these macros.
*/
#define CNATURAL_CRYPTO_POSIX_CRYPT 0

/**
* @brief Defines the DEBUG log level.
*
* In the DEBUG log level all calls to cnatural_log_base() and similars are
* printed to stdout or stderr.
*/
#define CNATURAL_LOG_DEBUG 0

/**
* @brief Defines the INFO log level.
*
* In the INFO log level, only messages with informational purposes and
* warnings/errors will be printed to stdout or stderr.
*/
#define CNATURAL_LOG_INFO 3

/**
* @brief Defines the WARNING log level.
*
* In the WARNING log level, only warnings and errors are printed to stdout
* or stderr.
*/
#define CNATURAL_LOG_WARNING 6

/**
* @brief Defines the ERROR log level.
*
* In the ERROR log level only errors will be printed to stdout or stderr.
*/
#define CNATURAL_LOG_ERROR 9

/**
* @brief The random engine state.
*
* Implements a linear-congruential engine.
*/
typedef struct cnatural_utilfcn_rdstate
{
	int_least64_t sum;
	int_least64_t mul;
	int_least64_t mod;
	int_least64_t xsubi;
} cnatural_utilfcn_rdstate_t;


/**
* @brief Duplicates a string.
*
* Like strdup, but is portable.
*
* @param str String to duplicate (is not modified).
* @return A malloc-created copy of str.
*/
char* cnatural_strdup(const char* str);

/**
* @brief Seeds the random number engine.
*
* For help about the random number engine, see the cnatural_random() function.
*
* This function is not reentrant and is not thread-safe. The default seed
* is 1.
*
* @param seed The new seed.
* @return A copy of the new global state.
*/
cnatural_utilfcn_rdstate_t cnatural_srandom(int_least64_t seed);

/**
* @brief Gets a random number and updates the global random state.
*
* Really, it returns an uniform pseudo-random number picked from the
* global random state and updates it. The engine used is a linear-congruential
* engine.
*
* This function uses the global state and is not thread safe. For a reentrant
* aproach, see the cnatural_random_r() function.
*
* @return The next pseudo-random number generated.
*/
int_least64_t cnatural_random(void);

/**
* @brief Gets a random number and updates a local random state.
*
* Like cnatural_random(), but reentrant.
*
* @param state The random state.
* @return The next pseudo-random number generated.
*/
int_least64_t cnatural_random_r(cnatural_utilfcn_rdstate_t* state);

/**
* @brief ASCIIifies a byte.
*
* The input byte can contain any valid value, but the returned byte always
* is a valid graphical ASCII character.
*
* @param chr The character to ASCIIify
* @return The ACIIfied character.
*/
char cnatural_asciify(char chr);

/**
* @brief Gets a random ASCII string.
*
* To get random bytes, it uses cnatural_random() if state is NULL or
* cnatural_random_r() otherwise.
*
* str always is NULL-terminated after calling this function.
*
* @note
*  The size of the string should be at least `sizeof(uint_least64_t)`
*  or nothing will be written. Also, the string will be written in sections
*  of `sizeof(uint_least64_t)` bytes each, so the string will not be fully
*  used unless it size is a multiplo of `sizeof(uint_least64_t)`.
* @note
*  This may be a problem with strings with size less than
*  `sizeof(uint_least64_t)`, in which nothing will be written but they will
*  be cleaned (filled with zeros).
*
* @param str The string to fill.
* @param len The length of the string, in bytes including the terminating
* NULL-byte.
* @param state The random state or NULL.
*/
void cnatural_fill_random(
	char* str,
	size_t len,
	cnatural_utilfcn_rdstate_t* state
);

/**
* @brief Encrypts a password using the specified salt.
*
* This uses the crypt(3) function if possible, if no encryption method
* was selected by using the macro CNATURAL_PASSWD_CRYPT_MTH, a copy of
* password is returned (this is a security risk).
*
* @param salt The salt to use.
* @param pass The password.
* @return NULL on error, a malloc-created string on success.
*/
char* cnatural_passwd_crypt(const char* salt, const char* pass);

/**
* @brief Verifies a encrypted password.
*
* The password should be encrypted with cnatural_passwd_crypt().
*
* @param epass The encrypted password.
* @param vpass The password to verify.
* @return -1 if error, 0 if the passwords not match or 1 if their match.
*/
int cnatural_passwd_verify(const char* epass, const char* vpass);

/**
* @brief Sets or gets the global log level.
*
* If `level` is a valid log level (a positive number between
* CNATURAL_LOG_DEBUG and CNATURAL both inclusive) then the global log level
* will be set to `level` and `level` will be returned.
*
* If `level` is not a valid level (a negative number) then the global log
* level will be returned.
*
* @param level The new global log level or `-1`.
* @return The global log level.
*/
int cnatural_log_level(int level);

/**
* @brief Sets if the log functions should use ANSI colors.
*
* If CNatural was compiled with the CNATURAL_USE_ANSI_COLOR macro, then
* this function enables the colored output if `use_color` is `true`, and
* disables it if is `false`. If CNatural was not compiled with the
* `CNATURAL_USE_ANSI_COLOR` macro, then does nothing and always returns
* `false`.
*
* @note
*   If CNatural was compiled without the `CNATURAL_USE_ANSI_COLOR` macro,
*   the log output will never been colored.
*
* @param use_color If a colored output should be used.
* @return `true` if the colored output is currently activated, `false`
* otherwise.
*/
bool cnatural_log_color(bool use_color);

/**
* @brief Base log function.
*
* If you want to log something, please don't use this function, it is designed
* **only** to be used by the others `cnatural_log_*` functions.
*
* It prints a string showing the level of the warning (like `"ERROR"` or
* `"DEBUG"`), prints the current date and time, prints the first message
* and prints the second messages all on the same line. If
* CNATURAL_USE_ANSI_COLOR is defined, it will wrap the printf() calls with an
* ANSI escape code that will change the **text** color according to the log
* level.
*
* This function will skip messages with log levels lesser than the global log
* level, so if the current global log level is CNATURAL_LOG_WARNING an you try
* to print a message with log level of CNATURAL_LOG_DEBUG, it will not be
* showed.
*
* The formatting strings and arguments will be passed to internal printf() and
* vprintf() calls.
*
* While checking the return value to be greater than 0 can be useful to detect
* IO errors, if `level` is lesser than the global log level this will always
* return 0, so don't worry about IO errors and just ignore the return value.
*
* @param level Level of the output log.
* @param fmt The formatting string of the first log message (like printf()).
* @param args The arguments for the first formatting string.
* @param fmt2 The formatting string for the second log message (like printf()).
* @param ... The arguments for the second formatting string.
* @return The number of characters written.
*/
int cnatural_log_base(
	int level,
	const char* fmt,
	va_list args,
	const char* fmt2,
	...
);

/**
* @brief Logs a message as DEBUG.
*
* This function should be used only to log data that is not important, that is,
* the DEBUG log messages are only show on "very verbose" modes.
*
* It's usage is exactly like the printf() family of functions, but this uses
* cnatural_log_base() to output the message and adds a trailing newline.
*
* @param fmt The formatting string (passed to an internal printf())
* @param ... The arguments for the printf() call.
* @return The number of characters written.
*/
int cnatural_log_debug(const char* fmt, ...);

/**
* @brief Logs a message as INFO.
*
* This function should be used only to log data that is important but not
* critical, that is, the INFO log messages are only show on "verbose"
* modes.
*
* It's usage is exactly like the printf() family of functions, but this uses
* cnatural_log_base() to output the message and adds a trailing newline.
*
* @param fmt The formatting string (passed to an internal printf())
* @param ... The arguments for the printf() call.
* @return The number of characters written.
*/
int cnatural_log_info(const char* fmt, ...);

/**
* @brief Logs a message as WARNING.
*
* This function should be used only to log warnings, their will be show unless
* the global log level is ERROR.
*
* It's usage is exactly like the printf() family of functions, but this uses
* cnatural_log_base() to output the message and adds a trailing newline.
*
* @param fmt The formatting string (passed to an internal printf())
* @param ... The arguments for the printf() call.
* @return The number of characters written.
*/
int cnatural_log_warning(const char* fmt, ...);

/**
* @brief Logs a message as ERROR.
*
* This function should be used to print errors, these messages are **always**
* show.
*
* It's usage is exactly like the printf() family of functions, but this uses
* cnatural_log_base() to output the message and adds a trailing newline.
*
* @param fmt The formatting string (passed to an internal printf())
* @param ... The arguments for the printf() call.
* @return The number of characters written.
*/
int cnatural_log_error(const char* fmt, ...);

/**
* @brief Prints an errno message.
*
* Like cnatural_log_error, but this prints an errno message like the function
* perror().
*
* @param fmt The formatting string (passed to an internal printf())
* @param ... The arguments for the printf() call.
* @return The number of characters written.
*/
int cnatural_perror(const char* fmt, ...);

/**
* @}
*/

CNATURAL_END_DECLRS

#endif /* ~H_CNATURAL_UTILFCN_H_ */
