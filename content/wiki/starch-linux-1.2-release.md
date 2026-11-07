---
title: Starch Linux 1.2 Release
description: Release notes and information for Starch Linux 1.2
category: content/wiki-categories/releases.yml
date: 2026-11-05
---
Starch Linux 1.2 is released!

This update focuses mainly on features, few fixes included

Features:

- Optional advanced tab in installer 
- Starch Lite pre-configuration which replaces the LTS + Systemd default config with Zen + OpenRC (Huge thanks to the Artix Linux team for allowing use of their repos)
- Additional option for Starch Lite package only to run the Xfce desktop, significantly changes user experience in favor of extremely light operation
- Switched out Konsole for the Cosmic terminal, retains fish shell

Fixes:

- The online installation now retries failed package downloads with fallbacks, this makes a more resilient installation
- Removed annoying beeps that play during live boot

Starch Lite runs incredibly light when running Xfce, I was personally surprised to see it idle at only 800MB ram usage on real hardware(not a promise, but a benchmark). Starch Lite with KDE isn’t much lighter than the standard LTS, but it does still remove Systemd if that is important to you. I have configured the low ram configuration with the tools in the Zen kernel and done some very minor service trimming, and that’s about all the additional manual tuning Lite has. I didn’t want to end up with something that runs impressively light but is very challenging to use, so I struck a balance. If you're not experienced with OpenRC, I highly recommend researching its differences with Systemd and reading my article discussing Systemd in comparison to other inits. That article is here: ++[https://starchlinuxproject.org/wiki/systemd-explained/](https://starchlinuxproject.org/wiki/systemd-explained/)++ 

The standard LTS configuration will be pretty much exactly how it was before, though now I ship Cosmic terminal instead of Konsole. You can expect the same reliability and customizability as before.

I hope you guys enjoy this new little option, it diverts a little bit from the original direction in a way I really like. I have lots of fun plans in the pipeline for this goofy little distro, so keep tuned in on occasion and maybe you’ll be surprised. 

Enjoy,

SethDoesTech