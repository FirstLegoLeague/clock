# Clock

Web based application showing the FLL match timer. Works in the latest versions
of chrome, firefox and internet explorer

## Mhub events

The clock creates to the following mhub messages (on the protected node)

| Topic          | Fired On                                       | Data                            |
| -------------- | ---------------------------------------------- | ------------------------------- |
| `clock:start`  | Fired when the countdown is starting to run    |                                 |
| `clock:stop`   | Fired when a countdown have stop in the middle |                                 |
| `clock:end`    | Fired at the end of the countdown              |                                 |
| `clock:reload` | Fired when the clock is reset the time         |                                 |
| `clock:time`   | Fired each second during the countdown         | Seconds to end of the countdown |

## External software

### MPlayer

This module is using mplayer to play the different sound for the server.
The original software and it's source can be found on the
[mplayer site](http://www.mplayerhq.hu). This software is been changed
such that only the mplayer executable and the licenese is provided as
part of this module.

## Publishing to NPM

When you want to publish to npm, run the command `yarn publish`. First you will be asked to enter a new version to publish. Following that the build script will run the packing stage (`prepack`).

Note: In most cases you will publish from the master branch.

```
$ yarn publish
yarn publish v1.12.1
[1/4] Bumping version...
info Current version: 2.2.2
question New version: 2.2.3
info New version: 2.2.3
[2/4] Logging in...
[3/4] Publishing...
$ webpack --mode production --config webpack.prod.js
.....
success Published.
[4/4] Revoking token...
info Not revoking login token, specified via config file.
Done in 140.79s.
```

## Adding new version to the `launcher`

To include your update in the `launcher` build, update the `clock` version in `launcher/dev-scripts/config-get.js`.

**Warning: Warning:**  
Prior to version `1.9.0`, Yarn has a bug with using the `.npmignore`
file correctly. Therefore make sure your Yarn version is `1.9.0` or later. If not, either upgrade your yarn or use the command `npm publish` instead.
