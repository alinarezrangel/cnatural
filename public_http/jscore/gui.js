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

		NaturalGUI.Widget = function(tagName)
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
		NaturalGUI.Widget.prototype.initClassAndData = function()
		{
			this.element
				.addClass("gui-widget")
				.data("widget", "widget");
		};
		NaturalGUI.Widget.prototype.addClass = function(classes)
		{
			this.element.addClass(classes);
		};

		NaturalGUI.Bin = function()
		{
			NaturalGUI.Widget.call(this);

			this.element = window.$natural.wrap(
				document.createElement("div")
			);

			this.initClassAndData();

			this.packed = false;
		};
		inherit(NaturalGUI.Bin, NaturalGUI.Widget);
		NaturalGUI.Bin.prototype.initClassAndData = function()
		{
			NaturalGUI.Widget.prototype.initClassAndData.call(this);

			this.element
				.addClass("gui-widget-bin")
				.data("widget", "bin");
		};
		NaturalGUI.Bin.prototype.add = function(child)
		{
			if(this.packed)
				return;

			this.packed = true;
			child.reparent(this);
			this.element.appendChild(child);
		};

		NaturalGUI.BoxLike = function()
		{
			NaturalGUI.Bin.call(this);

			this.initClassAndData();
		};
		inherit(NaturalGUI.BoxLike, NaturalGUI.Bin);
		NaturalGUI.BoxLike.prototype.initClassAndData = function()
		{
			NaturalGUI.Bin.prototype.initClassAndData.call(this);

			this.element
				.addClass("gui-widget-box-like")
				.data("widget", "box-like");
		};
		NaturalGUI.BoxLike.prototype.pack =
		NaturalGUI.BoxLike.prototype.appendChild =
		NaturalGUI.BoxLike.prototype.packEnd = function(child)
		{
			child.reparent(this);
			this.element.appendChild(child);
		};

		NaturalGUI.Box = function()
		{
			NaturalGUI.BoxLike.call(this);

			this.initClassAndData();
		};
		inherit(NaturalGUI.Box, NaturalGUI.BoxLike);
		NaturalGUI.Box.prototype.initClassAndData = function()
		{
			NaturalGUI.BoxLike.prototype.initClassAndData.call(this);

			this.element
				.addClass("box")
				.addClass("gui-widget-box")
				.data("widget", "box");
		};

		NaturalGUI.Container = function()
		{
			NaturalGUI.BoxLike.call(this);

			this.initClassAndData();
		};
		inherit(NaturalGUI.Container, NaturalGUI.BoxLike);
		NaturalGUI.Container.prototype.initClassAndData = function()
		{
			NaturalGUI.BoxLike.prototype.initClassAndData.call(this);

			this.element
				.addClass("container")
				.addClass("gui-widget-container")
				.data("widget", "container");
		};

		NaturalGUI.RowContainer = function(wrap)
		{
			NaturalGUI.Container.call(this);

			this.wrap = (typeof wrap === "boolean")? wrap : true;

			this.initClassAndData();
		};
		inherit(NaturalGUI.RowContainer, NaturalGUI.Container);
		NaturalGUI.RowContainer.prototype.initClassAndData = function()
		{
			NaturalGUI.Container.prototype.initClassAndData.call(this);

			this.element
				.addClass("row")
				.addClass(this.wrap? "wrap" : "no-wrap")
				.addClass("gui-widget-row-container")
				.data("widget", "row-container");
		};
		NaturalGUI.RowContainer.prototype.setWrap = function(w)
		{
			this.wrap = (typeof w === "boolean")? w : true;
		};
		NaturalGUI.RowContainer.prototype.getWrap = function()
		{
			return this.wrap;
		};

		NaturalGUI.Button = function()
		{
			NaturalGUI.BoxLike.call(this);

			this.element = window.$natural.wrap(
				document.createElement("button")
			);
			this.element.attr("type", "button");

			this.initClassAndData();
		};
		inherit(NaturalGUI.Button, NaturalGUI.BoxLike);
		NaturalGUI.Button.prototype.initClassAndData = function()
		{
			NaturalGUI.BoxLike.prototype.initClassAndData.call(this);

			this.element
				.addClass("button")
				.addClass("gui-widget-button")
				.data("widget", "button");
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
