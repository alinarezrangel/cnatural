/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (natural window system).
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

(function()
{
	var natsec = function(window, document)
	{
		if(typeof window.NaturalObject === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.System: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.WindowSystem === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.System: NaturalShell.WindowSystem is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.NaturalWindowSystem = function(context, manager)
		{
			window.NaturalShell.Base.WindowSystem.call(this, context, manager);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype =
			Object.create(window.NaturalShell.Base.WindowSystem.prototype);

		window.NaturalShell.Native.NaturalWindowSystem.prototype.createDefaultWindow = function(title, appdata)
		{
			var normal = function(winel, appdata)
			{
				var titlebar = document.createElement("div");
				var titlebarCloseOrBackButton = document.createElement("span");
				var titlebarTitle = document.createElement("h2");
				var titlebarMenuButton = document.createElement("span");
				var body = document.createElement("div");

				var parentWindow = null;

				var makeIcon = function(iconName)
				{
					var sp = document.createElement("span");
					sp.className = "gui-font-iconset-v2";
					sp.appendChild(document.createTextNode(iconName));

					return sp;
				};

				titlebar.className = "gui-widget-window-header gui-flexcore-row no-margin od-1";
				titlebar.dataset["widget"] = "window-header";

				titlebarCloseOrBackButton.className = "gui-font-iconset-v2 gui-hoverable od-1 text-jumbo gui-clickeable padding-2 margin-8 color-transparent gui-shape-circle gui-circular-button-50";
				titlebarCloseOrBackButton.dataset["widget"] = "button";

				titlebarTitle.className = "text-jumbo font-bold od-2 fx-1 margin-8 color-transparent";
				titlebarTitle.dataset["widget"] = "text";

				titlebarMenuButton.className = "gui-font-iconset-v2 gui-hoverable od-3 text-jumbo gui-clickeable padding-2 margin-8 color-transparent gui-shape-circle gui-circular-button-50";
				titlebarMenuButton.dataset["widget"] = "button";

				body.className = "gui-widget-window-body container overflow-auto border no-padding no-margin od-2 fx-1 force-relative";
				body.dataset["widget"] = "window-body";

				if(appdata.mainWindowCreated)
				{
					titlebarCloseOrBackButton.appendChild(document.createTextNode("back"));
				}
				else
				{
					titlebarCloseOrBackButton.appendChild(document.createTextNode("close"));
				}

				titlebarMenuButton.appendChild(document.createTextNode("menu"));

				titlebarTitle.appendChild(document.createTextNode(title));

				titlebar.appendChild(titlebarCloseOrBackButton);
				titlebar.appendChild(titlebarTitle);
				titlebar.appendChild(titlebarMenuButton);

				winel.appendChild(titlebar);
				winel.appendChild(body);

				return {
					"titlebar": titlebar,
					"titlebarCloseOrBackButton": titlebarCloseOrBackButton,
					"titlebarMenuButton": titlebarMenuButton,
					"titlebarTitle": titlebarTitle,
					"body": body
				};
			};

			return this.createCustomWindow(normal, appdata);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.createCustomWindow = function(callback, appdata)
		{
			var winel = document.createElement("div");
			var menu = document.createElement("div");
			var menuSideNav = document.createElement("div");
			var menuSideNavCloseMenu = document.createElement("span");
			var menuSideNavCloseWindow = document.createElement("span");
			var menuSideNavMinimizeWindow = document.createElement("span");

			var resmap = {
				titlebar: null,
				titlebarCloseOrBackButton: null,
				titlebarMenuButton: null,
				titlebarTitle: null,
				body: null,
				result: null
			};

			var parentWindow = null;

			var makeIcon = function(iconName)
			{
				var sp = document.createElement("span");
				sp.className = "gui-font-iconset-v2";
				sp.appendChild(document.createTextNode(iconName));

				return sp;
			};

			winel.className = "gui-widget-window no-padding no-margin force-relative";
			winel.dataset["widget"] = "window";

			winel.dataset["name"] = appdata.applicationName;
			winel.dataset["ns"] = appdata.namespace;
			winel.dataset["appid"] = appdata.applicationID;
			winel.dataset["instanceId"] = appdata.instanceID.toString();
			winel.dataset["windowId"] = appdata.windowID.toString();
			appdata.windowID++;

			menu.className = "gui-widget-window-menu container padding-8 no-margin card gui-hidden";
			menu.dataset["widget"] = "window-menu";

			// menuSideNav.className = "side-navigation border-bottom bs-2 border-color-natural-black";
			menuSideNav.className = "row wrap padding-4 border-bottom bs-2 border-color-natural-black color-transparent";
			menuSideNav.dataset["widget"] = "window-menu-native";

			menuSideNavCloseMenu.className =
				menuSideNavCloseWindow.className =
				menuSideNavMinimizeWindow.className =
					"col text-jumbo padding-16 fx-1 text-center gui-clickeable gui-hoverable gui-button";

			menuSideNavCloseMenu.dataset["widget"] =
				menuSideNavCloseWindow.dataset["widget"] =
				menuSideNavMinimizeWindow.dataset["widget"] =
					"button";

			menuSideNavCloseMenu.classList.add("od-1");
			menuSideNavCloseWindow.classList.add("od-2");
			menuSideNavMinimizeWindow.classList.add("od-3");

			menuSideNavCloseMenu.appendChild(makeIcon("back"));
			// menuSideNavCloseMenu.appendChild(document.createTextNode("Close menu"));
			menuSideNavCloseWindow.appendChild(makeIcon("close"));
			// menuSideNavCloseWindow.appendChild(document.createTextNode("Close Window"));
			menuSideNavMinimizeWindow.appendChild(makeIcon("minimize"));
			// menuSideNavMinimizeWindow.appendChild(document.createTextNode("Minimize window"));

			menuSideNav.appendChild(menuSideNavCloseMenu);
			menuSideNav.appendChild(menuSideNavCloseWindow);
			menuSideNav.appendChild(menuSideNavMinimizeWindow);

			menu.appendChild(menuSideNav);

			resmap = callback(winel, appdata);

			winel.appendChild(menu);

			if(appdata.mainWindowCreated)
			{
				parentWindow = appdata.mainWindow;
			}
			else
			{
				appdata.mainWindowCreated = true;
			}

			var win = new window.NaturalShell.Native.NaturalWindow(parentWindow, appdata, window.$natural.wrap(winel));

			this.initWindowEvents(
				win,
				winel,
				resmap.titlebar,
				resmap.titlebarCloseOrBackButton,
				resmap.titlebarMenuButton,
				resmap.body,
				menu,
				menuSideNavCloseMenu,
				menuSideNavCloseWindow,
				menuSideNavMinimizeWindow
			);

			if(parentWindow === null)
			{
				appdata.mainWindow = win;
			}

			this.getWindowManager().packWindowAsToplevel(win.getWMElement());

			return win;
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.destroyWindow = function(windowObject)
		{
			return this.destroyCustomWindow(windowObject);
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.destroyCustomWindow = function(windowObject)
		{
			var params = {};
			var canBeRemoved = true;

			windowObject.apply((windowObject) =>
			{
				canBeRemoved = canBeRemoved && windowObject.original.dispatchEvent(new CustomEvent("close", params));
			}).forEach();

			if(canBeRemoved)
			{
				this.getWindowManager().unpackWindow((windowElement) =>
				{
					return ((windowElement.data("instanceId") == windowObject.data("instanceId"))
						&& (windowElement.data("windowId") == windowObject.data("windowId"))
						&& (windowElement.data("applicationId") == windowObject.data("applicationId"))
						&& (windowElement.data("namespace") == windowObject.data("namespace")));
				});
				return true;
			}

			return false;
		};

		window.NaturalShell.Native.NaturalWindowSystem.prototype.initWindowEvents =
			function(
				windowObject,
				windowElement,
				titlebar,
				titlebarCloseOrBackButton,
				titlebarMenuButton,
				body,
				menu,
				menuSideNavCloseMenu,
				menuSideNavCloseWindow,
				menuSideNavMinimizeWindow
			)
		{
			windowElement = window.$natural.wrap(windowElement);
			menu = window.$natural.wrap(menu);
			menuSideNavCloseMenu = window.$natural.wrap(menuSideNavCloseMenu);
			menuSideNavCloseWindow = window.$natural.wrap(menuSideNavCloseWindow);
			menuSideNavMinimizeWindow = window.$natural.wrap(menuSideNavMinimizeWindow);

			if(titlebar !== null)
			{
				titlebar = window.$natural.wrap(titlebar);
				titlebarCloseOrBackButton = window.$natural.wrap(titlebarCloseOrBackButton);
				titlebarMenuButton = window.$natural.wrap(titlebarMenuButton);

				titlebarCloseOrBackButton.attach(() =>
				{
					this.destroyWindow(windowElement);
				}).on("click");

				titlebarMenuButton.attach(() =>
				{
					menu.showMoveFromTopToCenter();
				}).on("click");
			}

			menuSideNavCloseMenu.attach(() =>
			{
				menu.hideMoveFromCenterToTop();
			}).on("click");

			menuSideNavCloseWindow.attach(() =>
			{
				menu.hideMoveFromCenterToTop();
				this.destroyWindow(windowElement);
			}).on("click");

			menuSideNavMinimizeWindow.attach(() =>
			{
				menu.hideMoveFromCenterToTop();
				windowElement.addClass("gui-hidden");
			}).on("click");

			windowElement.attach((ev) =>
			{
				menu.showMoveFromTopToCenter();

				ev.preventDefault();
			}).on("contextmenu");
		};
	};

	if(typeof module !== "undefined")
	{
		module.exports = natsec; // NodeJS, AngularJS, NativeScript, RequireJS, etc
	}
	else
	{
		natsec(window, document); // Browser JS
	}
}());

