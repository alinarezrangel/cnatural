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
		window.NaturalObject.prototype.include = function(token, src, mime, callback)
		{
			recursive = (typeof recursive === "boolean")? recursive : false;

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
		};
		window.NaturalObject.prototype.includeScripts = function(doc, token, ondone)
		{
			ondone = ondone || function(x) {};

			if(typeof doc === "undefined")
			{
				doc = document;
			}

			var tags = window.$ntc("*[data-widget=\"script\"]");
			tags.apply((script) =>
			{
				var src = script.data("src");
				var mime = script.data("mime");
				var obj = script.data("object");
				var tp = script.data("type");
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
					}
					else if(tp == "javascript")
					{
						var scn = document.createElement("script");
						scn.type = "application/javascript";
						scn.appendChild(document.createTextNode(res));

						if(obj !== "")
							window[obj] = window.$ntc(scn);

						scn.addEventListener("load", () =>
						{
							ondone(script);
						});
					}
					script.remove();
				});
			}).forEach();
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
