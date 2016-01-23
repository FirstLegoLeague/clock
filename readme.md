Clock
=====

Web based application showing the clock. Works in the latest versions of chrome, firefox and internet explorer

Usage
-----

[Use the online version](http://firstlegoleague.github.io/clock/)

[Download the repository](https://github.com/FirstLegoLeague/clock/archive/gh-pages.zip) (See `Download ZIP` on the right) or clone it using GIT. **Note**: Control window does not work when served via the file system, you'll need to run a local server. If that does not make sense to you: control window will not work.

Open [index.html](http://firstlegoleague.github.io/clock/), set to full screen (press `F11`). Use keys or the control window on another screen (press `c`)

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

Usage with socketio
-----

Adjust the source to listen to a socketio stream

The clock listens to the following socketio messages

- `{cmd:'color',color:'#FF0000'}` sets the background color (for color keying purposes)
- `{cmd:'arm',countdown:30}` arms the clock (in this case 30 seconds, defaults to 2.5 min (150sec))
- `{cmd:'start',countdown:30}` arms the clock and starts it
- `{cmd:'pause'}` pauses or resumes the clock
- `{cmd:'stop'}` stops the clock
- `{cmd:'nudge',direction:'x',amount:10}` moves the clock in x or y direction by the given number of pixels
- `{cmd:'size',amount:2}` increases the font size by the given number of pixels

Compatibility
-------------

The clock has been verified to work correctly on the following systems:

- windows 7
  - Chrome 30.0.1
  - Firefox 23.0.1
  - IE 10
  - IE 9
  - IE 8

Development
----------

Development is done directly on the gh-pages branch, in order to keep a github hosted version online.