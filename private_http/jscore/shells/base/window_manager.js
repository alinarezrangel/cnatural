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
		 * @param {NaturalShell.Base.WindowElement}
		 *
		 * @method NaturalShell.Base.WindowElement.prototype.packWindowAsToplevel
		 */
		window.NaturalShell.Base.WindowManager.prototype.packWindowAsToplevel = function(windowElement)
		{
			return;
		};

		/**
		 * Hides all **visible** windows.
		 */
		window.NaturalShell.Base.WindowManager.prototype.hideAllWindows = function()
		{
			// Abstract method!
			/// Hides all windows.
		};

		window.NaturalShell.Base.WindowManager.prototype.showToplevel = function()
		{
			// Abstract method!
			/// Shows the toplevel (most elevated, higher Z-Index) window.
		};

		window.NaturalShell.Base.WindowManager.prototype.moveToTop = function(cmpfcn)
		{
			// Abstract method!
			/// Moves the window specified by the function cmpfcn to be the toplevel window.
		};

		window.NaturalShell.Base.WindowManager.prototype.isShowingWindow = function()
		{
			// Abstract method!
			/// Returns true if is visible any window.
		};

		window.NaturalShell.Base.WindowManager.prototype.isShowing = function(cmpfcn)
		{
			// Abstract method!
			/// Returns true if the cmpfcn functions returns true on any of the windows
			/// contained in this.context.
		};

		window.NaturalShell.Base.WindowManager.prototype.unpackWindow = function(cmpfcn)
		{
			// Abstract method!
			/// Unpacks a window
		};

		window.NaturalShell.Base.WindowManager.prototype.forEach = function(callback)
		{
			this.context.getWindowArea().apply((windowEl) =>
			{
				callback(windowEl);
			}).forEach();
		};

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

