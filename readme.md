[![npm](https://img.shields.io/npm/v/@first-lego-league/clock.svg)](https://www.npmjs.com/package/@first-lego-league/clock)
[![codecov](https://codecov.io/gh/FirstLegoLeague/clock/branch/master/graph/badge.svg)](https://codecov.io/gh/FirstLegoLeague/clock)
[![Build status](https://ci.appveyor.com/api/projects/status/yvxmdp73an9sl6gc/branch/master?svg=true)](https://ci.appveyor.com/project/2roy999/clock/branch/master)
[![GitHub](https://img.shields.io/github/license/FirstLegoLeague/clock.svg)](https://github.com/FirstLegoLeague/clock/blob/master/LICENSE)

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

## Using the Clock API

In order to use the API, you first need to get an authenticity token. You can get this by sending an authentication request to the [Identity Provider](https://github.com/FirstLegoLeague/identity-provider) module (AKA IdP). It runs on the server computer, typically listening on port 2030.

Send a request: `POST idp-endpoint/login?callbackUrl=url with the body { username: admin, password: your-admin-password }`

You will receive a 304 Redirect with set-cookie header that contains the auth token. You can use that.
Once you have the authenticity token, you send it as a header in each request you make. 

The timer API has four actions:
-  POST timer-endpoint/action/start - will start the timer, only if it isn't running already. If the timer is running it will return 400 Bad Request.
-  POST timer-endpoint/action/stop - will stop the timer, only if it's running. If the timer isn't running it will return 400 Bad Request.
-  POST timer-endpoint/action/reload- will set the timer back to 2:30, only if it's done running. If the timer isn't done running it will return 400 Bad Request.

## Publishing to NPM

When you want to publish to npm, run the command `yarn publish`. First you will be asked to enter a new version to publish. Following that the build script will run the packing stage (`prepack`).

Note: Publish from a version branch (e.g. v2.2.3) so that you can do a PR.

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