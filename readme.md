Clock
=====

Web based application showing the clock. Works in the latest versions
of chrome, firefox and internet explorer

Mhub events
-----------

The clock creates to the following mhub messages (on the protected node)

| Topic          | Fired On                                       | Data                            |
| -------------- | ---------------------------------------------- | ------------------------------- |
| `clock:start`  | Fired when the countdown is starting to run    |                                 |
| `clock:stop`   | Fired when a countdown have stop in the middle |                                 |
| `clock:end`    | Fired at the end of the countdown              |                                 |
| `clock:reload` | Fired when the clock is reset the time         |                                 |
| `clock:time`   | Fired each second during the countdown         | Seconds to end of the countdown |

External software
-----------------
### MPlayer
This module is using mplayer to play the different sound for the server.
The original software and it's source can be found in the
[mplayer site](http://www.mplayerhq.hu). This software is been changed
such that only the mplayer executable and the licenese is devlivered as
part of this module.

Publishing to NPM
-----------------
When needed to publish to npm run the command `yarn publish`. When running publish the
building script would run before the packing stage (`prepack`).

**:warning: Warning:** Prior to version `1.9.0`, Yarn has a bug with using the `.npmignore`
file correctly. Therefore please make sure your Yarn version is `1.9.0` or later. If not either
upgrade your yarn or use the command `npm publish` instead.
