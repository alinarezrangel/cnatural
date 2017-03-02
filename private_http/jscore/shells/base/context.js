/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (context of elements).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Context: NaturalObject is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * Callback for window related events.
		 *
		 * Note that the action table is implementation dependend, but these
		 * are the standard ones:
		 *
		 * | Action string      | Action to do (or ended)                 |
		 * | ------------------ | --------------------------------------- |
		 * | "window.add"       | A window was added                      |
		 * | "window.remove"    | A window was removed                    |
		 * | "window.show"      | A window was unhidden                   |
		 * | "window.front"     | A window was moved to the front         |
		 * | "window.hide"      | A window was hidden                     |
		 * | "window.toplevel"  | This window is now the toplevel window  |
		 *
		 * @callback NaturalShell.Base.Context~hiddenWindowsCallback
		 *
		 * @param {string} action - Action to do (see table).
		 * @param {NaturalShell.Base.Window} window - Window where the action was executed (may be null).
		 */

		/**
		 * Callback for application related things.
		 *
		 * Note that the action table  is implementation dependend, but these
		 * are the standard ones:
		 *
		 * | Action string               | Action to do (or ended)         |
		 * | --------------------------- | ------------------------------- |
		 * | "application.register"      | An application was registered   |
		 *
		 * @callback NaturalShell.Base.Context~applicationsCallback
		 *
		 * @param {string} action - Action string (see table).
		 * @param {NaturalShell.Base.Application} application - Application where the action was executed (may be null).
		 */

		/**
		 * It's a context for windows, window systems and window managers.
		 *
		 * The context manager callback to the shells, in this form it's like
		 * a bridge between the front-end (windows/winsystems/winmanagers) and
		 * the back-end (shell's core).
		 *
		 * @param {object.<string, function>|map} map - Map with the callbacks.
		 * @param {NaturalObject} map.windowArea - Area where the windows will be pushed and removed.
		 * @param {NaturalShell.Base.Context~hiddenWindowsCallback|function} map.hiddenWindowsCallback - Callback for windows.
		 * @param {NaturalShell.Base.Context~applicationsCallback|function} map.applicationsCallback - Callback for applications.
		 *
		 * @class Context
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.Context = function(map)
		{
			this.windowArea = map["windowArea"];
			this.hiddenWindowsCallback = map["hiddenWindowsCallback"];
			this.applicationsCallback = map["applicationsCallback"];
		};

		/**
		 * Gets the window area.
		 *
		 * @return {NaturalObject} Window area passed on the construction.
		 *
		 * @method NaturalShell.Base.Context.prototype.getWindowArea
		 */
		window.NaturalShell.Base.Context.prototype.getWindowArea = function()
		{
			return this.windowArea;
		};

		/**
		 * Gets the windows callback.
		 *
		 * @return {NaturalShell.Base.Context~hiddenWindowsCallback|function} Windows callback passed on construction.
		 *
		 * @method NaturalShell.Base.Context.prototype.getHiddenWindowsCallback
		 */
		window.NaturalShell.Base.Context.prototype.getHiddenWindowsCallback = function()
		{
			return this.hiddenWindowsCallback;
		};

		/**
		 * Gets the applications callback.
		 *
		 * @return {NaturalShell.Base.Context~applicationsCallback|function} Applications callback passed on construction.
		 *
		 * @method NaturalShell.Base.Context.prototype.getApplicationsCallback
		 */
		window.NaturalShell.Base.Context.prototype.getApplicationsCallback = function()
		{
			return this.applicationsCallback;
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

