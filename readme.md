Clock
=====

Web based application showing the clock. Works in the latest versions of chrome, firefox and internet explorer

Usage
-----

[Use the online version](http://firstlegoleague.github.io/clock/clock.html)

[Download the repository](https://github.com/FirstLegoLeague/clock/archive/master.zip) (See `Download ZIP` on the right) or clone it using GIT. **Note**: Control window does not work when served via the file system, you'll need to run a local server. If that does not make sense to you: control window will not work.

Open [clock.html](http://firstlegoleague.github.io/clock/clock.html), set to full screen (press `F11`). Use keys or the control window on another screen (press `c`)

Usage with key control (local)
-----

The following keys can be used to control the clock:

- `a` arms the clock to 2:30
- `s` starts or stops the clock
- `p` pauses or resumes the clock
- `<space>` pauses or resumes the clock
- `x` stops the clock
- `[` reduces clock font size
- `]` increases clock font size
- `t` switches display of tenths
- `<up>,<down>,<left>,<right>` repositions the clock
- `m` edit clock countdown
- `<enter>` leaves edit mode
- `c` shows controls (does not work on local file system)
- `<F11>` toggle fullscreen

Usage with Mhub
-----
Make sure you have a working (and accessible) mhub instance running on your server; see [mbhub documentation](https://github.com/poelstra/mhub) 

1. Open config.js to configure the mhub server (default is localserver at port 13900)
2. In config.js also configure the node to connect to (default is 'overlay', so it works with the DisplaySystem)

Optional:
It is recommended to run from a webserver rather then open the file locally. A config for a sample node server is included, to install:

3. Install the package (if not present): 
`npm install connect`
`npm install serve-static`
4. Run the webserver:
`node localserver.js`
5. Open a browser to 
`localhost:8080`

The port can be changed in localserver.js

**Note:** currently the control panel (when pressing 'c') does not send commands. I.e. the clock in combination with mhub only listens. Using the controls will only affect the local instance of the clock (no other browser windows or running clocks).

Clock Mhub protocol
-----

### Receiving commands
The clock listens to the following mhub messages (by default on the 'overlay' node)

| Topic | Data (optional)    | Comments | 
| ----- |:------------------:| --------:|
| `arm` | `"countdown":tt`   | arms (resets) the clock |
| `start` | `"countdown":tt`   | tt is seconds to countdown from |
| `stop` |    | stops the clock, and leave it at the countdown time  | 
| `pause` |    | pauses the clock when running, and resumes it when paused (toggle) | 
| `nudge` | `"direction":"x|y","amount":"px""    | moves the clock in x or y direction by the given number of pixels | 
| `size` | `"amount":px`   | increases the font size by the given number of pixels |

Make sure you use the right quotes, see [mbhub documentation](https://github.com/poelstra/mhub)
The following is a command line example on the windows command prompt, which will start the countdown from 40 seconds. (note that strings are double quoted)
- `mclient -n overlay -t start -d "{ ""countdown"": "40" }"`
This one will move the clock 10 px in the horizontal direction (to the right)
- `mclient -n overlay -t start -d "{ ""direction"": ""x"",""amount"":"10" }"

### Sending commands
Not yet implemented

Compatibility
-------------

The clock has been verified to work correctly on the following systems:

- windows 7
  - Chrome 30.0.1
  - Firefox 23.0.1
  - IE 10
  - IE 9
  - IE 8
