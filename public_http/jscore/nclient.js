/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Declares the NaturalClient namespace and it's methods
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
			throw new Error("Error at CNatural.JS.Widgets.NClient: NaturalObject is undefined");
		}

		/**
		 * Contains all things related to the client of CNatural.
		 *
		 * In modules and applications is named `window.NaturalClient` instead.
		 *
		 * @see NaturalObject
		 * @see NaturalWidgets
		 * @see NaturalStorage
		 * @see NaturalShell
		 *
		 * @namespace NaturalClient
		 *
		 * @property {string} Name - Name of the client
		 * @property {string} Version - The version of the client in the form X.Y.Z.
		 * @property {string} Codename - Codename of the version.
		 * @property {Array} ReservedNames - An array of strings containing all global reserved names.
		 */

		window.NaturalClient = window.NaturalClient || {};

		// Metadata:

		// Name of the client
		window.NaturalClient.Name = "CNatural Client (Araguaney v0.0.1)";

		// Version of the client
		window.NaturalClient.Version = "0.0.1";

		// Codename of the client
		window.NaturalClient.Codename = "Araguaney";

		// JavaScript reserved name (non-exaustive list)
		window.NaturalClient.ReservedNames = [
			"$ntc",
			"$natural",
			"NaturalObject",
			"NaturalShell",
			"NaturalStorage",
			"NaturalWidgets",
			"NaturalClient"
		];

		/**
		 * Contains the metadata about the Generation CSS Framework used.
		 *
		 * @property {string} MinVersion - Minimal version guarranty to be used.
		 * @property {object} Object - The Generation Framework object (`window.Generation`).
		 * @property {Array} Palletes - A stringlist with all color palletes used.
		 *
		 * @memberof NaturalClient
		 * @namespace Generation
		 */

		window.NaturalClient.Generation = window.NaturalClient.Generation || {};

		// Minimal Generation Version supported
		window.NaturalClient.Generation.MinVersion = "1.1";

		// Generation Object
		window.NaturalClient.Generation.Object = window.Generation || null;

		// Generation Palletes
		window.NaturalClient.Generation.Palletes = [
			"default",
			"basics",
			"natural",
			"gui"
		];

		/**
		 * Contains all metadata related to the current HTML engine.
		 *
		 * @property {string} MinVersion - The minimal version of HTML supported.
		 * @property {boolean} CustomElementAPI - If the custom elements API is available.
		 * @property {boolean} ForceCustomElements - If you can emulate CustomElement by CSS and ignoring warnings.
		 *
		 * @memberof NaturalClient
		 * @namespace HTML
		 */

		window.NaturalClient.HTML = window.NaturalClient.HTML || {};

		// Minimal HTML Version supported
		window.NaturalClient.HTML.MinVersion = "5";

		// If the CustomElement API is available
		window.NaturalClient.HTML.CustomElementsAPI = false;

		// If you can use custom elements forcing a CSS and ignoring warnings
		window.NaturalClient.HTML.ForceCustomElements = true;

		/**
		 * Contains all thing about the JavaScript engine.
		 *
		 * @property {string} MinVersion - Minimal version supported.
		 * @property {boolean} BrowserMode - If is running on a browser.
		 *
		 * @memberof NaturalClient
		 * @namespace JavaScript
		 */

		window.NaturalClient.JavaScript = window.NaturalClient.JavaScript || {};

		// Minimal JavaScript Version supported
		window.NaturalClient.JavaScript.MinVersion = "5";

		// If is running on a browser
		window.NaturalClient.JavaScript.BrowserMode = true;

		/**
		 * Contains all things related to the API protocol.
		 *
		 * @property {string} Version - Version of the protocol in X.Y.Z form.
		 * @property {string} Type - Type of the protocol, by default "AJAX-based".
		 * @property {boolean} CSPEnabled - If the CSP is enabled.
		 *
		 * @memberof NaturalClient
		 * @namespace Protocol
		 */

		window.NaturalClient.Protocol = window.NaturalClient.Protocol || {};

		// CNatural AJAX Protocol Version
		window.NaturalClient.Protocol.Version = "0.0.1";

		// CNatural AJAX Protocol Type
		window.NaturalClient.Protocol.Type = "AJAX-based";

		// CNatural AJAX Protocol CSP enabled
		window.NaturalClient.Protocol.CSPEnabled = true;

		/**
		 * Is an enum with all application types.
		 *
		 * @property {unespecified} GENERAL - An application (can be uninstalled).
		 * @property {unespecified} BUILTIN - A preinstalled, CNatural-specific application (cannot be uninstalled).
		 * @property {unespecified} SHELLNTV - A shell's application (cannot be uninstalled).
		 *
		 * @memberof NaturalClient
		 * @name ApplicationType
		 */
		window.NaturalClient.ApplicationType = window.NaturalClient.ApplicationType || {};

		window.NaturalClient.ApplicationType.GENERAL = 0x01;
		window.NaturalClient.ApplicationType.BUILTIN = 0x02;
		window.NaturalClient.ApplicationType.SHELLNTV = 0x04;

		/**
		 * Callback for {@link NaturalClient.GetToken}.
		 *
		 * @callback NaturalClient~GetTokenCallback
		 *
		 * @param {Error} err - Error getting the token (or null).
		 * @param {string} token - User token (or undefined).
		 */

		/**
		 * Callback for {@link NaturalClient.GetApplicationResource}.
		 *
		 * @callback NaturalClient~GetApplicationResourceCallback
		 *
		 * @param {Error} err - Error getting the resource (or null).
		 * @param {opaque_type|string} resc - The resource file handler or content (or undefined).
		 */

		/**
		 * Gets the current user auth token.
		 *
		 * This token may be used for API calls purposes.
		 *
		 * @param {NaturalClient~GetTokenCallback} cll - Callback to be called when the token is getted
		 *
		 * @function GetToken
		 * @memberof NaturalClient
		 */
		window.NaturalClient.GetToken = function(cll)
		{
			var st = $natural.getStorage();

			st.open("CNatural.JS.Storage.Core", (err) =>
			{
				if(err)
				{
					return cll(err);
				}

				st.get("authtoken", (err, value) =>
				{
					if(err)
					{
						return cll(err);
					}

					st.close((err) =>
					{
						if(err)
						{
							return cll(err);
						}

						return cll(null, value);
					});
				});
			});
		};

		/**
		 * Callback for {@link NaturalClient.APIRequest}.
		 *
		 * @callback NaturalClient~APIRequestCallback
		 *
		 * @param {Error} err - The API Request error (or null).
		 * @param {string|AJAXResponseText} res - The API response text (or undefined).
		 */

		/**
		 * Makes an API request to the server.
		 *
		 * Generally, it's required in some argument the user auth token. You can
		 * get it using {@link NaturalClient.GetToken}.
		 *
		 * @param {string} method - Method to be called (for example, `coreutils.time.get`).
		 * @param {map|object} args - Map with all arguments to be passed to the method.
		 * @param {NaturalClient~APIRequestCallback} cll - Callback to be called with the method result.
		 *
		 * @function APIRequest
		 * @memberof NaturalClient
		 */
		window.NaturalClient.APIRequest = function(method, args, cll)
		{
			$natural.ajax({
				url: "/api/ajax/" + method.replace(".", "/"),
				args: {},
				pdata: args,
				async: true
			}, function(err, res)
			{
				return cll(err, res);
			});
		};

		/**
		 * Converts a server-side time string to a `Date` parseable string.
		 *
		 * When using the CNatural `coreutils.time.get` method it will returns
		 * a string of the form `dd-mm-yyThh:nn:ss.00Z` instead of a Date-parseable
		 * string.
		 *
		 * The correct usage of this function is
		 * `new Date(ConvertServerTime(servertimestring))`.
		 *
		 * @param {string} str - The server-formatted time string.
		 * @return {string} The locally adapted time string.
		 *
		 * @function ConvertServerTime
		 * @memberof NaturalClient
		 */
		window.NaturalClient.ConvertServerTime = function(str)
		{
			var dt = new Date(str);

			if(!isNaN(dt.getDate()))
				return str;

			str = str.replace("T", " ").replace(".00Z", "");
			dt = new Date(str);

			if(!isNaN(dt.getDate()))
				return str;

			throw new Error("Invalid argument time str: format not detected");
		};

		/**
		 * Gets some file from the application's resources directory.
		 *
		 * The apps resources dirs are:
		 *
		 * - For shell specific apps: `private_http/jscore/apps/$SHELL_NAME/$APP_NAME/`.
		 * - For general, CNatural preinstalled apps: `private_http/jscore/apps/base/$APP_NAME/`.
		 * - For all other apps: `$CNATURAL_RC_PATH/share/$APP_NAME/resources/`.
		 *
		 * You need to specify what kind of application is, most user will only use
		 * `NaturalClient.ApplicationType.GENERAL`.
		 *
		 * **Note**: this function uses the {@link NaturalShell.CurrentShell} namespace,
		 * because the NaturalClient namespace cannot verify it's existence, you will
		 * need to make sure that the {@link NaturalShell.CurrentShell} namespace exists
		 * **before** calling this function. In most cases, an application registered
		 * using the standard APIs (see {@link NaturalShell.CurrentShell.RegisterApplication})
		 * will not need to verify this (because the function `RegisterApplication`
		 * verifies this), but some non-standard APIs will not verify this.
		 *
		 * If the argument `sz` is `true`, the file optimization will be activated.
		 * The file optimization will query a file handler instead of the full file
		 * contents, making the request faster and more efficient. For small text
		 * files, this will increase the complexity of the program, but for large
		 * files is recommended. When the optimization is enabled, the callback will
		 * called with a *file handler* of type {@link NaturalClient.BasicIO.FileStream},
		 * but when is disabled, the callback will be called with an opaque object
		 * containing the entire file contents. If you want to use both, try with
		 * the function {@link NaturalClient.BasicIO.streamify} on the resource
		 * handler.
		 *
		 * @param {string} rspath - A valid path inside the resources directory.
		 * @param {NaturalShell.Base.ApplicationData} appid - The data of the application.
		 * @param {NaturalClient.ApplicationType} type - The type of the application.
		 * @param {NaturalClient.BooleanFileSize} sz - `true` if the file optimization should be used.
		 * @param {NaturalClient~GetApplicationResourceCallback} cll - A callback, will
		 * be called when the resource is ready to be used.
		 *
		 * @function GetApplicationResource
		 * @memberof NaturalClient
		 */
		window.NaturalClient.GetApplicationResource = function(rspath, appdata, type, cll)
		{
			var pth = "";
			var appid = appdata.applicationID;

			switch(type)
			{
				case window.NaturalClient.ApplicationType.BUILTIN:
					pth = "private_http/jscore/apps/base/" + appid + "/";
					break;
				case window.NaturalClient.ApplicationType.SHELLNTV:
					pth = "private_http/jscore/apps/" +
						window.NaturalShell.CurrentShell.Source +
						"/" + appid + "/";
					break;
				case window.NaturalClient.ApplicationType.GENERAL:
					pth = "$CNATURAL_RC_PATH/share/" + appid + "/";
					break;
			}

			pth += rspath;

			// Now read the file and return the handler

			/*
			// The method basicio.file.open does not exist yet, use a fake call
			window.NaturalClient.APIRequest(sz? "basicio.file.open" : "coreutils.import", {
				//
			}, function(err, res)
			{
				//
			});
			*/

			return cll(null, 0);
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
