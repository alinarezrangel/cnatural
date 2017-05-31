/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Clock (time and date) app for Natural.
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
				"shelldesc": "Mira la hora en el servidor y el tu cliente",
				"title": "Reloj",
				"timeDifference": "Diferencia de tiempo",
				"serverTime": "Tiempo en el servidor (convertido)",
				"clientTime": "Tiempo en el cliente (local)"
			}
		},
		"en": {
			"all": {
				"shelldesc": "See the time at the server and at your client",
				"title": "Clock",
				"timeDifference": "Time difference",
				"serverTime": "Time on the server (converted)",
				"clientTime": "Time on the client (local)"
			}
		}
	};

	function ClockApplication(context, window_system)
	{
		window.NaturalShell.Base.Application.call(this, context, window_system);

		var LangMap = window.$natural.selectPOMapIn(POMap, window.$natural.Localization);

		// Metadata here
		this.setName("Clock");
		this.setID("org.cnatural.applications.clock");
		this.setNamespace("CNatural:Software:Desktop:Applications:Builtins");

		this.setMetadataIcon("/resources/images/icons/clock-icon.svg");
		this.setMetadataCategory("System");
		this.setMetadataGenericName(LangMap["title"]);
		this.setMetadataComment(LangMap["shelldesc"]);
		this.setMetadataGraphical(true);
		this.setMetadataShowInShell(true);
	}

	ClockApplication.prototype = Object.create(window.NaturalShell.Base.Application.prototype);

	ClockApplication.prototype.run = function(args)
	{
		var appdata = this.createInstance();
		// Lang here
		var LangMap = window.$natural.selectPOMapIn(POMap,
			window.NaturalShell.CurrentShell.GetShortNameArgument(args, "-l") ||
			window.NaturalShell.CurrentShell.GetLongNameArgument(args, "--lang") ||
			window.$natural.Localization
		);

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
				noPadding: false
			}
		);

		mainContainer.pack("BEGIN");

		var rowContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.RowContainer,
			{
				parent: mainContainer.getElement()
			}
		);

		rowContainer.pack("BEGIN");

		var serverTimeContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.ContainerWithHeader,
			{
				parent: rowContainer.getElement(),
				color: "color-ocean",
				level: 3,
				size: "content.title",
				title: LangMap.serverTime
			}
		);

		serverTimeContainer.pack("APPEND");
		serverTimeContainer.getElement()
			.addClass("col")
			.addClass("od-1")
			.addClass("fx-1");

		var clientTimeContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.ContainerWithHeader,
			{
				parent: rowContainer.getElement(),
				color: "color-ocean",
				level: 3,
				size: "content.title",
				title: LangMap.clientTime
			}
		);

		clientTimeContainer.pack("APPEND");
		clientTimeContainer.getElement()
			.addClass("col")
			.addClass("od-1")
			.addClass("fx-1");

		var serverTime = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: serverTimeContainer.getBody(),
				text: "00:00:00"
			}
		);

		serverTime.getElement()
			.addClass("text-jumbo")
			.addClass("width-block")
			.addClass("no-margin")
			.addClass("no-padding")
			.addClass("text-center");

		serverTime.pack("APPEND");

		var clientTime = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: clientTimeContainer.getBody(),
				text: "00:00:00"
			}
		);

		clientTime.getElement()
			.addClass("text-jumbo")
			.addClass("width-block")
			.addClass("no-margin")
			.addClass("no-padding")
			.addClass("text-center");

		clientTime.pack("APPEND");

		var differenceContainer = window.NaturalWidgets.Create(
			window.NaturalWidgets.ContainerWithHeader,
			{
				parent: mainContainer.getElement(),
				color: "color-ocean",
				level: 3,
				size: "content.title",
				title: LangMap.timeDifference
			}
		);

		differenceContainer.pack("APPEND");

		var timeDifference = window.NaturalWidgets.Create(
			window.NaturalWidgets.Text,
			{
				parent: differenceContainer.getBody(),
				text: "+00:00:00"
			}
		);

		timeDifference.getElement()
			.addClass("text-jumbo")
			.addClass("width-block")
			.addClass("no-margin")
			.addClass("no-padding")
			.addClass("text-center");

		timeDifference.pack("APPEND");

		var interval = window.setInterval(function()
		{
			window.$natural.ajax({
				url: "/api/ajax/coreutils/time/get",
				args: {},
				pdata: {},
				async: true
			}, (err, response) =>
			{
				if(err)
				{
					console.error("ClockApplication: " + err);
					return;
				}

				var dt1 = new Date(window.NaturalClient.ConvertServerTime(response));

				var hours1 = dt1.getHours();
				var minutes1 = dt1.getMinutes();
				var seconds1 = dt1.getSeconds();

				serverTime.changeText(
					((hours1 < 10)? "0" + hours1 : hours1) +
					":" +
					((minutes1 < 10)? "0" + minutes1 : minutes1) +
					":" +
					((seconds1 < 10)? "0" + seconds1 : seconds1)
				);

				var dt2 = new Date();

				var hours2 = dt2.getHours();
				var minutes2 = dt2.getMinutes();
				var seconds2 = dt2.getSeconds();

				clientTime.changeText(
					((hours2 < 10)? "0" + hours2 : hours2) +
					":" +
					((minutes2 < 10)? "0" + minutes2 : minutes2) +
					":" +
					((seconds2 < 10)? "0" + seconds2 : seconds2)
				);

				var hours3 = hours2 - hours1;
				var minutes3 = minutes2 - minutes1;
				var seconds3 = seconds2 - seconds1;
				var sign3 = "+";

				if(dt2 < dt1)
				{
					sign3 = "-";
				}

				timeDifference.changeText(
					sign3 +
					((hours3 < 10)? "0" + hours3 : hours3) +
					":" +
					((minutes3 < 10)? "0" + minutes3 : minutes3) +
					":" +
					((seconds3 < 10)? "0" + seconds3 : seconds3)
				);
			});
		}, 500);

		myWindow.addEventListener("close", () =>
		{
			window.clearInterval(interval);
		});

		this.getWindowSystem().getWindowManager().showToplevel();

		return 0;
	};

	return ClockApplication;
});
