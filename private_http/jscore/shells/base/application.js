/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (application).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.ApplicationBase: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.Context === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Base.ApplicationBase: NaturalShell.Context is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * Is the data specific to any application.
		 *
		 * Minimal metadata used by all the windowed system.
		 *
		 * @typedef {object} ApplicationData
		 *
		 * @property {string} applicationName - The name of the application (without translate).
		 * @property {string} applicationID - The ID of the application.
		 * @property {string} namespace - The namespace of the application.
		 * @property {number} instanceID - ID of one instance of the application.
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * Is a metadata specific to any application.
		 *
		 * This is generally not used too much by the windowed system, except for the shell.
		 *
		 * @typedef {object} ApplicationMetadata
		 *
		 * @property {string} icon - Path to the icon of the application.
		 * @property {NaturalShell.Base.AppCategory} category - Category of the application (see table).
		 * @property {string} genericName - Application Name (can be translated).
		 * @property {string} onlyShowIn - Name off the client that this application supports.
		 * @property {string} comment - Short description of the application.
		 * @property {boolean} graphical - If the application is graphical.
		 * @property {boolean} showInShell - If the application should be listed in the launcher.
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * It's a valid URL path.
		 *
		 * The valid URL paths for icons are of the form:
		 *
		 * ```
		 * /resources/images/icons/...
		 * ```
		 *
		 * All non-preinstalled applications should have it's own folders.
		 *
		 * @typedef {string} URLPath
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * It's the category of an application.
		 *
		 * The valid categories are:
		 *
		 * | Category (string)   | Category         |
		 * | ------------------- | ---------------- |
		 * | "X-Any"             | Any              |
		 * | "System"            | System           |
		 * | "Accesories"        | Accesories       |
		 * | "Utilities"         | Utilities        |
		 * | "Math"              | Mathematics      |
		 * | "Sound"             | Sound            |
		 * | "Video"             | Video            |
		 * | "SoundVideo"        | Sound and Video  |
		 * | "Science"           | Science          |
		 * | "Education"         | Education        |
		 * | "UniversalAccs"     | Universal access |
		 * | "Electronics"       | Electronics      |
		 * | "Graphics"          | Graphics         |
		 * | "Design"            | Design           |
		 * | "Internet"          | Internet         |
		 * | "Games"             | Games            |
		 * | "Office"            | Office           |
		 * | "Programation"      | Programation     |
		 * | "Misc"              | Others           |
		 *
		 * @typedef {string} AppCategory
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * The name of an application.
		 *
		 * Generally, the application names does not have any specific format.
		 *
		 * @typedef {string} ApplicationName
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * The ID of an application.
		 *
		 * The application ID should be a string of the form:
		 *
		 * ```
		 * (org|com|net|...)\....
		 * For example:
		 * org.cnatural.applications.native.launcher
		 * com.google.daemons.keep_drive_updated
		 * net.sourceforge.applications.client
		 * ```
		 *
		 * @typedef {string} ApplicationID
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * The namespace (NS) of an application.
		 *
		 * The namespace should be a string of the form:
		 *
		 * ```
		 * \:?...
		 * For example:
		 * CNatural:Software:Applications:Desktop:Native:Builtins
		 * Intel:Hardware:Galileo:Gen1:Viewer
		 * Google:Software:Applications
		 * ```
		 *
		 * @typedef {string} ApplicationNS
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * The AppInstanceData (a.k.a. "appdata") is a set of data fields that
		 * uniquely identifies an instance of one application.
		 *
		 * This not only differentiates the instance from other instances of the
		 * same application, also can be used to see what application an instance
		 * is.
		 *
		 * Note that the `instanceID` only differs between instance of the **same**
		 * application, but `application*` and `namespace` are application
		 * dependend.
		 *
		 * @typedef {object} AppInstanceData
		 *
		 * @property {NaturalShell.Base.ApplicationName} applicationName - The name of the application that this instance is.
		 * @property {NaturalShell.Base.ApplicationID} applicationID - The ID of the application that this instance is.
		 * @property {NaturalShell.Base.ApplicationNS} namespace - The namespace of the application that this instance is.
		 * @property {number.integer|number} instanceID - The ID (numeric) of **this** instance in particular.
		 * @property {number.integer|number} windowID - The ID of the next created window.
		 * @property {boolean} mainWindowCreated - If a main window was created and associated with this instance.
		 * @property {NaturalShell.Base.Window} mainWindow - The main window associated with this instance (or null).
		 *
		 * @memberof NaturalShell.Base
		 */

		/**
		 * Abstraction of an application.
		 *
		 * @param {NaturalShell.Base.Context} ctx - Context to use.
		 * @param {NaturalShell.Base.WindowSystem} ws - Window System to use.
		 *
		 * @class Application
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.Application = function(ctx, ws)
		{
			/**
			 * Contains the application data.
			 *
			 * @member {NaturalShell.Base.ApplicationData} NaturalShell.Base.Application~appdata
			 * @protected
			 * @readonly
			 */
			this.appdata = {
				"applicationName": "(null)",
				"applicationID": "(null)",
				"namespace": "(null)",
				"instanceID": 0
			};
			this.windowSystem = ws;
			this.context = ctx;

			/**
			 * Contains the application metadata.
			 *
			 * @member {NaturalShell.Base.ApplicationMetadata} NaturalShell.Base.Application~metadata
			 * @protected
			 * @readonly
			 */
			this.metadata = {
				"icon": "/resources/images/icons/executable-icon.svg",
				"category": "X-Any",
				"genericName": "(null)",
				"onlyShowIn": "CNatural Client (Araguaney v0.0.1)",
				"comment": "(null)",
				"graphical": true,
				"showInShell": true
			};
		};

		/**
		 * Sets the icon of the application.
		 *
		 * By convension, all application icons are stored in
		 * `/resources/images/icons/` and have the name `[application name]-icon.svg`.
		 *
		 * @param {NaturalShell.Base.URLPath} x - Path to the icon.
		 *
		 * @method setMetadataIcon
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataIcon = function(x)
		{
			this.metadata.icon = x.toString();
		};

		/**
		 * Sets the category of the application.
		 *
		 * @param {NaturalShell.Base.AppCategory} x - Category.
		 *
		 * @method setMetadataCategory
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataCategory = function(x)
		{
			this.metadata.category = x.toString();
		};

		/**
		 * Sets the generic name of the application.
		 *
		 * The generic name is generally a translated-version of the appname.
		 *
		 * @param {string} x - Generic name.
		 *
		 * @method setMetadataGenericName
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataGenericName = function(x)
		{
			this.metadata.genericName = x.toString();
		};

		/**
		 * Sets the comment.
		 *
		 * The comment is a short description of the application. May be
		 * translated.
		 *
		 * @param {string} x - Comment.
		 *
		 * @method setMetadataComment
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataComment = function(x)
		{
			this.metadata.comment = x.toString();
		};

		/**
		 * Sets if the application is graphical.
		 *
		 * Any application that shows data on the screen is graphical.
		 *
		 * @param {boolean} x - If the app is graphical.
		 *
		 * @method setMetadataGraphical
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataGraphical = function(x)
		{
			this.metadata.graphical = x === true;
		};

		/**
		 * Sets if the application should be listed in the launcher.
		 *
		 * If is false, when the users opens a launcher to see all applications
		 * this application will not be listed.
		 *
		 * The launcher is responsive to follow or not this flag, some launchers
		 * may ignore this.
		 *
		 * @param {boolean} x - If the app should be listed in the shell.
		 *
		 * @method setMetadataShowInShell
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setMetadataShowInShell = function(x)
		{
			this.metadata.showInShell = x === true;
		};

		/**
		 * Gets the metdata.
		 *
		 * It's readonly, for change the metadata use any of the setters methods.
		 *
		 * @return {NaturalShell.Base.ApplicationMetadata} Application metadata.
		 *
		 * @method getMetadata
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getMetadata = function()
		{
			return this.metadata;
		};

		/**
		 * Sets the application name.
		 *
		 * Should be a string without any specific format.
		 *
		 * @param {NaturalShell.Base.ApplicationName} name - New appname.
		 *
		 * @throws {Error} If the name is invalid, throws an error (not used).
		 *
		 * @method setName
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setName = function(name)
		{
			if(this.validateName(name))
			{
				this.appdata.applicationName = name;
			}
			else
			{
				throw new Error("Error at CNatural.JS.Desktop.Base.ApplicationBase: setName: The name <" + name + "> is invalid");
			}
		};

		/**
		 * Sets the application ID.
		 *
		 * @param {NaturalShell.Base.ApplicationID} id - New appid.
		 *
		 * @throws {Error} If the ID is invalid, throws an error.
		 *
		 * @method setID
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setID = function(id)
		{
			if(this.validateID(id))
			{
				this.appdata.applicationID = id;
			}
			else
			{
				throw new Error("Error at CNatural.JS.Desktop.Base.ApplicationBase: setID: The ID <" + id + "> is invalid");
			}
		};

		/**
		 * Sets the application namespace.
		 *
		 * The namespace will be used to classify the application, and
		 * should not contain the application name.
		 *
		 * @param {NaturalShell.Base.ApplicationNS} ns - New appns.
		 *
		 * @throws {Error} If the namespace is invalid, throws an error.
		 *
		 * @method setNamespace
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.setNamespace = function(ns)
		{
			if(this.validateNamespace(ns))
			{
				this.appdata.namespace = ns;
			}
			else
			{
				throw new Error("Error at CNatural.JS.Desktop.Base.ApplicationBase: setNamespace: The namespace <" + ns + "> is invalid");
			}
		};

		/**
		 * Gets the application name.
		 *
		 * @return {NaturalShell.Base.ApplicationName} The application name.
		 *
		 * @method getName
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getName = function()
		{
			return this.appdata.applicationName;
		};

		/**
		 * Gets the application ID.
		 *
		 * @return {NaturalShell.Base.ApplicationID} The application ID.
		 *
		 * @method getID
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getID = function()
		{
			return this.appdata.applicationID;
		};

		/**
		 * Gets the application namespace.
		 *
		 * @return {NaturalShell.Base.ApplicationNS} The application namespace.
		 *
		 * @method getNamespace
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getNamespace = function()
		{
			return this.appdata.namespace;
		};

		/**
		 * Validates a name.
		 *
		 * @param {string} name - The name to validate.
		 *
		 * @return {boolean} true if the name is valid, false otherwise.
		 *
		 * @method validateName
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.validateName = function(name)
		{
			// Names are always valid.
			return true;
		};

		/**
		 * Validates an ID.
		 *
		 * @param {string} id - The id to validate.
		 *
		 * @return {boolean} true if the ID is valid and false otherwise.
		 *
		 * @method validateID
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.validateID = function(id)
		{
			// Format:
			/// [a-z]+(\.[a-zA-Z0-9_]+){2,}

			return /^[a-z]+(\.[a-zA-Z0-9_]+){2,}$/.test(id);
		};

		/**
		 * Validates a namespace.
		 *
		 * @param {string} ns - The namespace to validate.
		 *
		 * @return {boolean} true if the namespace if valid, false otherwise.
		 *
		 * @method validateNamespace
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.validateNamespace = function(ns)
		{
			// Format:
			/// _*[a-z][a-zA-Z0-9_:]*
			/// strlen(id) > 4
			/// The reserved NSs are:
			/// - All that begins with ":"
			/// - :Example:
			/// - :System:
			/// - :Shell:
			/// - :Manual:

			return /^\:?[a-zA-Z0-9_]+\:[a-zA-Z0-9_:]*$/.test(ns);
		};

		/**
		 * Creates an instance of this application.
		 *
		 * The returned AppInstanceData is required by other classes to work.
		 *
		 * @return {NaturalShell.Base.AppInstanceData} An instance data.
		 *
		 * @method createInstance
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.createInstance = function()
		{
			var cp = {
				"applicationName": this.appdata.applicationName,
				"applicationID": this.appdata.applicationID,
				"namespace": this.appdata.namespace,
				"instanceID": this.appdata.instanceID++,
				"windowID": 0,
				"mainWindowCreated": false,
				"mainWindow": null
			};

			return cp;
		};

		/**
		 * Registers this application.
		 *
		 * It's called by the shell automaticly, so you never will need this function.
		 *
		 * @method registerApplication
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.registerApplication = function()
		{
			(this.context.getApplicationsCallback())("application.register", this);
		};

		/**
		 * Gets the window context.
		 *
		 * @return {NaturalShell.Base.Context} Window's context.
		 *
		 * @method getContext
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getContext = function()
		{
			return this.context;
		};

		/**
		 * Gets the window system.
		 *
		 * From the window system you can get the window manager.
		 *
		 * @return {NaturalShell.Base.WindowSystem} The window's window system.
		 *
		 * @method getWindowSystem
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.getWindowSystem = function()
		{
			return this.windowSystem;
		};

		/**
		 * Runs the application.
		 *
		 * Each time that the shells needs to run the application calls this method.
		 *
		 * Note that only **one** application **instance** will be created at time,
		 * so you should not put all the app code in the constructor.
		 * 
		 * Runs the current application. For get an usable appdata,
		 * use the this.createInstance method. args is an array of
		 * objects containing the arguments passed to this app.
		 * Generally, args only have strings but some apps support other
		 * types: NFiles support the `["--call-on-open", <function>]`
		 * but if you don't specify any other arg type, the standard says
		 * that args will be an array of only strings.
		 *
		 * The returned object of this function (undefined will be converted
		 * to null) will be passed to the caller, this function may return
		 * simple objects (integers (standard), reals, functions, etc) or
		 * objects (only maps (JSON-like objects) are supported).
		 *
		 * In Brief: args = `array<string (recommended)|function|JSONLikeObject|number>`
		 * return value = `<integer (recommended)|number|function|JSONLikeObject>`
		 *
		 * You can return or accept in args complex objects (like Windows or other)
		 * but this is not standard.
		 *
		 * Return values (standard):
		 *
		 * - 0: Successful return case.
		 * - 1: An error occurs.
		 * - 2: An interrupt/signal/unhandled exception occurs.
		 * - (3, 255): User-defined.
		 *
		 * @param {string[]|Array.<string>|Array} args - Argument list.
		 *
		 * @return {number.integer|number} The return value.
		 *
		 * @abstract
		 * @method run
		 * @memberof NaturalShell.Base.Application.prototype
		 */
		window.NaturalShell.Base.Application.prototype.run = function(args)
		{
			return 0;
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

