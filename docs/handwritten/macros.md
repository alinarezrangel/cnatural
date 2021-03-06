# C Macros index #

At the source code level, CNatural uses macros to determine the features of
the host environment. These macros are described here. Note that some macros
and it's values have special requirements of other macros defined at system
level.

## `CNATURAL_DEBUG` - Debug control ##

If this macro is defined, CNatural will enable assertions and will (de)optimize
for debug.

### Requirements ###

* `NDEBUG` is not defined.

### Default ###

It default value in the `Makefile` is *defined* (the macro is defined).

## `CNATURAL_RDC_SAFE_MODE` - Safe initialization of random state ##

If this macro is defined, the initial configuration given to the random number
generation engine will be safely choosed using the implementation-dependend
macros `CNATURAL_RDC_ARG_*`. If is not defined, the following parameters will
be using in the builtin linear congruential engine:

	Xn = a * Xi + b      (mod c)

* `a = 0x5DEECE66D` (the same value than in [drand48][drand48])
* `Xi = seed`
* `b = 0xB` (the same value than in [drand48][drand48])
* `c = 281474976710656` (48-bit arithmetic)

With the default parameters, the builtin random generation engine is equal
to the [drand48][drand48] family of functions, but if this macro is defined,
the parameters will be:

* `a = CNATURAL_RDC_ARG1 + 1`
* `Xi = seed`
* `b = CNATURAL_RDC_ARG2 + seed / 2`
* `c = max(CNATURAL_RDC_ARG3, 281474976710656)`

So, if this macro is defined, the macros `CNATURAL_RDC_ARG1`,
`CNATURAL_RDC_ARG2` and `CNATURAL_RDC_ARG3` should be defined or an error
will be raised.

### Requirements ###

* `CNATURAL_RDC_ARG1`, `CNATURAL_RDC_ARG2` and `CNATURAL_RDC_ARG3` are
defined with unsigned integer values in the range of a 64-bit
`uint64_t` or `uint_least64_t` types.

### Default ###

The default value in the `Makefile` is *undef* (this macro is undefined).

## `CNATURAL_USE_POSIX_STDIO` - POSIX-style `stdio.h` functions ##

If this macro is defined, the `<stdio.h>` family of functions are assumed to
be POSIX-compatible. The following differences are assumed:

* [scanf][scanf] supports the modifier `%ms` and `%m[RANGE]` for dynamical
allocation of readed strings.
* [dprintf][dprintf] is assumed to exists.

### Default ###

It default value in the `Makefile` is *defined* (the macro is defined).

## `CNATURAL_TOKEN_NO_IGNORE_ZERO` - No ignore zero timestamps ##

If this macro is defined, when comparing and deserializing natural tokens,
a timestamp 0 is considered an error. When the system calendar time is
wrong (like systems without a clock) the function call `time(NULL)` may
return zero always, which will raise an error at each token validation.

### Default ###

It default value in the `Makefile` is *undef* (the macro is not defined).

## `CNATURAL_NOT_USE_RESTRICT_KEYWORD` - Not use the C `restrict` keyword ##

If this macro is defined, the macro `CNATURAL_RESTRICT` will expand to
nothing. Otherwise, the macro `CNATURAL_RESTRICT` will expand to the C's
`restrict` keyword. Defining this macro should not change the observable
behavior of CNatural (as declared on the C99 spec, see the note 1).

If your compiler does not support the `restrict` keyword, you should define
this macro. Otherwise, undefining it will only probably decrease the
optimization level of the output (see below).

Remember that the `restrict` keyword is defined only for optimization
purposes, so you should not worry about is defining or not this macro.

### Requirements ###

* A C compiler that supports the `restrict` keyword (C99+).

### Default ###

It default value in the `Makefile` is *undef* (the macro is not defined).

## `CNATURAL_PASSWD_CRYPT_MTH` - Password crypt method ##

If this macro is defined with a valid value, the password encrypton method
can be selected by using other macros (not defined yet).

### Values ###

* `0` or `CNATURAL_CRYPTO_GNU_CRYPT`: The header `<crypt.h>` should be
included in order to use the `crypt` function.
* `1` or `CNATURAL_CRYPTO_POSIX_CRYPT`: The header `<crypt.h>` is not
required to use the `crypt` function if the header `<unistd.h>` is included.

### Default ###

It default value in the `Makefile` is `1` (`CNATURAL_CRYPTO_GNU_CRYPT`).

## `CNATURAL_DEFAULT_LOG_LEVEL` - The default log level ##

If this macro is defined, it's value will be used to set the default log level
of CNatural. The log levels are:

* `0` or `CNATURAL_LOG_DEBUG`: Logs all (very verbose).
* `3` or `CNATURAL_LOG_INFO`: Logs informational messages (verbose).
* `6` or `CNATURAL_LOG_WARNING`: Logs warnings and errors.
* `9` or `CNATURAL_LOG_ERROR`: Logs only errors.

Note that all log levels logs messages with the same level **or more**, so
a log level of `0` (DEBUG) will show **all** messaged but a log level of
`6` (WARNING) will show both warnings **and** errors because the error's
log level is 9.

If the macro `CNATURAL_DEBUG` is defined, this macro is ignored and the log
level is always set to `0` (DEBUG).

### Values ###

* `0` or `CNATURAL_LOG_DEBUG`: Logs all (very verbose).
* `3` or `CNATURAL_LOG_INFO`: Logs informational messages (verbose).
* `6` or `CNATURAL_LOG_WARNING`: Logs warnings and errors.
* `9` or `CNATURAL_LOG_ERROR`: Logs only errors.

### Default ###

The default value in the `Makefile` is `0` (DEBUG).

## `CNATURAL_USE_ANSI_COLOR` - Enables colored output ##

If this macro is defined, the log messages will be printed in full color using
[ANSI color codes][ansi-color].

### Default ###

The default value in the `Makefile` is *defined* (the macro is defined).

## `H_CNATURAL_*_H_` - Header macros ##

You should **never** define any macro which name begins with `H_CNATURAL_`
and ends with `_H_` because these macros are used in header guards.

## Links and notes ##

1. C99 standard (ISO/IEC 9899:1999): 6.7.3.1 Formal definition of restrict
(p: 110-112)

[drand48]: man://drand48
[rand]: man://rand
[scanf]: man://scanf
[dprintf]: man://dprintf
[ansi-color]: https://en.wikipedia.org/wiki/ANSI_escape_code
