# From scratch: Launching apps #

Ready to launch some apps! is really easy and the Native desktop provides some
useful shortcuts for the more-used apps. First, open the *Launcher* by clicking
the button on the topbar that contains an icon like a grid, that will open the
launcher app. Inside the launcher app click the clock app. The clock app
should be opened, and if is, congratulations! you opened your first app! (see
troubleshooting if something is wrong).

## Searching apps ##

Open the menu in the Launcher app and start to write in the text field. The
area below the text field contains buttons to open the apps. When you see
the app in the area below, click it's button to open it.

## From CTerminal ##

Two apps for low-level control of CNatural are *CTerminal* and *STerminal*,
the first controls the client and the second controls the server. If you
are in the server CLI, the command `cnatural-sterminal` provided along other
useful server-side interfaces is basicly the same program.

From the CTerminal, use the app id of the app that you want to open, for
example, to open the *Clock* app, use the command
`org.cnatural.applications.clock`.

## From STerminal ##

Use the command `client app open [appid]` and replace `[appid]` with the app
ID of the application that you want to open, for example: to open the clock
app on **all** connected clients, use
`client app open org.cnatural.applications.clock`.

## Notes and links ##

*There are no notes for now*

