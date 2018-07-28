Clock
=====

Web based application showing the clock. Works in the latest versions
of chrome, firefox and internet explorer

Clock Mhub Events
-----------------

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

