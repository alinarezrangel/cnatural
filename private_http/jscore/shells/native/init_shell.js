/************************************************
**********************
*** CNatural: Remote embed systems control.
*** * Inits the Native Desktop Environment namespace.
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

(function()
{
	var natsec = function(window, document)
	{
		// Init the shell's NS and metadata
		window.NaturalShell = window.NaturalShell || {};
		window.NaturalShell.Native = window.NaturalShell.CurrentShell;
		window.NaturalShell.Native.Metadata = window.NaturalShell.Native.Metadata || {};

		// Name of the current shell
		window.NaturalShell.Native.Metadata.Name = "Native";

		// Version of the current shell
		window.NaturalShell.Native.Metadata.Version = "0.0.1";

		// Type of the current shell
		window.NaturalShell.Native.Metadata.Type = "tilling/uniwindow";

		// Support for the current shell
		window.NaturalShell.Native.Metadata.Supports = "CNatural; Mozilla.Firefox:Gecko";

		// Used Window
		window.NaturalShell.Native.Metadata.UsedWindow = "Natural Window";

		// Used Window Manager
		window.NaturalShell.Native.Metadata.UsedWindowManager = "Fixed Window Manager";

		// Used Window System
		window.NaturalShell.Native.Metadata.UsedWindowSystem = "Natural Window System";

		// Used Window Style
		window.NaturalShell.Native.Metadata.UsedWindowStyle = "Natural Window Style";
	};

	if(typeof module !== "undefined")
	{
		module.exports = natsec; // NodeJS, AngularJS, NativeScript, RequireJS, etc
	}
	else
	{
		natsec(window, document); // Browser JS
	}
}());
