# CNatural Server CLI #

The CNatural server provides a number of CLI options to manage some useful
details or defaults:

## General syntax ##

Most options have two forms: a one-letter flag and a long option form.

The options are separated by spaces, and their arguments too:
`-p 8888`, `--seed 324242` and `-c myconf` are all valid examples.

## Overriding the configuration file ##

Most options are simply flags to override the `cnatural.conf` settings, like
`--pass` and others.

* `-a` or `--pass`: Overrides `useLivePassword`.
* `-r` or `--rand`: Overrides `useLiveRandom`.
* `-s` or `--secr`: Overrides `useLiveSecret`.
* `-p` or `--port`: Overrides `port`.

For more help about the configuration files, see the [USAGE](../../USAGE.md)
file.

The special option `-c`/`--conf` sets the configuration file, with this
option you can read the configuration from files other than `cnatural.conf`.

## Examples ##

```sh
# Start over port 9500 ignoring the `port` configuration field
./bin/cnatural.out -p 9500
# Alias:
./bin/cnatural.out --port 9500

# Always prompt for password
./bin/cnatural.out -a
# Alias:
./bin/cnatural.out --pass

# Show Help
./bin/cnatural.out -h
```
