Clock
=====

Web based application showing the clock. Works in the latest versions of chrome, firefox and internet explorer

Usage
-----

[Use the online version](http://firstlegoleague.github.io/clock/clock.html)

[Download the repository](https://github.com/FirstLegoLeague/clock/archive/master.zip) (See `Download ZIP` on the right) or clone it using GIT. **Note**: Control window does not work when served via the file system, you'll need to run a local server. If that does not make sense to you: control window will not work.

Open [clock.html](http://firstlegoleague.github.io/clock/clock.html), set to full screen (press `F11`). Use keys or the control window on another screen (press `c`)

Usage with key control
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

Clock Mhub protocol
-----

The clock listens to the following mhub messages (by default on the 'overlay' node)

- `arm` 
- `start
- `stop


Command line example (windows command prompt):
- `mclient -n overlay -t start -d """cmd:'arm',countdown:30"""`


- `{cmd:'color',color:'#FF0000'}` sets the background color (for color keying purposes)
- `{cmd:'arm',countdown:30}` arms the clock (in this case 30 seconds, defaults to 2.5 min (150sec))
- `{cmd:'start',countdown:30}` arms the clock and starts it
- `{cmd:'pause'}` pauses or resumes the clock
- `{cmd:'stop'}` stops the clock
- `{cmd:'nudge',direction:'x',amount:10}` moves the clock in x or y direction by the given number of pixels
- `{cmd:'size',amount:2}` increases the font size by the given number of pixels

The clock sends the following messages:



Compatibility
-------------

The clock has been verified to work correctly on the following systems:

- windows 7
  - Chrome 30.0.1
  - Firefox 23.0.1
  - IE 10
  - IE 9
  - IE 8
