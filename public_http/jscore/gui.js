/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * NaturalWidgets wrapper high-level library.
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
			throw new Error("Error at CNatural.JS.Widgets: NaturalObject is undefined");
		}
		if(typeof window.NaturalWidgets === "undefined")
		{
			throw new Error("Error at CNatural.JS.Widgets: NaturalWidgets is undefined");
		}

		var inherits = function(child, base)
		{
			child.prototype = Object.create(base.prototype);
			child.prototype.constructor = child;
		};

		var NaturalGUI = {};

		NaturalGUI.Widget = function()
		{
			this.parent = null;
			this.element = null;
		};
		NaturalGUI.Widget.prototype.reparent = function(parent)
		{
			if(this.parent !== null)
			{
				this.parent.remove(this);
			}
			this.parent = parent || null;
		};
		NaturalGUI.Widget.prototype.getNaturalElement = function()
		{
			return this.element;
		};
		NaturalGUI.Widget.prototype.getHTMLElement = function()
		{
			return this.element.original;
		};
		NaturalGUI.Widget.prototype.setNaturalElement = function(element)
		{
			this.element = element;
		};
		NaturalGUI.Widget.prototype.setHTMLElement = function(element)
		{
			this.element = window.$natural.wrap(element);
		};
		NaturalGUI.Widget.prototype.getParent = function()
		{
			return this.parent;
		};
		NaturalGUI.Widget.prototype. = function()
		{
			//
		};
		NaturalGUI.Widget.prototype. = function()
		{
			//
		};
		NaturalGUI.Widget.prototype. = function()
		{
			//
		};

		window.NaturalWidgets.NaturalGUI = window.NaturalWidgets.NaturalGUI || NaturalGUI;
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
