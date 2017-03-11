# Natural Import Spec #

The Import Spec is a specification about a directory structure that enables
the support for JavaScript libraries.

```javascript
// In your application:

window.NaturalClient.LibraryImport(
	"libhello",
	(err) =>
	{
		if(err)
		{
			throw new Error("Error importing libhello");
		}

		// libhello is ready to use:
		var libhello = window.NaturalClient.LibraryGet("libhello");

		libhello.HelloWorld();
	}
);
```

## Directory structure ##

In the `private_http/jscore/libs/` folder should exists another folder with
the name of the library (for example: `private_http/jscore/libs/libhello`)
and inside it, the structure should be like:

```directory_structure
libname/
	natural.json (for NodeNatural-like projects)
	cnatural.json (for CNatural-specific projects)
	libname.js

	...
```

## natural.json ##

The `natural.json` file should be on the root directory of the library, it's
optional and if not exists or it's invalid, the library system will search
for `cnatural.json`. Having a `natural.json` file makes your library works
on NodeNatural and CNatural.

The file is a simple JSON file with the fields:

```json
{
	"name": [lib name],
	"type": "module",
	"preventDuplicate": true
}
```

### `name` field ###

It's a string containing the library name. A file with the extension `.js`
will be searched: for example, if your library it's named `hellolib`, then
your `name` field should have the string `"hellolib"` and a file named
`hellolib.js` shoudl exists on the same directory that the `natural.json`.

### `type` field ###

It's one of the strings:

* `"module"` (NodeNatural and CNatural): the library it's modular, so
the Natural Server used (CNatural or NodeNatural) can load it without worring
about other files.
* `"application"` (CNatural): The file contains an application (**obsolete**).

### `preventDuplicate` field ###

`true` if the library system should prevent this library from being imported
more than one times. `false` if it can be included each time that it's
imported. The library system may ignore this field and assign it the value
`true` always.

## cnatural.json ##

A `cnatural.json` file it's like a `natural.json`, but it's CNatural specific
and **not works** on NodeNatural.

The basic template is:

```json
{
	"name": "libhello",
	"license": "MIT License",
	"version": "1.2.3",
	"cnatural": {
		"version": "~0.0.1"
	}
}
```

More of the fields explains itself very good, but the `cnatural.version` field
needs more explication:

This field contains a string that can be:

* `A.B.C`: only works on CNatural `A.B.C`
* `~A.B.C`: works on any version compatible with `A.B.C`

## Recommendations to your library ##

```javascript
(function(window)
{
	window.Hello = window.Hello || function()
	{
		window.alert("hello");
	};
}(window));
```

It's recommended for libraries to wrap and proxy your code inside a function,
this can be used later in special cases.

It's **not** recommended to pollute the global namespace with variables used
internally in your library, a code like this is bad for a library:

```javascript
MY_CODE = "hello"; // <= pollution

Hello = Hello || function() // <= Non-proxing
{
	alert(MY_CODE);
};
```

*Why?*, simple, this code will be included on the CNatural client, these
global variables will be in the same namespace that the applications,
functions and others.


