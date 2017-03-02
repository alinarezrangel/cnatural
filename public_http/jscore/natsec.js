/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural Selectors Library.
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
		/* * Utilify function to detect if a char is in lowercase. */
		var isLowerCase = function(char)
		{
			return char === char.toLowerCase();
		};
		/* * Utilify function to detect if a char is in uppercase. */
		var isUpperCase = function(char)
		{
			return char === char.toUpperCase();
		};

		/**
		 * Any object/s returner by a valid DOM operation (or null/undefined).
		 *
		 * Generally, have all operations on a DOM Node or a NodeList.
		 *
		 * @typedef {object} NaturalObject~DOMObject
		 */

		/**
		 * A text returned by an AJAX request (or null/undefined).
		 *
		 * @typedef {string} NaturalObject~AJAXResponseText
		 */

		/**
		 * Callback for {@link NaturalObject~on}.
		 *
		 * @callback NaturalObject~onCallback
		 *
		 * @param {Event} ev - Event.
		 *
		 * @return {boolean} If the event can propagated (**obsolete**).
		 */

		/**
		 * Callback for {@link NaturalObject~ajax}.
		 *
		 * @callback NaturalObject~ajaxCallback
		 *
		 * @param {Error} err - Error on the AJAX (or null).
		 * @param {NaturalObject~AJAXResponseText} res - AJAX response text (or undefined).
		 */

		/**
		 * Callback for {@link NaturalObject~each}.
		 *
		 * @callback NaturalObject~eachCallback
		 *
		 * @param {NaturalObject~DOMObject} node - Node resulting from some DOM operation.
		 */

		/**
		 * The NaturalObject provides wrappers to DOM functions.
		 *
		 * In the modules and applications this class is `window.NaturalObject`.
		 *
		 * @param {NaturalObject~DOMObject} dom - DOM element/s to wrap.
		 *
		 * @class NaturalObject
		 */
		var NaturalObject = function(dom)
		{
			this.original = dom;
			this._callbackLastRef = function(ev){};
		};

		/**
		 * Checks if the current object is a node list.
		 *
		 * Remeber that operations maded on a NodeList differs from the
		 * operations maded on a simple Node.
		 *
		 * @return {boolean} true is the object is a NodeList, false otherwise.
		 *
		 * @method NaturalObject.prototype.isNodeList
		 */
		NaturalObject.prototype.isNodeList = function()
		{
			return (this.original instanceof window.NodeList) ||
				(this.original instanceof window.HTMLCollection);
		};

		/**
		 * Gets a element from this object.
		 *
		 * If the object is a NodeList and the index is a number, returns
		 * the nth-node contained in this NodeList wrapped using NaturalObject.
		 *
		 * If the object is NOT a node list, only returns the current contained
		 * object wrapped using OTHER NaturalObject (like a copy in NaturalObject
		 * but NOT in DOM).
		 *
		 * @param {number} [i] - The index of the object to be accesed.
		 *
		 * @return {NaturalObject} The wrapped element.
		 *
		 * @method NaturalObject.prototype.get
		 */
		NaturalObject.prototype.get = function(i)
		{
			if((typeof i === "number") && this.isNodeList())
			{
				return new NaturalObject(this.original[i]);
			}
			return new NaturalObject(this.original);
		};

		/**
		 * Searchs for a child that matches the specified expression..
		 *
		 * If the expression is a string, it's like call `querySelectorAll`
		 * on the contained Node, otherwise returns the expression wrapped
		 * on a NaturalObject.
		 *
		 * The usage of this function for wraps a Node or HTMLElement is
		 * discouraged and should be avoided (see {@link NaturalObject~wrap}.
		 *
		 * If no child matches that expression, the returned NaturalObject
		 * will be void (zero child or objects).
		 *
		 * @param {string} sq - Expression to search (CSS expression).
		 *
		 * @return {NaturalObject} The child that matches the expression.
		 *
		 * @method NaturalObject.prototype.child
		 */
		NaturalObject.prototype.child = function(sq)
		{
			if(typeof sq === "string")
			{
				return new NaturalObject(this.original.querySelectorAll(sq));
			}
			return new NaturalObject(sq);
		};

		/**
		 * Wraps a NodeList, Node, HTMLElement or HTMLCollection.
		 *
		 * The returned object is a NaturalObject that haves this
		 * object a contained DOM element.
		 *
		 * Passing a non-DOM object is undefined.
		 *
		 * @param {NaturalObject~DOMObject} obj - Object to wrap.
		 *
		 * @return {NaturalObject} NaturalObject wrapping that object.
		 *
		 * @method NaturalObject.prototype.wrap
		 */
		NaturalObject.prototype.wrap = function(obj)
		{
			return new NaturalObject(obj);
		};

		/**
		 * Echoes an object.
		 *
		 * @param {*} obj - The object to echo.
		 *
		 * @return {*} Returns the object without any changes.
		 *
		 * @method NaturalObject.prototype.echo
		 */
		NaturalObject.prototype.echo = function(obj)
		{
			return obj;
		};

		/**
		 * Applies a function to all contained elements.
		 *
		 * The callback is called with one Node.
		 *
		 * @param {funcion} func - Callback to apply.
		 *
		 * @return {*} The value returned by func in a list, or this.
		 *
		 * @private
		 *
		 * @method NaturalObject.prototype._forAll
		 */
		NaturalObject.prototype._forAll = function(func)
		{
			if(this.isNodeList())
			{
				var rt = [];
				for(var i = 0; i < this.original.length; i++)
				{
					var r = func(this.original[i]);

					if(typeof r !== "undefined")
						rt.push(r);
				}

				if(rt.length == 0)
				{
					// No returned value
					return this;
				}
				else if(rt.length == 1)
				{
					// Only one returned value
					return rt[0];
				}
				else
				{
					return rt;
				}
			}
			else
			{
				var r = func(this.original);
				if(typeof r === "undefined")
					return this;
				else
					return r;
			}
		};

		/**
		 * Access (sets or gets) an attribute from the node.
		 *
		 * Can be called on NodeList for modify ALL nodes in the list.
		 *
		 * If no attribute value is provided, the function returns the
		 * attribute value (gets).
		 *
		 * If a attribute value is provided, the function sets the
		 * value and this object is returned (sets).
		 *
		 * It's chainable (only setting values).
		 *
		 * On NodeList, returns an array (without specifing order) or all
		 * values of the contained objects (on get).
		 *
		 * @param {string|DOMString} name - Name of the attribute to set/get.
		 * @param {string|DOMString} [value] - Value of the attribute.
		 *
		 * @return {string|DOMString|Array|NaturalObject} The value of the attribute, or this.
		 *
		 * @method NaturalObject.prototype.attr
		 */
		NaturalObject.prototype.attr = function(name, value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.setAttribute(name, value);
				}
				else
				{
					return to.getAttribute(name);
				}
			};

			return this._forAll(func);
		};

		/**
		 * Like {@link NaturalObject~attr} but access to the dataset.
		 *
		 * Can be called on NodeList for modify ALL nodes in the list.
		 *
		 * If no data value is provided, the function returns the data value
		 * (gets).
		 *
		 * If a data value is provided, the function sets the value and this
		 * object is returned (sets).
		 *
		 * It's chainable (only setting values).
		 *
		 * On NodeList, returns an array (without specifing order) or all
		 * values of the contained objects (on get).
		 *
		 * @param {string|DOMString} name - Name of the data to set/get.
		 * @param {string|DOMString} [value] - Value of the data.
		 *
		 * @return {string|DOMString|Array|NaturalObject} The value of the data, or this.
		 *
		 * @method NaturalObject.prototype.data
		 */
		NaturalObject.prototype.data = function(name, value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.dataset[name] = value;
				}
				else
				{
					return to.dataset[name];
				}
			};

			return this._forAll(func);
		};

		/**
		 * Like {@link NaturalObject~attr} but access to the values.
		 *
		 * Can be called on NodeList for modify ALL nodes in the list.
		 *
		 * Only works on `<input>` elements (HTMLInputElement) and with
		 * "value" this function means the current input's value.
		 *
		 * If no input value is provided, the function returns the input value
		 * (gets).
		 *
		 * If a input value is provided, the function sets the value and this
		 * object is returned (sets).
		 *
		 * It's chainable (only setting values).
		 *
		 * On NodeList, returns an array (without specifing order) or all
		 * values of the contained objects (on get).
		 *
		 * @param {string|DOMString} [value] - Value of the datalink.
		 *
		 * @return {string|DOMString|Array|NaturalObject} The value of the data, or this.
		 *
		 * @method NaturalObject.prototype.value
		 */
		NaturalObject.prototype.value = function(value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.value = value;
				}
				else
				{
					return to.value;
				}
			};

			return this._forAll(func);
		};

		/**
		 * Access to the element's styles.
		 *
		 * Can be called on NodeList for modify ALL nodes in the list.
		 *
		 * If a string is provided as style value, gets the style with specified
		 * name from the object.
		 *
		 * If a object (map) is provided as style value, sets all properties of
		 * the style of the node (like JQuery css method).
		 *
		 * It's chainable (only setting values).
		 *
		 * On NodeList, returns an array (without specifing order) or all
		 * values of the contained objects (on get).
		 *
		 * @param {string|DOMString|map|object} obj - Style value.
		 *
		 * @return {string|DOMString|Array|NaturalObject} The value of the style, or this.
		 *
		 * @method NaturalObject.prototype.style
		 */
		NaturalObject.prototype.style = function(obj)
		{
			var func = (to) =>
			{
				if(typeof obj === "string")
				{
					return to.style[obj];
				}

				for(var i in obj)
				{
					if(obj.hasOwnProperty(i))
					{
						to.style[i] = obj[i];
					}
				}
			};

			return this._forAll(func);
		};

		/**
		 * Adds a class to all contained nodes (or contained node).
		 *
		 * If an array is provided instead of a string, it will be
		 * equivalent to call addClass with each item of the list.
		 * For example: `obj.addClass(["h", "i", "j", "k"])` is equal to call
		 * `obj.addClass("h").addClass("i").addClass("j").addClass("k")`.
		 *
		 * It's chainable.
		 *
		 * @param {string|DOMString|Array} newremove - Class/es to add.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.addClass
		 */
		NaturalObject.prototype.addClass = function(newremove)
		{
			var func = (to) =>
			{
				if(Array.isArray(newremove))
				{
					to.classList.add.apply(to.classList, newremove);

					return;
				}

				to.classList.add(newremove);
			};

			return this._forAll(func);
		};

		/**
		 * Removes a class to all contained nodes (or contained node).
		 *
		 * If an array is provided instead of a string, it will be
		 * equivalent to call removeClass with each item of the list.
		 * For example: `obj.removeClass(["h", "i", "j", "k"])` is equal to call
		 * `obj.removeClass("h").removeClass("i").removeClass("j").removeClass("k")`.
		 *
		 * It's chainable.
		 *
		 * @param {string|DOMString|Array} newremove - Class/es to remove.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.removeClass
		 */
		NaturalObject.prototype.removeClass = function(newremove)
		{
			var func = (to) =>
			{
				if(Array.isArray(newremove))
				{
					to.classList.remove.apply(to.classList, newremove);

					return;
				}

				to.classList.remove(newremove);
			};

			return this._forAll(func);
		};

		/**
		 * Determines if the object have a specified class.
		 *
		 * When an array is used instead of a string, it's
		 * equal to apply AND operations to calling hasclass
		 * on all items of the array.
		 *
		 * @param {string|DOMString|Array} className - The class name/es to verify.
		 *
		 * @return {boolean} If the elements have all specified classes.
		 *
		 * @method NaturalObject.prototype.hasClass
		 */
		NaturalObject.prototype.hasClass = function(className)
		{
			var func = (to) =>
			{
				if(Array.isArray(newremove))
				{
					for(var i = 0; i < className.length; i++)
					{
						if(!to.classList.contains(className[i]))
							return false;
					}

					return true;
				}

				return to.classList.contains(className);
			};

			return this._forAll(func);
		};

		/**
		 * Sets the event handler for the next event set.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject~onCallback|function} handler - Next event handler.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.attach
		 */
		NaturalObject.prototype.attach = function(handler)
		{
			this._callbackLastRef = handler;

			return this;
		};

		/**
		 * Alias of {@link NaturalObject~attach}.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject~onCallback|function} handler - Next event handler.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.apply
		 */
		NaturalObject.prototype.apply = function(handler)
		{
			return this.attach(handler);
		};

		/**
		 * Alias of {@link NaturalObject.attach}.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject~onCallback|function} handler - Next event handler.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.call
		 */
		NaturalObject.prototype.call = function(handler)
		{
			return this.attach(handler);
		};

		/**
		 * Attaches an event handler.
		 *
		 * If only an event name is specified, the setted event
		 * handler (setted with {@link NaturalObject~attach} like functions)
		 * will be used.
		 *
		 * If an event name AND a boolean are provided, the setted event
		 * handler (setted with {@link NaturalObject~attach} like functions)
		 * will be used and the boolean determines if the event is bubbled or
		 * not.
		 *
		 * If an event name AND a callback are specified, the callback will
		 * be used AND will be setted as next event handler (like calling
		 * {@link NaturalObject~attach} on them before calling this).
		 *
		 * If and event name AND a callback AND a boolean are provided,
		 * the callback will be used AND will be setted as next event handler
		 * (like calling {@link NaturalObject~attach} on them before calling
		 * this) and the boolean will determine if the event is bubbled or not.
		 *
		 * It's chanined.
		 *
		 * @param {string|DOMString} evt - Event name.
		 * @param {NaturalObject~onCallback|boolean} [cll] - Callback or boolean.
		 * @param {boolean} [bbl] - If bubbles are used or not.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.on
		 */
		NaturalObject.prototype.on = function(evt, cll, bbl)
		{
			var bubbles = (cll === true);

			if(typeof bbl !== "undefined")
			{
				bubble = (bbl === true);
			}

			if(typeof cll === "function")
			{
				this._callbackLastRef = cll;
			}
			else
			{
				cll = this._callbackLastRef;
			}

			var func = (to) =>
			{
				to.addEventListener(evt, function(ev)
				{
					return cll(ev);
				}, !bubbles);
			};

			return this._forAll(func);
		};

		/**
		 * Makes an AJAX call.
		 *
		 * The options object have the attributes:
		 *
		 * ```javascript
		 * {
		 * 	"args": {Array} // Arguments to be passed as HTTP GET
		 * 	"pdata": {Array} // Arguments to be passed as HTTP POST
		 * 	"url": {string} // URL where the AJAX will be sended
		 * 	"async": {boolean} // If the ajax is executed asyncronusly
		 * }
		 * ```
		 *
		 * The HTTP method used is ALWAYS POST.
		 *
		 * It's chainable.
		 *
		 * @param {object|map} options - Options to the call.
		 * @param {NaturalObject~ajaxCallback} callback - Callback.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.ajax
		 */
		NaturalObject.prototype.ajax = function(options, callback)
		{
			var xhrc = new XMLHttpRequest();
			var params = "";
			var pdata = "";

			for(var i in options.args)
			{
				if(options.args.hasOwnProperty(i))
				{
					params += "&" + i + "=" + encodeURIComponent(options.args[i]);
				}
			}

			for(var i in options.pdata)
			{
				if(options.pdata.hasOwnProperty(i))
				{
					pdata += "&" + i + "=" + encodeURIComponent(options.pdata[i]);
				}
			}

			if(params !== "")
				params = params.substr(1, params.length - 1);

			if(pdata !== "")
				pdata = pdata.substr(1, pdata.length - 1);

			xhrc.onreadystatechange = function()
			{
				if((this.readyState === 4) && (this.status === 200))
				{
					callback(null, this.responseText);
				}
				if((this.readyState === 4) && (this.status !== 200))
				{
					callback(new Error("Error: unexpected HTTP !200 code " + this.status));
				}
			};

			xhrc.open("POST", options.url + ((params !== "")? ("?" + params) : ""), options.async);
			xhrc.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhrc.setRequestHeader("Content-length", pdata.length);
			xhrc.setRequestHeader("Connection", "close");
			xhrc.send(pdata);

			return this;
		};

		/**
		 * Appends a child node to the contained element/s.
		 *
		 * If is a NodeList, the child will be appended to ALL contained nodes.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject} child - Node to be appended.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.appendChild
		 */
		NaturalObject.prototype.appendChild = function(child)
		{
			var func = (to) =>
			{
				to.appendChild(child.original);
			};

			return this._forAll(func);
		};

		/**
		 * Removes this node from the DOM.
		 *
		 * If is a NodeList, all contained nodes will be removed.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.remove
		 */
		NaturalObject.prototype.remove = function()
		{
			var func = (to) =>
			{
				if(to.parentNode)
				{
					to.parentNode.removeChild(to);
				}
			};

			return this._forAll(func);
		};

		/**
		 * Removes a child node to the contained element/s.
		 *
		 * If is a NodeList, the child will be removed to ALL contained nodes.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject} child - Node to be removed.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.removeChild
		 */
		NaturalObject.prototype.removeChild = function(child)
		{
			var func = (to) =>
			{
				to.removeChild(child.original);
			};

			return this._forAll(func);
		};

		/**
		 * Applies a function to all contained nodes.
		 *
		 * If is NOT a NodeList, the function will called with the contained
		 * object instead.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject~eachCallback} cll - Callback to be called on all contained nodes.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.each
		 */
		NaturalObject.prototype.each = function(cll)
		{
			if(typeof cll === "function")
			{
				this._callbackLastRef = cll;
			}
			else
			{
				cll = this._callbackLastRef;
			}

			var func = (to) =>
			{
				cll(to);
			};

			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i));
				}
			}
			else
			{
				func(this);
			}

			return this;
		};

		/**
		 * Alias of {@link NaturalObject.each}.
		 *
		 * It's chainable.
		 *
		 * @param {NaturalObject~eachCallback} cll - Callback to be called on all contained nodes.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @method NaturalObject.prototype.forEach
		 */
		NaturalObject.prototype.forEach = function(cll)
		{
			return this.each(cll);
		};

		/**
		 * Reloads global variables.
		 *
		 * When a change is maded to {@link NaturalObject}, it's good the reload
		 * all global variables (like `$natural` or `$ntc`). This function does
		 * that.
		 *
		 * @param {window} [win] - window where the globals will be reloaded.
		 *
		 * @method NaturalObject.prototype.reloadGlobals
		 */
		NaturalObject.prototype.reloadGlobals = function(win)
		{
			if(typeof win === "undefined")
			{
				win = window;
			}
			win.NaturalObject = win.NaturalObject || NaturalObject;
			win.$natural = new win.NaturalObject(document);
			win.$ntc = function(obj)
			{
				if(typeof obj === "string")
				{
					return win.$natural.child(obj);
				}
				return win.$natural.wrap(obj);
			};
		};

		(new NaturalObject(document)).reloadGlobals(window);
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
