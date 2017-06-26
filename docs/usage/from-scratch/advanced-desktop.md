# From scratch: Advanced Desktop #

The desktop have some advanced tips and tricks:

## General ##

### Using GPIOs ###

You can access to the GPIOs (if availables) by installing a driver and using
the *Hardware Control* app. It will contain a grid with each GPIO and it's
state, value and others. From this app the user can directly control all GPIOs
and their mode/value, inclusive PWM, analog inputs/outputs and others. Use the
app's menu to select and configure the board. Remember that this app will not
work if the user that started CNatural cannot access to the GPIOs.

### Accessing serial pins ###

If your board have serial pins, you may want to read from them. First, enable
the serial pins in the *Hardware Control* app, and then read or write from or
to them by using the *Serial Terminal* app.

### Controlling programs on the server ###

Use the *STerminal* app to control the server-side programs.

## For Native ##

* You can add apps to the sidebar by context-clicking them in the *Launcher*.

### Shortcuts ###

| Shortcut             | Action                                            |
| -------------------- | ------------------------------------------------- |
| `Cmd+A`              | Opens the *Launcher* app                          |
| `Cmd+O`              | Opens the *Opened Windows* app                    |
| `Cmd+M`              | Opens the *Notifications* app                     |
| `Cmd+Tab`            | Switchs between apps                              |
| `Cmd+Mayus+Tab`      | Reverses the order of `Cmd+Tab`                   |
| `Cmd+X`              | Executes a program from it's appid                |
| `Cmd+1`              | Gives the keyboard control to the shell's docks   |
| `Cmd+2`              | Gives the keyboard control to the window's docks  |
| `Cmd+3`              | User-defined *                                    |
| `Cmd+4`              | User-defined *                                    |

* The *`cmd`* keystroke is a system-dependent key, generally `Control` (alias
`Ctrl`) but it can be also `Alt` or `Meta` (alias `Escape`|`Esc`).

* * You can program them by using the *Configuration>Keyboard>Shortcuts* app.

## Notes and links ##

*There are no notes for now*

