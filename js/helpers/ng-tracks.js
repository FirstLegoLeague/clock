angular.module('Clock').service('$tracks', ['$config','$audio', function($config, $audio) {
    var listeners = [];

    function trigger(event, time) {
        if(event instanceof Array) {
            event.forEach(event => trigger(event, time));
            return;
        }

        if(typeof event !== 'string') {
            event = event.toString();
        }

        listeners.forEach(listener => {
            if(listener && listener.event === event) {
                if(listener.action === 'set') {
                    set(listener, time);
                    return;
                }
                ACTIONS[listener.action](listener, time);
            }
        });
    }

    const ACTIONS = {
        start: (listener,time) => {
            listener.track.play();
            listener.playing = true;
            if(listener.name) {
                trigger(listener.name, time);
            }
        },
        stop: listener => {
            listener.track.stop();
            listener.playing = false;
        },
        reset: listener => {
            listener.track.reset();
            listener.playing = false;
            listener.paused = false;
        },
        pause: listener => {
            listener.track.pause();
            listener.paused = true;
        }
    };

    function set(listener, time) {
        let event = Math.floor(time / 1000) - listener.timeAfterEvent;
        listeners.push({
            event: event,
            track: listener.track,
            action: listener.metaAction
        });
    }

    function resolveTimeEvent(str, config) {
        var match;
        // The xxxs | xxx% | xxx secs | xxx seconds | xxx percents case
        // With the option for xxx after yyy
        // Where xxx is the original number-unit trigger, and the yyy is a 
        // reference to another trigger
        if(match = str.match(/^(\d+)(s| secs| seconds|%| percents)( (after|before) (.+))?$/)) {
            let quantity = parseInt(match[1]);
            let unit = match[2];
            let direction = 1; // Counting forward
            let startCountingAt = config.seconds; // Start from the beginning
            if(match[3]) { // Start at a specific time
                direction = (match[4] === 'before') ? -1 : 1;
                startCountingAt = resolveTimeEvent(match[5], config);
            }
            let time;
            if(unit.match(/^ ?s/)) {
                time = quantity;
            }
            if(unit.match(/^(%| p)/)) {
                time = Math.floor(config.seconds * quantity / 100);
            }

            if(isFinite(startCountingAt)) {
                startCountingAt = parseInt(startCountingAt);
                let time = startCountingAt - direction * quantity;
                return time.toString();
            } else {
                if(startCountingAt.match(/^(after|before)/)) {
                    console.error(`Illegal trigger: ${str}`);
                    return undefined;
                }
                return {
                    event: startCountingAt,
                    timeAfter: direction * quantity
                };
            }

        // The mm:ss case
        } else if(match = str.match(/^(\d+):(\d+)$/)) {
            let minutes = parseInt(match[1]);
            let seconds = parseInt(match[2]);
            let time = minutes * 60 + seconds
            return time.toString();
        // The generic word case
        } else {
            //Remove all ignorable trigger words
            str = str.replace(/^(on |with )/, '');
            return str;
        }
    }

    function resolveListeners(trackConfig, track, generalConfig) {
        var listeners = [];

        // Iterates over all possible actions,
        // If and action has an attribute for it, it will assign it accordingly
        Object.keys(ACTIONS).forEach(function(action) {
            if(!trackConfig.hasOwnProperty(action)) return;

            let event = resolveTimeEvent(trackConfig[action], generalConfig);
            if(typeof event === 'string') {
                listeners.push({
                    name: trackConfig.name,
                    event: event,
                    track: track,
                    action: action
                });
            // This is in case of complecated events, i.e. start: 50s after start
            // In that case, the resolveTimeEvent will return an object,
            // with a property "event" containing the event to start counting from (in our case "start")
            // and a property "timeAfter" containing the time to set the event to be triggered after the inital event.
            // For this there is a special action 'set' which will set a new event when the initial event triggers
            // Because that's the firsdt time we can know the time of the new event.
            } else if(typeof event !== undefined) {
                listeners.push({
                    name: trackConfig.name,
                    event: event.event,
                    timeAfterEvent: event.timeAfter,
                    track: track,
                    action: 'set',
                    metaAction: action
                });
            }

            if(trackConfig.name) {
                track.onEnded(function() {
                    // Notice: this is the only place we don't pass the time parameter,
                    // Because there can't be a trigger "302 after after start",
                    // That's illegal.
                    trigger(`after ${trackConfig.name}`);
                });
            }
        });
        return listeners;
    }

    return {
        init: function() {
            return $config.init().then(function(config) {
                if(!config.tracks) {
                    return;
                }
                config.tracks.forEach(function(trackConfig) {
                    $audio.init(trackConfig.source,function(track) {
                        listeners = listeners.concat(resolveListeners(trackConfig, track, config));
                    });
                });
            });
        },
        trigger: trigger,
        pause: function() {
            listeners.forEach(listener => {
                if(listener.playing) {
                    listener.track.pause();
                    listener.paused = true;
                }
            });
        },
        unpause: function() {
            listeners.forEach(listener => { 
                if(listener.paused) {
                    listener.track.play();
                    delete listener.paused;
                }
            });
        },
        reset: function() {
            listeners.forEach(listener => listener.track.reset());
        }
    };
}]);