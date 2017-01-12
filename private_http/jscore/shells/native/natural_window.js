/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (natural window).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.NaturalWindow: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.Window === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.NaturalWindow: NaturalShell.WindowStyleBase is undefined");
		}

		if(typeof window.NaturalShell.Native.NaturalStyle === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.NaturalWindow: NaturalShell.NaturalStyle is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.NaturalWindow = function(parent, appdata, element)
		{
			window.NaturalShell.Base.Window.call(this, parent, appdata);
			this.element = element;
			this.style = new window.NaturalShell.Native.NaturalStyle(this, appdata);
			this.style.updateColors();
		};

		window.NaturalShell.Native.NaturalWindow.prototype =
			Object.create(window.NaturalShell.Base.Window.prototype);

		window.NaturalShell.Native.NaturalWindow.prototype.show = function()
		{
			this.element.removeClass("gui-hidden");
		};

		window.NaturalShell.Native.NaturalWindow.prototype.hide = function()
		{
			this.element.addClass("gui-hidden");
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getWMElement = function()
		{
			return this.element;
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getInnerElement = function()
		{
			return this.element;
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getBody = function()
		{
			return this.element.child("*[data-widget='window-body']");
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getHeaderbar = function()
		{
			var hb = this.element.child("*[data-widget='window-title']");

			if(hb.original.length === 0)
			{
				return this.element.child("*[data-widget='window-headerbar']");
			}

			var nhb = document.createElement("div");

			hb.remove();

			nhb.addClass([
				"gui-widget-headerbar-container",
				"box",
				"no-padding",
				"margin-8",
				"od-2",
				"fx-1"
			]);
			nhb.data("widget", "window-headerbar");

			this.element.child("*[data-widget='window-header']").appendChild(nhb);

			return nhb;
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getContextMenu = function()
		{
			return null;
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getMenu = function()
		{
			return this.element.child("*[data-widget='window-menu']")
		};

		window.NaturalShell.Native.NaturalWindow.prototype.setTitle = function(title)
		{
			var hb = this.element.child("*[data-widget='window-title']");

			while(hb.original.firstChild)
				hd.original.removeChild(hb.original.firstChild);

			hb.original.appendChild(document.createTextNode(title));
		};

		window.NaturalShell.Native.NaturalWindow.prototype.getTitle = function()
		{
			return this.element.child("*[data-widget='window-title']").original.textContent;
		};

		window.NaturalShell.Native.NaturalWindow.prototype.storeData = function(key, value)
		{
			this.element.data(key, value);
		};

		window.NaturalShell.Native.NaturalWindow.prototype.loadData = function(key)
		{
			return this.element.data(key);
		};

		window.NaturalShell.Native.NaturalWindow.prototype.addEventListener = function(event_name, event_listener)
		{
			this.element.on(event_name, function(event)
			{
				event_listener(event);
			});
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

