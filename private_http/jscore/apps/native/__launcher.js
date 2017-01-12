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
				.addClass("fcontainer")
				.addClass("center")
				.addClass("no-wrap")
				.addClass("text-center")
				.addClass("padding-16")
				.addClass("margin-8")
				.addClass("color-gui-button")
				.addClass("fx-1")
				.addClass("gui-hoverable")
				.addClass("gui-clickeable")
				.addClass("gui-widget")
				.addClass("gui-widget-application-button")
				.data("widget", "application-button");
		}
	}));

	function Launcher(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Launcher");
		this.setID("__launcher");
		this.setNamespace("org.cnatural.applications.native.launcher");

		this.setMetadataIcon("/resources/syslog.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName("Launcher");
		this.setMetadataComment("Launch applications from a simple interface");

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

		winstyle.removeBorders();
		winstyle.updateColors();

		var windowBody = myWindow.getBody();

		var container = window.NaturalWidgets.Create(
			window.NaturalWidgets.Container,
			{
				parent: windowBody
			}
		);

		container.getElement()
			.addClass("color-transparent")
			.addClass("row")
			.addClass("wrap")
			.removeClass("container");

		container.pack("APPEND");

		window.NaturalShell.CurrentShell.GetAllApplications().forEach((value, index, array) =>
		{
			var node = window.NaturalWidgets.Create(
				AppButton,
				{
					parent: container.getElement()
				}
			);

			var logo = window.NaturalWidgets.Create(
				window.NaturalWidgets.Image,
				{
					parent: node.getElement(),
					src: value.getMetadata().icon,
					width: 128,
					height: 128,
					alt: value.getMetadata().genericName
				}
			);

			var text = window.NaturalWidgets.Create(
				window.NaturalWidgets.Text,
				{
					parent: node.getElement(),
					text: value.getName()
				}
			);

			node.getElement().on("click", () =>
			{
				this.getWindowSystem().destroyWindow(myWindow.getWMElement());

				value.run([]);
			});

			logo.pack("BEGIN");
			text.pack("END");
			node.pack("APPEND");
		});

		myWindow.addEventListener("close", () =>
		{
			this.isOpenALauncher = false;
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return Launcher;
});
