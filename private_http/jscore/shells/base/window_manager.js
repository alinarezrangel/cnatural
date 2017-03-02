/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (window manager base class).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.ManagerBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.Context === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.ManagerBase: NaturalShell.Context is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * It's any object that represents a window.
		 *
		 * It's implementation-defined, so you never should use it directly if
		 * you don't know what windowed interface are you using.
		 *
		 * @typedef {opaque_type|object} WindowElement
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * Represents a window manager.
		 *
		 * The window manager "manages" the windows, packing (adding), showing,
		 * hidding and doing other operations on the windows packed **on his area**.
		 *
		 * The Windowed Interface need almost one window manager and one window system.
		 * But remember that this is the lower limit, you can have multiples window
		 * systems and managers on the **same shell** or **windowed interface**.
		 *
		 * Remember that the window manager **can not create windows**, only manages
		 * the existing ones.
		 *
		 * @param {NaturalShell.Base.Context} context - Context to use.
		 *
		 * @class WindowManager
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.WindowManager = function(context)
		{
			this.context = context;
		};

		/**
		 * Packs a windows as toplevel.
		 *
		 * The toplevel window is the window with the higher Z-index currently
		 * visible. This method will add the window to this manager **and** will
		 * convert it to the toplevel window.
		 *
		 * @param {NaturalShell.Base.WindowElement} windowElement - Window Element to pack.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.packWindowAsToplevel
		 */
		window.NaturalShell.Base.WindowManager.prototype.packWindowAsToplevel = function(windowElement)
		{
			return;
		};

		/**
		 * Hides all **visible** windows.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.hideAllWindows
		 */
		window.NaturalShell.Base.WindowManager.prototype.hideAllWindows = function()
		{
			return;
		};

		/**
		 * Shows the toplevel window.
		 *
		 * If you call {@link NaturalShell.Base.WindowManager~hideAllWindows} then
		 * the toplevel window will be hidden. Call this method to show the window
		 * with the higher Z-index.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.showToplevel
		 */
		window.NaturalShell.Base.WindowManager.prototype.showToplevel = function()
		{
			return;
		};

		/**
		 * Makes a window the new toplevel.
		 *
		 * Calling this method will be change the current toplevel window.
		 *
		 * The callback is implementation dependend, but you can use the
		 * {@link NaturalShell.Base.WindowSystem~getEqualsCallback} method for
		 * get this callback in a implementation-independend manner.
		 *
		 * @param {function} cmpfcn - Callback to determine where two windows are equals.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.moveToTop
		 */
		window.NaturalShell.Base.WindowManager.prototype.moveToTop = function(cmpfcn)
		{
			return;
		};

		/**
		 * Determines if **any** window is visible.
		 *
		 * This method returns true if at least **one** window is visible.
		 *
		 * @return {boolean} true if at least one window is visible, false otherwise.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.isShowingWindow
		 */
		window.NaturalShell.Base.WindowManager.prototype.isShowingWindow = function()
		{
			return false;
		};

		/**
		 * Determines is a specified window is visible.
		 *
		 * The callback is in an implementation-defined format, but you can get in
		 * a implementation-independend manner a callback using the
		 * {@link NaturalShell.Base.WindowSystem~getEqualsCallback} method.
		 *
		 * @param {function} cmpfcn - Function used to determine where two are equals.
		 *
		 * @return {boolean} true if the specified window is visible, false otherwise.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.isShowing
		 */
		window.NaturalShell.Base.WindowManager.prototype.isShowing = function(cmpfcn)
		{
			return false;
		};

		/**
		 * Unpacks a window.
		 *
		 * After a window is unpacked, this window manager does **not** have more
		 * control over it.
		 *
		 * @param {function} cmpfcn - Function used to determine where two windows are equals.
		 *
		 * @abstract
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.unpackWindow
		 */
		window.NaturalShell.Base.WindowManager.prototype.unpackWindow = function(cmpfcn)
		{
			return;
		};

		/**
		 * Applies a function to all windows in this window manager.
		 *
		 * It's not abtract, but should be overrided.
		 *
		 * @param {function} callback - Function to apply (only have one argument: the {@link NaturalShell.Base.WindowElement}).
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.forEach
		 */
		window.NaturalShell.Base.WindowManager.prototype.forEach = function(callback)
		{
			this.context.getWindowArea().apply((windowEl) =>
			{
				callback(windowEl);
			}).forEach();
		};

		/**
		 * Gets the context of this window manager.
		 *
		 * @return {NaturalShell.Base.Context} Context passed on the creation.
		 *
		 * @method NaturalShell.Base.WindowManager.prototype.getContext
		 */
		window.NaturalShell.Base.WindowManager.prototype.getContext = function()
		{
			return this.context;
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

