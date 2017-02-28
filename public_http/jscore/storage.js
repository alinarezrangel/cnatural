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

		/**
		 * Represents and manages a persistent storage (if any) on the browser.
		 *
		 * This API is so flexible that enables a combination of synchronus and
		 * asynchronus client's API:
		 *
		 * This constructor is for internal use only.
		 *
		 * @example
		 * // Uses sync API (if any)
		 * var st = $natural.getStorage(window);
		 * st.open("Who.Am.I");
		 * st.set("hello", "world");
		 * st.close()
		 * // Uses async API (works on any system)
		 * var st = $natural.getStorage(window);
		 * st.open("Who.Am.I", (err) =>
		 * {
		 *   if(err) throw err;
		 *
		 *   st.set("hello", "world", (err) =>
		 *   {
		 *     if(err) throw err;
		 *
		 *     st.close((err) => {if(err) throw err;});
		 *   });
		 * });
		 * @class
		 */
		window.NaturalStorage = function(ls)
		{
			this.storage = ls || window.localStorage || null;
			this.owner = "";
			this.haveSync = true;
		};

		/**
		 * Opens the storage system.
		 *
		 * If the storage system is not opened BEFORE doing any operation,
		 * the storage system might fail.
		 *
		 * The callback syntax should look like: `(Error error) => {...}`.
		 *
		 * The callback can be omited ONLY the the storage system is synchronus.
		 *
		 * If no error occours, the error parameter will be null.
		 *
		 * @param {string} by - The owner of the session.
		 * @param {function} [callback] - The callback to be called.
		 *
		 * @returns {*} Value returned by the callback.
		 */
		window.NaturalStorage.prototype.open = function(by, callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			this.owner = by;
			return callback(null);
		};

		/**
		 * Closes the storage system.
		 *
		 * If the storage system is not opened BEFORE doing any this operation,
		 * the storage system might fail.
		 *
		 * The callback syntax should look like: `(Error error) => {...}`.
		 *
		 * The callback can be omited ONLY the the storage system is synchronus.
		 *
		 * If no error occours, the error parameter will be null.
		 *
		 * @param {function} [callback] - The callback to be called.
		 *
		 * @returns {*} Value returned by the callback.
		 */
		window.NaturalStorage.prototype.close = function(callback)
		{
			callback = this._syncCallback(callback, (_1) => _1);
			return callback(null);
		};

		/**
		 * Gets a value from the specified key.
		 *
		 * If the storage system is not opened BEFORE doing any operation,
		 * the storage system might fail.
		 *
		 * The callback syntax should look like: `(Error error, string value) => {...}`.
		 *
		 * The callback can be omited ONLY the the storage system is synchronus.
		 *
		 * In sync mode, the value is returned instead of passing it to a callback.
		 *
		 * If no error occours, the error parameter will be null.
		 *
		 * @param {string} name - Name of the key to get.
		 * @param {function} [callback] - The callback to be called.
		 *
		 * @returns {*} Value returned by the callback.
		 */
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

		/**
		 * Sets the value of a key.
		 *
		 * If the storage system is not opened BEFORE doing any operation,
		 * the storage system might fail.
		 *
		 * The callback syntax should look like: `(Error error) => {...}`.
		 *
		 * The callback can be omited ONLY the the storage system is synchronus.
		 *
		 * If no error occours, the error parameter will be null.
		 *
		 * @param {string} name - Name of the key.
		 * @param {string} value - New value of the key.
		 * @param {function} [callback] - The callback to be called.
		 *
		 * @returns {*} Value returned by the callback.
		 */
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

		/**
		 * Normalizes a callback.
		 *
		 * If the API is in sync mode, makes a minimalist fake callback.
		 *
		 * @param {function|object|undefined} callback - Param passed to the function.
		 * @param {function} fc - the default value of the callback on sync mode.
		 *
		 * @return {function} A callback.
		 *
		 * @private
		 */
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


		/**
		 * @name NaturalStorage.prototype.getStorage
		 * @function
		 * @global
		 *
		 * Gets the available storage.
		 *
		 * May return null if no storage is available.
		 *
		 * @param {window} win - Window where the storage is defined.
		 *
		 * @return {window.NaturalStorage} The storage system wrapped.
		 */
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
