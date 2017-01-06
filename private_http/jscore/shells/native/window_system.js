/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (window system).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.SystemBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Native.Window === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.SystemBase: NaturalShell.WindowBase is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.WindowSystem = function(context, manager)
		{
			this.context = context;
			this.windowManager = manager;
		};

		window.NaturalShell.Native.WindowSystem.prototype.getContext = function()
		{
			return this.context;
		};

		window.NaturalShell.Native.WindowSystem.prototype.getWindowManager = function()
		{
			return this.windowManager;
		};

		window.NaturalShell.Native.WindowSystem.prototype.createDefaultWindow = function(title, appdata)
		{
			// Abstract method!
			/// Creates and returns a new window with a default layout and with the title "title".
			/// appdata is a object map with all application data.
			///
			/// Note that destroyWindow and destroyCustomWindow removes the window from the
			/// window manager using the unpackWindow method, but this function and
			/// createDefaultWindow ADDS the window to the window manager.
		};

		window.NaturalShell.Native.WindowSystem.prototype.createCustomWindow = function(callback, appdata)
		{
			// Abstract method!
			/// Creates and returns a new window with a user-provided layout defined
			/// by callback(window).
			/// appdata is a object map with all application data.
			///
			/// Note that destroyWindow and destroyCustomWindow removes the window from the
			/// window manager using the unpackWindow method, but this function and
			/// createDefaultWindow ADDS the window to the window manager.
		};

		window.NaturalShell.Native.WindowSystem.prototype.destroyWindow = function(windowObject)
		{
			// Abstract method!
			/// Destroys a window created with createDefaultWindow.
			///
			/// Returns true if the window was deinitialized and removed from the DOM.
			/// This functions may call windowManager.unpackWindow.
		};

		window.NaturalShell.Native.WindowSystem.prototype.destroyCustomWindow = function(windowObject)
		{
			// Abstract method!
			/// Destroys a window created with createCustomWindow.
			///
			/// Returns true if the window was deinitialized and removed from the DOM.
			/// This functions may call windowManager.unpackWindow.
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

