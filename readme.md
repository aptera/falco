# mobshell
Sanitary pair and mob programming for the modern age

![](icon.png)


Use this handy dandy script to coordinate driver rotation (in conjunction with a remote meeting tool (like Zoom) and a sweet timer (like Mobster)) to bring your remote mob programming sessions back to life!

## Install

1. Download [the script](mobshell.sh)
1. Copy it to your bin: `cp mobshell.sh /usr/local/bin/mobshell`
1. Give it permish: `chmod +x /usr/local/bin/mobshell`

## Use

### Everybody in the session
Navigate to your project directory in a bash terminal.

### First driver
1. If you're not working on `master`, checkout the branch you'll be using.
1. Begin the session with `mobshell start`. (This will create a `mobbing` branch off the working branch, to hold work-in-progress commits during the session.)
1. When it's time to switch to the next driver, `mobshell pass`. (This will make a "wip" commit and push it to the `mobbing` branch.)

### Nth driver
1. Begin your turn with `mobshell drive`. (This will checkout the `mobbing` branch and pull down the latest wip commit(s).)
1. When it's time to switch to the next driver, `mobshell pass`.

### Last driver
1. Use `mobshell commit "{message}"` to commit work in progress, squash merge, and push to the original working branch.
2. If you are not the last driver, or if you do not want to merge the session's results, use `mobshell stop` to clean up your local workspace and return to the original working branch.