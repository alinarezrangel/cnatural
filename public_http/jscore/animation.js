/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for the JS Animations core.
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
		if(typeof window.NaturalObject === "undefined")
		{
			throw new Error("Error at CNatural.JS.Core.Animations: NaturalObject is undefined");
		}
		window.NaturalObject.prototype.animatable = function()
		{
			this.animateEndEvent = function(){};
			this.on("animationend", (ev) =>
			{
				console.log("Animation end");
				this.animateEndEvent(ev);
			});
			return this;
		};
		window.NaturalObject.prototype.hideSlideUp = function()
		{
			this.addClass("animate-hide-slide-up");
			this.animateEndEvent = function()
			{
				alert("GUI HIDDEN");
				this.addClass("gui-hidden");
			};
			return this;
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
