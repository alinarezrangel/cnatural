/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (window style).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.StyleBase: NaturalObject is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * Controls the look of a window.
		 *
		 * Not all window styles works on all windows, specific windows
		 * uses specific window styles.
		 *
		 * @param {NaturalShell.Base.Window} windowObject - Window to style.
		 * @param {}
		 */
		window.NaturalShell.Base.WindowStyle = function(windowObject, appdata)
		{
			this.window = windowObject;
			this.appdata = appdata;
			this.titlebarColor = null;
			this.bodyColor = null;
			this.borderColor = null;
			this.defaultPallete = {
				titlebarColor: null,
				bodyColor: null,
				borderColor: null
			};
		};

		window.NaturalShell.Base.WindowStyle.prototype.setTitlebarColor = function(colorname)
		{
			this.titlebarColor = colorname;
		};

		window.NaturalShell.Base.WindowStyle.prototype.setBodyColor = function(colorname)
		{
			this.bodyColor = colorname;
		};

		window.NaturalShell.Base.WindowStyle.prototype.setBorderColor = function(colorname)
		{
			this.borderColor = colorname;
		};

		window.NaturalShell.Base.WindowStyle.prototype.getTitlebarColor = function()
		{
			return this.titlebarColor;
		};

		window.NaturalShell.Base.WindowStyle.prototype.getBodyColor = function()
		{
			return this.bodyColor;
		};

		window.NaturalShell.Base.WindowStyle.prototype.getBorderColor = function()
		{
			return this.borderColor;
		};

		window.NaturalShell.Base.WindowStyle.prototype.getWindow = function()
		{
			return this.window;
		};

		window.NaturalShell.Base.WindowStyle.prototype.getApplicationData = function()
		{
			return this.appdata;
		};

		window.NaturalShell.Base.WindowStyle.prototype.updateColors = function()
		{
			// Abstract method!
			/// [protected] Updates the colors of the window using the attributes
			/// getTitlebarColor, getBodyColor and getBorderColor. Optionally
			/// can use the getPallete.
			///
			/// You can use the this.defaultPallete protected attribute,
			/// it have a titlebarColor, bodyColor and borderColor attributes and
			/// if get*Color returns null, you should use the value contained in this
			/// map. But the map can contain null values and in that case, you
			/// may use your own colors.
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

