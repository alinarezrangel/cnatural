/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Manages includes and HTML-inlined data.
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
			throw new Error("Error at CNatural.JS.Core.CData: NaturalObject is undefined");
		}

		/**
		 * Callback for {@link NaturalObject~require}.
		 *
		 * @callback NaturalObject~requireCallback
		 *
		 * @param {NaturalObject} nc - `<script>` element containing the URL pointer to the required code.
		 */

		/**
		 * Callback for {@link NaturalObject~parseSemanticIconsetTags}.
		 *
		 * @callback NaturalObject~parseSemanticIconsetTagsCallback
		 *
		 * @param {NaturalObject} tag - Tag that recently was translated.
		 */

		/**
		 * Callback for {@link NaturalObject~include}.
		 *
		 * @callback NaturalObject~includeCallback
		 *
		 * @param {Error} err - Import error (may be null).
		 * @param {NaturalObject} node - HTML Root node of the inserted fragment (or undefined).
		 */

		/**
		 * Callback for {@link NaturalObject~includeScripts}.
		 *
		 * @callback NaturalObject~includeScriptsCallback
		 *
		 * @param {NaturalObject} tag - HTML includetag that was finished to include.
		 */

		/**
		 * Maps a semantic icon name to a real icon set character.
		 *
		 * @type {object.<string, string>|map}
		 *
		 * @member NaturalObject.prototype.NaturalIconSetMap
		 */
		window.NaturalObject.prototype.NaturalIconSetMap = {
			"times": "a",
			"close": "a",
			"plus": "b",
			"add": "b",
			"menu": "c",
			"bars": "c",
			"minimize": "d",
			"floor": "d",
			"unmaximize": "e",
			"maximize": "f",
			"unminimize": "g",
			"left": "h",
			"back": "h",
			"right": "i",
			"next": "i",
			"top": "j",
			"up": "j",
			"bottom": "k",
			"down": "k",
			"points-left": "l",
			"arrow-left": "l",
			"points-right": "m",
			"arrow-right": "m",
			"points-top": "n",
			"arrow-top": "n",
			"points-bottom": "ñ",
			"arrow-bottom": "ñ",
			"see": "o",
			"view": "o",
			"no-see": "p",
			"no-view": "p",
			"info-stamp": "q",
			"info-rect": "r",
			"info": "s",
			"warning": "t",
			"apps": "u",
			"applications": "u",
			"home": "v",
			"reload": "w",
			"swap": "x",
			"exchange": "x",
			"papers": "x",
			"windows": "x",
			"stack": "x",
			"minus": "y",
			"by": "z",
			"percent": "A",
			"permil": "B",
			"text": "C",
			"notify": "D",
			"power": "E",
			"alert": "F",
			"fullscreen": "G",
			"user": "H",
			"tools": "I",
			"connection": "J"
		};

		/**
		 * Contains the current language as string.
		 *
		 * @type {string}
		 *
		 * @member NaturalObject.prototype.Localization
		 */
		window.NaturalObject.prototype.Localization =
			window.navigator.userLanguage || window.navigator.language || "en-all";

		/**
		 * Contains the currently supported languages.
		 *
		 * @type {Array|string[]}
		 *
		 * @member NaturalObject.prototype.GlobalPOMapSupportedLangs
		 */
		window.NaturalObject.prototype.GlobalPOMapSupportedLangs =
		[
			// NOTE: Basic CNatural builtins GUI localization:
			"en",
			"en-all",
			"es",
			"es-all"
		];

		/**
		 * Contains the current global POMap.
		 *
		 * A POMap maps a universal message to a locale-specific message.
		 *
		 * @type {object|POMapSubLG}
		 *
		 * @member NaturalObject.prototype.GlobalPOMap
		 */
		window.NaturalObject.prototype.GlobalPOMap =
		{
			// NOTE: Basic CNatural builtins GUI localization:
			"es": {
				"all": {
					"welcomettl": "CNatural",
					"click2use": "Bienvenido! clickea cualquier parte para iniciar sesión",
					"login": "Iniciar sesión",
					"loginbtn": "Iniciar sesión!",
					"nativedtkdsc": "Un escritorio simple y responsable diseñado para todos",
					"click2usedtk": "Clickea para usar",
					"loginwindow_ttl": "Iniciando sesión...",
					"loginwindow_desc": "CNatural está iniciando sesión, por favor espere...",
					"errorwindow_ttl": "Esto es malo!",
					"errorwindow_desc": "Hubo un error iniciando sesión, intente con"
						+ "verificar la contraseña o el nombre de usuario",
					"welcome_ttl": "Bienvenido a CNatural",
					"welcome_desc": "Puedes obtener ayuda en cnatural.sourceforge.io"
				}
			},
			"en": {
				"all": {
					"welcomettl": "CNatural",
					"click2use": "Welcome! click in any place to login",
					"login": "Login",
					"loginbtn": "Login!",
					"nativedtkdsc": "A simple and responsive desktop maded for everybody",
					"click2usedtk": "Click to use",
					"loginwindow_ttl": "Login...",
					"loginwindow_desc": "CNatural is login you, please wait...",
					"errorwindow_ttl": "This is bad!",
					"errorwindow_desc": "There was an error login you, try"
						+ "checking the password or username",
					"welcome_ttl": "Welcome to CNatural",
					"welcome_desc": "You can get help on cnatural.sourceforge.io"
				}
			}
		};

		/**
		 * Selects a POMap using a language.
		 *
		 * The POMap is selected from a POMapSubLG list.
		 *
		 * @param {POMapSubLG} pomap - Sublanguage list to search.
		 * @param {string} lang - Language code to use.
		 *
		 * @return {POMap} A POMap that uses lang as language.
		 *
		 * @method NaturalObject.prototype.selectPOMapIn
		 */
		window.NaturalObject.prototype.selectPOMapIn = function(pomap, lang)
		{
			var lg = lang.split("-")[0];
			var sg = lang.split("-")[1];

			var localmap = {};
			var sgmap = {};

			if(typeof pomap[lg] === "undefined")
			{
				// No language is available, keep default messages
				return null;
			}

			localmap = pomap[lg];

			if(typeof localmap[sg] === "undefined")
			{
				// No sublanguage is available, use default language msgs
				sgmap = localmap["all"];
			}
			else
			{
				sgmap = localmap[sg];
			}

			return sgmap;
		};

		/**
		 * Selects a message from a POMapSubLG.
		 *
		 * @param {string} msg - Message to search.
		 * @param {POMapSubLG} pomap - POMapSubLG where search.
		 * @param {string} lang - Language to use.
		 *
		 * @return {string} Message msg in the language.
		 *
		 *
		 * @method NaturalObject.prototype.selectMessagePOMapIn
		 */
		window.NaturalObject.prototype.selectMessagePOMapIn = function(msg, pomap, lang)
		{
			var sgmap = this.selectPOMapIn(pomap, lang);

			var vl = sgmap[msg];

			if(typeof vl === "undefined")
			{
				// Message not fount: switching!
				vl = localmap["all"][msg];

				if(typeof vl === "undefined")
				{
					// No available in allmap? keep default
					return null;
				}
			}

			return vl;
		};

		/**
		 * Imports a JavaScript code.
		 *
		 * Note that not specifing a token (token = null) but setting the path as
		 * private (isprivate = true) is illegal and will throw an exception.
		 *
		 * If no callback is provided, the last event handler will be used (setted
		 * using {@link NaturalObject~attach} or similar).
		 *
		 * If `isprivate` is not specified it's defaults to false.
		 *
		 * @param {boolean} async - If the JavaScript code should load asynchronus.
		 * @param {string} path - Path to the JavaScript resource.
		 * @param {string} token - User auth token (or null).
		 * @param {boolean} [isprivate=false] - If the resource is in private path.
		 * @param {NaturalObject~requireCallback} [cll] - Callback called when the code is ready.
		 *
		 * @method NaturalObject.prototype.require
		 */
		window.NaturalObject.prototype.require = function(async, path, token, isprivate, cll)
		{
			isprivate = (typeof isprivate === "boolean")? isprivate : false;
			cll = (typeof cll === "function")? (this._callbackLastRef = cll) : this._callbackLastRef;

			if((typeof token === "undefined") || (token === null))
			{
				if(isprivate)
				{
					throw new Error(
						"Error at CNatural.JS.Core.CData: require: The module is in private area but the token is undefined or null"
					);
				}

				token = "";
			}

			if(isprivate)
			{
				var sc = document.createElement("script");
				sc.src = "/api/private/" + token + "/" + path;

				sc.async = async;

				sc.addEventListener("load", () =>
				{
					cll(window.$ntc(sc));
				});

				window.$ntc(document.body).appendChild(window.$ntc(sc));
			}
			else
			{
				var sc = document.createElement("script");
				sc.src = "/" + path;

				sc.async = async;

				sc.addEventListener("load", () =>
				{
					cll(window.$ntc(sc));
				});

				window.$ntc(document.body).appendChild(window.$ntc(sc));
			}
		};

		/**
		 * Translates all semantic icons to it's mapped equivalents.
		 *
		 * A semantic icon like `tools` need to be translated to a
		 * single-char value like `I`. This translates all tags marked with
		 * `gui-font-iconset-v2`.
		 *
		 * @param {document} [doc=document] - Document to translate
		 * @param {NaturalObject~parseSemanticIconsetTagsCallback} [ondone] - Callback when all tags was translated.
		 *
		 * @method NaturalObject.prototype.parseSemanticIconsetTags
		 */
		window.NaturalObject.prototype.parseSemanticIconsetTags = function(doc, ondone)
		{
			ondone = ondone || function(x) {};

			if(typeof doc === "undefined")
			{
				doc = document;
			}

			var tags = window.$ntc("*.gui-font-iconset-v2");
			tags.apply((tag) =>
			{
				var text = tag.original.textContent.replace(/\t|\n|\r| /gmi, "");

				while(tag.original.firstChild)
					tag.original.removeChild(tag.original.firstChild);

				tag.original.appendChild(document.createTextNode(this.NaturalIconSetMap[text]));

				tag.removeClass("gui-font-iconset-v2").addClass("gui-font-iconset-v1");

				tag.attr("aria-hidden", "true");

				ondone(tag);
			}).forEach();
		};

		/**
		 * Gets a PO message from the current language and Global POMap.
		 *
		 * @param {string} msg - Message to translate.
		 *
		 * @return {string} Message translated.
		 *
		 * @method NaturalObject.prototype.getPOMessage
		 */
		window.NaturalObject.prototype.getPOMessage = function(msg)
		{
			return this.selectMessagePOMapIn(msg, this.GlobalPOMap, this.Localization);
		};

		/**
		 * Translates all client's GUI.
		 *
		 * Uses the global POMap.
		 *
		 * @param {document} [doc=document] - Document to translate.
		 *
		 * @method NaturalObject.prototype.parsePOMaps
		 */
		window.NaturalObject.prototype.parsePOMaps = function(doc)
		{
			if(typeof doc === "undefined")
			{
				doc = document;
			}

			var sgmap = this.selectPOMapIn(this.GlobalPOMap, this.Localization);

			var tags = window.$ntc("*[data-pomap-message]");
			tags.apply((tag) =>
			{
				var msname = tag.data("pomapMessage");
				var o = tag.original;
				var vl = sgmap[msname];

				if(typeof vl === "undefined")
				{
					// Message not fount: switching!
					vl = localmap["all"][msname];

					if(typeof vl === "undefined")
					{
						// No available in allmap? keep default
						return;
					}
				}

				while(o.firstChild)
					o.removeChild(o.firstChild);

				o.appendChild(document.createTextNode(vl));
			}).forEach();
		};

		/**
		 * Includes a fragment of HTML from a private resource.
		 *
		 * @param {string} token - Token to use.
		 * @param {string} src - Private path to the resource.
		 * @param {string} mime - Expected MIME-type of the resource.
		 * @param {NaturalObject~includeCallback} callback - Callback to be called when the import is done.
		 *
		 * @method NaturalObject.prototype.include
		 */
		window.NaturalObject.prototype.include = function(token, src, mime, callback)
		{
			this.ajax({
				url: "/api/ajax/coreutils/import",
				args: {},
				pdata: {
					file: src,
					type: "include",
					expected: mime,
					token: token
				},
				async: true
			}, (err, res) =>
			{
				if(err)
				{
					callback(new Event("scriptLoadError"));
					return;
				}

				var dm = new DOMParser();
				var dc = dm.parseFromString(res, "text/html");
				window.$ntc(dc.body.childNodes).apply((node) =>
				{
					this.appendChild(node);
				}).forEach();
				callback(null, window.$ntc(dc));
			});

			this.parseSemanticIconsetTags(document, function(s) {});
			this.parsePOMaps(document);
		};

		/**
		 * Includes all scripts embed on `div[data-widget="include"]` tags.
		 *
		 * More, calls some utility functions.
		 *
		 * @param {document} [doc=document] - Document to parse.
		 * @param {string} token - The user auth token.
		 * @param {NaturalObject~includeScriptsCallback} [ondone] - Callback called when the parsing is finished.
		 *
		 * @method NaturalObject.prototype.includeScripts
		 */
		window.NaturalObject.prototype.includeScripts = function(doc, token, ondone)
		{
			ondone = ondone || function(x) {};

			if(typeof doc === "undefined")
			{
				doc = document;
			}

			var ax = false;

			var tags = window.$ntc("*[data-widget=\"script\"]");
			tags.apply((script) =>
			{
				var src = script.data("src");
				var mime = script.data("mime");
				var obj = script.data("object");
				var tp = script.data("type");

				if(tp == "javascript")
				{
					var sc = document.createElement("script");
					sc.src = "/api/private/" + token + "/" + src;

					sc.addEventListener("load", () =>
					{
						ondone(script);
					});

					window.$ntc(script.original.parentNode).appendChild(window.$ntc(sc));

					return;
				}

				this.ajax({
					url: "/api/ajax/coreutils/import",
					args: {},
					pdata: {
						file: src,
						type: "include",
						expected: mime,
						token: token
					},
					async: true
				}, (err, res) =>
				{
					if(err)
					{
						script.original.dispatchEvent(new Event("scriptLoadError"));
						return;
					}

					if(tp == "html")
					{
						var dm = new DOMParser();
						var dc = dm.parseFromString(res, "text/html");
						window.$ntc(dc.body.childNodes).apply((node) =>
						{
							window.$ntc(script.original.parentNode).appendChild(node);
						}).forEach();
						if(obj !== "")
							window[obj] = window.$ntc(dc.body);
						ondone(script);

						ax = true;
					}
					script.remove();

					this.parseSemanticIconsetTags(doc, function(s) {});
					this.parsePOMaps(doc);
				});
			}).forEach();

			if(ax)
			{
				this.includeScripts(doc, token, ondone);
			}

			this.parseSemanticIconsetTags(doc, function(s) {});
			this.parsePOMaps(doc);
		};

		(new window.NaturalObject(document)).reloadGlobals(window);
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
