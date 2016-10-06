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
		pdata: "",
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
		var pd = "username: ";
		pd += $ntc("#login_username").value() + "\n";
		pd += "password: " + $ntc("#login_password").value();
		var win = NWCreateTextDialog($ntc("#_loginscreen"), 2, "Iniciando sesión, por favor espere...", function(win, msg, txt)
		{
			win.getElement().addClass("text-natural-grey");
		});
		$natural.ajax({
			url: "/api/ajax/coreutils/login",
			args: {},
			pdata: pd,
			async: true
		}, function(err, res)
		{
			if(err)
			{
				console.error(err);
				return;
			}
			win.getElement().remove();
			alert(res);
		});
	}).on("click");
});
