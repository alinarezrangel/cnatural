/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * main file for the ECMAScript core.
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

window.NaturalClient = window.NaturalClient || {};

// Metadata:

// Name of the client
window.NaturalClient.Name = "CNatural Client (Araguaney v0.0.1)";

// Version of the client
window.NaturalClient.Version = "0.0.1";

// Codename of the client
window.NaturalClient.Codename = "Araguaney";

// JavaScript reserved name (non-exaustive list)
window.NaturalClient.ReservedNames = [
	"$ntc",
	"$natural",
	"NaturalObject",
	"NaturalShell",
	"NaturalStorage",
	"NaturalWidgets",
	"NaturalClient"
];

window.NaturalClient.Generation = window.NaturalClient.Generation || {};

// Minimal Generation Version supported
window.NaturalClient.Generation.MinVersion = "1.1";

// Generation Object
window.NaturalClient.Generation.Object = window.Generation || null;

// Generation Palletes
window.NaturalClient.Generation.Palletes = [
	"default",
	"basics",
	"natural",
	"gui"
];

window.NaturalClient.HTML = window.NaturalClient.HTML || {};

// Minimal HTML Version supported
window.NaturalClient.HTML.MinVersion = "5";

// If the CustomElement API is available
window.NaturalClient.HTML.CustomElementsAPI = false;

// If you can use custom elements forcing a CSS and ignoring warnings
window.NaturalClient.HTML.ForceCustomElements = true;

window.NaturalClient.JavaScript = window.NaturalClient.JavaScript || {};

// Minimal JavaScript Version supported
window.NaturalClient.JavaScript.MinVersion = "5";

// If is running on a browser
window.NaturalClient.JavaScript.BrowserMode = true;

window.NaturalClient.Protocol = window.NaturalClient.Protocol || {};

// CNatural AJAX Protocol Version
window.NaturalClient.Protocol.Version = "0.0.1";

// CNatural AJAX Protocol Type
window.NaturalClient.Protocol.Type = "AJAX-based";

// CNatural AJAX Protocol CSP enabled
window.NaturalClient.Protocol.CSPEnabled = true;

window.NaturalClient.GetToken = function(cll)
{
	var st = $natural.getStorage();

	st.open("CNatural.JS.Storage.Core", (err) =>
	{
		if(err)
		{
			return cll(err);
		}

		st.get("authtoken", (err, value) =>
		{
			if(err)
			{
				return cll(err);
			}

			st.close((err) =>
			{
				if(err)
				{
					return cll(err);
				}

				return cll(null, value);
			});
		});
	});
};

window.NaturalClient.APIRequest = function(method, args, cll)
{
	$natural.ajax({
		url: "/api/ajax/" + method.replace(".", "/"),
		args: {},
		pdata: args,
		async: true
	}, function(err, res)
	{
		return cll(err, res);
	});
};

window.NaturalClient._attach_shell_events = function(token)
{
	var start_native_shell = $ntc("#_start_native_shell");

	start_native_shell.attach(function(ev)
	{
		$ntc("#_mainscreen").hideSlideUp();
		$ntc("#_loadscreen").removeClass("gui-hidden");

		$ntc(document.body).include(token, "htcore/shells/native/shell.html", "text/html", function(err, docmt)
		{
			if(err)
			{
				console.error(err);
				NaturalWidgets.CreateTextDialog($ntc("#_mainscreen"), 2, "Error: " + res, function(win, msg, txt)
				{
					win.getElement().addClass("text-natural-darkred");
				});
				return;
			}

			$natural.includeScripts(document, token, (node) => {});

			$ntc(document.body).on("shellLoaded", function(ev)
			{
				$ntc("#_loadscreen").hideSlideUp();
			});
		}, true);
	}).on("click");
};

$ntc(window).on("load", function()
{
	$natural.ajax({
		url: "/api/ajax/coreutils/test",
		args: {},
		pdata: {
			name: "cnatural",
			version: "1.0.0"
		},
		async: true
	}, function(err, res)
	{
		if(err)
		{
			console.error(err);
			return;
		}

		if(res === "Hello World")
			return;

		NaturalWidgets.CreateTextDialog($ntc("#_bootscreen"), 2, "Error: " + res, function(win, msg, txt)
		{
			win.getElement().addClass("text-natural-darkred");
		});
	});

	$natural.parseSemanticIconsetTags(document, (s) => {});
	$natural.parsePOMaps(document);

	$ntc("#_bootscreen").attach(function(ev)
	{
		$ntc("#_bootscreen").hideSlideUp();
		$ntc("#_loginscreen").removeClass("gui-hidden");
	}).on("click");

	$ntc("#login_button").attach(function(ev)
	{
		var win = NaturalWidgets.CreateTextDialog(
			$ntc("#_loginscreen"),
			$natural.getPOMessage("loginwindow_ttl"),
			$natural.getPOMessage("loginwindow_desc"),
			(win) => {}
		);
		$natural.ajax({
			url: "/api/ajax/coreutils/login",
			args: {},
			pdata: {
				uname: $ntc("#login_username").value(),
				upass: $ntc("#login_password").value()
			},
			async: true
		}, function(err, res)
		{
			if(err)
			{
				console.error(err);
				return;
			}

			win.getElement().remove();

			if(res === "enopass")
			{
				var err = NaturalWidgets.CreateTextDialog(
					$ntc("#_loginscreen"),
					$natural.getPOMessage("errorwindow_ttl"),
					$natural.getPOMessage("errorwindow_desc"),
					(win) => {}
				);
				return;
			}

			var st = $natural.getStorage();
			st.open("CNatural.JS.Storage.Core", function(error)
			{
				if(error)
				{
					console.error(error);
					return;
				}

				st.set("authtoken", res, function(error)
				{
					if(error)
					{
						console.error(error);
						return;
					}

					st.close(function(error)
					{
						if(error)
						{
							console.error(error);
							return;
						}

						$ntc("#_loginscreen").hideSlideUp();
						$ntc("#_mainscreen").removeClass("gui-hidden");

						$natural.includeScripts(document, res, function(sc)
						{
							NaturalClient._attach_shell_events(res);
						}, true);
					});
				});
			});
		});
	}).on("click");
});
