/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Help app for Native.
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

window.NaturalShell.CurrentShell.RegisterApplication(function(window, document)
{
	// POMap: at least es_VEN and en_US
	var POMap = {
		"es_VEN": {
			"title": "Notificaciones"
		},
		"en_US": {
			"title": "Notifications"
		}
	};

	function DesktopNotificationApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		// Metadata here
		this.setName("Desktop Notification");
		this.setID("org.cnatural.applications.native.desktop_notification");
		this.setNamespace("CNatural:Software:Desktop:Native:Applications:Builtins");

		this.setMetadataIcon("/resources/images/icons/executable-icon.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName("Desktop Notification");
		this.setMetadataComment("Look at your notifications");
		this.setMetadataGraphical(true);
		this.setMetadataShowInShell(true);

		this.isOpenALauncher = false;
	}

	DesktopNotificationApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	DesktopNotificationApplication.prototype.run = function(args)
	{
		if(this.isOpenALauncher)
		{
			return;
		}

		this.isOpenALauncher = true;

		var appdata = this.createInstance();
		// Lang here
		var LangMap = POMap[
			window.NaturalShell.Native.GetShortNameArgument(args, "-l") ||
			window.NaturalShell.Native.GetLongNameArgument(args, "--lang") ||
			"en_US"
		];

		var myWindow = this.getWindowSystem().createDefaultWindow(
			LangMap.title,
			appdata
		);

		var windowBody = myWindow.getBody();
		var windowStyle = myWindow.getStyle();

		windowStyle.removeBorders();
		windowStyle.updateColors();

		var mainContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.MainContainer,
			{
				parent: windowBody,
				noPadding: true
			}
		);

		mainContainer.pack("BEGIN");

		var packNotification = (parent, i, title, description, event_activate) =>
		{
			var ct = window.NaturalWidgets.Create(
				window.NaturalWidgets.ContainerWithHeader,
				{
					parent: parent,
					level: 3,
					size: "content.title",
					color: "color-ocean",
					title: title
				}
			);

			var txt = window.NaturalWidgets.Create(
				window.NaturalWidgets.Text,
				{
					parent: ct.getBody(),
					text: description
				}
			);

			ct.getElement()
				.addClass("gui-clickeable");

			txt.pack("APPEND");
			ct.pack("APPEND");

			ct.getBody()
				.on("click", () =>
				{
					ct.getElement().remove();
					window.NaturalShell.CurrentShell.RemoveDesktopNotification(i);
					return event_activate();
				});

			ct.getHeader()
				.on("click", () =>
				{
					ct.getElement().remove();
					window.NaturalShell.CurrentShell.RemoveDesktopNotification(i);
				});
		};

		window.NaturalShell.CurrentShell.GetDesktopNotifications().forEach((notification, i) =>
		{
			packNotification(
				mainContainer.getElement(),
				i,
				notification.title,
				notification.description,
				notification.event_activate
			);
		});

		window.NaturalShell.CurrentShell.AllNotificationsViewed();

		myWindow.addEventListener("close", () =>
		{
			this.isOpenALauncher = false;
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return DesktopNotificationApplication;
});
