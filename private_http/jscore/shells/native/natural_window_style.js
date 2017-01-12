/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (natural window style).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.NaturalStyle: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.WindowStyle === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.NaturalStyle: NaturalShell.WindowStyleBase is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.NaturalStyle = function(windowObject, appdata)
		{
			window.NaturalShell.Base.WindowStyle.call(this, windowObject, appdata);
		};

		window.NaturalShell.Native.NaturalStyle.prototype =
			Object.create(window.NaturalShell.Base.WindowStyle.prototype);

		window.NaturalShell.Native.NaturalStyle.prototype.addBorders = function()
		{
			var win = this.getWindow().getWMElement();

			var body = win.child("*[data-widget='window-body']");
			var menu = win.child("*[data-widget='window-menu']");

			body.addClass("border").echo(menu).addClass("border");
		}

		window.NaturalShell.Native.NaturalStyle.prototype.removeBorders = function()
		{
			var win = this.getWindow().getWMElement();

			var body = win.child("*[data-widget='window-body']");
			var menu = win.child("*[data-widget='window-menu']");

			body.removeClass("border").echo(menu).removeClass("border");
		}

		window.NaturalShell.Native.NaturalStyle.prototype.updateColors = function()
		{
			var win = this.getWindow().getWMElement();

			var selectOf = function(x, y, z)
			{
				if(x === null)
				{
					if(y === null)
					{
						return z;
					}
					else
					{
						return y;
					}
				}
				else
				{
					return x;
				}
			};

			var titlebarColor = selectOf(this.getTitlebarColor(), this.defaultPallete.titlebarColor, "color-gui-header");
			var bodyColor = selectOf(this.getBodyColor(), this.defaultPallete.bodyColor, "color-gui-body");
			var borderColor = selectOf(this.getBorderColor(), this.defaultPallete.borderColor, "color-transparent");

			var titlebar = win.child("*[data-widget='window-header']").get(0).original;
			var body = win.child("*[data-widget='window-body']").get(0).original;
			var menu = win.child("*[data-widget='window-menu']").get(0).original;

			var i = 0;
			var j = titlebar.classList.length;
			var bodyContainsBorder = false, menuContainsBorder = false;

			for(i = 0; i < j; i++)
			{
				if(titlebar.classList[i].startsWith("color-"))
				{
					window.$ntc(titlebar).removeClass(titlebar.classList[i]);
				}
			}

			j = body.classList.length;

			for(i = 0; i < j; i++)
			{
				var cl = body.classList[i];

				if(typeof cl === "undefined")
					break;

				if(cl.startsWith("color-"))
				{
					window.$ntc(body).removeClass(cl);
				}
				if(cl.startsWith("border-color-"))
				{
					window.$ntc(body).removeClass(cl);
				}
				if(cl == "border")
				{
					bodyContainsBorder = true;
				}
			}

			j = menu.classList.length;

			for(i = 0; i < j; i++)
			{
				var cl = body.classList[i];

				if(typeof cl === "undefined")
					break;

				if(cl.startsWith("color-"))
				{
					window.$ntc(menu).removeClass(cl);
				}
				if(cl.startsWith("border-color-"))
				{
					window.$ntc(menu).removeClass(cl);
				}
				if(cl == "border")
				{
					menuContainsBorder = true;
				}
			}

			window.$ntc(titlebar).addClass(titlebarColor);

			window.$ntc(body).addClass(bodyColor);

			window.$ntc(menu).addClass(bodyColor);

			if(bodyContainsBorder)
				window.$ntc(body).addClass(borderColor);

			if(menuContainsBorder)
				window.$ntc(menu).addClass(borderColor);
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

