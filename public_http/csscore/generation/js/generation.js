/**************************************
* Generation: A CSS3 Based framework. *
*      This is Generation 1.0         *
***************************************
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
**************************************/

var Generation = Generation || {
	version: 1,
	get: function(id)
	{
		return this._parse(document.getElementById(id));
	},
	_parse: function(el)
	{
		return {
			original: el,
			click: function(fnc)
			{
				this.original.addEventListener("click", fnc);
			},
			hover: function(fnc)
			{
				this.original.addEventListener("mouseenter", fnc);
			},
			leave: function(fnc)
			{
				this.original.addEventListener("mouseleave", fnc);
			},
			move: function(fnc)
			{
				this.original.addEventListener("mousemove", fnc);
			},
			mousedown: function(fnc)
			{
				this.original.addEventListener("mousedown", fnc);
			},
			mouseup: function(fnc)
			{
				this.original.addEventListener("mouseup", fnc);
			},
			keydown: function(fnc)
			{
				this.original.addEventListener("keydown", fnc);
			},
			keyup: function(fnc)
			{
				this.original.addEventListener("keyup", fnc);
			},
			keypress: function(fnc)
			{
				this.original.addEventListener("keypress", fnc);
			},
			html: function(h)
			{
				if(typeof h === "undefined")
					return this.original.innerHTML;
				this.original.innerHTML = h;
			},
			value: function(h)
			{
				if(typeof h === "undefined")
					return this.original.value;
				this.original.value = h;
			},
			css: function(map)
			{
				if(typeof h === "undefined")
					return this.original.style;
				for(var i in map)
				{
					this.original.style[i] = map[i];
				}
			}
		};
	},
	compatible: function(v)
	{
		if(this.version === v)
			return true;
		return false;
	},
	startModals: function()
	{
		var modals = document.querySelectorAll(".modal");
		var i = 0;
		var l = modals.length;
		for(i = 0;i < l;i++)
		{
			var modal = modals[i];
			console.log("At " + modal.id);
			var closebtn = document.querySelectorAll("[data-close-modal=\"" + modal.id + "\"]");
			var j = 0;
			var w = closebtn.length;
			for(j = 0;j < w;j++)
			{
				closebtn[j].addEventListener("click", function()
				{
					var md = document.getElementById(this.getAttribute("data-close-modal"));
					md.style.animation = "fadeOut 0.2s linear";
					console.log("Close " + md.id);
					setTimeout(function()
					{
						md.style.display = "none";
					}, 200);
				});
			}
			var openers = document.querySelectorAll("[data-open-modal=\"" + modal.id + "\"]");
			var k = openers.length;
			for(j = 0;j < k;j++)
			{
				openers[j].addEventListener("click", function()
				{
					var md = document.getElementById(this.getAttribute("data-open-modal"));
					md.style.display = "flex";
					md.style.animation = "fadeIn 0.2s linear";
					console.log("Open " + md.id);
				});
			}
		}
	},
	ready: function()
	{
		Generation.startModals();
	}
};

window.addEventListener("load", function()
{
	Generation.ready();
});
