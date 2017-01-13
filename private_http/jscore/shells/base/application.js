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

		window.NaturalShell.Base.Application = function(ctx, ws)
		{
			this.appdata = {
				"applicationName": "(null)",
				"applicationID": "(null)",
				"namespace": "(null)",
				"instanceID": 0
			};
			this.windowSystem = ws;
			this.context = ctx;

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

		window.NaturalShell.Base.Application.prototype.setMetadataIcon = function(x)
		{
			this.metadata.icon = x.toString();
		};

		window.NaturalShell.Base.Application.prototype.setMetadataCategory = function(x)
		{
			this.metadata.category = x.toString();
		};

		window.NaturalShell.Base.Application.prototype.setMetadataGenericName = function(x)
		{
			this.metadata.genericName = x.toString();
		};

		window.NaturalShell.Base.Application.prototype.setMetadataComment = function(x)
		{
			this.metadata.comment = x.toString();
		};

		window.NaturalShell.Base.Application.prototype.setMetadataGraphical = function(x)
		{
			this.metadata.graphical = x === true;
		};

		window.NaturalShell.Base.Application.prototype.setMetadataShowInShell = function(x)
		{
			this.metadata.showInShell = x === true;
		};

		window.NaturalShell.Base.Application.prototype.getMetadata = function(x)
		{
			return this.metadata;
		};

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

		window.NaturalShell.Base.Application.prototype.getName = function()
		{
			return this.appdata.applicationName;
		};

		window.NaturalShell.Base.Application.prototype.getID = function()
		{
			return this.appdata.applicationID;
		};

		window.NaturalShell.Base.Application.prototype.getNamespace = function()
		{
			return this.appdata.namespace;
		};

		window.NaturalShell.Base.Application.prototype.validateName = function(name)
		{
			// Names are always valid.
			return true;
		};

		window.NaturalShell.Base.Application.prototype.validateID = function(id)
		{
			// Format:
			/// [a-z]+(\.[a-zA-Z0-9_]+){2,}

			return /^[a-z]+(\.[a-zA-Z0-9_]+){2,}$/.test(id);
		};

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

		window.NaturalShell.Base.Application.prototype.registerApplication = function()
		{
			(this.context.getApplicationsCallback())("application.register", this);
		};

		window.NaturalShell.Base.Application.prototype.getContext = function()
		{
			return this.context;
		};

		window.NaturalShell.Base.Application.prototype.getWindowSystem = function()
		{
			return this.windowSystem;
		};

		window.NaturalShell.Base.Application.prototype.run = function(args)
		{
			// Abstract method!
			/// Runs the current application. For get an usable appdata,
			/// use the this.createInstance method. args is an array of
			/// objects containing the arguments passed to this app.
			/// Generally, args only have strings but some apps support other
			/// types: NFiles support the ["--call-on-open", <function>]
			/// but if you don't specify any other arg type, the standard says
			/// that args will be an array of only strings.
			///
			/// The returned object of this function (undefined will be converted
			/// to null) will be passed to the caller, this function may return
			/// simple objects (integers (standard), reals, functions, etc) or
			/// objects (only maps (JSON-like objects) are supported).
			///
			/// In Brief: args = array<string (recommended)|function|JSONLikeObject|number>
			/// return value = <integer (recommended)|number|function|JSONLikeObject>
			///
			/// You can return or accept in args complex objects (like Windows or other)
			/// but this is not standard.
			///
			/// Return values (standard):
			/// - 0: Successful return case.
			/// - 1: An error occurs.
			/// - 2: An interrupt/signal/unhandled exception occurs.
			/// - (3, 255): User-defined.
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

