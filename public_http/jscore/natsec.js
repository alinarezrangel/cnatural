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
		var isLowerCase = function(char)
		{
			return char === char.toLowerCase();
		};
		var isUpperCase = function(char)
		{
			return char === char.toUpperCase();
		};

		var NaturalObject = function(dom)
		{
			this.original = dom;
		};
		NaturalObject.prototype.isNodeList = function()
		{
			return (this.original instanceof window.NodeList) ||
				(this.original instanceof window.HTMLCollection);
		};
		NaturalObject.prototype.get = function(i)
		{
			if(typeof i === "number")
			{
				return new NaturalObject(his.original[i]);
			}
			return new NaturalObject(this.original);
		};
		NaturalObject.prototype.child = function(sq)
		{
			if(typeof sq === "string")
			{
				return new NaturalObject(this.original.querySelectorAll(sq));
			}
			return new NaturalObject(sq);
		};
		NaturalObject.prototype.wrap = function(obj)
		{
			return new NaturalObject(obj);
		};
		NaturalObject.prototype.attr = function(name, value)
		{
			var func = (to) =>
			{
				if(typeof value === "string")
				{
					to.setAttribute(name, value);
					return this;
				}
				else
				{
					return to.getAttribure(name);
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					return func(this.get(i).original);
				}
			}
			else
			{
				return func(this.original);
			}
		};
		NaturalObject.prototype.style = function(obj)
		{
			if(typeof obj === "string")
			{
				return this.original.style[obj];
			}
			var func = (to) =>
			{
				for(var i in obj)
				{
					if(obj.hasOwnProperty(i))
					{
						to.style[i] = obj[i];
					}
				}
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.addClass = function(newremove)
		{
			var func = (to) =>
			{
				to.classList.add(newremove);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.removeClass = function(newremove)
		{
			var func = (to) =>
			{
				to.classList.remove(newremove);
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};
		NaturalObject.prototype.on = function(evt, cll)
		{
			var func = (to) =>
			{
				to.addEventListener(evt, function(ev)
				{
					return cll(ev);
				});
			};
			if(this.isNodeList())
			{
				for(var i = 0; i < this.original.length; i++)
				{
					func(this.get(i).original);
				}
			}
			else
			{
				func(this.original);
			}
			return this;
		};

		window.NaturalObject = window.NaturalObject || NaturalObject;
		window.$natural = new window.NaturalObject(document);
		window.$ntc = function(obj)
		{
			if(typeof obj === "string")
			{
				return window.$natural.child(obj);
			}
			return window.$natural.wrap(obj);
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
