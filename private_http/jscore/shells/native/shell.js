/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Native Desktop Environment (main file).
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

CNaturalGetToken((err, token) =>
{
	if(err)
	{
		console.error(err);

		//document.body.dispatchEvent(new CustomEvent("shellLoaded", {}));
		document.body.dispatchEvent(new CustomEvent("shellLoadError", {}));

		return;
	}

	var importSec = function(path, paths, cll)
	{
		$natural.apply((node) =>
		{
			if(paths.length > 0)
				importSec(paths[0], paths.slice(1, paths.length), cll);
			else
				cll();
		}).require(false, path, token, true);
	};

	importSec(
		"jscore/shells/native/context.js",
		[
			"jscore/shells/native/window_style.js",
			"jscore/shells/native/window.js",
			"jscore/shells/native/window_manager.js",
			"jscore/shells/native/window_system.js",
			"jscore/shells/native/natural_window_style.js",
			"jscore/shells/native/natural_window.js",
			"jscore/shells/native/fixed_window_manager.js",
			"jscore/shells/native/natural_window_system.js"
		],
		() =>
		{
			// Now all files are loaded.

			var CNaturalDefaultContext = new NaturalShell.Native.Context({
				"windowArea": $ntc(".gui-widget-shell-window-area").get(0),
				"hiddenWindowsCallback": (action, windowElement) =>
				{
					switch(action)
					{
						case "window.add":
							console.log("Added window " + windowElement);
							break;
						case "window.remove":
							console.log("Removed window " + windowElement);
							break;
					}
				}
			});

			var CNaturalDefaultWindowManager = new NaturalShell.Native.FixedWindowManager(
				CNaturalDefaultContext
			);

			var CNaturalDefaultWindowSystem = new NaturalShell.Native.NaturalWindowSystem(
				CNaturalDefaultContext,
				CNaturalDefaultWindowManager
			);

			// Example:

			var example_appdata = {
				"applicationName": "Example Application",
				"applicationID": "example_app",
				"namespace": "org.cnatural.examples.application",
				"instanceID": 0,
				"windowID": 0,
				"mainWindowCreated": false,
				"mainWindow": null
			};
			var example = CNaturalDefaultWindowSystem.createDefaultWindow(
				"Example Window",
				example_appdata
			);
			var example_sub = CNaturalDefaultWindowSystem.createDefaultWindow(
				"Example Sub Window",
				example_appdata
			);
			var example_style = example.getStyle();
			var example_sub_style = example_sub.getStyle();

			example_style.removeBorders();
			example_sub_style.removeBorders();

			example_style.setTitlebarColor("color-ocean");
			example_sub_style.setTitlebarColor("color-natural-deeporange");
			example_style.setBodyColor("color-water");
			example_sub_style.setBodyColor("color-natural-redgrey");

			example_style.updateColors();
			example_sub_style.updateColors();

			CNaturalDefaultWindowManager.showToplevel();

			document.body.dispatchEvent(new CustomEvent("shellLoaded", {}));
		}
	);
});
