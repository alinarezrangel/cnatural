/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Natural Animations Library.
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
			throw new Error("Error at CNatural.JS.Core.Animations: NaturalObject is undefined");
		}

		/**
		 * Fake namespace used to document extensions from the module animation.
		 *
		 * All functions in this namespace are methods of {@link NaturalObject}.
		 *
		 * @namespace Animations
		 */

		/**
		 * Makes a node (or nodes) animatables. Note that
		 * the animatable feature is not embed in the node
		 * or nodes itself, it's embed on the NaturalObject
		 * that called this method, because this, the next code
		 * will not work as espected:
		 *
		 * ```javascript
		 * var a = window.$ntc("#object_a");
		 * var b = window.$ntc("#object_a");
		 *
		 * a.animatable();
		 *
		 * // b.isAnimatable is false, note that a and b are the same NODE but not the
		 * // same OBJECT.
		 *
		 * a.alertMoveForever();
		 *
		 * // This animates the node, so b have the animation class now.
		 *
		 * // Note that b is NOT animatable at this point but have the animation classes:
		 *
		 * b.haveClass("gui-animation-alert"); // This is true
		 * b.isAnimatable; // This is false
		 * ```
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function animatable
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.animatable = function()
		{
			this.isAnimatable = this.isAnimatable || false;

			if(this.isAnimatable === true)
				return this;

			this.animateEndEvent = function(){};
			this.isAnimatable = true;
			this.inAnimation = false;

			this.on("animationend", (ev) =>
			{
				this.animateEndEvent(ev);
			});

			return this;
		};

		/**
		 * Hides the current node/s.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function hide
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.hide = function()
		{
			this.animatable().addClass("gui-hidden");
			return this;
		};

		/**
		 * Shows the current node/s.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function show
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.show = function()
		{
			this.animatable().removeClass("gui-hidden");
			return this;
		};

		/**
		 * Binds a event to the animation_end_event.
		 *
		 * This event it's called when the animation ends.
		 *
		 * It's chainable.
		 *
		 * @param {function} evt - Callback to be called on the animation_end_event.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function animationEndEvent
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.animationEndEvent = function(evt)
		{
			this.animatable().animateEndEvent = (ev) =>
			{
				this.inAnimation = false;
				return evt(ev);
			};

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Hides the node while it's height is reducing. At the end,
		 * hides the node.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function hideSlideUp
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.hideSlideUp = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.animationEndEvent(() =>
				{
					this.hide().removeClass("gui-animation-hide-slide-up");
				})
				.addClass("gui-animation-hide-slide-up");

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Shows the node while it's height is increasing. At the start,
		 * shows the node.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function showSlideDown
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.showSlideDown = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.show()
				.animationEndEvent(() =>
				{
					this.removeClass("gui-animation-hide-slide-down").removeClass("gui-hidden");
				})
				.addClass("gui-animation-hide-slide-down");

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Hides the node while it's moving from the center of the parent
		 * to the top of the screen. At the end, hides the node.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function hideMoveFromCenterToTop
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.hideMoveFromCenterToTop = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.animationEndEvent(() =>
				{
					this.hide().removeClass("gui-animation-hide-move-from-center-to-top");
				})
				.addClass("gui-animation-hide-move-from-center-to-top");

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Shows the node while it's moving from the top of the screen to the
		 * center. At the start, it shows the node.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function showMoveFromTopToCenter
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.showMoveFromTopToCenter = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.show()
				.animationEndEvent(() =>
				{
					this.removeClass("gui-animation-show-move-from-top-to-center").removeClass("gui-hidden");
				})
				.addClass("gui-animation-show-move-from-top-to-center");

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Moves the node forever in a alert manner, rotating it from the left
		 * to the right and progresivesly reducing the rotation angle. At the end
		 * of a cycle, the rotation angle reset to it's start value.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function alertMoveForever
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.alertMoveForever = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.show()
				.animationEndEvent(() =>
				{
					this
						/*.removeClass("gui-animation-alert")*/
						.removeClass("gui-hidden");
				})
				.addClass("gui-animation-alert");

			return this;
		};

		/**
		 * Animates the current node/s.
		 *
		 * Exponentialy expands the element, without moving it. At the end,
		 * the element have it's parent size and it's hidden.
		 *
		 * It's chainable.
		 *
		 * @return {NaturalObject} Always returns this object.
		 *
		 * @function expandElement
		 * @memberof Animations
		 */
		window.NaturalObject.prototype.expandElement = function()
		{
			this.animatable();

			if(this.inAnimation)
				return this;

			this.inAnimation = true;

			this.animatable()
				.show()
				.animationEndEvent(() =>
				{
					this
						/*.removeClass("gui-animation-alert")*/
						hide()
						.removeClass("gui-animation-expand");
				})
				.addClass("gui-animation-expand");

			return this;
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
