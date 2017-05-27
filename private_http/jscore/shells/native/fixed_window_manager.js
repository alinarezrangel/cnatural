/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (fixed window manager).
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
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.FixedManager: NaturalObject is undefined");
		}

		if(typeof window.NaturalShell.Base.Context === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.FixedManager: NaturalShell.Context is undefined");
		}

		if(typeof window.NaturalShell.Base.WindowManager === "undefined")
		{
			throw new Error("Error at CNatural.JS.Desktop.Native.Window.FixedManager: NaturalShell.WindowManager is undefined");
		}

		window.NaturalShell = window.NaturalShell || {};

		window.NaturalShell.Native = window.NaturalShell.Native || {};

		window.NaturalShell.Native.FixedWindowManager = function(context)
		{
			window.NaturalShell.Base.WindowManager.call(this, context);

			this.showingWindow = false;
		};

		window.NaturalShell.Native.FixedWindowManager.prototype =
			Object.create(window.NaturalShell.Base.WindowManager.prototype);

		window.NaturalShell.Native.FixedWindowManager.prototype.packWindowAsToplevel = function(windowElement)
		{
			var maxIndex = 0;
			var windows = this.context.getWindowArea().child("*[data-widget='window']");

			if(this.showingWindow)
			{
				windows.apply((windowEl) =>
				{
					windowEl.addClass("gui-hidden");
				}).forEach();
			}

			windows.apply((windowEl) =>
			{
				if(parseInt(windowEl.data("zIndex")) > maxIndex)
				{
					maxIndex = parseInt(windowEl.data("zIndex"));
				}
			}).forEach();

			windowElement.data("zIndex", (maxIndex + 1) + "");
			this.context.getWindowArea().appendChild(windowElement);

			this.showingWindow = true;
			window.$natural.parseSemanticIconsetTags(document, (tag) => {});

			(this.context.getHiddenWindowsCallback())("window.add", windowElement);
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.hideAllWindows = function()
		{
			this.showingWindow = false;
			this.context.getWindowArea().child("*[data-widget='window']").apply((windowEl) =>
			{
				windowEl.addClass("gui-hidden");

				(this.context.getHiddenWindowsCallback())("window.hide", windowEl);
			}).forEach();
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.showToplevel = function()
		{
			var maxIndex = 0, element = null;

			this.hideAllWindows();

			this.context.getWindowArea().child("*[data-widget='window']").apply((windowEl) =>
			{
				if(parseInt(windowEl.data("zIndex")) > maxIndex)
				{
					maxIndex = parseInt(windowEl.data("zIndex"));
					element = windowEl;
				}
			}).forEach();

			if(element !== null)
			{
				element.removeClass("gui-hidden");
				this.showingWindow = true;

				(this.context.getHiddenWindowsCallback())("window.show", element);
			}

			(this.context.getHiddenWindowsCallback())("window.toplevel", element);
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.moveToTop = function(cmpfcn)
		{
			var index = 0, maxIndex = 0, winEl = null;
			var windows = this.context.getWindowArea().child("*[data-widget='window']");

			windows.apply((windowEl) =>
			{
				if(parseInt(windowEl.data("zIndex")) > maxIndex)
				{
					maxIndex = windowEl.data("zIndex");
				}

				if(cmpfcn(windowEl))
				{
					winEl = windowEl;
					index = parseInt(windowEl.data("zIndex"));

					(this.context.getHiddenWindowsCallback())("window.front", windowEl);
				}
			}).forEach();

			if(winEl !== null)
				winEl.data("zIndex", maxIndex);

			windows.apply((windowEl) =>
			{
				if(parseInt(windowEl.data("zIndex")) > index)
				{
					windowEl.data("zIndex", (parseInt(windowEl.data("zIndex")) - 1).toString());
				}
			}).forEach();
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.isShowingWindow = function()
		{
			return this.showingWindow;
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.isShowing = function(cmpfcn)
		{
			var rt = null;

			this.context.getWindowArea().child("*[data-widget='window']").apply((windowEl) =>
			{
				if(cmpfcn(windowEl))
				{
					rt = windowEl;
				}
			}).forEach();

			return !rt.hasClass("gui-hidden");
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.forEachWindow = function(cll)
		{
			this.context.getWindowArea().child("*[data-widget='window']").apply((windowEl) =>
			{
				cll(windowEl);
			}).forEach();
		};

		window.NaturalShell.Native.FixedWindowManager.prototype.unpackWindow = function(cmpfcn)
		{
			var rm = null, index = 0, windows = this.context.getWindowArea().child("*[data-widget='window']");

			windows.apply((windowEl) =>
			{
				if(cmpfcn(windowEl))
				{
					index = parseInt(windowEl.data("zIndex"));

					windowEl.remove();
					rm = windowEl;

					(this.context.getHiddenWindowsCallback())("window.remove", windowEl);
				}
			}).forEach();


			windows.apply((windowEl) =>
			{
				if(parseInt(windowEl.data("zIndex")) > index)
				{
					windowEl.data("zIndex", parseInt(windowEl.data("zIndex")) - 1);
				}
			}).forEach();

			this.showToplevel();

			return rm;
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

