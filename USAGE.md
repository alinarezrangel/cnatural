# Using the server #

## Configuration files ##

If one argument it's passed to the server, it is the path to the configuration
file to be used. This file have a general structure like:

	username="cnatural"
	password="a123b456"
	secret="This secret should be changed to something more... secret!"
	random="This should be different from the secret and very random"
	port="8888"

If not argument is supplied, the server searchs in the current directory.

## Starting ##

Only execute the file `cnatural.out` (it is not in the dot out format).
