# Remreload

I got tired of having to manually reload multiple different Remote SSH
workspaces in Visual Studio Code after waking my computer from sleep (and VSCode
isn't the fastest thing to reload either). This extension helps **Rem**ote
workspaces get **reload**ed automatically.

I don't know of a way to actually detect when VSCode's SSH plugin is in a state
where it is disconnected and given up (i.e. it's not trying to reconnect again).
So this extension just uses a heuristic where it polls every few seconds, and if
the difference in time exceeds a configurable threshold, this means the computer
has been asleep and we assume SSH is also disconnected. This works well in
practice for me.

You can also configure a connectivity check command to ensure that it waits for
a network/VPN connection to be established, thus ensuring that the reload
actually succeeds. As an example, set `remreload.checkConnectivityCommand` to
`ssh -o ConnectTimeout=1 <remote_dest> 'exit'` (replace `<remote_dest>` as
appropriate).

## Attribution

Icons are combined from the ones made by [Roundicons
Premium](https://www.flaticon.com/authors/roundicons-premium) and
[Freepik](https://www.freepik.com) on
[www.flaticon.com](https://www.flaticon.com/).
