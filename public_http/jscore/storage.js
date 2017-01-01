/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural Storage System.
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
			throw new Error("Error at CNatural.JS.Core.Storage: NaturalObject is undefined");
		}
		window.NaturalStorage = function(ls)
		{
			this.storage = ls || window.localStorage || null;
			this.owner = "";
			this.haveSync = true;
		};
		window.NaturalStorage.prototype.open = function(by, callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			this.owner = by;
			return callback(null);
		};
		window.NaturalStorage.prototype.close = function(callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			return callback(null);
		};
		window.NaturalStorage.prototype.get = function(name, callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			name = name.toString();

			if((name.length > 0) && (name.charAt(0) == "!"))
			{
				name = name.substr(1, name.length);
			}
			else
			{
				name = this.owner.replace(".", "_") + "__" + name;
			}

			return callback(null, this.storage.getItem(name).toString());
		};
		window.NaturalStorage.prototype.set = function(name, value, callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			name = name.toString();
			value = value.toString();

			if((name.length > 0) && (name.charAt(0) == "!"))
			{
				name = name.substr(1, name.length);
			}
			else
			{
				name = this.owner.replace(".", "_") + "__" + name;
			}

			this.storage.setItem(name, value);
			return callback(null);
		};
		window.NaturalStorage.prototype._syncCallback = function(callback, fc)
		{
			if(typeof callback === "undefined")
			{
				if(this.haveSync)
				{
					return (err, _1) => {if(err) throw err; return fc(_1)};
				}
				else
				{
					throw new TypeError("Error unexpected null callback on a non-synchronus storage API");
				}
			}
			else
			{
				return callback;
			}
		};

		window.NaturalObject.prototype.getStorage = function(win)
		{
			if(typeof win === "undefined")
			{
				win = window;
			}

			if(typeof win.localStorage !== "undefined")
				return new window.NaturalStorage(win.localStorage);
			else
				return null;
		};

		(new window.NaturalObject(document)).reloadGlobals(window);
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
