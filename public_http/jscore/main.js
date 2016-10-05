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
		async: true
	}, function(err, res)
	{
		if(err)
		{
			console.error(err);
			return;
		}
		var win = NWCreate(NWDialog, {
			parent: $ntc("#_bootscreen")
		});
		var message = NWCreate(NWHeader, {
			parent: win.getElement(),
			level: 2,
			size: "content.title"
		});
		var text = NWCreate(NWPlainText, {
			parent: message.getElement(),
			text: "Response: " + res
		});
		win.getElement()
			.style({
				top: "50%",
				left: "50%",
				width: "50%",
				height: "12%",
				transform: "translateX(-50%)"
			})
			.addClass("color-aqua");
		text.pack("APPEND");
		message.pack("BEGIN");
		win.pack("APPEND");
	});
	$ntc("#_bootscreen").attach(function(ev)
	{
		$ntc("#_bootscreen").hideSlideUp();
		$ntc("#_loginscreen").removeClass("gui-hidden");
	}).on("click");
});
