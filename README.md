# CNatural #

CNatural (or Natural for short) it's a remote embed systems control using
standard web technologies like LocalStorage, HTML5, CSS3 and JavaScript.

CNatural provides a simple way for monitoring, manage and use a embed
system or remote server via web, with a simple and useful interface.

## Features ##

* Not overloads the server (see below)
* Applications in JavaScript
* Secure and user-sandboxed sessions
* Material-like based interface (we call it *Natural Design*)
* Interface maded upon usability and simplicity
* Light server (less than 10Mb)
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

If you need the docs, use:

	make docs

For install use the:

	make install

command.

Note that you can install a minimal version of the server, better for system
with limited storage using:

	make minimal

Running the server is easy:

	./cnatural.out

All configuration data will be readed from `cnatural.conf`

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
```

Note that the documentation generation is in development.

## Authors ##

* Alejandro Linarez Rangel @alinarezrangel (GitHub)

**Add your name here after doing a contribution**

## License ##

CNatural it's licensed under the Apache license version 2.0

Other resources used by CNatural may have other licenses:

* `public_http/resources/backgrounds/`:
[node-natural-background-images][naturalbkg] it's licensed under the
CC-BY-SA 4.0 (please see the LICENSE for that project)


[naturalbkg]: https://github.com/alinarezrangel/node-natural-background-images
