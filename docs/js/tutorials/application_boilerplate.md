# Application boilerplate #

After reading lots and lots of documentations you don't understand very good
how to create an application, this tutorial will help you.

## First, the basic boilerplate ##

```javascript
window.NaturalShell.CurrentShell.RegisterApplication(function(window, document)
{
	var POMap = {
		"es": {
			"all": {
				"title": "Mi aplicacion"
			}
		},
		"en": {
			"all": {
				"title": "My application"
			}
		}
	};

	function MyApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		// Metadata here
		this.setName(""); // FILL HERE #1
		this.setID(""); // FILL HERE #2
		this.setNamespace(""); // FILL HERE #3

		this.setMetadataIcon("/resources/images/icons/my-application/icon.svg");
		this.setMetadataCategory(""); // FILL HERE #4
		this.setMetadataGenericName(""); // FILL HERE #5
		this.setMetadataComment(""); // FILL HERE #6
		this.setMetadataGraphical(true);
		this.setMetadataShowInShell(true);
	}

	MyApplication.prototype =
		Object.create(window.NaturalShell.Base.Application.prototype);

	MyApplication.prototype.run = function(args)
	{
		var appdata = this.createInstance();

		var LangMap = window.$natural.selectPOMapIn(POMap,
			window.NaturalShell.Native.GetShortNameArgument(args, "-l") ||
			window.NaturalShell.Native.GetLongNameArgument(args, "--lang") ||
			window.$natural.Localization
		);

		var myWindow = this.getWindowSystem().createDefaultWindow(
			LangMap.title,
			appdata
		);

		var windowBody = myWindow.getBody();
		var windowStyle = myWindow.getStyle();

		windowStyle.removeBorders();
		windowStyle.updateColors();

		var mainContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.MainContainer,
			{
				parent: windowBody,
				noPadding: false
			}
		);

		mainContainer.pack("BEGIN");

		// All your code here!

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return MyApplication;
});
```

### Fill the data ###

First, you should change the `MyApplication` class to a more-semantic name
that ends with `Application`, for example:

* The Clock application of Native have a name of `ClockApplication`.
* A file manager named "FileBox" can have a name of `FileBoxApplication`.

Some lines have a comment `// FILL HERE` at the end. These lines have metadata
information.

* The first three "fill here" can be filled with the application data. You can
see the expected values and format of these attributes in the documentation
of the class `NaturalShell.Base.Application`:
{@link NaturalShell.Base.Application~setID},
{@link NaturalShell.Base.Application~setName} and
{@link NaturalShell.Base.Application~setNamespace}
* In the `setMetadataIcon` line you should change the part `my-application` to
your application name or a path where you installed the icon.
* The "fill here" #4, #5 and #6 should be filled with the application
metadata. Again I recomment you to see the
{@link NaturalShell.Base.Application} documentation for explanations about
it's values.

The line with the `// All your code here!` should be replaced with your
application's code. You can use the `LangMap` variable to get localized
messages. For packing widgets on your window, use the `mainContainer`
object as parent. This widget provides a viewport to your window and adds
a content-overflow secure that provides to the user a good experience.

## Application arguments ##

The standard arguments that the shell may try to use on any application are:

* `-l [language-code]` `--lang=[language-code]`: Sets the application language
independently of the environment language.
* `-h` `-?` `--help`: Tries to get help about the application.
* `-s` `--slow-server`: The application should try to use the less number of
server API calls possibles because the server right now is unable to handle
a big number of API calls.
