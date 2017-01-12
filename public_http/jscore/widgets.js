/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for widgets library.
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

		var Extend = function(base, child)
		{
			"use strict";
			if((typeof base !== "object") || (typeof child !== "object"))
			{
				throw new TypeError("Error at Extend(base, child): the base or the child arent objects");
			}
			child._super = {};
			for(let i in base)
			{
				if(base.hasOwnProperty(i) && (typeof child[i] === "undefined"))
				{
					if(typeof base[i] === "object")
					{
						child[i] = Extend(base[i], {});
					}
					else if(typeof base[i] == "function")
					{
						child[i] = base[i]; // Later we change this.
					}
					else
					{
						child[i] = base[i];
					}
				}
				if(base.hasOwnProperty(i) && (typeof child[i] !== "undefined") && (typeof base[i] == "function"))
				{
					child._super[i] = base[i]; // Later we change this.
				}
			}
			return child;
		};
		var Create = function(klass, args)
		{
			"use strict";
			var obj = Object.create(klass);
			obj._constructor.call(obj, args);
			return obj;
		};
		var Class = function(child) // Semantic only
		{
			return child;
		};

		window.NaturalWidgets = window.NaturalWidgets || {};

		window.NaturalWidgets.Class = Class;
		window.NaturalWidgets.Create = Create;
		window.NaturalWidgets.Extend = Extend;

		window.NaturalWidgets.Widget = Class({
			type: "Widget",
			path: "CNatural.JS.Widgets.Widget",
			_constructor: function(args)
			{
				this._parent = args.parent;
				this._element = null;
				this._packed = false;
			},
			pack: function(side)
			{
				if(this._packed)
					return;
				this._packed = true;
				this._parent.appendChild(this._element);
			},
			unpack: function()
			{
				if(!this._packed)
					return;
				this._packed = false;
				this._element.remove();
			},
			reparent: function(np)
			{
				if(this._parent === np)
					return;
				this.unpack();
				this._parent = np;
			},
			getParent: function()
			{
				return this._parent;
			},
			getElement: function()
			{
				return this._element;
			}
		});
		window.NaturalWidgets.PlainText = Extend(window.NaturalWidgets.Widget, Class({
			type: "PlainText",
			path: "CNatural.JS.Widgets.PlainText",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createTextNode(args.text)
				);
			}
		}));
		window.NaturalWidgets.Text = Extend(window.NaturalWidgets.Widget, Class({
			type: "Text",
			path: "CNatural.JS.Widgets.Text",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("p")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-text");
			}
		}));
		window.NaturalWidgets.Container = Extend(window.NaturalWidgets.Widget, Class({
			type: "Container",
			path: "CNatural.JS.Widgets.Container",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("gui-widget")
					.addClass("gui-widget-container");
			}
		}));
		window.NaturalWidgets.Button = Extend(window.NaturalWidgets.Widget, Class({
			type: "Button",
			path: "CNatural.JS.Widgets.Button",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("button")
				);
				this._element.attr("type", "button");
				this._element
					.addClass("button")
					.addClass("gui-widget")
					.addClass("gui-widget-button");
			}
		}));
		window.NaturalWidgets.Header = Extend(window.NaturalWidgets.Widget, Class({
			type: "Header",
			path: "CNatural.JS.Widgets.Header",
			levelTable: {
				"page.title": "jumbo-4",
				"page.subtitle": "jumbo-3",
				"section.title": "jumbo-2",
				"section.subtitle": "jumbo",
				"content.title": "ultra-big",
				"content.subtitle": "big"
			},
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("h" + args.level)
				);
				this._element
					.addClass("text-" + this.levelTable[args.size])
					.addClass("gui-widget")
					.addClass("gui-widget-header");
			}
		}));
		window.NaturalWidgets.Image = Extend(window.NaturalWidgets.Widget, Class({
			type: "Header",
			path: "CNatural.JS.Widgets.Image",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("img")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-image");
				this._element.original.src = args.src;
				this._element.original.width = args.width;
				this._element.original.height = args.height;
				this._element.original.alt = args.alt;
			}
		}));
		window.NaturalWidgets.Window = Extend(window.NaturalWidgets.Widget, Class({
			type: "Window",
			path: "CNatural.JS.Widgets.Window",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("no-padding")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.style({
						position: "absolute"
					});
			}
		}));
		window.NaturalWidgets.Dialog = Extend(window.NaturalWidgets.Widget, Class({
			type: "Dialog",
			path: "CNatural.JS.Widgets.Window.Dialog",
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("no-padding")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.style({
						position: "absolute"
					});
			}
		}));

		window.NaturalWidgets.CreateTextDialog = function(parent, level, text, oncreated)
		{
			var win = window.NaturalWidgets.Create(window.NaturalWidgets.Dialog, {
				parent: parent
			});
			var message = window.NaturalWidgets.Create(window.NaturalWidgets.Header, {
				parent: win.getElement(),
				level: level,
				size: "content.title"
			});
			var text = window.NaturalWidgets.Create(window.NaturalWidgets.PlainText, {
				parent: message.getElement(),
				text: text
			});
			win.getElement()
				.show()
				.removeClass("gui-hidden")
				.style({
					top: "50%",
					left: "50%",
					maxWidth: "50%",
					maxHeight: "50%",
					transform: "translateX(-50%)"
				})
				.addClass("padding-16")
				.addClass("overflow-hidden")
				.attach(function(ev)
				{
					win.getElement().hide();
					ev.preventDefault();
					return false;
				})
				.on("click", true);
			text.pack("APPEND");
			message.pack("BEGIN");
			win.pack("APPEND");
			oncreated(win, message, text);
			return win;
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
