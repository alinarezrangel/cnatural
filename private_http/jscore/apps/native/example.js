/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Example app for Native.
**********************

Copyright 2016 Alejandro Linarez Rangel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**********************
************************************************/

window.NaturalShell.CurrentShell.RegisterApplication(function(window, document)
{
	function PackWidgetPlainText(parentWidget, text)
	{
		window.NaturalWidgets.Create(
			window.NaturalWidgets.PlainText,
			{
				parent: parentWidget.getElement(),
				text: text
			}
		).pack("APPEND");
	}

	function ExampleApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Example Application");
		this.setID("example_application");
		this.setNamespace("org.cnatural.applications.example");
	}

	ExampleApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	ExampleApplication.prototype.run = function(args)
	{
		var appdata = this.createInstance();

		var myWindow = this.getWindowSystem().createDefaultWindow(
			"Example Application",
			appdata
		);

		var windowBody = myWindow.getBody();
		var windowStyle = myWindow.getStyle();

		var header = window.NaturalWidgets.Create(
			window.NaturalWidgets.Header,
			{
				parent: windowBody,
				level: 1,
				size: "page.title"
			}
		);

		var message = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: windowBody
			}
		);

		PackWidgetPlainText(header, "CNatural!");

		PackWidgetPlainText(message, "Bienvenido a CNatural!");

		header.pack("BEGIN");
		message.pack("APPEND");

		windowStyle.removeBorders();

		windowStyle.setTitlebarColor("color-natural-deeporange");
		windowStyle.setBorderColor("color-natural-redgrey");
		windowStyle.setBodyColor("color-natural-redgrey");

		windowStyle.updateColors();

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return ExampleApplication;
});
