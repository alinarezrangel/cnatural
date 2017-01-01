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

		NWCreateTextDialog($ntc("#_bootscreen"), 2, "Error: " + res, function(win, msg, txt)
		{
			win.getElement().addClass("text-natural-darkred");
		});
	});

	$ntc("#_bootscreen").attach(function(ev)
	{
		$ntc("#_bootscreen").hideSlideUp();
		$ntc("#_loginscreen").removeClass("gui-hidden");
	}).on("click");

	$ntc("#login_button").attach(function(ev)
	{
		var win = NWCreateTextDialog(
			$ntc("#_loginscreen"),
			2,
			"Iniciando sesión, por favor espere...",
			function(win, msg, txt)
			{
				win.getElement().addClass("color-natural-grey");
			}
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
				var err = NWCreateTextDialog(
					$ntc("#_loginscreen"),
					2,
					"Error fatal: " + res,
					function(win, msg, txt)
					{
						win.getElement().addClass("color-natural-deepred");
					}
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


						$natural.includeScripts(document, res);
					})
				})
			});
		});
	}).on("click");
});
