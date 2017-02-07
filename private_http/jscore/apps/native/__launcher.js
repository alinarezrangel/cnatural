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
				.addClass("flat-button")
				.addClass("gui-widget")
				.addClass("gui-widget-button")
				.addClass("gui-widget-application-button")
				.data("widget", "application-button");
		}
	}));

	function Launcher(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		this.setName("Launcher");
		this.setID("org.cnatural.applications.native.launcher");
		this.setNamespace("CNatural:Software:Desktop:Native:Applications:Builtins");

		this.setMetadataIcon("/resources/syslog.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName("Launcher");
		this.setMetadataComment("Launch applications from a simple interface");
		this.setMetadataGraphical(true);
		this.setMetadataShowInShell(true);

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

		var windowMenu = myWindow.getMenu();

		var applicationList = [];

		var searchInput = window.NaturalWidgets.Create(
			window.NaturalWidgets.Input,
			{
				parent: windowMenu,
				type: "text",
				placeholder: "Enter application to search..."
			}
		);

		var searchResults = window.NaturalWidgets.Create(
			window.NaturalWidgets.Container,
			{
				parent: windowMenu
			}
		);

		searchInput.pack("APPEND");
		searchResults.pack("APPEND");

		searchInput.getElement().attach((event) =>
		{
			var isearchResults = searchResults.getElement().original;
			var searching = searchInput.getElement().value();

			while(isearchResults.firstChild)
				isearchResults.removeChild(isearchResults.firstChild);

			applicationList.forEach((value, index, array) =>
			{
				if(value.getName().toLowerCase().indexOf(searching.toLowerCase()) >= 0)
				{
					var node = window.NaturalWidgets.Create(
						window.NaturalWidgets.Button,
						{
							parent: searchResults.getElement(),
							text: value.getName()
						}
					);
					node.getElement().addClass("gui-margin-bottom");

					var logo = window.NaturalWidgets.Create(
						window.NaturalWidgets.Image,
						{
							parent: node.getElement(),
							src: value.getMetadata().icon,
							width: 32,
							height: 32,
							alt: value.getMetadata().genericName
						}
					);

					logo.getElement().addClass([
						"gui-margin-left"
					]);

					node.pack("APPEND");
					logo.pack("APPEND");

					node.getElement().attach((event) =>
					{
						this.getWindowSystem().destroyWindow(myWindow.getWMElement());

						value.run([]);
					}).on("click").addClass([
						"color-gui-button",
						"gui-clickeable",
						"width-block",
						"margin-4",
						"padding-16"
					]);
				}
			});
		}).on("keypress");

		var windowBody = myWindow.getBody();

		var mcontainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.MainContainer,
			{
				parent: windowBody,
				noPadding: false
			}
		);

		var container = window.NaturalWidgets.Create(
			window.NaturalWidgets.Container,
			{
				parent: mcontainer.getElement()
			}
		);

		container.getElement()
			.addClass("color-transparent")
			.addClass("row")
			.addClass("wrap")
			.removeClass("container");

		mcontainer.pack("APPEND");
		container.pack("APPEND");

		window.NaturalShell.CurrentShell.GetAllApplications().forEach((value, index, array) =>
		{
			if(!value.getMetadata().showInShell)
				return;

			applicationList.push(value);

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
