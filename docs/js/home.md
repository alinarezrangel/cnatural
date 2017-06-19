# CNatural Client JavaScript API #

CNatural have two interfaces: one in the server and one in the client.
This is the documentation **for the client API** and all programs here
are executed on the **client**.

## Using the APIs on your app ##

When an application is imported, all APIs are included **before** that,
so you can use all these APIs in your application without adding some
more code.

## Using the APIs **inside** an API ##

If you are developing new features or bug fixes for any API, not all
APIs may be defined at that point of code. The order of import is:

1. `natsec.js`
2. `animation.js`
3. `widgets.js`
4. `cdata.js`
5. `storage.js`
6. `builder.js`
7. `nclient.js`
8. `main.js`

Depending of your shell, the order of the Shell's Base APIs may be
different, but in Native the order is:

1. `base/context.js`
2. `base/window_style.js`
3. `base/window.js`
4. `base/window_manager.js`
5. `base/window_system.js`
6. `base/application.js`
7. `native/natural_window_style.js`
8. `native/natural_window.js`
9. `native/fixed_window_manager.js`
10. `native/natural_window_system.js`

This is the reccomended order for all shells.

## Viewing this documentation ##

You should `make docsjs` in the root directory of the project
for construct all HTML, JS, CSS and other files in the `out/`
directory. After doing `make docsjs` open the `docs/js/out/index.html`
file in your favorite web browser.
