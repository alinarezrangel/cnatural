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

		/**
		 * Represents a DOM-compliant object generated from a valid XML tree or
		 * string. All XML DOM methods works on this object, but it specific
		 * type is undefined (and never should be assumed a specific type,
		 * for example, is undefined behavior if you call native's XMLDocument
		 * specific methods on this object).
		 *
		 * @typedef {object} XMLDocument
		 *
		 * @memberof NaturalWidgets.Builder
		 */

		/**
		 * The builder class can construct complex user interfaces from XML files.
		 *
		 * In modules and applications is `window.NaturalWidgets.Builder`.
		 *
		 * @class Builder
		 * @memberof NaturalWidgets
		 */
		var Builder = function()
		{
			this.doctype = "text/xml";
			this.parser = new DOMParser();
			this.widgets = {}; // map.<string: id, object: widget>
		};

		/**
		 * Generates a {@link NaturalWidgets.XMLDocument} from a XML string.
		 *
		 * The string should be valid or a exception will be throw.
		 *
		 * @param {string} xmltext - The string to parse.
		 *
		 * @returns {NaturalWidgets.XMLDocument} The parsed document.
		 *
		 * @method parseXMLFromText
		 * @memberof NaturalWidgets.Builder.prototype
		 */
		Builder.prototype.parseXMLFromText = function(xmltext)
		{
			return this.parser.parseFromString(xmltext, this.doctype);
		};

		/**
		 * Gets a widget by it's ID.
		 *
		 * This method is defined only after a sucessful call to
		 * {@link Builder~buildWindowFromDocument}.
		 *
		 * @param {string} id - A valid ID.
		 *
		 * @returns {derivated<NaturalWidgets.Widget>} A valid Widget-class specialization.
		 *
		 * @method getWidgetByID
		 * @memberof NaturalWidgets.Builder.prototype
		 */
		Builder.prototype.getWidgetByID = function(id)
		{
			return this.widgets[id];
		};

		/**
		 * Builds a complete shell window from a
		 * {@link NaturalWidgets.XMLDocument}.
		 *
		 * The {@link NaturalWidgets.XMLDocument} should be returned by
		 * {@link NaturalWidgets.Builder~parseXMLFromText}.
		 *
		 * This method is exception-safe.
		 *
		 * @param {NaturalWidgets.XMLDocument} xmldoc - The XMLDocument to use.
		 * @param {NaturalShell.CurrentShell.Window|NaturalShell.Base.Window} win - The window to build.
		 * @param {NaturalObject.POMap} POMap - The POMap to use to translate special messages.
		 *
		 * @returns {NaturalShell.CurrentShell.Window|NaturalShell.Base.Window} The builded window.
		 *
		 * @method buildWindowFromDocument
		 * @memberof NaturalWidgets.Builder.prototype
		 */
		Builder.prototype.buildWindowFromDocument = function(xmldoc, win, POMap)
		{
			try
			{
				var body = win.getBody();
				var menu = win.getMenu();
				var style = win.getStyle();

				this._buildWindowFromDocument(xmldoc, style, menu, body, POMap);
			}
			catch(err)
			{
				console.error(err);

				throw Error("Error building the window");
			}
		};

		/**
		 * Builds a complete shell window from a {@link NaturalWidgets.XMLDocument}
		 *
		 * This method is **not** exception-safe.
		 *
		 * @param {NaturalWidgets.XMLDocument} xmldoc - The XMLDocument to use.
		 * @param {opaque_type|object} style - The style object of the window.
		 * @param {opaque_type|object} eMenu - The menu element.
		 * @param {opaque_type|object} eBody - The body elemenr.
		 * @param {NaturalObject.POMap} POMap - The POMap to use.
		 *
		 * @protected
		 *
		 * @method _buildWindowFromDocument
		 * @memberof NaturalWidgets.Builder.prototype
		 */
		Builder.prototype._buildWindowFromDocument = function(xmldoc, style, eMenu, eBody, POMap)
		{
			var getChildByTagName = function(element, tagname)
			{
				var el = element.children;
				var ls = [];

				for(var i = 0; i < el.length; i++)
				{
					var lm = el[i];

					if(lm.tagName == tagname)
						ls.push(lm);
				}

				return ls;
			};

			var getInnerText = function(element)
			{
				var text = "";

				var iter = xmldoc.createNodeIterator(element, window.NodeFilter.SHOW_TEXT);
				var textnode = null;

				while(textnode = iter.nextNode())
				{
					text += textnode.nodeValue;
				}

				return text;
			};

			var specialColorLike = function(colorlike)
			{
				if(colorlike == "null")
					return null;
				else
					return colorlike;
			};

			var rootNode = xmldoc.getElementsByTagName("window")[0];

			var styleNode = getChildByTagName(rootNode, "style")[0];
			var menuNode = getChildByTagName(rootNode, "menu")[0];
			var bodyNode = getChildByTagName(rootNode, "body")[0];

			var borderColor = getChildByTagName(styleNode, "border-color")[0];
			var bodyColor = getChildByTagName(styleNode, "body-color")[0];
			var titlebarColor = getChildByTagName(styleNode, "titlebar-color")[0];

			style.setBorderColor(specialColorLike(getInnerText(borderColor)));
			style.setBodyColor(specialColorLike(getInnerText(bodyColor)));
			style.setTitlebarColor(specialColorLike(getInnerText(titlebarColor)));

			style.updateColors();

			var menuElement = this.buildGUIFromElement(xmldoc, menuNode, eMenu, POMap);
			var bodyElement = this.buildGUIFromElement(xmldoc, bodyNode, eBody, POMap);
		};

		/**
		 * Converts a valid XML tag name to a CamelCased object name.
		 *
		 * For example:
		 *
		 * ```
		 * <example-application>    =    ExampleApplication
		 * <main-container>         =    MainContainer
		 * <text>                   =    Text
		 * <longname>               =    Longname
		 * <long-name>              =    LongName
		 * ```
		 *
		 * @param {string} tagname - The tag name.
		 *
		 * @returns {string} The converted object name.
		 *
		 * @method getWidgetNameFromTagName
		 * @memberof NaturalWidgets.Builder.prototype
		 */
		Builder.prototype.getWidgetNameFromTagName = function(tagname)
		{
			// tagname = some-tag-name
			// returns = SomeTagName

			tagname = tagname.toLowerCase();

			var dash = true;
			var r = "";

			for(var i = 0; i < tagname.length; i++)
			{
				var c = tagname.charAt(i);

				if(c == "-")
				{
					dash = true;
					continue;
				}

				if(dash)
				{
					r += c.toUpperCase();

					dash = false;
				}
				else
				{
					r += c.toLowerCase();
				}
			}

			return r;
		};

		Builder.prototype.buildGUIFromElement = function(xmldoc, rootnode, parentElement, POMap)
		{
			var ch = rootnode.children;

			var carea = null;

			if(typeof parentElement.getContainerArea !== "function")
			{
				// Is a NaturalObject
				carea = parentElement;
			}
			else
			{
				// Is a Widget
				carea = parentElement.getContainerArea();
			}

			var isDigits = function(str)
			{
				for(var i = 0; i < str.length; i++)
				{
					var c = str.charAt(i);

					switch(c)
					{
						case "0":
						case "1":
						case "2":
						case "3":
						case "4":
						case "5":
						case "6":
						case "7":
						case "8":
						case "9":
							break;
						default:
							return false;
					}
				}

				return true;
			};

			var isFloats = function(str)
			{
				for(var i = 0; i < str.length; i++)
				{
					var c = str.charAt(i);

					if(isDigits(c) || (c == "."))
						continue;
					else
						return false;
				}

				return true;
			};

			for(var i = 0; i < ch.length; i++)
			{
				if(carea === null)
				{
					throw new Error("Unexpected children in non-container element");
				}

				var cl = ch[i];

				var wn = this.getWidgetNameFromTagName(cl.tagName);

				var WidgetClass = window.NaturalWidgets[wn];

				var argss = {};
				var id = "";
				var className = [];

				for(var j = 0; j < cl.attributes.length; j++)
				{
					var attr = cl.attributes[j];

					var name = attr.nodeName;
					var value = attr.nodeValue;

					switch(name)
					{
						case "class":
							className = value.trim().split(" ");
							break;
						case "id":
							id = value;
							break;
						default:
							if(value.startsWith("${") && value.endsWith("}"))
							{
								argss[name] = POMap[value.substring(2, value.length - 1)];
							}
							else
							{
								if((value == "true") || (value == "false"))
								{
									// boolean
									argss[name] = (value == "true");
								}
								else if(isDigits(value))
								{
									// integer
									argss[name] = parseInt(value, 10);
								}
								else if(isFloats(value))
								{
									// float
									argss[name] = parseFloat(value, 10);
								}
								else
								{
									argss[name] =
										value
											.replace(/\\\\/gmi, "\0")
											.replace(/\\$/gmi, "$")
											.replace(/\0/gmi, "\\");
								}
							}
					}
				}

				var text = "";

				var iter = xmldoc.createNodeIterator(cl, window.NodeFilter.SHOW_TEXT);
				var textnode = null;

				while(textnode = iter.nextNode())
				{
					text += textnode.nodeValue;
				}

				argss["parent"] = carea;
				argss["text"] = argss["text"] || text;

				var instance = window.NaturalWidgets.Create(
					WidgetClass,
					argss
				);

				if(id != "")
				{
					this.widgets[id] = instance;
				}

				if(className.length != 0)
					instance.getElement().addClass(className);

				instance.pack("APPEND");

				this.buildGUIFromElement(xmldoc, cl, instance, POMap);
			}
		};

		window.NaturalWidgets.Builder = Builder;
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
