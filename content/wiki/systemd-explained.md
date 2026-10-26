---
title: "systemd: Everyone's Ugly Duckling That Never Goes Away"
description: Learn about systemd, why it's fantastic, why it sucks, its
  alternatives, and what it means to you. (10/25/26)
category: content/wiki-categories/linux-explained.yml
order: 10
---
Hello;

  


Quick notice, there's some technical stuff in here. I’ll try to provide explanations for newbies, but technical subjects require technical knowledge no matter the day of the week. Also, there is sarcasm. 

- *What?*

Systemd has been getting more and more controversial by the hour for over a decade. Goobers on TikTok flex their lack of systemd, while Red Hat invests another million dollars into the project. So one naturally asks, 

What gives?

- *Why?*

Realistically speaking, and don’t be offended by this if you're a TikTok goober, you’re using systemd as we speak. It’s hands down the most widely supported and most commonly understood init system. (Init systems are generally responsible for starting your system and managing its services and resources). While there are inits that the community loves such as runit, Dinit and OpenRC, these alternatives must be sought out. If you're not specifically looking for a systemd alternative, you're likely running systemd. It’s assumed by many developers that it will be present on your system, which makes it a dependency in many cases. (A dependency is software which is required for another piece of software to operate).

  


Check your init system:

ps -p 1 -o comm=

  


This checks the process currently running as PID 1, which is basically the throne of the process hierarchy. The output should name your init. 

- *Please explain.*

Systemd does many things correctly. It uses simple commands like “systemctl enable bluetooth”, which is pretty self-explanatory. It covers every single possible base you could ever want an init system to cover, which is both its number one pro and absolute pitfall. Its years of maturity and resources make it generally dependable. With its full suite installed it covers  many bases that can make things easier for developers, since they don’t have to find or create external solutions.

  


However, this large suite can drive up RAM usage, storage usage and often lead to it doing jobs init systems were never intended to do, though this depends on how it’s configured. It comes with its own suite of configurations for things like networking and it has an extensive (subjectively resource intensive) integrated logging system. It also uses its own service management format called unit files in place of traditional shell scripts. (It can technically run shell scripts and not all other inits use shell scripts, but this is generally how things work). The project’s broad inclusion, potentially heavy resource usage compared to minimalist alternatives and the separation from “Do one thing and one thing well” Unix philosophy often fuel criticism. Many people like to aggressively push Unix philosophy onto core system components, and understandably so. 

- *You spent real time writing this?*

What does SethDoesTech, the developer of the software on this website and the website itself, think of systemd? I am using it on the system I’m currently typing on. I see systemd from both sides, and I use it how I see fit accordingly. Linux Update Utility contains nothing systemd-specific on purpose. Starch Linux by default uses systemd in its LTS configuration. On Starch Linux, I trimmed down the bloat of systemd and the KDE desktop, and so Starch runs considerably lighter compared to many similar systems. I don’t want to make any callouts, and so I invite you to make comparisons yourself.  On the same token, Starch is getting an optional OpenRC configuration soon as an advanced option. It may be available by the time you're reading. Check the newest release notes. I have taken to using OpenRC on systems I know I won’t use systemd-dependent software on. I personally love OpenRC, and honestly only find myself with systemd because it’s often necessary. 

- *What’s important?*

At the end of the day, the choice is completely yours. Don’t let a goober in a comment section pick your init system, but don’t let a corpo agent pick it either. In truth, changing your init system won’t completely and radically change your computing experience. It’s completely fair to simply trust the pros to pick it for you, or to learn the ins and outs and pick it yourself. As always when choosing for yourself, choose what you understand and choose with a motive. There is no Biblically-accurate init system, and so you should interpret each in your own usage however you like. 

Happy computing,

SethDoesTech