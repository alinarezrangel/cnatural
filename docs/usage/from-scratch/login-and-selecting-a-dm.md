# From scratch: Login and selecting a DM #

So, this is your very first time in CNatural, you have not installed any
desktop or extra applications except for your board's driver. You are
starting *from scratch*. Dont worry! the series *From Scratch* will
introduce you to this new enviroment.

First, you should have compiled, installed and running CNatural. You can
get help about these on the [official wiki][wiki] and on the `README.md` file
on the top-level folder of the project.

## Open CNatural ##

CNatural is running on your board/computer, but what now? first, a TCP/IP
connection between your host computer (the board) and your client computer
(the computer that you will use to control the board) is required. Remember,
in it's lowest level CNatural is just a HTTP server. Once you have connection
with your board, just open it's IP adress using a web browser and use the
port `8888`. For example, if your host IP is `192.168.1.12` open
`192.168.1.12:8888` with your web browser.

You should be able to see a white screen the the text *"CNatural"*
and the CNatural project's logo. The message below the *"Cnatural"*
is localized to one of the CNatural supported languages. If the
language that CNatural is using is not the language that you want,
look at the bottom left corner for a selection widget (looks like
a dropdown: an underlined text) and click it, that will open the
language selection dialog. It's recommended to change your browser's
default language because the CNatural language selection only lasts
one the session (if you close your browser and opens it again,
probably you will need to select again your language).

## Login ##

Now you are on the *"click to login"* starting screen with your
preferred language (if your preferred language is not supported,
you can contribute to CNatural by adding it! just enter to
[our i18n page][contrib-i18n]).

To login just click on any place (except for the change language
dropdown) and the current screen will slide up revealing a new
login screen. The entries are simple: username and password. Both
are set on the `cnatural.conf` file on the server, generally when
you starts CNatural it will ask you for a password, that is the
password that you should enter now. The username is, by default
`"cnatural"`.

After entering the username and password, click the *"Login!"*
button to start login. It will show a loading dialog until
the login is done. If something fails with the login, an
error dialog will be showed.

## Selecting your DM ##

The DM (Desktop Manager) is in CNatural what is called Desktop
Enviroment in normal desktops. After login, you will see multiples
cards, just click the DM that you want to use. For this guide,
using the desktop "Native" is recommended.

## Notes and link ##

*there are no notes for now*

[wiki]: https://cnatural.sourceforge.io/wiki/
[contrib-i18n]: https://cnatural.sourceforge.io/i18n/
