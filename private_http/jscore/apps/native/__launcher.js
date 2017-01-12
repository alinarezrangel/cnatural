/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Launcher App for Native.
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
	var AppButton = window.NaturalWidgets.Extend(window.NaturalWidgets.Widget, window.NaturalWidgets.Class({
		type: "ApplicationButton",
		path: "CNatural.JS.Widgets.ApplicationButton",
		_constructor: function(args)
		{
			this._super._constructor.call(this, args);
			this._element = window.$natural.wrap(
				document.createElement("div")
			);
			this._element
				.addClass("container")
				.addClass("padding-16")
				.addClass("margin-8")
				.addClass("color-gui-button")
				.addClass("float-left")
				.addClass("gui-hoverable")
				.addClass("gui-clickeable")
				.addClass("gui-widget")
				.addClass("gui-widget-application-button");
		}
	}));

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

	function Launcher(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Launcher");
		this.setID("__launcher");
		this.setNamespace("org.cnatural.applications.native.launcher");

		this.isOpenALauncher = false;
	}

	Launcher.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	Launcher.prototype.run = function(args)
	{
		if(this.isOpenALauncher)
		{
			return;
		}

		this.isOpenALauncher = true;
		var appdata = this.createInstance();

		var myWindow = this.getWindowSystem().createDefaultWindow(
			"Launcher",
			appdata
		);

		var winstyle = myWindow.getStyle();

		var windowBody = myWindow.getBody();

		var container = window.NaturalWidgets.Create(
			window.NaturalWidgets.Container,
			{
				parent: windowBody
			}
		);

		container.getElement().addClass("color-transparent");

		container.pack("APPEND");

		window.NaturalShell.CurrentShell.GetAllApplications().forEach((value, index, array) =>
		{
			var node = window.NaturalWidgets.Create(
				AppButton,
				{
					parent: container.getElement()
				}
			);

			var text = window.NaturalWidgets.Create(
				window.NaturalWidgets.Text,
				{
					parent: node.getElement()
				}
			);

			PackWidgetPlainText(text, value.getName());

			node.getElement().on("click", () =>
			{
				this.getWindowSystem().destroyWindow(myWindow.getWMElement());

				value.run([]);
			});

			text.pack("END");
			node.pack("APPEND");
		});

		winstyle.removeBorders();

		winstyle.setTitlebarColor("color-gui-header");
		winstyle.setBodyColor("color-gui-body");

		winstyle.updateColors();

		myWindow.addEventListener("close", () =>
		{
			this.isOpenALauncher = false;
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return Launcher;
});
