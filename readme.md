# falco
Sanitary pair and mob programming for the modern age

![](icon.jpg)

Use this handy dandy script (in conjunction with [a remote meeting tool](https://zoom.us) and a [sweet timer](http://mobster.cc)) to coordinate driver rotations through git, and bring your remote mob programming sessions back to life!

## Install

### Bash (macOS, Linux)

1. Download [falco](bash/falco.sh) and [its install script](bash/install.sh) to the same directory. 
1. Run the install script.

### PowerShell (Windows)

1. Download [falco](powershell/falco.ps1) and [its install script](powershell/install.ps1) to the same directory.
1. If necessary, run `Unblock-File install.ps1`.
1. Run the install script.

## Use

### Everybody in the session
Navigate to your project directory in a terminal.

### First driver
1. If you're not working on `master`, checkout the branch you'll be using.
1. Begin the session with `falco start`. (This will create a `mobbing` branch off the working branch, to hold work-in-progress commits during the session.)
1. When it's time to switch to the next driver, `falco pass`. (This will make a "wip" commit and push it to the `mobbing` branch.)

### Nth driver
1. Begin your turn with `falco drive`. (This will checkout the `mobbing` branch and pull down the latest wip commit(s).)
1. When it's time to switch to the next driver, `falco pass`.

### Baby driver
A solid 93% on Rotten Tomatoes.

### Last driver
1. Use `falco commit <message>` to commit work in progress, squash merge, and push to the original working branch.
2. If you are not the last driver, or if you do not want to merge the session's results, use `falco stop` to clean up your local workspace and return to the original working branch.