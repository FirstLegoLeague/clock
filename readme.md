Clock
=====

Web based application showing the clock. Works in the latest versions of chrome, firefox and internet explorer

Usage
-----

[Download the repository](https://github.com/FirstLegoLeague/clock/archive/master.zip) (See `Download ZIP` on the right) or clone it using GIT.

Open [clock.html](clock.html), set to full screen (press `F11`). Use keys or the control window on another screen (press `c`)

Usage with key control
-----

The following keys can be used to control the clock:

- `a` arms the clock to 2:30
- `s` starts or stops the clock
- `<space>` starts or stops the clock
- `x` stops the clock
- `[` reduces clock font size
- `]` increases clock font size
- `t` switches display of tenths
- `<up>,<down>,<left>,<right>` repositions the clock
- `m` edit clock countdown
- `<enter>` leaves edit mode
- `c` shows controls

Usage with socketio
-----

Adjust the source to listen to a socketio stream

The clock listens to the following socketio messages

- `{cmd:'color',color:'#FF0000'}` sets the background color (for color keying purposes)
- `{cmd:'arm',countdown:30}` arms the clock (in this case 30 seconds, defaults to 2.5 min (150sec))
- `{cmd:'start',countdown:30}` arms the clock and starts it
- `{cmd:'stop'}` stops the clock
- `{cmd:'nudge',direction:'x',amount:10}` moves the clock in x or y direction by the given number of pixels
- `{cmd:'size',amount:2}` increases the font size by the given number of pixels
