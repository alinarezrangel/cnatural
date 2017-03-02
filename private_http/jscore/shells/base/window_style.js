/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Base Desktop Environment (window style).
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
			throw new Error("Error at CNatural.JS.Desktop.Base.Window.StyleBase: NaturalObject is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Base = window.NaturalShell.Base || {};

		/**
		 * A object that describes a color.
		 *
		 * It's implementation defined, the only standard formats are:
		 *
		 * - Any **string** containing a **valid and defined** CSS class name
		 * it's a valid `ColorLike`.
		 * - If the implementation supports, a class named `NaturalShell.Base.WindowStyle.Color`
		 * is defined and it's a valid color-like, where the constructor is of
		 * the form `new Color((r, g, b) | CSSClassName | CSSColor?)`.
		 *
		 * @typedef {opaque_type|object} NaturalShell.Base.WindowStyle.ColorLike
		 */

		/**
		 * Controls the look of a window.
		 *
		 * Not all window styles works on all windows, specific windows
		 * uses specific window styles.
		 *
		 * @param {NaturalShell.Base.Window} windowObject - Window to style.
		 * @param {NaturalShell.Base.AppInstanceData} appdata - AppInstanceData of any **valid** instance.
		 *
		 * @class WindowStyle
		 * @memberof NaturalShell.Base
		 */
		window.NaturalShell.Base.WindowStyle = function(windowObject, appdata)
		{
			this.window = windowObject;
			this.appdata = appdata;
			this.titlebarColor = null;
			this.bodyColor = null;
			this.borderColor = null;

			/**
			 * The default pallete of colors.
			 *
			 * Contains the colors that **should be used** if any of the window's
			 * colors are not specified.
			 *
			 * If any of the members are `null`, the implementation can use it's owns
			 * colors.
			 *
			 * @member {object} NaturalShell.Base.WindowStyle~defaultPallete
			 *
			 * @property {NaturalShell.Base.WindowStyle.ColorLike} titlebarColor - The color of the titlebar.
			 * @property {NaturalShell.Base.WindowStyle.ColorLike} bodyColor - The color of the window body.
			 * @property {NaturalShell.Base.WindowStyle.ColorLike} borderColor - The color of the window border.
			 *
			 * @protected
			 * @readonly
			 */
			this.defaultPallete = {
				titlebarColor: null,
				bodyColor: null,
				borderColor: null
			};
		};

		/**
		 * Sets the color of the titlebar.
		 *
		 * If the window system does **not** support a custom titlebar color,
		 * this function does nothing.
		 *
		 * A `null` color will keep default values.
		 *
		 * @param {NaturalShell.Base.WindowStyle.ColorLike} colorname - The color of the titlebar (or null).
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.setTitlebarColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.setTitlebarColor = function(colorname)
		{
			this.titlebarColor = colorname;
		};

		/**
		 * Sets the color of the window's body.
		 *
		 * If the window system does **not** support a custom body color,
		 * this function does nothing.
		 *
		 * A `null` color will keep default values.
		 *
		 * @param {NaturalShell.Base.WindowStyle.ColorLike} colorname - The color of the body (or null).
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.setBodyColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.setBodyColor = function(colorname)
		{
			this.bodyColor = colorname;
		};

		/**
		 * Sets the color of the window's border.
		 *
		 * If the window system does **not** support a custom border color,
		 * this function does nothing.
		 *
		 * A `null` color will keep default values.
		 *
		 * @param {NaturalShell.Base.WindowStyle.ColorLike} colorname - The color of the border.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.setBorderColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.setBorderColor = function(colorname)
		{
			this.borderColor = colorname;
		};

		/**
		 * Gets the color of the titlebar, or null.
		 *
		 * Only inspecs on the internal table, does **not** return the current
		 * window titlebar's color.
		 *
		 * @return {NaturalShell.Base.WindowStyle.ColorLike} Color of the titlebar in this style.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.getTitlebarColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.getTitlebarColor = function()
		{
			return this.titlebarColor;
		};

		/**
		 * Gets the color of the body, or null.
		 *
		 * Only inspecs on the internal table, does **not** return the current
		 * window body's color.
		 *
		 * @return {NaturalShell.Base.WindowStyle.ColorLike} Color of the body in this style.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.getBodyColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.getBodyColor = function()
		{
			return this.bodyColor;
		};

		/**
		 * Gets the color of the border, or null.
		 *
		 * Only inspecs on the internal table, does **not** return the current
		 * window border's color.
		 *
		 * @return {NaturalShell.Base.WindowStyle.ColorLike} Color of the border in this style.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.getBorderColor
		 */
		window.NaturalShell.Base.WindowStyle.prototype.getBorderColor = function()
		{
			return this.borderColor;
		};

		/**
		 * Gets the styled window.
		 *
		 * In this window the setted styles will be applied.
		 *
		 * @return {NaturalShell.Base.Window} Window which style will be changed.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.getWindow
		 */
		window.NaturalShell.Base.WindowStyle.prototype.getWindow = function()
		{
			return this.window;
		};

		/**
		 * Gets the {@link NaturalShell.Base.AppInstanceData} of the instance.
		 *
		 * It can be used to style the window.
		 *
		 * @return {NaturalShell.Base.AppInstanceData} AppInstanceData of the instance that owns the window to style.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.getApplicationData
		 */
		window.NaturalShell.Base.WindowStyle.prototype.getApplicationData = function()
		{
			return this.appdata;
		};

		/**
		 * Updates the colors of the window using the attributes
		 * `getTitlebarColor`, `getBodyColor` and `getBorderColor`.
		 *
		 * You can use the {@link NaturalShell.Base.WindowStyle~defaultPallete} protected attribute,
		 * it have a titlebarColor, bodyColor and borderColor attributes and
		 * if get*Color returns null, you should use the value contained in this
		 * map. But the map can contain null values and in that case, you
		 * may use your own colors.
		 *
		 * @method NaturalShell.Base.WindowStyle.prototype.updateColors
		 */
		window.NaturalShell.Base.WindowStyle.prototype.updateColors = function()
		{
			return;
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

