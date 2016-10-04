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
		NaturalObject.prototype.get = function(i)
		{
			if(typeof i === "number")
			{
				return this.original[i];
			}
			return this.original;
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
			var i = 0;
			var sname = name.split("");
			var j = sname.length;
			var last = "";
			for(i = 0; i < j; i++)
			{
				var at = sname[i];
				if(at.)
			}
			if(typeof value === "string")
			{
				this.original.setAttribute(name, value);
			}
		};
		NaturalObject.prototype.style = function(obj)
		{
			for(var i in obj)
			{
				if(obj.hasOwnProperty(i))
				{
					this.original.style[i] = obj[i];
				}
			}
		};
		NaturalObject.prototype.addClass = function(newremove)
		{
			this.original.classList.add(newremove);
		};
		NaturalObject.prototype.removeClass = function(newremove)
		{
			this.original.classList.remove(newremove);
		};
		NaturalObject.prototype.on = function(evt, cll)
		{
			this.original.addEventListener(evt, cll);
		};
		window.NaturalObject = window.NaturalObject || NaturalObject;
		window.$natural = new NaturalObject(window);
	};

	if(module)
	{
		module.exports = natsec; // NodeJS, AngularJS, NativeScript, RequireJS, etc
	}
	else
	{
		natsec(window, document); // Browser JS
	}
}());
