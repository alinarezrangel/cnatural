/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment.
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
		/**
		 * Main namespace for all shell related things.
		 *
		 * In modules and applications is named `window.NaturalShell` instead.
		 *
		 * @namespace NaturalShell
		 */
		window.NaturalShell = window.NaturalShell || {};

		/**
		 * The core shell. Is for API definition only.
		 *
		 * @namespace Base
		 * @memberof NaturalShell
		 */
		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * The Current Shell used:
		 *
		 * @namespace CurrentShell
		 * @memberof NaturalShell
		 */
		window.NaturalShell.CurrentShell = window.NaturalShell.CurrentShell || {};

		/**
		 * The current shell's metadata.
		 *
		 * @var {object} NaturalShell.CurrentShell.Metadata
		 *
		 * @property {string} Name - Name of the shell
		 * @property {string} Version - Version of the shell
		 * @property {string} Type - Type of the shell
		 * @property {string} Supports - Supported servers and browsers
		 * @property {string} UsedWindow - Used window
		 * @property {string} UsedWindowManager - Used window manager
		 * @property {string} UsedWindowSystem - Used window system
		 * @property {string} UsedWindowStyle - Used window style
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.Metadata = window.NaturalShell.CurrentShell.Metadata || {};

		/**
		 * Registers a new application.
		 *
		 * The function should have two arguments: a `window` object and a `document`
		 * object. The returned value of the function should be the `Application` class
		 * child.
		 *
		 * @param {function} fcn - function with the app definition.
		 *
		 * @function RegisterApplication
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.RegisterApplication = function(fcn)
		{
			return;
		};

		/**
		 * Gets an application by it's ID.
		 *
		 * If no application with the specified ID was registered, returns null.
		 *
		 * @param {NaturalShell.Base.ApplicationID} id - The ID of the app to search.
		 *
		 * @return {NaturalShell.Base.Application} Application with the ID `id`, or null.
		 *
		 * @function GetApplication
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetApplication = function(id)
		{
			return null;
		};

		/**
		 * Launchs an application.
		 *
		 * @param {NaturalShell.Base.ApplicationID} id - The ID of the app to launch.
		 * @param {array|string[]} args - The argument list.
		 *
		 * @return {number.integer|number} The app return value.
		 *
		 * @function LaunchApplication
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.LaunchApplication = function(id, args)
		{
			return null;
		};

		/**
		 * Gets a list of all application.
		 *
		 * @return {array|NaturalShell.Base.Application[]} Array of all application.
		 *
		 * @function GetAllApplications
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetAllApplications = function()
		{
			return [];
		};

		/**
		 * Gets a short-name argument.
		 *
		 * A short name argument is of the form `["-[arg]", "[value]"]`.
		 *
		 * @param {string[]|array} args - the argument list.
		 * @param {string} argname - the argument name.
		 *
		 * @return {string} The argument value or null.
		 *
		 * @function GetShortNameArgument
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetShortNameArgument = function(args, argname)
		{
			for(var i = 0; i < args.length; i++)
			{
				if(args[i] == argname)
				{
					return args[i + 1] || null;
				}
			}

			return null;
		};

		/**
		 * Gets a long name argument.
		 *
		 * A long name argument is of the form `["--[name]=[value]"]`.
		 *
		 * @param {string[]|array} args - the argument list.
		 * @param {string} argname - the argument name.
		 *
		 * @return {string} The argument name or null.
		 *
		 * @function GetLongNameArgument
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetLongNameArgument = function(args, argname)
		{
			for(var i = 0; i < args.length; i++)
			{
				if(args[i].startsWith(argname + "="))
				{
					return args[i].split("=").slice(1).join("=");
				}
			}

			return null;
		};

		/**
		 * Gets an argument flag.
		 *
		 * The argument flag is of the form `"-[name]"` or `"--[name]"`.
		 *
		 * @param {string[]|array} args - the argument list.
		 * @param {string} argname - the flag name.
		 *
		 * @return {boolean} true if the flag is in the list or false otherwise.
		 *
		 * @function GetLongNameFlagArgument
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetLongNameFlagArgument = function(args, argname)
		{
			for(var i = 0; i < args.length; i++)
			{
				if(args[i] == argname)
				{
					return true;
				}
			}

			return false;
		};

		/**
		 * Gets an argument flag (alias of {@link NaturalShell.CurrentShell.GetLongNameFlagArgument}).
		 *
		 * The argument flag is of the form `"-[name]"` or `"--[name]"`.
		 *
		 * @param {string[]|array} args - the argument list.
		 * @param {string} argname - the flag name.
		 *
		 * @return {boolean} true if the flag is in the list or false otherwise.
		 *
		 * @function GetShortNameFlagArgument
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetShortNameFlagArgument =
			window.NaturalShell.CurrentShell.GetLongNameFlagArgument;

		/**
		 * Shows a desktop notification (DN).
		 *
		 * there is not warranty about the Desktop Notification will be showed,
		 * only warranties that the shell will know about that.
		 *
		 * The default images for DNs are installed on `/resources/images/cards/`.
		 *
		 * @param {string} title - Title of the DN.
		 * @param {string} message - The message of the DN.
		 * @param {function} event_activated - A callback that will be called without arguments if the DN is activated.
		 * @param {NaturalShell.Base.URLPath} opt_image_url? - Image of the DN.
		 *
		 * @function ShowDesktopNotification
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.ShowDesktopNotification =
			function(title, message, event_activated, opt_image_url)
		{
			return;
		};

		/**
		 * Gets all desktop notifications.
		 *
		 * Each object in the array is of the form:
		 *
		 * * `title`: DN's title.
		 * * `description`: DN's message.
		 * * `event_activated`: DN's event activated.
		 * * `image_url`: DN's image url.
		 *
		 * @return {array.<object>|array} An array of all DN on the stack.
		 *
		 * @function GetDesktopNotifications
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.GetDesktopNotifications = function()
		{
			return [];
		};

		/**
		 * Mark all DNs as viewed by the user.
		 *
		 * @function AllNotificationsViewed
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.AllNotificationsViewed = function()
		{
			return;
		};

		/**
		 * Removes the DN at a specified index.
		 *
		 * The index should be a valid index between 0 (inclusive) and the
		 * number of DNs (length of the array result of
		 * {@link NaturalShell.CurrentShell.GetDesktopNotifications}).
		 *
		 * @param {number.integer|number} at - The valid index of the DN to remove.
		 *
		 * @function RemoveDesktopNotification
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.RemoveDesktopNotification = function(at)
		{
			return;
		};

		/**
		 * Adds the event listener to the DN events.
		 *
		 * When a DN is added, this event listened will be called.
		 *
		 * @param {eventlistener|callback|function} ev - The event listener.
		 *
		 * @function ReceiveDesktopNotifications
		 *
		 * @memberof NaturalShell.CurrentShell
		 */
		window.NaturalShell.CurrentShell.ReceiveDesktopNotifications = function(ev)
		{
			//
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

