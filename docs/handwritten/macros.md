# C Macros index #

At the source code level, CNatural uses macros to determine the features of
the host environment. These macros are described here. Note that some macros
and it's values have special requirements of other macros defined at system
level.

## `CNATURAL_DEBUG` - Debug control ##

If this macro is defined, CNatural will enable assertions and will optimize
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

## `_CNATURAL_*_H_` - Header macros ##

You should **never** define any macro which name begins with `_CNATURAL_`
and ends with `_H_` because these macros are used in header guards.

## Links and notes ##

*There are no notes for now*

[drand48]: man://drand48
[rand]: man://rand
[scanf]: man://scanf
[dprinf]: man://dprintf
