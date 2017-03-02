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

		/**
		 * Contains the Natural Widgets API.
		 *
		 * In modules and applications, is named `window.NaturalWidgets` instead.
		 *
		 * @namespace NaturalWidgets
		 */

		/**
		 * Extends a plain class.
		 *
		 * In the process, the child class will inherit the base class.
		 *
		 * @param {PlainClass} base - Base class.
		 * @param {PlainClass} child - Child class.
		 *
		 * @return {PlainClass} The new class that is a copy of child but inherits base.
		 *
		 * @function Extend
		 * @memberof NaturalWidgets
		 */
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

		/**
		 * Instanciates a PlainClass.
		 *
		 * @param {PlainClass} klass - Class to instanciate.
		 * @param {object} args - Arguments passed to the class constructor.
		 *
		 * @return {object} Instance of klass.
		 *
		 * @function Create
		 * @memberof NaturalWidgets
		 */
		var Create = function(klass, args)
		{
			"use strict";
			var obj = Object.create(klass);
			obj._constructor.call(obj, args);
			return obj;
		};
		
		/**
		 * Converts an object to a PlainClass.
		 *
		 * @param {object} child - Object to convert.
		 *
		 * @return {PlainClass} Class copy of object.
		 *
		 * @function Class
		 * @memberof NaturalWidgets
		 */
		var Class = function(child) // Semantic only
		{
			return child;
		};

		window.NaturalWidgets = window.NaturalWidgets || {};

		window.NaturalWidgets.Class = Class;
		window.NaturalWidgets.Create = Create;
		window.NaturalWidgets.Extend = Extend;

		/**
		 * Base widget class.
		 *
		 * Create with `var instance = NaturalWidgets.Create(NaturalWidgets.Widget, ...)`
		 *
		 * @type {PlainClass}
		 * @class Widget
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Widget = Class(
			/** @lends NaturalWidgets.Widget */
			{
			/**
			 * The type of the widget (will inherit).
			 */
			type: "Widget",

			/**
			 * The path of the widget (will inherit).
			 */
			path: "CNatural.JS.Widgets.Widget",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 */
			_constructor: function(args)
			{
				this._parent = args.parent;
				this._element = null;
				this._packed = false;
			},

			/**
			 * Packs the widget on it's parent.
			 *
			 * | Side String | Packing result |
			 * | ----------- | -------------- |
			 * | APPEND      | The widget will be appended to the end of the container |
			 * | BEGIN       | The widget will be packed to the start of the container |
			 * | END         | The widget will be packed to the end of the container   |
			 *
			 * @param {string} side - One of the specified sides.
			 */
			pack: function(side)
			{
				if(this._packed)
					return;
				this._packed = true;
				this._parent.appendChild(this._element);
			},

			/**
			 * Unpacks the widget from it's container.
			 *
			 * Once unpacked, it can be reparent and packed again.
			 */
			unpack: function()
			{
				if(!this._packed)
					return;
				this._packed = false;
				this._element.remove();
			},

			/**
			 * Changes the parent (container) of a widget.
			 *
			 * If the widget it's packed, it will be unpacked before changing the parent.
			 *
			 * @param {NaturalObject} np - New Parent.
			 */
			reparent: function(np)
			{
				if(this._parent === np)
					return;
				this.unpack();
				this._parent = np;
			},

			/**
			 * Gets the parent (container) or the widget.
			 *
			 * @return {NaturalObject} Parent (Container) Node/s.
			 */
			getParent: function()
			{
				return this._parent;
			},

			/**
			 * Gets the widget internal element.
			 *
			 * @return {NaturalObject} Internal Element.
			 */
			getElement: function()
			{
				return this._element;
			}
		});

		/**
		 * Plain Text node (no general usability).
		 *
		 * @extends NaturalWidgets.Widget
		 * @class PlainText
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.PlainText = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.PlainText */
			{
			type: "PlainText",
			path: "CNatural.JS.Widgets.PlainText",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string} args.text - Inner text.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createTextNode(args.text)
				);
			}
		}));

		/**
		 * Text element, for amouts on read-only text.
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Text
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Text = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Text */
			{
			type: "Text",
			path: "CNatural.JS.Widgets.Text",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string} [args.text] - Inner text.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("p")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-text")
					.data("widget", "text");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			},
			/**
			 * Changes the current text.
			 *
			 * This will delete ALL childs of this widget.
			 *
			 * @param {string} new_text - New text to display.
			 */
			changeText: function(new_text)
			{
				var node = this._element.original;

				while(node.firstChild)
					node.removeChild(node.firstChild);

				node.appendChild(document.createTextNode(new_text));
			}
		}));

		/**
		 * container element, a general reusable container.
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Container
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Container = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Container */
			{
			type: "Container",
			path: "CNatural.JS.Widgets.Container",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.data("widget", "container");
			}
		}));

		/**
		 * A container that aligns it's childrens in a row.
		 *
		 * @extends NaturalWidgets.Container
		 * @class RowContainer
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.RowContainer = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.RowContainer */
			{
			type: "RowContainer",
			path: "CNatural.JS.Widgets.Container.RowContainer",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("row")
					.addClass("wrap")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-row-container")
					.data("widget", "row-container");
			}
		}));

		/**
		 * The main container of any window, provides a viewport with scrollbars and
		 * management of layout.
		 *
		 * @extends NaturalWidgets.Container
		 * @class MainContainer
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.MainContainer = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.MainContainer */
			{
			type: "MainContainer",
			path: "CNatural.JS.Widgets.Container.MainContainer",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {boolean} [args.noPadding] - If the container should NOT have padding.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("overflow-auto")
					.addClass("color-transparent")
					.addClass("width-block")
					.addClass("height-block")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-main-container")
					.data("widget", "main-container");

				if((typeof args.noPadding === "boolean") && (args.noPadding))
					this._element.addClass("no-padding");
			}
		}));

		/**
		 * A general button.
		 *
		 * Note that the button not inherits container but can contains more
		 * that text (a partial container).
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Button
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Button = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Button */
			{
			type: "Button",
			path: "CNatural.JS.Widgets.Button",

			/**
			 * Contructs the new widget.
			 *
			 * | Button type (string) | Result               |
			 * | -------------------- | -------------------- |
			 * | "normal-button"      | A normal shadowed button. |
			 * | "flat-button"        | A button that not haves shadow until it's hovered. |
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string} [args.text] - The inner text of the button.
			 * @param {string} [args.type] - The type of the button (see type table).
			 */
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
					.addClass("gui-widget-button")
					.data("widget", "button");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}

				if(typeof args.type !== "undefined")
				{
					if(args.type == "flat-button")
					{
						this.element
							.removeClass("button")
							.addClass("flat-button");
					}
				}
			}
		}));

		/**
		 * An Input, like LineEntries, TextAreas and others.
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Input
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Input = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Input */
			{
			type: "Input",
			path: "CNatural.JS.Widgets.Input",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string|DOMString} [args.value] - Input value.
			 * @param {string|DOMString} [args.placeholder] - Input placeholder.
			 * @param {string|DOMString} [args.name] - Input name (only for forms).
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("input")
				);
				this._element.attr("type", args.type);
				this._element
					.addClass("input")
					.addClass("gui-widget")
					.addClass("gui-widget-input")
					.data("widget", "input");

				if(typeof args.value !== "undefined")
				{
					this._element.attr("value", args.value);
				}
				if(typeof args.placeholder !== "undefined")
				{
					this._element.attr("placeholder", args.placeholder);
				}
				if(typeof args.name !== "undefined")
				{
					this._element.attr("name", args.name);
				}
			}
		}));

		/**
		 * A header. Provides semantic difference of text. Comes with sizes.
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Header
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Header = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Header */
			{
			type: "Header",
			path: "CNatural.JS.Widgets.Header",

			/**
			 * Basic size table.
			 *
			 * The key is a valid size and the value is a CSS class.
			 *
			 * @type {object.<string, string>|map}
			 */
			levelTable: {
				"page.title": "jumbo-4",
				"page.subtitle": "jumbo-3",
				"section.title": "jumbo-2",
				"section.subtitle": "jumbo",
				"content.title": "ultra-big",
				"content.subtitle": "big"
			},

			/**
			 * Contructs the new widget.
			 *
			 * Use the header sizes semanticly:
			 *
			 * | Size                | Result (Generation) |
			 * | ------------------- | ------------------- |
			 * | "page.title"        | "jumbo-4"           |
			 * | "page.subtitle"     | "jumbo-3"           |
			 * | "section.title"     | "jumbo-2"           |
			 * | "section.subtitle"  | "jumbo"             |
			 * | "content.title"     | "ultra-big"         |
			 * | "content.subtitle"  | "big"               |
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {number} args.level - Level of the header (1-6).
			 * @param {string} args.size - Header size (see table).
			 * @param {string|DOMString} [args.text] - Header text.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("h" + args.level)
				);
				this._element
					.addClass("text-" + this.levelTable[args.size])
					.addClass("gui-widget")
					.addClass("gui-widget-header")
					.data("widget", "title-header");

				if(typeof args.text !== "undefined")
				{
					this._element.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			}
		}));

		/**
		 * Displays an Image of specified width and height.
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Image
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Image = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Image */
			{
			type: "Image",
			path: "CNatural.JS.Widgets.Image",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string|DOMString} args.src - Image source path.
			 * @param {string|DOMString} args.width - Image width (in pixels).
			 * @param {string|DOMString} args.height - Image height (in pixels).
			 * @param {string|DOMString} args.alt - Image alternative text.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("img")
				);
				this._element
					.addClass("gui-widget")
					.addClass("gui-widget-image")
					.data("widget", "image");
				this._element.original.src = args.src;
				this._element.original.width = args.width;
				this._element.original.height = args.height;
				this._element.original.alt = args.alt;
			}
		}));

		/**
		 * Is a container with a colored header and a border body.
		 *
		 * Instead of using it directly, use the {@link NaturalWidgets.ContainerWithHeader.getHeader}
		 * and the {@link NaturalWidgets.ContainerWithHeader.getBody} methods as parents.
		 *
		 * @extends NaturalWidgets.Container
		 * @class ContainerWithHeader
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.ContainerWithHeader = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.ContainerWithHeader */
			{
			type: "ContainerWithHeader",
			path: "CNatural.JS.Widgets.Container.ContainerWithHeader",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string|DOMString} args.color - Color class that is the color of the container.
			 * @param {number} args.level - A level of {@link NaturalWidgets.Header}.
			 * @param {string} args.size - A size of {@link NaturalWidgets.Header}.
			 * @param {string} args.title - The title of the container.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);
				this._element = window.$natural.wrap(
					document.createElement("div")
				);
				this._element
					.addClass("container")
					.addClass("padding-16")
					.addClass("no-margin")
					.addClass("gui-widget")
					.addClass("gui-widget-container")
					.addClass("gui-widget-container-with-header")
					.data("widget", "container-with-header");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass(args.color);
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border")
					.addClass("border-" + args.color);
				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: args.level,
						size: args.size,
						text: args.title
					}
				);
				this._innerTitle.pack("BEGIN");
				this._element.appendChild(this._innerHeader);
				this._element.appendChild(this._innerBody);
			},

			/**
			 * Gets the header of the container.
			 *
			 * Use it for pack elements on the header.
			 *
			 * @return {NaturalObject} Header container.
			 */
			getHeader: function()
			{
				return this._innerHeader;
			},

			/**
			 * Gets the inner body of the container.
			 *
			 * Use it for pack elements on this container.
			 *
			 * @return {NaturalObject} Body container.
			 */
			getBody: function()
			{
				return this._innerBody;
			}
		}));

		/**
		 * A basic window.
		 *
		 * @abstract
		 *
		 * @extends NaturalWidgets.Widget
		 * @class Window
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Window = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Window */
			{
			type: "Window",
			path: "CNatural.JS.Widgets.Window",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 */
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
					})
					.data("widget", "window");
			},
			getBody: function()
			{
				return this._element;
			}
		}));

		/**
		 * A modal Dialog.
		 *
		 * @extends NaturalWidgets.Window
		 * @class Dialog
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.Dialog = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.Dialog */
			{
			type: "Dialog",
			path: "CNatural.JS.Widgets.Window.Dialog",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 */
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
					})
					.data("widget", "dialog");
			},

			/**
			 * Gets the dialog body.
			 *
			 * Put here all dialog content.
			 *
			 * @return {NaturalObject} Dialog's body.
			 */
			getBody: function()
			{
				return this._element;
			}
		}));

		/**
		 * Represents a Accept/Deny dialog.
		 *
		 * This modal dialog have a message (or content) and two buttons.
		 *
		 * @extends NaturalWidgets.Dialog
		 * @class AcceptDenyDialog
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.AcceptDenyDialog = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.AcceptDenyDialog */
			{
			type: "AcceptDenyDialog",
			path: "CNatural.JS.Widgets.Window.Dialog.AcceptDenyDialog",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string} args.title - Dialog's title.
			 * @param {string} args.acceptText - Text of the accept button.
			 * @param {string} args.denytext - Text of the deny button.
			 * @param {string} [args.text] - Dialog's inner text.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);

				this.onready = function(event, choice) {};

				this._element = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.addClass("gui-widget-window-accept-deny-dialog")
					.addClass("gui-modal")
					.addClass("gui-hidden")
					.data("widget", "accept-deny-dialog");
				this._innerModal = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal-content")
					.addClass("box")
					.addClass("color-gui-body")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-gui-header")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-transparent")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border-bottom")
					.addClass("bs-1")
					.addClass("border-color-dark-grey");
				this._innerBottom = window.$natural.wrap(
					document.createElement("div")
				).addClass("row")
					.addClass("wrap")
					.addClass("right")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");

				this._element
					.appendChild(this._innerModal)
					.echo(this._innerModal)
					.appendChild(this._innerHeader)
					.appendChild(this._innerBody)
					.appendChild(this._innerBottom);

				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: 6,
						size: "content.title",
						text: args.title
					}
				);
				this._innerTitle.getElement()
					.addClass("text-center")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("width-block");

				this._acceptButton = window.NaturalWidgets.Create(
					window.NaturalWidgets.Button,
					{
						parent: this._innerBottom,
						text: args.acceptText
					}
				);
				this._acceptButton.getElement()
					.addClass("fx-1")
					.addClass("od-1")
					.addClass("padding-8")
					.addClass("margin-16")
					.addClass("color-gui-button")
					.on("click", (ev) =>
					{
						this._element.addClass("gui-hidden");
						this._lastChoice = "accept";
						this.onready(ev, this._lastChoice);
					});

				this._denyButton = window.NaturalWidgets.Create(
					window.NaturalWidgets.Button,
					{
						parent: this._innerBottom,
						text: args.denyText
					}
				);
				this._denyButton.getElement()
					.addClass("fx-1")
					.addClass("od-2")
					.addClass("padding-8")
					.addClass("margin-16")
					.addClass("color-gui-button")
					.on("click", (ev) =>
					{
						this._element.addClass("gui-hidden");
						this._lastChoice = "deny";
						this.onready(ev, this._lastChoice);
					});

				this._acceptButton.pack("APPEND");
				this._denyButton.pack("APPEND");
				this._innerTitle.pack("APPEND");

				if(typeof args.text !== "undefined")
				{
					this._innerBody.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}
			},

			/**
			 * Gets the dialog body.
			 *
			 * Useful when the dialog displays other than text.
			 *
			 * @return {NaturalObject} Dialog's inner body.
			 */
			getBody: function()
			{
				return this._innerBody;
			},

			/**
			 * Shows the dialog.
			 *
			 * Is modal, so will block the window until the user selects an action.
			 */
			show: function()
			{
				this._element.removeClass("gui-hidden");
			},

			/**
			 * Hides the dialog.
			 */
			hide: function()
			{
				this._element.addClass("gui-hidden");
			},

			/**
			 * Gets the last choice maded.
			 *
			 * @return {string} "accept" if the user clicked the accept button or "deny" otherwise.
			 */
			getLastChoice: function()
			{
				return this._lastChoice;
			},

			/**
			 * Sets the callback of the selected_event.
			 *
			 * This will be called when the dialog is displayed and the user selects
			 * a button or action.
			 *
			 * @param {function(Event, string)} Callback for the event.
			 */
			onSelected: function(callback)
			{
				this.onready = callback || function(event, choice) {};
			}
		}));

		/**
		 * A text dialog only displays a text and it's non-modal.
		 *
		 * @extends NaturalWidgets.Dialog
		 * @class TextDialog
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.TextDialog = Extend(window.NaturalWidgets.Widget, Class(
			/** @lends NaturalWidgets.TextDialog */
			{
			type: "TextDialog",
			path: "CNatural.JS.Widgets.Window.Dialog.TextDialog",

			/**
			 * Contructs the new widget.
			 *
			 * @param {object} args - Arguments.
			 * @param {NaturalObject} args.parent - Parent node.
			 * @param {string} args.title - The dialog's title.
			 * @param {string} [args.text] - The dialog's text to display (if any).
			 * @param {boolean} args.can_be_closed - true if the dialog can be closed by the user (non-modal) false otherwise.
			 * @param {boolean} args.destroy_on_close - If true, when the dialog is closed will be destroyed too.
			 */
			_constructor: function(args)
			{
				this._super._constructor.call(this, args);

				this._element = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal")
					.addClass("gui-widget")
					.addClass("gui-widget-window")
					.addClass("gui-widget-window-dialog")
					.addClass("gui-widget-window-text-dialog")
					.addClass("gui-modal")
					.addClass("gui-hidden")
					.data("widget", "text-dialog");
				this._innerModal = window.$natural.wrap(
					document.createElement("div")
				).addClass("modal-content")
					.addClass("box")
					.addClass("color-gui-body")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeader = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-gui-header")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("no-border");
				this._innerHeaderCloseButton = window.$natural.wrap(
					document.createElement("span")
				).addClass("close-button")
					.addClass("gui-font-iconset-v1")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("gui-clickeable")
					.addClass("font-bold")
					.addClass("text-big")
					.addClass("color-transparent");
				this._innerHeaderCloseButton.appendChild(window.$natural.wrap(
					document.createTextNode(window.$natural.NaturalIconSetMap["close"])
				));
				this._innerBody = window.$natural.wrap(
					document.createElement("div")
				).addClass("container")
					.addClass("color-transparent")
					.addClass("padding-8")
					.addClass("no-margin")
					.addClass("border-bottom")
					.addClass("bs-1")
					.addClass("border-color-dark-grey");

				this._element
					.appendChild(this._innerModal)
					.echo(this._innerModal)
					.appendChild(this._innerHeader)
					.appendChild(this._innerBody)
					.echo(this._innerHeader)
					.appendChild(this._innerHeaderCloseButton);

				this._innerTitle = window.NaturalWidgets.Create(
					window.NaturalWidgets.Header,
					{
						parent: this._innerHeader,
						level: 6,
						size: "content.title",
						text: args.title
					}
				);
				this._innerTitle.getElement()
					.addClass("text-center")
					.addClass("color-transparent")
					.addClass("no-padding")
					.addClass("no-margin")
					.addClass("no-border")
					.addClass("width-block");
				this._innerTitle.pack("APPEND");

				if(typeof args.text !== "undefined")
				{
					this._innerBody.appendChild(window.$natural.wrap(
						document.createTextNode(args.text)
					));
				}

				if(args.can_be_closed || true)
				{
					this._innerHeaderCloseButton.attach(() =>
					{
						this.hide();

						if(args.destroy_on_close || false)
						{
							this.getElement().remove();
						}
					}).on("click");
				}
			},

			/**
			 * Gets the Dialog's body.
			 *
			 * In the body you can put content to show on the dialog.
			 *
			 * @return {NaturalObject} Dialog's inner body.
			 */
			getBody: function()
			{
				return this._innerBody;
			},

			/**
			 * Shows the dialog.
			 *
			 * Will be modal if in the construction the flag `args.can_be_closed` is false.
			 */
			show: function()
			{
				this._element.removeClass("gui-hidden");
			},

			/**
			 * Hides the dialog.
			 */
			hide: function()
			{
				this._element.addClass("gui-hidden");
			}
		}));

		/**
		 * Creates a basic text dialog.
		 *
		 * It's a wrapper for {@link NaturalWidgets.TextDialog}.
		 *
		 * @param {NaturalObject} parent - Parent of the dialog.
		 * @param {string} title - Title of the dialog.
		 * @param {string} text - Inner text of the dialog.
		 * @param {function} oncreated - Event called when the dialog is packed and created.
		 *
		 * @return {NaturalWidgets.TextDialog} The created dialog.
		 *
		 * @function CreateTextDialog
		 * @memberof NaturalWidgets
		 */
		window.NaturalWidgets.CreateTextDialog = function(parent, title, text, oncreated)
		{
			var win = window.NaturalWidgets.Create(window.NaturalWidgets.TextDialog, {
				parent: parent,
				title: title,
				text: text,
				can_be_closed: true,
				destroy_on_close: true
			});
			win.pack("APPEND");
			win.show();
			oncreated(win);
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
