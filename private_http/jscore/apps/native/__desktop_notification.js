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
		"es": {
			"all": {
				"title": "Notificaciones",
				"throwtestbtn": "Lanzar notificacion de prueba"
			}
		},
		"en": {
			"all": {
				"title": "Notifications",
				"throwtestbtn": "Raises a test notification"
			}
		}
	};

	function DesktopNotificationApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		// Metadata here
		this.setName("Desktop Notification");
		this.setID("org.cnatural.applications.native.desktop_notification");
		this.setNamespace("CNatural:Software:Desktop:Native:Applications:Builtins");

		this.setMetadataIcon("/resources/images/icons/desktop-notification-icon.svg");
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
		var LangMap = window.$natural.selectPOMapIn(POMap,
			window.NaturalShell.Native.GetShortNameArgument(args, "-l") ||
			window.NaturalShell.Native.GetLongNameArgument(args, "--lang") ||
			window.$natural.Localization
		);

		var myWindow = this.getWindowSystem().createDefaultWindow(
			LangMap.title,
			appdata
		);

		var windowBody = myWindow.getBody();
		var windowStyle = myWindow.getStyle();

		var windowMenu = myWindow.getMenu();

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

		var throwtestbtn = window.NaturalWidgets.Create(
			window.NaturalWidgets.Button,
			{
				parent: windowMenu,
				text: LangMap.throwtestbtn
			}
		);

		throwtestbtn.pack("APPEND");

		throwtestbtn.getElement()
			.addClass([
				"color-gui-button",
				"gui-clickeable",
				"width-block",
				"margin-4",
				"padding-16"
			])
			.on("click", () =>
			{
				window.NaturalShell.CurrentShell.ShowDesktopNotification(
					"Test",
					"CNatural",
					() => {},
					"/cards/system-card.svg"
				);
			});

		var packNotification = (parent, i, imgurl, title, description, event_activate) =>
		{
			var ct = window.NaturalWidgets.Create(
				window.NaturalWidgets.Container,
				{
					parent: parent
				}
			);

			var rw = window.NaturalWidgets.Create(
				window.NaturalWidgets.RowContainer,
				{
					parent: ct.getElement()
				}
			);

			var img = window.NaturalWidgets.Create(
				window.NaturalWidgets.Image,
				{
					parent: rw.getElement(),
					src: "/resources/images/" + imgurl,
					width: 64,
					height: 64,
					alt: "[Notification Image Here]"
				}
			)

			var ttl = window.NaturalWidgets.Create(
				window.NaturalWidgets.Header,
				{
					parent: rw.getElement(),
					text: title,
					size: "content.title",
					level: 5
				}
			);

			var txt = window.NaturalWidgets.Create(
				window.NaturalWidgets.Text,
				{
					parent: ct.getElement(),
					text: description
				}
			);

			ct.getElement()
				.addClass("card")
				.addClass("sw-2")
				.addClass("border")
				.addClass("bs-2")
				.addClass("border-color-grey")
				.addClass("padding-16")
				.addClass("margin-4")
				.addClass("color-white")
				.addClass("gui-clickeable")
				.addClass("gui-width-auto")
				.addClass("gui-margin-bottom");

			rw.getElement()
				.addClass("padding-8")
				.addClass("no-margin");

			ttl.getElement()
				.addClass("fx-1")
				.addClass("od-2");

			img.getElement()
				.addClass("od-1")
				.addClass("border-jumbo-round")
				.addClass("border")
				.addClass("bs-2")
				.addClass("border-color-grey")
				.addClass("no-padding")
				.addClass("margin-4");

			txt.getElement()
				.addClass("gui-select");

			rw.pack("BEGIN");
			img.pack("APPEND");
			ttl.pack("APPEND");
			txt.pack("APPEND");
			ct.pack("APPEND");

			ct.getElement()
				.on("click", () =>
				{
					ct.getElement().remove();
					window.NaturalShell.CurrentShell.RemoveDesktopNotification(i);
				});

			ttl.getElement()
				.on("click", () =>
				{
					if(typeof event_activate === "function")
						return event_activate();
				});
		};

		var interval = window.setInterval(function()
		{
			var pg = mainContainer.getElement();

			while(pg.original.firstChild)
				pg.original.removeChild(pg.original.firstChild);

			window.NaturalShell.CurrentShell.GetDesktopNotifications().forEach((notification, i) =>
			{
				packNotification(
					pg,
					i,
					notification.image_url || "cards/syslog-card.svg",
					notification.title,
					notification.description,
					notification.event_activate
				);
			});

			window.NaturalShell.CurrentShell.AllNotificationsViewed();
		}, 1000);


		myWindow.addEventListener("close", () =>
		{
			this.isOpenALauncher = false;
			window.clearInterval(interval);
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return DesktopNotificationApplication;
});
