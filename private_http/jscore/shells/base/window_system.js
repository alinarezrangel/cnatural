/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (window system).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.SystemBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.Window === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.SystemBase: NaturalShell.WindowBase is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * Maps a layout.
		 *
		 * @typedef {object} NaturalShell.Base.ResMap
		 *
		 * @property {opaque_type|object} titlebar - The titlebar to use (or null).
		 * @property {opaque_type|object} titlebarCloseOrBackbutton - The titlebar close button (null only if titlebar is null).
		 * @property {opaque_type|object} titlebarMenuButton - The titlebar menu button (null only if titlebar is null).
		 * @property {opaque_type|object} body - The window body.
		 */

		/**
		 * A callback that can be used to layout a window.
		 *
		 * @callback NaturalShell.Base.WindowSystem~CreateCustomWindowCallback
		 *
		 * @param {NaturalShell.Base.WindowElement} winel - The window element.
		 * @param {NaturalShell.Base.AppInstanceData} appdata - The application instance data.
		 *
		 * @return {NaturalShell.Base.ResMap} A ResMap.
		 */

		/**
		 * Represents a window system.
		 *
		 * The window system can create windows, and the window manager manages them.
		 *
		 * @param {NaturalShell.Base.Context} context - Context to use.
		 * @param {NaturalShell.Base.WindowManager} manager - Window manager to use.
		 *
		 * @class WindowSystem
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.WindowSystem = function(context, manager)
		{
			this.context = context;
			this.windowManager = manager;
		};

		/**
		 * Gets the current context used.
		 *
		 * @return {NaturalShell.Base.Context} Context used.
		 *
		 * @method NaturalShell.Base.WindowSystem.prototype.getContext
		 */
		window.NaturalShell.Base.WindowSystem.prototype.getContext = function()
		{
			return this.context;
		};

		/**
		 * Gets the used window manager.
		 *
		 * @return {NaturalShell.Base.WindowManager} The used window manager.
		 *
		 * @method NaturalShell.Base.WindowSystem.prototype.getWindowManager
		 */
		window.NaturalShell.Base.WindowSystem.prototype.getWindowManager = function()
		{
			return this.windowManager;
		};

		/**
		 * Creates a default window.
		 *
		 * The default window have a default layout with a titlebar, a body and a menu.
		 *
		 * After creating the window, it's packed on the used window manager.
		 *
		 * Note that you can create multiples windows using the same AppInstanceData.
		 *
		 * @param {string} title - Title of the new window.
		 * @param {NaturalShell.Base.AppInstanceData} appdata - The instance data of the application creating the window.
		 *
		 * @return {NaturalShell.Base.Window} The created window.
		 *
		 * @abstract
		 * @method NaturalShell.Base.WindowSystem.prototype.createDefaultWindow
		 */
		window.NaturalShell.Base.WindowSystem.prototype.createDefaultWindow = function(title, appdata)
		{
			return null;
		};

		/**
		 * Creates a custom window.
		 *
		 * This window only haves a body and a menu, all layout is defined in the callback.
		 *
		 * After creating the window, it's packed on the used window manager.
		 *
		 * @param {NaturalShell.Base.WindowSystem~CreateCustomWindowCallback} callback - Callback to layout the window.
		 * @param {NaturalShell.Base.AppInstanceData} appdata - AppInstanceData to use to create the window.
		 *
		 * @return {NaturalShell.Base.Window} The created window.
		 *
		 * @abstract
		 * @method NaturalShell.Base.WindowSystem.prototype.createCustomWindow
		 */
		window.NaturalShell.Base.WindowSystem.prototype.createCustomWindow = function(callback, appdata)
		{
			return null;
		};

		/**
		 * Destroys a window.
		 *
		 * The window should be created with {@link NaturalShell.Base.WindowSystem~createDefaultWindow}
		 * or this method will fail.
		 *
		 * Calls {@link NaturalShell.Base.WindowManager~unpackWindow}.
		 *
		 * @param {NaturalShell.Base.Window} windowObject - The window to destroy.
		 *
		 * @return {boolean} true if the window was removed successfuly, false otherwise.
		 *
		 * @abstract
		 * @method NaturalShell.Base.WindowSystem.prototype.destroyWindow
		 */
		window.NaturalShell.Base.WindowSystem.prototype.destroyWindow = function(windowObject)
		{
			return false;
		};

		/**
		 * Destroys a window.
		 *
		 * The window should be created with {@link NaturalShell.Base.WindowSystem~createCustomWindow}
		 * or this method will fail.
		 *
		 * Calls {@link NaturalShell.Base.WindowManager~unpackWindow}.
		 *
		 * @param {NaturalShell.Base.Window} windowObject - The window to destroy.
		 *
		 * @return {boolean} true if the window was removed successfuly, false otherwise.
		 *
		 * @abstract
		 * @method NaturalShell.Base.WindowSystem.prototype.destroyCustomWindow
		 */
		window.NaturalShell.Base.WindowSystem.prototype.destroyCustomWindow = function(windowObject)
		{
			return false;
		};

		/**
		 * Gets the callback that determines if two windows are equal.
		 *
		 * Generally, the callback is of the form `callback(windowElement) => true if otherWindow == windowObject`
		 * but not uses the `==` operator, instead compares the window data.
		 *
		 * @param {NaturalShell.Base.Window} windowObject - The window to determine if is equal.
		 *
		 * @return {function} A valid callback to determine when two windows are equal.
		 *
		 * @abstract
		 * @method NaturalShell.Base.WindowSystem.prototype.getEqualsCallback
		 */
		window.NaturalShell.Base.WindowSystem.prototype.getEqualsCallback = function(windowObject)
		{
			return null;
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

