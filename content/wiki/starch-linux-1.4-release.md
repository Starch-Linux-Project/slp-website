---
title: Starch Linux 1.3 Release
description: Release notes and information for Starch Linux 1.2
category: content/wiki-categories/releases.yml
date: 2026-11-24
---
Starch Linux 1.3 is released!

This update focuses on making Starch more approachable, with clearer installation choices and a better-defined purpose.

Starch takes a configured Arch-based system and makes it quick to install through a simple graphical installer.

Features:

- Simplified installation options into three distinct profiles.
- Cleaned up the Xfce configuration, added Slick Greeter, and enabled drag-to-tile.
- Added a COSMIC desktop option for LTS installations.
- Included Linux Update Utility 1.2.2 by default.

Fixes:

- Made the default bootloader configuration more robust.

The new starch:

The advanced selection page has been replaced with a profiles page, offering three configurations:

- KDE Plasma + LTS
- COSMIC + LTS
- Starch Lite

Pick the setup that fits what you want out of your computer. If you’re unsure, choose KDE Plasma + LTS. It’s the default for a reason.

What stays the same?

All three profiles come from the same ISO and include networking, Bluetooth, audio, and tools for everyday use. All three also use D-Bus to let applications and services communicate.

Software management uses pacman, Flatpak, and Linux Update Utility across all configurations. Applications such as COSMIC Terminal, Firefox, and Linux Update Utility are also universal.

Starch remains a rolling-release system regardless of your profile. The differences are in the desktop, kernel, background services, and how those pieces are configured.

Shared between KDE Plasma + LTS and COSMIC + LTS:

Both use the Arch LTS kernel and systemd for service management. “LTS” specifically refers to that kernel. It does not mean the entire operating system or every application is an LTS release.

Both desktops run Wayland sessions, with XWayland included for applications that still use X11. The desktop itself and its integrated tools are where the experiences start to differ.

Shared between COSMIC + LTS and Starch Lite:

These two profiles share the following supporting components, although their desktop controls and service management differ:

- NetworkManager for networking and BlueZ for Bluetooth.
- PipeWire and WirePlumber for audio.
- A GNOME PolicyKit agent for authentication prompts when an action needs elevated permissions.
- nftables with the same firewall policy: block unsolicited incoming connections and forwarded traffic, while allowing outgoing traffic and essential network functions. No inbound exceptions are included for SSH, web servers, or file sharing.
- zstd-compressed RAM swap, sized at half your RAM and capped at 4 GiB. This lets some memory contents be compressed when needed. It isn’t a free RAM download.

With those shared pieces covered, here’s what makes each profile different.

- KDE Plasma + LTS

This is the default for a reason. KDE Plasma gives you a mature, customizable desktop backed by well-established components.

KWin manages windows and display output, while KDED handles KDE’s background modules. Plasma Firewall provides graphical controls for firewalld, rather than the directly configured nftables setup used by COSMIC and Lite. KWallet stores passwords and other credentials for applications that support it.

Plasma gives you plenty of room to customize things, whether you want a practical desktop or a modern “techtok rice.”

- Cosmic + LTS

COSMIC swaps KDE Plasma for COSMIC’s desktop and compositor, with COSMIC Greeter handling login.

Starch configures COSMIC with dark mode, blue accents, Evergreen wallpaper, floating windows, and a small centered dock. These are starting defaults; change them to your liking.

Bluetooth is managed through COSMIC’s desktop controls, and GNOME Keyring handles credential storage. The audio stack runs through systemd user services and sockets.

Software management uses the shared tools listed above; COSMIC Store is excluded.

Choose this profile if you want COSMIC’s desktop experience while keeping the Arch LTS kernel and systemd foundation.

A note for touchscreen users

COSMIC’s on-screen keyboard is currently configured for manual activation in Starch. You can add a shortcut to your dock to bring it up.

I’d like it to appear automatically when using touch without popping up when it isn’t wanted. I could maintain a Starch-specific workaround, but I first need a Starch package repository so I can reliably deliver updates to that configuration. If upstream hasn’t addressed this by then, I plan to revisit it.

If helping with maintenance or basic development sounds interesting, hop in the Discord :)

- Starch Lite

Lite makes the biggest changes. It uses Linux Zen, an Artix OpenRC base, and Xfce on X11, with LightDM and Slick Greeter handling login. Older descriptions mentioning Plasma and SDDM no longer describe the selectable Lite profile.

Desktop compositing and GTK animations are disabled, cutting back on visual effects, while drag-to-tile makes arranging windows easier. The shared networking and Bluetooth components get different desktop controls: nm-applet for networking and Blueman for Bluetooth.

Unlike COSMIC’s systemd-managed audio setup, Lite uses a Starch session supervisor to start and restart PipeWire and WirePlumber without a systemd user manager.

The important difference is maintenance. Lite uses OpenRC instead of systemd, with Artix repositories providing its system foundation and Arch’s extra repository supplying additional packages. Service commands and troubleshooting instructions can therefore differ from the other profiles.

Lite is recommended for experienced users. Choose it if you want Xfce, OpenRC, and fewer desktop effects. The name does not guarantee your particular machine will suddenly become a rocket.

Enjoy the Evergreen name, it is soon to be replaced. There is a lot going on behind the scenes in SLP, many large decisions are being made. Starch Linux is about to change, and I hope the community appreciates the direction. 

Happy computing,  
SethDoesTech



