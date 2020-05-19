# falco
Sanitary pair and mob programming for the modern age

![](icon.jpg)

Use this handy dandy script (in conjunction with [a remote meeting tool](https://zoom.us) and a [sweet timer](http://mobster.cc)) to coordinate driver rotations through git, and bring your remote mob programming sessions back to life!

## Install

    npm i -g @aptera/falco

## Use

### Everybody in the session
1. Navigate to your project directory in a terminal.
1. If you're not working on `master`, checkout the branch you'll be using.

### First driver
1. Begin the session with `falco start`. (This will create a `<working-branch>-mobbing` branch off the working branch, to hold work-in-progress commits during the session.)
1. When it's time to switch to the next driver, `falco pass`. (This will make a "wip" commit and push it to the `<working-branch>-mobbing` branch.)

### Nth driver
1. Begin your turn with `falco drive`. (This will checkout the `<working-branch>-mobbing` branch and pull down the latest wip commit(s).)
1. When it's time to switch to the next driver, `falco pass`.

### Baby driver
A solid 93% on Rotten Tomatoes.

### Last driver
1. Use `falco commit <message>` to commit work in progress, squash merge, and push to the original working branch.
2. If you are not the last driver, or if you do not want to merge the session's results, use `falco stop` to clean up your local workspace and return to the original working branch.