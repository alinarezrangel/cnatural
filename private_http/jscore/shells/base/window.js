/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (window).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.WindowBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.WindowStyle === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.WindowBase: NaturalShell.WindowStyleBase is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * Represents a window.
		 *
		 * @param {NaturalShell.Base.Window} parent - The parent window (or null).
		 * @param {NaturalShell.Base.AppInstanceData} appdata - The AppInstanceData to use.
		 *
		 * @class Window
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.Window = function(parent, appdata)
		{
			this.parent = parent;
			this.appdata = appdata;
			this.style = new window.NaturalShell.Base.WindowStyle(this, appdata);
			this.style.updateColors();
		};

		/**
		 * Shows the window.
		 *
		 * There is not warranty that the window will be visible to the user,
		 * for that use {@link NaturalShell.Base.WindowManager~moveToTop}.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.show
		 */
		window.NaturalShell.Base.Window.prototype.show = function()
		{
			return;
		};

		/**
		 * Hides the window.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.hide
		 */
		window.NaturalShell.Base.Window.prototype.hide = function()
		{
			return;
		};

		/**
		 * Gets the {@link NaturalShell.Base.WindowElement} associated with this window.
		 *
		 * @return {NaturalShell.Base.WindowElement} The WindowElement associated with this window.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getWMElement
		 */
		window.NaturalShell.Base.Window.prototype.getWMElement = function()
		{
			return null;
		};

		/**
		 * Gets the window parent.
		 *
		 * @return {NaturalShell.Base.Window} Parent window (or null).
		 *
		 * @method NaturalShell.Base.Window.prototype.getParent
		 */
		window.NaturalShell.Base.Window.prototype.getParent = function()
		{
			return this.parent;
		};

		/**
		 * Gets the {@link NaturalShell.Base.AppInstanceData} of this window.
		 *
		 * @return {NaturalShell.Base.AppInstanceData} appdata of this window.
		 *
		 * @method NaturalShell.Base.Window.prototype.getApplicationData
		 */
		window.NaturalShell.Base.Window.prototype.getApplicationData = function()
		{
			return this.appdata;
		};

		/**
		 * Gets the winddow body.
		 *
		 * In this body you can put the window content.
		 *
		 * @return {NaturalObject} Window body.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getBody
		 */
		window.NaturalShell.Base.Window.prototype.getBody = function()
		{
			return null;
		};

		/**
		 * Gets the window's headerbar.
		 *
		 * If the window does not have a headerbar, it removes the titlebar and adds
		 * a headerbar. Note that using a headerbar will disable the methods:
		 *
		 * * {@link NaturalShell.Base.Window~setTitle}.
		 * * {@link NaturalShell.Base.Window~getTitle}.
		 *
		 * The headerbar is a container, so you can put content inside it.
		 *
		 * If no headerbar is supported returns null.
		 *
		 * @return {NaturalObject} The headerbar or null.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getHeaderbar
		 */
		window.NaturalShell.Base.Window.prototype.getHeaderbar = function()
		{
			return null;
		};

		/**
		 * Returns the context menu.
		 *
		 * It may be non-empty and if it have content, these content should not
		 * be removed (but if you want, you can remove them).
		 *
		 * If no context menu is supported, returns null.
		 *
		 * @return {NaturalObject} The context menu or null.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getContextMenu
		 */
		window.NaturalShell.Base.Window.prototype.getContextMenu = function()
		{
			return null;
		};

		/**
		 * Gets the window menu.
		 *
		 * The window menu may return the same object that {@link NaturalShell.Base.Window~getContextMenu},
		 * and may return null if no menu is supported.
		 *
		 * If the window's context menu contains any object, you can
		 * (if you want) remove they and add your owns, but in this
		 * object (the window's menu) you should never remove any object,
		 * only add (specificly, append objects to the end).
		 *
		 * @return {NaturalObject} Window menu or null.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getMenu
		 */
		window.NaturalShell.Base.Window.prototype.getMenu = function()
		{
			return null;
		};

		/**
		 * Sets the window's title.
		 *
		 * If a headerbar is used, this function is undefined.
		 *
		 * @param {string} title - The new window's title.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.setTitle
		 */
		window.NaturalShell.Base.Window.prototype.setTitle = function(title)
		{
			return;
		};

		/**
		 * Gets the window's title.
		 *
		 * If a headerbar is used, this function is undefined.
		 *
		 * @return {string} The current window's title.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.getTitle
		 */
		window.NaturalShell.Base.Window.prototype.getTitle = function()
		{
			return "";
		};

		/**
		 * Stores some data on the window.
		 *
		 * Generally, this data may be atoms or some application-specific data.
		 *
		 * @param {string} key - Name (key) of the data value to store.
		 * @param {string} value - Value of the data to store.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.storeData
		 */
		window.NaturalShell.Base.Window.prototype.storeData = function(key, value)
		{
			return;
		};

		/**
		 * Loads some data on the window.
		 *
		 * Generally, this data may be atoms or some application-specific data.
		 *
		 * @param {string} key - Name (key) of the value to load.
		 *
		 * @return {string} value - Value of the key.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.loadData
		 */
		window.NaturalShell.Base.Window.prototype.loadData = function(key)
		{
			return null;
		};

		/**
		 * Adds an event listener to the window.
		 *
		 * Some events are window-specific:
		 *
		 * * `close`: The window is closed
		 * * `iconify`: The window was minimized
		 * * `deiconify`: The window was unminimized
		 *
		 * These can be catched using this function.
		 *
		 * There is no warranty about that these events will be raised.
		 *
		 * @param {string} event_name - The name of the event.
		 * @param {function} event_listener - A valid event listener.
		 *
		 * @abstract
		 * @method NaturalShell.Base.Window.prototype.addEventListener
		 */
		window.NaturalShell.Base.Window.prototype.addEventListener = function(event_name, event_listener)
		{
			return;
		};

		/**
		 * Gets the window's style.
		 *
		 * @return {NaturalShell.Base.WindowStyle}
		 *
		 * @method NaturalShell.Base.Window.prototype.getStyle
		 */
		window.NaturalShell.Base.Window.prototype.getStyle = function()
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

