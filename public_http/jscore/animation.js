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
		window.NaturalObject.prototype.animatable = function()
		{
			if(this.isAnimatable === true)
				return this;
			this.animateEndEvent = function(){};
			this.isAnimatable = true;
			this.on("animationend", (ev) =>
			{
				this.animateEndEvent(ev);
			});
			return this;
		};
		window.NaturalObject.prototype.hide = function()
		{
			this.animatable().addClass("gui-hidden");
			return this;
		};
		window.NaturalObject.prototype.show = function()
		{
			this.animatable().removeClass("gui-hidden");
			return this;
		};
		window.NaturalObject.prototype.hideSlideUp = function()
		{
			this.animatable()
				.addClass("gui-animation-hide-slide-up")
				.animateEndEvent = () =>
				{
					this.hide().removeClass("gui-animation-hide-slide-up");
				};
			return this;
		};
		window.NaturalObject.prototype.showSlideDown = function()
		{
			this.animatable()
				.show()
				.addClass("gui-animation-hide-slide-down")
				.animateEndEvent = () => {
					this.removeClass("gui-animation-hide-slide-down").removeClass("gui-hidden");
				};
			return this;
		};
		window.NaturalObject.prototype.hideMoveFromCenterToTop = function()
		{
			this.animatable()
				.addClass("gui-animation-hide-move-from-center-to-top")
				.animateEndEvent = () =>
				{
					this.hide().removeClass("gui-animation-hide-move-from-center-to-top");
				};
			return this;
		};
		window.NaturalObject.prototype.showMoveFromTopToCenter = function()
		{
			this.animatable()
				.show()
				.addClass("gui-animation-show-move-from-top-to-center")
				.animateEndEvent = () => {
					this.removeClass("gui-animation-show-move-from-top-to-center").removeClass("gui-hidden");
				};
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
