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

/**
 * Attaches the events to the clients front-end.
 *
 * The the user logins and opens the select-DE-screen, this function is
 * called to attach the events to each card and start the corresponding
 * DE.
 *
 * @param {string} token - The user auth token tu use in API calls.
 *
 * @private
*/
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

(function()
{
	// Search for the GET parameter `client_language` and override the
	// browser's window.navigator.language with these

	// CNatural Client's Language ID Spec:
	//
	// ~  <base-name> ::= "es" | "en"
	// ~  <sub-language> ::= "all"
	// ~  <language-id> ::= <base-name> "-" <sub-language>
	//
	// For example: "en-US" is english from United States,
	// "es-VEN" is spanish from Venezuela and
	// "en" only specifies english (equal to "en-all")
	//
	// If the language not exists, it's replaced by "en-all".

	window.location.search
	.substr(1)
	.split("&")
	.forEach((value) =>
	{
		var t = value.split("=").map((value) => decodeURIComponent(value));
		var name = t[0];
		var value = t[1];

		switch(name)
		{
			case "client_language":
				// Special values:
				switch(value)
				{
					case "auto":
					case "client":
						// * "auto" it's like not set the flag:
						return;
					case "server":
						// * "server" uses the server language:
						// TODO
						break;
				}

				if(value.split("-".length <= 1))
				{
					value += "-all";
				}

				if(!$natural.GlobalPOMapSupportedLangs.indexOf(value))
				{
					value = value.split("-")[0];

					if(!$natural.GlobalPOMapSupportedLangs.indexOf(value))
					{
						// Language s is not supported:
						value = "en-all";
					}
					else
					{
						// Sublanguage invalid:
						value += "-all";
					}
				}

				window.NaturalObject.prototype.Localization = value;

				(new window.NaturalObject(document)).reloadGlobals(window);
				break;
		}
	});

	// Verify that the language exist globally
	if($natural.selectMessagePOMapIn(
			"welcomettl",
			$natural.GlobalPOMap,
			$natural.Localization
		) === null)
	{
		// Bad or crafted localization: use "en-all"
		window.NaturalObject.prototype.Localization = "en-all";
		(new window.NaturalObject(document)).reloadGlobals(window);
	}
}());

$ntc(window).on("load", function()
{
	// Init all front-end and start the client

	// Prevent the browser's contextmenu from appear in any place when
	// the users right-clicks anything
	$ntc(document.body).on("contextmenu", (ev) =>
	{
		ev.preventDefault();
	}, false);

	// We should test that the server is accesible via the coreutils.test
	// method, this will return "Hello World" on success
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

		NaturalWidgets.CreateTextDialog($ntc("#_bootscreen"), "Fatal error", "Error: " + res, function(win, msg, txt)
		{
			win.getElement().addClass("text-natural-darkred");
		});
	});

	// Replace the semantic iconset tags (like "home") with it's
	// FontSet value (like "h"), this is NOT DONE automaticlly
	// until we call NaturalObject.include or
	// NaturalObject.includeScripts which will not work until
	// we have a token
	$natural.parseSemanticIconsetTags(document, (s) => {});
	$natural.parsePOMaps(document);

	// "Click anything to continue" on the start screen
	$ntc("#_bootscreen").attach(function(ev)
	{
		$ntc("#_bootscreen").hideSlideUp();
		$ntc("#_loginscreen").removeClass("gui-hidden");
	}).on("click");

	// When the users tries to login:
	$ntc("#login_button").attach(function(ev) // attach() .. on("click")
	{
		$ntc("#login_button").original.disabled = true;

		// Show a dialog saying that the login is in process
		// (if something go wrong like connection failed, the user
		// can know that using the long-delay of login)
		var win = NaturalWidgets.CreateTextDialog(
			$ntc("#_loginscreen"),
			$natural.getPOMessage("loginwindow_ttl"),
			$natural.getPOMessage("loginwindow_desc"),
			(win) => {}
		);

		// Now try to login and get the token:
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
				$ntc("#login_button").original.disabled = false;

				// Bad username or password
				var err = NaturalWidgets.CreateTextDialog(
					$ntc("#_loginscreen"),
					$natural.getPOMessage("errorwindow_ttl"),
					$natural.getPOMessage("errorwindow_desc"),
					(win) => {}
				);
				return;
			}

			// Correctly logged user, save the token:

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

						// Now the token was saved, the user will select a
						// DE and the DE will execute.

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
