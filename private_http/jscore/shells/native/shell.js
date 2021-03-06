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

window.NaturalClient.GetToken((err, token) =>
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

	var changeDocksColors = function(manager)
	{
		console.log("Changing docks color? " + manager.isShowingWindow());

		if(manager.isShowingWindow())
		{
			$ntc(".gui-shell-docks").addClass("color-natural-black").removeClass("gui-color-semitransparent");
		}
		else
		{
			$ntc(".gui-shell-docks").removeClass("color-natural-black").addClass("gui-color-semitransparent");
		}
	};

	var importApps = function(ondone)
	{
		importSec(
			"jscore/apps/native/__launcher.js",
			[
				"jscore/apps/native/__open_windows.js",
				"jscore/apps/native/__desktop_notification.js",
				"jscore/apps/native/welcome.js",
				"jscore/apps/base/clock/clock.js"
			],
			() =>
			{
				ondone();
			}
		);
	};

	importSec(
		"jscore/shells/base/context.js",
		[
			"jscore/shells/base/shell.js",
			"jscore/shells/native/init_shell.js", // NOTE
			"jscore/shells/base/window_style.js",
			"jscore/shells/base/window.js",
			"jscore/shells/base/window_manager.js",
			"jscore/shells/base/window_system.js",
			"jscore/shells/base/application.js",
			"jscore/shells/native/natural_window_style.js",
			"jscore/shells/native/natural_window.js",
			"jscore/shells/native/fixed_window_manager.js",
			"jscore/shells/native/natural_window_system.js"
		],
		() =>
		{
			/*
			NOTE: the init_shell file will init the Native's shell namespace,
			if we don't init the NS BEFORE any other thing, the entire program
			will fail.
			*/

			// Now all files are loaded.
			var
				CNaturalDefaultContext = null,
				CNaturalDefaultWindowManager = null,
				CNaturalDefaultWindowSystem = null,
				CNaturalApplicationList = [];

			CNaturalDefaultContext = new NaturalShell.Base.Context({
				"windowArea": $ntc(".gui-widget-shell-window-area").get(0),
				"hiddenWindowsCallback": (action, windowElement) =>
				{
					switch(action)
					{
						case "window.add":
							console.log("Added window " + windowElement);
							windowElement.animatable().fadeIn();
							changeDocksColors(CNaturalDefaultWindowManager);
							break;
						case "window.remove":
							console.log("Removed window " + windowElement);
							windowElement.animatable().fadeOut();
							changeDocksColors(CNaturalDefaultWindowManager);
							break;
						case "window.show":
							console.log("Showed window " + windowElement);
							changeDocksColors(CNaturalDefaultWindowManager);
							break;
						case "window.front":
							console.log("Moved to front window " + windowElement);
							break;
						case "window.hide":
							console.log("Hidded window " + windowElement);
							changeDocksColors(CNaturalDefaultWindowManager);
							break;
						case "window.toplevel":
							console.log("Toplevel window " + windowElement);
							changeDocksColors(CNaturalDefaultWindowManager);
							break;
					}
				},
				"applicationsCallback": (action, application) =>
				{
					switch(action)
					{
						case "application.register":
							console.log("Added app " + application);

							CNaturalApplicationList.push(application);
							break;
					}
				}
			});

			CNaturalDefaultWindowManager = new NaturalShell.Native.FixedWindowManager(
				CNaturalDefaultContext
			);

			CNaturalDefaultWindowSystem = new NaturalShell.Native.NaturalWindowSystem(
				CNaturalDefaultContext,
				CNaturalDefaultWindowManager
			);

			window.NaturalShell.Native.RegisterApplication = function(fcn)
			{
				var appT = fcn(window, document);

				var x = new appT(CNaturalDefaultContext, CNaturalDefaultWindowSystem);
				x.registerApplication();
			};

			window.NaturalShell.Native.GetApplication = function(id)
			{
				var i = 0, j = CNaturalApplicationList.length;

				for(i = 0; i < j; i++)
				{
					var c = CNaturalApplicationList[i];

					if(c.getID() == id)
					{
						return c;
					}
				}

				return null;
			};

			window.NaturalShell.Native.LaunchApplication = function(id, args)
			{
				var c = window.NaturalShell.Native.GetApplication(id);

				if(c === null)
				{
					return null;
				}

				return c.run(args);
			};

			window.NaturalShell.Native.GetAllApplications = function()
			{
				return CNaturalApplicationList;
			};

			window.NaturalShell.Native.__DesktopNotifications = [];
			window.NaturalShell.Native.__DesktopNotificationsEvents = [];

			window.NaturalShell.Native.ReceiveDesktopNotifications = function(ev)
			{
				window.NaturalShell.Native.__DesktopNotificationsEvents.push(ev);
			};

			window.NaturalShell.Native.ShowDesktopNotification =
				function(title, message, event_activated, opt_image_url)
			{
				window.NaturalShell.Native.__DesktopNotifications.push(
					{
						title: title,
						description: message,
						event_activated: event_activated,
						image_url: opt_image_url
					}
				);

				var nt = window.$ntc("#_shellscreen__alert");

				nt.alertMoveForever();

				window.NaturalShell.Native.__DesktopNotificationsEvents.forEach((ev) =>
				{
					return ev();
				});
			};

			window.NaturalShell.Native.GetDesktopNotifications =
				function()
			{
				return window.NaturalShell.Native.__DesktopNotifications;
			};

			window.NaturalShell.Native.AllNotificationsViewed = function()
			{
				var nt = window.$ntc("#_shellscreen__alert");

				nt.removeClass("gui-animation-alert");
			};

			window.NaturalShell.Native.RemoveDesktopNotification = function(at)
			{
				window.NaturalShell.Native.__DesktopNotifications.splice(at, 1);
			};

			window.NaturalShell.CurrentShell = window.NaturalShell.Native;

			importApps(() =>
			{
				CNaturalDefaultWindowManager.showToplevel();

				$ntc("#_shellscreen__apps").on("click", () =>
				{
					console.log("Opening <launcher>");
					window.NaturalShell.Native.LaunchApplication("org.cnatural.applications.native.launcher", []);
				});

				$ntc("#_shellscreen__menu").on("click", () =>
				{
					console.log("Opening <open windows>");
					window.NaturalShell.Native.LaunchApplication("org.cnatural.applications.open_windows", []);
				});

				$ntc("#_shellscreen__alert").on("click", () =>
				{
					console.log("Opening <desktop notifications>");
					window.NaturalShell.Native.LaunchApplication("org.cnatural.applications.native.desktop_notification", []);
				});

				$ntc("#_shellscreen__notify").on("click", () =>
				{
					console.log("Opening <desktop notifications>");
					window.NaturalShell.Native.LaunchApplication("org.cnatural.applications.native.desktop_notification", []);
				});

				document.body.dispatchEvent(new CustomEvent("shellLoaded", {}));

				window.NaturalShell.Native.ShowDesktopNotification(
					window.$natural.getPOMessage("welcome_ttl"),
					window.$natural.getPOMessage("welcome_desc"),
					() => {}
				);
			});
		}
	);
});
