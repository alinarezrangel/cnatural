/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (window).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.WindowBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Native.WindowStyle === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.WindowBase: NaturalShell.WindowStyleBase is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.Window = function(parent, appdata)
		{
			this.parent = parent;
			this.appdata = appdata;
			this.style = new window.NaturalShell.Native.WindowStyle(this, appdata);
		};

		window.NaturalShell.Native.Window.prototype.show = function()
		{
			// Abstract method!
			/// Shows the window (if is hidden) but not as toplevel.
			/// For a toplevel show, use WindowManager.moveToTop
			/// which should be compatible with the getWMElement method.
		};

		window.NaturalShell.Native.Window.prototype.hide = function()
		{
			// Abstract method!
			/// Hides the window (if is showed).
		};

		window.NaturalShell.Native.Window.prototype.getWMElement = function()
		{
			// Abstract method!
			/// Gets the raw window element, which can be used on the window
			/// manager and system functions.
		};

		window.NaturalShell.Native.Window.prototype.getParent = function()
		{
			return this.parent;
		};

		window.NaturalShell.Native.Window.prototype.getApplicationData = function()
		{
			return this.appdata;
		};

		window.NaturalShell.Native.Window.prototype.getBody = function()
		{
			// Abstract method!
			/// Gets the HTMLElement (or HTMLElement-like) object that is the
			/// the window body.
		};

		window.NaturalShell.Native.Window.prototype.getHeaderbar = function()
		{
			// Abstract method!
			/// Gets the window headerbar (if it contains any element, they should be removed)
			/// and if have, removes the window title. If no headerbar is supported,
			/// can return null.
		};

		window.NaturalShell.Native.Window.prototype.getContextMenu = function()
		{
			// Abstract method!
			/// Gets the context menu for the window (right-click menu).
			/// May be non-empty.
		};

		window.NaturalShell.Native.Window.prototype.getMenu = function()
		{
			// Abstract method!
			/// Gets the window's menu (if any) or null if no window's menu
			/// is supported. May return the same object that getContextMenu,.
			///
			/// If the window's context menu contains any object, you can
			/// (if you want) remove they and add your owns, but in this
			/// object (the window's menu) you should never remove any object,
			/// only add (specificly, append objects to the end).
		};

		window.NaturalShell.Native.Window.prototype.setTitle = function(title)
		{
			// Abstract method!
			/// Sets the title of the window. If a headerbar is used, this
			/// function is undefined.
		};

		window.NaturalShell.Native.Window.prototype.getTitle = function()
		{
			// Abstract method!
			/// Gets the title of the window. If a headerbar is used, this
			/// function is undefined.
		};

		window.NaturalShell.Native.Window.prototype.storeData = function(key, value)
		{
			// Abstract method!
			/// Stores the key "key" with the value "value" in this window.
		};

		window.NaturalShell.Native.Window.prototype.loadData = function(key)
		{
			// Abstract method!
			/// Loads the key "key" from this window.
		};

		window.NaturalShell.Native.Window.prototype.getStyle = function()
		{
			return this.style;
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

