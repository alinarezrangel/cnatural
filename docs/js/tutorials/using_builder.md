# Using the GUI Builder #

When developing Graphical User Interfaces (GUIs) there is always one common
problem: how to maintain our code readable while keeping flexibility of
change anything just changing some lines of code?

A builder is a class that reads a file (generally XML or similar) and
generates a GUI that only needs to bind events and other easy things.

In the popular framework GTK+, you will find the `GtkBuilder` or, in
Gtkmm the `Gtk::Builder` classes. CNatural also provides that flexible API
with a similar name and function: the `NaturalWidgets.Builder` class.

This class receives a XML string, parses it and builds a GUI from this
string.

For example:

```xml
<window>
	<style>
		<titlebar-color>null</titlebar-color>
		<body-color>null</body-color>
		<border-color>null</border-color>
	</style>
	<menu>
	</menu>
	<body>
		<main-container no-padding="false">
			<container>
				<header level="1" size="section.title">Hello world!</header>
			</container>
		</main-container>
	</body>
</window>
```

Will create a default-styled window with: `MainContainer > Container > Header`,
the generated window will have a big text showing "`Hello World`".

## First: instanciate the builder ##

First we need to instanciate the builder. Unlike other resource-management
classes, the builder does not have an store so you can just use:

```javascript
let builder = new window.NaturalWidgets.Builder();
```

The builder only parses valid XML, not HTML or others. So try to avoid common
XML errors like:

* `<void-tag>` instead of `<void-tag />`
* `<a><b>c</a>` instead of `<a><b>c</b></a>`
* `<a>b<a>` instead of `<a>b</a>`
* `<a attr=value>` instead of `<a attr="value" />` or `<a attr="value">`

And others.

## Second: parse the XML ##

After instanciating the builder we need to parse the XML in order to build
the GUI, parsing the XML string is almost too easy like instanciating the
builder:

```javascript
let xmldoc = builder.parseXMLFromText(xml_string);
```

Generally you not want your code to be mixed with the frontend, so is more
easy to write your XML GUI to a file in your application's resources
directory and read that file when needed. Is recommended to use cache when
reading the GUI from a file.

## Third: adding the GUI to a window ##

If you already have a window, using the builder is easy:

```javascript
// Suppose that a window object is called "win"
builder.buildWindowFromDocument(xmldoc, win, LangMap);
```

Here, `LangMap` denotes the localized POMap, see the *Application Boilerplate*
tutorial to see how to create a LangMap from a POMap.

The `buildWindowFromDocument` method may throw exceptions in case of a
malformed XML or other things. All exceptions throwed by this method
are hard to debug, but their are **always** problems with the XML,
the window or the LangMap.

If you dont have a window, you will need one:

```javascript
// Inside your application's run method
let win = this.getWindowSystem().createDefaultWindow(...);
```

## Making a dynamic GUI ##

The steps before are good for static GUIs, but a good GUI is not static,
is dynamic: contantly creating and destroying elements and interacting
with the user. So, for example, you may want to add a button to your GUI,
how we can detect when the button is pressed? easy. Some attributes on
the XML are not passed to the created widget, the attributes `id` and
`class` are reserved for different purposes: the `class` attribute actuates
like the `class` attribute on normal HTML elements. The `id` attribute
makes this widget accesible from the JavaScript code:

```xml
<!-- Your GUI file -->
...
<button id="hello_btn" type="normal-button">Hello!</button>
...
```

```javascript
// Your application file
...

let hello_btn = builder.getWidgetByID("hello_btn");

// hello_btn is an object of class NaturalWidgets.Button

hello_btn.getElement().on("click", () =>
{
	...
});

...
```

Like this, by using the `getWidgetByID` method you can get all items that
have an `id` attribute.

## How the widgets are build ##

All attributes of the XML Node are converted to a `map.<string, any>` and
passed to the widget in it `args` argument: a `<example a="1" b="2" c="3" />`
tag will be converted to
`NaturalWidgets.Create(NaturalWidgets.Example, {a: 1, b: 2, c: 3})`.

If an attribute starts with `${` and ends with `}` it contents will be used as
a key to the LangMap: `<text text="${hello}" />` will be converted to
`NaturalWidgets.Create(NaturalWidgets.Text, {text: LangMap["hello"]})`.

The attributes of the form `\d+` and `(\d|\.)+` will be converted to integers
or floats in base 10 (always base 10 is used).

Other attributes are converted to strings, like `size="content.subtitle"`.

If you need to use the `${` and `}` just use `\${` and `}` instead:
`code="${hello}` will localizate the message `hello` and pass it from
the LangMap to the widget, but `code="\${hello}"` will pass an argument `code`
with the value `"${hello}`. You can escape `\` with `\\`.

The widgets specified on the tag names are always searched on the
`NaturalWidgets` namespace.

If the tag does **not** contains a `text` attribute **and** have text child,
the text child will be passed as the `text` attribute: `<text>Hello</text>`
is the same than `<text text="Hello" />` that is the same that
`NaturalWidgets.Create(NaturalWidgets.Text, {text: "Hello"})`.

## Notes ##

You should **never** call more than one times the `buildWindowFromDocument`
method on the same builder. This will throw an exception.

