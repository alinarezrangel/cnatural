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
			"message_p1": "CNatural es una implementación parecida a NodeNatural pero en C11 (en vez de NodeJS).",
			"message_p2": "Este es CNatural, puedes ver la ayuda utilizando la aplicación <Ayuda> en el launcher (barra superior izquerda).",
			"message_p3": "Gracias por usar CNatural!",
			"button_done": "Aceptar"
		},
		"en_US": {
			"title": "Welcome",
			"subtitle": "CNatural Araguaney",
			"message_p1": "CNatural is an implementation NodeNatural-like but in C11 instead of NodeJS.",
			"message_p2": "This is CNatural, you can see the system help using the application <Help> in the launcher (top bar, left button).",
			"message_p3": "Thanks for using CNatural!",
			"button_done": "Accept"
		}
	};

	function WelcomeApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Welcome Application");
		this.setID("welcome_application");
		this.setNamespace("org.cnatural.applications.welcome");

		this.setMetadataIcon("/resources/images/icons/help-icon.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName("Welcome");
		this.setMetadataComment("A welcome app for new users");
	}

	WelcomeApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	WelcomeApplication.prototype.run = function(args)
	{
		var appdata = this.createInstance();
		var LangMap = POMap["en_US"];

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
				parent: windowBody
			}
		);

		mainContainer.pack("BEGIN");

		var header = window.NaturalWidgets.Create(
			window.NaturalWidgets.Header,
			{
				parent: mainContainer.getElement(),
				level: 6,
				size: "section.title",
				text: LangMap.subtitle
			}
		);

		var message_p1 = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: mainContainer.getElement(),
				text: LangMap.message_p1
			}
		);

		var message_p2 = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: mainContainer.getElement(),
				text: LangMap.message_p2
			}
		);

		var message_p3 = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: mainContainer.getElement(),
				text: LangMap.message_p3
			}
		);

		var accept_btn = window.NaturalWidgets.Create(
			window.NaturalWidgets.Button,
			{
				parent: mainContainer.getElement(),
				text: LangMap.button_done
			}
		);

		header.getElement()
			.addClass("text-center")
			.addClass("padding-8")
			.addClass("margin-8");

		accept_btn.getElement()
			.addClass("width-block")
			.addClass("padding-16")
			.addClass("color-gui-button")
			.on("click", () =>
			{
				this.getWindowSystem().destroyWindow(myWindow.getWMElement());
			});

		header.pack("BEGIN");
		message_p1.pack("APPEND");
		message_p2.pack("APPEND");
		message_p3.pack("APPEND");
		accept_btn.pack("END");

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return WelcomeApplication;
});
