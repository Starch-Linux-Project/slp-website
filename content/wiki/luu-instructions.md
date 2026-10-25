---
title: Linux Update Utility Installation and Usage Guide
description: Instructions for installing and using Linux Update
  Utility(10/24/26) *Edited(10/25/26)
category: content/wiki-categories/installation-guides.yml
order: 10
---
Hello;

This guide will take you step by step on installing and using Linux Update Utility your computer. 

Prerequisites and good-to-knows: 

1. A Linux system with somewhat recent packages (Ultra-reliable server-desktop systems may have considerably aged packages)
2. You WILL use the terminal (No, it’s not scary)
3. Linux Update Utility was created and is maintained by 1 person, me :)

![Screenshot_20261024_143933.png](/wiki/images/screenshot20261024143933-1.png)

Once you’ve got these requirements out of the way, installation will fly by. Explanation for commands and practices will be provided when needed. If you need help, the Discord is always available. Tundra and I are quite active and can help you get going very quickly. This example is running Fedora KDE, but steps are the same across all systems. 

Navigate to the download page and download the LUU Setup Utility;

++[starchlinuxproject.org/download](http://starchlinuxproject.org/download)++ 

![Screenshot_20261024_144059.png](/wiki/images/screenshot20261024144059.png)

Instructions from here may have to be interpreted slightly for new releases, however only the file name will change. 

Now open your terminal, your web browser will no longer be need;

Use the cd command to enter your downloads directory;

cd Downloads

![Screenshot_20261024_144245.png](/wiki/images/screenshot20261024144245.png)

Do a quick ls to get the exact name of the file;

Make sure to either leave this on screen or remember it.

![Screenshot_20261024_144334.png](/wiki/images/screenshot20261024144334.png)

Now we make the file executable with chmod;

Use chmod 744 to make the file executable. The tool chmod is a standard Linux tool, 744 makes the file only executable by the owner, which is you. 

The command is chmod 744 followed by the exact name of the file. 

Then repeat the ls, notice that it appears differently compared to before. 

![Screenshot_20261024_144458.png](/wiki/images/screenshot20261024144458.png)

To run it, simply type ./ followed by the exact file name;

As long as the app loads, errors in the terminal can be ignored. 

![Screenshot_20261024_144552.png](/wiki/images/screenshot20261024144552.png)

To install, click “Yes, Set Up” and enter your PIN once prompted;

This installs the app like any other app on your computer, simply search for it with your desktop environment’s existing utility and click on it to open it. 

![Screenshot_20261024_144626.png](/wiki/images/screenshot20261024144626.png)

You have successfully installed Linux Update Utility! 

The rest of this guide will consist of a tour and usage instructions;

![Screenshot_20261024_144712.png](/wiki/images/screenshot20261024144712-1.png)

Absorb the layout for a little bit, don’t be afraid to push buttons. This app has no processes which can break your Linux system. 

The settings menu contains a themes menu and an option to uninstall the app;

Uninstalling the app removes all of its files permanently and cannot be undone. 

To resume usage after an uninstall, reinstall the app. 

![Screenshot_20261024_144744.png](/wiki/images/screenshot20261024144744.png)

The System Info tab contains some information about the app and your computer;

At the top is your Linux distribution

Next is your CPU architecture

Next is your kernel

Next is your package managers

Next is the status of the update script

![Screenshot_20261024_144842.png](/wiki/images/screenshot20261024144842-1.png)

Now you should generate an update script for your system;

This detects what package managers your system uses and creates a script for the program to run in order to update packages with them. 

This app operates the terminal for you, doing many tasks most Linux users already do. 

![Screenshot_20261024_144923.png](/wiki/images/screenshot20261024144923.png)

To update your system, click Update System;

This runs the script we generated in the previous step. It uses your PIN to authorize the commands for you, your PIN is not permanently stored by the app nor does it ever leave your computer.

![Screenshot_20261024_145046.png](/wiki/images/screenshot20261024145046.png)

Your system is now being updated! During updates you’ll see a loading wheel and the terminal moving along, requiring no input. The terminal may sit still for a long time, that behavior is completely normal and doesn’t necessarily mean something has gone wrong. 

![Screenshot_20261024_145145.png](/wiki/images/screenshot20261024145145.png)

Once met with the Update Complete message, it means your system is now up to date. To keep it up to date, periodically open the app and click Update System. 

![Screenshot_20261024_145333.png](/wiki/images/screenshot20261024145333.png)

You are now equipped with a tool to easily keep your system up-to-date! Thank you for using my app, and always feel free to join the Discord and support me. 

Enjoy,

SethDoesTech