# C Random utilities #

This document describes shortly how to get random numbers in CNatural.

## Why no use `rand` ##

The C standard header `<stdlib.h>` provides two functions that may be very
useful for almost any program: the functions `rand` and `srand` are very good
in some computers, why CNatural not just use these standard functions instead
of using it's own API? the randomness of these functions changes with the
system, some systems (like most GNU/Linux distros, see note 1) have a very
good randomness for `rand`, some others not. The standard does not specify a
minimal implementation, distribution or other requirements so is unsafe to use
`rand` for cryptography and others. CNatural implements it's own pseudo-random
number generator by the (very similar) `cnatural_random`, `cnatural_srandom`
and `cnatural_random_r`.

## The CNatural random API ##

```c
/* When from inside CNatural: */
#include "utilfcn.h"

/* When from outside CNatural (like writing drivers and others) */
#include <cnatural/utilfcn.h>

cnatural_utilfcn_rdstate_t cnatural_srandom(uint_least64_t seed);

uint_least64_t cnatural_random(void);
uint_least64_t cnatural_random_r(cnatural_utilfcn_rdstate_t* state);
```

### About the engine ###

CNatural uses a linear-congruential engine with two modes: in the *safe* mode
the user specifies all LCE parameters at compilation, in the *unsafe* mode,
is almost equal to the `drand48` engine (also works with 48-bits arithmetic).

Activate the safe mode by using the `CNATURAL_RDC_SAFE_MODE` macro.

### Setting the seed ###

Generally you will not need to set the seed of the engine, CNatural gives it
a sensible value at the start. This is a replacement for `srand`.

### Getting a pseudo-random value ###

Use `cnatural_random` as a replacement for `rand`, is not thread-safe, for a
reentrant version see `cnatural_random_r`.

### Getting a pseudo-random value but reentrant ###

The `cnatural_random_r` is a replacement for the obsolete POSIX `rand_r`. Note
that this function cannot be used alone: because the
`cnatural_utilfcn_rdstate_t` struct **should be used as an opaque type**, the
only way to use this function is by using the thread-unsafe function
`cnatural_srandom`:

```c
/* Please do not use time(NULL) to get a seed */
cnatural_utilfcn_rdstate_t my_state = cnatural_srandom(
	(uint_least64_t) time(NULL)
);

...

uint_least64_t rd = cnatural_random_r(&my_state);

...
```

## Macros used ##

See the [macros][macros] file to get a list of macros used by the LCE.

## Notes and links ##

1. Extracted from the `rand` man page:

> The versions of rand() and srand() in the Linux C Library use the same
> random number generator as random(3) and srandom(3), so the lower-order bits
> should be as random as the higher-order bits.  However, on older rand()
> implementations, and on current implementations on different systems, the
> lower-order bits are much less random than the higher-order bits.  Do not
> use this function in applications intended to be portable when good
> randomness is needed.  (Use random(3) instead.)

[macros]: macros.md

