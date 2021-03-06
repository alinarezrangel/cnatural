# CNatural #

CNatural (or Natural for short) it's a remote embed systems control using
standard web technologies like LocalStorage, HTML5, CSS3 and JavaScript.

CNatural provides a simple way for monitoring, manage and use a embed
system or remote server via web, with a simple and useful interface.

## Dependencies ##

* Standard library for C99 (or C version used).
* [GNU libmicrohttpd](https://www.gnu.org/software/libmicrohttpd/) (`-lmicrohttpd`).
* POSIX APIs (like `unistd.h` and others, `-lutil -lcrypt`).
* [libjwt for C](https://github.com/benmcollins/libjwt) (`-ljwt`).

Note that libjwt requires:

* [jansson](https://github.com/akheron/jansson).
* OpenSSL

And it's recommended to have:

* [libgcrypt](https://www.gnupg.org/documentation/manuals/gcrypt/)
* [libgnutls](http://www.gnutls.org/)

For use SSL/TLS on the server.

If you want to generate a documentation, you will need too:

* [JsDoc 3](http://usejsdoc.org) (lastest is better).
* [DocStrap Theme](http://docstrap.github.io/docstrap/) (optional, but if not,
you should change the Makefile's theme used).
* [Doxygen](http://www.stack.nl/~dimitri/doxygen/).
* Any Doxygen theme that you want.

If you do not want to install DocStrap Theme, you will need to edit the
Makefile: see `NPM_PREFIX`, `JSDOC_TEMPLATE` and `JSDOC_TEMPLATE_ARG`.

## Features ##

* Not overloads the server (see below)
* Applications in JavaScript
* Secure and user-sandboxed sessions
* Material-like based interface
* Interface maded upon usability and simplicity
* Light server (~24Mb versus the **80Mb** of NodeNatural)
* Powerful JavaScript and C API

## Server overload ##

CNatural does **not** overloads the server, this is good in embed systems
like the original target of the project: the Intel Galileo Gen 1 board.

This board was very slow using common remote desktop systems, creating a
"server overload" reducing the board usability. This is because these
common remote desktop systems only *shares* the desktop: the rendering
and all user-interaction is realized on the server!

CNatural really is a text server, it does **not** renders the desktop
in the server, enabling the server to not have a desktop environment,
a graphical server, a window manager, etc. All rendering is maked in
the client's browser. This have a big advantage: the server may have
an arbitrary number of clients without rendering *each user*, and,
without slowing the board.

## How it works ##

The server is a HTTP server that only manages the common page requests
and AJAX text-based requests. The client renders in the browser all required
front-end.

The server uses JWT (JSON Web Tokens / Signature) for authentication.

## Security ##

The server uses a fake username and password that are not the server's
username and passwords. The client should enter the username and password
for enter to the system. Because the server it's sandboxed, any security
violation will affect **only** to the user that started the server.

## Building and running ##

For build, use the Make tool:

	make

Install CNatural using:

	make install

Running the server is easy:

	./bin/cnatural

But running the CNatural binary outside the installation directory will not
work, so avoid using it like:

	cd ./bin/
	./cnatural

All configuration data will be readed from `cnatural.conf` (see
`./bin/cnatural --help` or [USAGE](USAGE.md) for more help).

## Documentation ##

For generate the C documentation CNatural uses Doxygen and for the JavaScript
documentation uses JsDoc 3. All docs will be placed on the `docs/` subfolder,
it's structure will be like:

```
docs/
	js/
		(all JS docs)
	c/
		(all C docs)
	handwritten/
		(all non-generated docs)
	usage/
		(all help for non-programmers)
```

## Size ##

CNatural it's in development, so it size may vary. The most sized component
is the documentation (for now is ~43% of the project size).

## Authors ##

* Alejandro Linarez Rangel @alinarezrangel (GitHub)

*Add your name here after doing a contribution*

## License ##

CNatural it's licensed under the Apache license version 2.0

Other resources used by CNatural may have other licenses:

* `public_http/resources/backgrounds/`:
[node-natural-background-images][naturalbkg] it's licensed under the
CC-BY-SA 4.0 (please see the LICENSE for that project)
* `public_http/generation/`:
[generation][genrepo]


[naturalbkg]: https://github.com/alinarezrangel/node-natural-background-images
[genrepo]: https://github.com/alinarezrangel/generation/releases/tag/v1.1.0
