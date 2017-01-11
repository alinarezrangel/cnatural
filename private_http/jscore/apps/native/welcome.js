/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Welcome app for Native.
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
	var POMap = {
		"es_VEN": {
			"title": "Bienvenido",
			"subtitle": "CNatural Araguaney",
			"message_p1": "",
			"message_p2": "",
			"message_p3": "",
			"button_done": ""
		},
		"en_US": {
			"title": "",
			"subtitle": "",
			"message_p1": "",
			"message_p2": "",
			"message_p3": "",
			"button_done": ""
		}
	};

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

	function WelcomeApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Welcome Application");
		this.setID("welcome_application");
		this.setNamespace("org.cnatural.applications.welcome");
	}

	WelcomeApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	WelcomeApplication.prototype.run = function(args)
	{
		var appdata = this.createInstance();

		var myWindow = this.getWindowSystem().createDefaultWindow(
			"Welcome",
			appdata
		);

		var windowBody = myWindow.getBody();
		var windowStyle = myWindow.getStyle();

		var header = window.NaturalWidgets.Create(
			window.NaturalWidgets.Header,
			{
				parent: windowBody,
				level: 6,
				size: "section.title"
			}
		);

		var message = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: windowBody
			}
		);

		header.getElement()
			.addClass("text-center")
			.addClass("padding-8")
			.addClass("margin-8");

		PackWidgetPlainText(header, "Native");

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

	return WelcomeApplication;
});
