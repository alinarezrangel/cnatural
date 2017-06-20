# CNatural Server C API #

CNatural have two interfaces: one in the server and one in the client.
This is the documentation **for the server API** and all programs here
are executed on the **server**.

## Using the APIs on your app/changes ##

Remember to explicitly include all your dependencies before use
your code! CNatural's Server side API will not import automaticly
anything as the client side API will.

## Using the APIs **inside** an API ##

See the header and source files to get an idea about the import
order.

## Viewing this documentation ##

You should `make docsc` in the root directory of the project
for construct all HTML, JS, CSS and other files in the `out/html/`
directory. After doing `make docsc` open the `docs/c/out/html/index.html`
file in your favorite web browser.

