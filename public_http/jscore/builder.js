/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * NaturalWidgets wrapper for build GUIs from XML files.
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
			throw new Error("Error at CNatural.JS.Widgets.Builder: NaturalObject is undefined");
		}
		if(typeof window.NaturalWidgets === "undefined")
		{
			throw new Error("Error at CNatural.JS.Widgets.Builder: NaturalWidgets is undefined");
		}

		// <tag-name attrs class="">
		// =
		// Create(TagName, {attrs}).addClass(class)
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
