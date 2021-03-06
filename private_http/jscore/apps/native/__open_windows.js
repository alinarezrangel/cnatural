/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Help app for Native.
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
	// POMap: at least es_VEN and en_US
	var POMap = {
		"es": {
			"all": {
				"shelldesc": "",
				"title": "Ventanas abiertas"
			}
		},
		"en": {
			"all": {
				"shelldesc": "",
				"title": "Open Windows"
			}
		}
	};

	function OpenWindowsApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		var LangMap = window.$natural.selectPOMapIn(POMap, window.$natural.Localization);

		// Metadata here
		this.setName("Open Windows");
		this.setID("org.cnatural.applications.open_windows");
		this.setNamespace("CNatural:Software:Desktop:Native:Applications:Builtins");

		this.setMetadataIcon("/resources/syslog.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName(LangMap["title"]);
		this.setMetadataComment(LangMap["shelldesc"]);
		this.setMetadataGraphical(true);
		this.setMetadataShowInShell(false);

		this.isOpenALauncher = false;
	}

	OpenWindowsApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	OpenWindowsApplication.prototype.run = function(args)
	{
		if(this.isOpenALauncher)
		{
			return;
		}

		this.isOpenALauncher = true;

		var appdata = this.createInstance();
		// Lang here
		var LangMap = window.$natural.selectPOMapIn(POMap,
			window.NaturalShell.CurrentShell.GetShortNameArgument(args, "-l") ||
			window.NaturalShell.CurrentShell.GetLongNameArgument(args, "--lang") ||
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
				noPadding: true
			}
		);

		mainContainer.pack("BEGIN");

		var packWindowsOfOn = (parent, appname, appid, win) =>
		{
			if(appid == this.getID())
				return;

			var ct = window.NaturalWidgets.Create(
				window.NaturalWidgets.ContainerWithHeader,
				{
					parent: parent,
					level: 3,
					size: "content.title",
					color: "color-ocean",
					title: appname
				}
			);

			var txt = window.NaturalWidgets.Create(
				window.NaturalWidgets.Text,
				{
					parent: ct.getBody(),
					text: appid
				}
			);

			txt.pack("APPEND");
			ct.pack("APPEND");

			ct.getElement()
				.addClass("gui-clickeable")
				.on("click", () =>
				{
					win.removeClass("gui-hidden");
					this.getWindowSystem().getWindowManager().moveToTop(
						this.getWindowSystem().getEqualsCallback(win)
					);
					this.getWindowSystem().getWindowManager().showToplevel();
					this.getWindowSystem().destroyWindow(myWindow.getWMElement());
				});
		};

		this.getWindowSystem().getWindowManager().forEachWindow((winEl) =>
		{
			var winttl = winEl.child("*[data-widget=\"window-header\"] > *[data-widget=\"text\"]");

			if(winttl.original.length == 0)
			{
				// Use application name
				winttl = winEl.data("name");
			}
			else
			{
				winttl = winttl.original[0].innerHTML;
			}

			packWindowsOfOn(mainContainer.getElement(), winttl, winEl.data("appid"), winEl);
		});

		myWindow.addEventListener("close", () =>
		{
			this.isOpenALauncher = false;
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return OpenWindowsApplication;
});
