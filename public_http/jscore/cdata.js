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
		window.NaturalObject.prototype.includeScripts = function(doc)
		{
			if(typeof doc === "undefined")
			{
				doc = document;
			}
			var tags = $ntc("*[data-widget=\"script\"]");
			tags.attach(function(script)
			{
				var src = script.data("src");
				var mime = script.data("mime");
				this.ajax({
					url: "/api/ajax/coreutils/import",
					args: {},
					pdata: {
						type: "include",
						expected: mime,
						file: src
					},
					async: true
				}, function(err, res)
				{
					//
				});
			}).each();
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
