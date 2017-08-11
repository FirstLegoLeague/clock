angular.module('Clock',['ngStorage'])
    .filter('time',function() {
        function pad(str) {
            str = ''+str;
            if (str.length<2) {
                str = '0'+str;
            }
            return str;
        }
        return function(msec,hundreds) {
            var secs = Math.floor(msec/1000);
            var hsec = Math.floor((msec/100)) % 10;
            var sec = secs % 60;
            var min = Math.floor((secs-sec)/60);
            var str = min+':'+pad(sec);
            if (hundreds) {
                str += '.'+hsec;
            }
            return str;
        };
    })
    .factory('$audio',[
        function() {
            function init(file,cb) {
                new Audio5js({
                    swf_path: 'swf/audio5js.swf',
                    ready: function () {
                        this.load(file);
                        this.reset = function() {
                            this.pause();
                            this.load(file);
                        };
                        cb(this);
                    }
                });
            }

            return {
                init: init
            };
        }
    ])

    .service('$config',['$localStorage',function($localStorage) {
        var _promise;

        function params() {
            var str = window.location.search.split('?')[1];
            return str.split('&').reduce(function(map,pair) {
                var parts = pair.split('=');
                map[parts[0]] = decodeURIComponent(parts[1]);
                return map;
            }, {});
        }

        return {

            init: function() {
                _promise = _promise || new Promise(function(resolve) {
                    //initialize config with the angular configuration
                    var urlConfig
                    try {
                        // console.log(params().state);
                        urlConfig = JSON.parse(params().state);
                    } catch(e) {
                        //no url Config
                    }

                    //config from localStorage, then url, then defaults from config
                    var $storage = $localStorage.$default({
                        config: urlConfig || clockConfig
                    });

                    resolve($storage.config);
                });
                return _promise;
            },
            setToUrl: function(config) {
                console.log(config);
                $window.history.pushState(config,'','/?state='+JSON.stringify(config));
            }
        };
    }])

    .service('$tracks', ['$config','$audio', function($config, $audio) {
        var listeners = [];

        function trigger(event, time) {
            if(event instanceof Array) {
                event.forEach(event => trigger(event, time));
                return;
            }
            
            listeners.forEach(listener => {
                if(listener && listener.event === event) {
                    if(listener.action === 'set') {
                        set(listener, time);
                    }
                    ACTIONS[listener.action](listener, time);
                }
            });
        }

        const ACTIONS = {
            start: (listener,time) => {
                listener.track.play();
                if(listener.name) {
                    trigger(listener.name, time);
                }
            },
            stop: listener => listener.track.stop(),
            reset: listener => listener.track.reset(),
            pause: listener => listener.track.pause()
        };

        function set(listener, time) {
            let event = time - listener.timeAfter;
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
                let quantity = Number(match[1]);
                let unit = match[2];
                let direction = 1; // Counting forward
                let startCountingAt = config.seconds;
                if(match[3]) {
                    let direction = (match[4] === 'before') ? -1 : 1;
                    let startCountingAt = resolveTimeEvent(match[5], config);
                }
                let time;
                if(unit.match(/^ ?s/))
                    time = quantity;
                if(unit.match(/^(%| p)/))
                    time = Math.floor(config.seconds * quantity / 100);

                if(isFinite(startCountingAt)) {
                    return String(Number(startCountingAt) - direction * quantity);
                } else {
                    if(startCountingAt.startsWith(/after|before/)) {
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
                let minutes = Number(match[1]);
                let seconds = Number(match[2]);
                return String(minutes * 60 + seconds);
            
            // The generic word case
            } else if(str === 'set') {
                console.error(`Illegal trigger: ${str}`);
                return undefined;
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
                    if(!config.tracks)  return;
                    config.tracks.forEach(function(trackConfig) {
                        $audio.init(trackConfig.source,function(track) {
                            listeners = listeners.concat(resolveListeners(trackConfig, track, config));
                        });
                    });
                });
            },
            trigger: trigger,
            pause: function() {
                listeners.forEach(listener => listener.track.pause());
            },
            reset: function() {
                listeners.forEach(listener => listener.track.reset());
            }
        };
    }])

    .controller('ClockCtrl',[
        '$scope','$timeout','$audio','$window','$config','$tracks',
        function($scope,$timeout,$audio,$window,$config,$tracks) {
            $config.init().then(function(config) {
                $scope.config = config;
                $scope.time = config.seconds * 1000;
                $scope.armTime = config.seconds * 1;
                $scope.$apply();
                $scope.connect();
            });

            $tracks.init();
            
            var handlers = {};
            $scope.bgColor = 'black';
            $scope.state = 'stopped';
            $scope.tenths = false;
            $scope.size = 340;

            $scope.pos = {
                x: 0,
                y: 0
            };

            $scope.connected = false;
            var backoff = 100;
            var maxBackoff = 5000;
            var pendingConnection;

            function initWebsocket(config) {
                var ws;
                if (config.host) {
                    if (pendingConnection) {
                        $timeout.cancel(pendingConnection);
                    }
                    ws = new WebSocket(config.host);

                    ws.onopen = function() {
                        if (config.node) {
                            ws.send(JSON.stringify({
                                type: "subscribe",
                                node: config.node
                            }));
                            $scope.connected = true;
                            backoff = 100;
                        }
                        $scope.$digest();
                    };
                    ws.onerror = function(e){
                        console.log("error");
                        ws.close();
                    };
                    ws.onclose = function() {
                        console.log("close reconnecting in",backoff,'ms');
                        $scope.connected = false;
                        $scope.$digest();
                        pendingConnection = $timeout($scope.connect,backoff);
                        backoff = Math.min(maxBackoff,backoff * 2);
                    };
                    ws.onmessage = function(msg) {
                        var data = JSON.parse(msg.data);
                        if (data.topic) {
                            $scope.handleMessage(data);
                        }
                        $scope.$digest();
                    };
                }

                return ws;
            }

            $scope.connect = function() {
                $scope.ws = initWebsocket($scope.config);
            };

            $scope.send = function(topic, data) {
                if ($scope.ws) {
                    $scope.ws.send(JSON.stringify({
                        type: 'publish',
                        node: $scope.config.node,
                        data: data,
                        topic: topic
                    }))
                }
            }

            $scope.updateConfig = function(config) {
                //reinitialize socket connection
                if ($scope.ws) {
                    $scope.ws.close();
                }
                $scope.conect();
                $scope.armTime = config.seconds * 1;
                //save to the url
                $config.setToUrl(config);
            };

            $scope.handleMessage = function(msg){
                var topic = msg.topic.toLowerCase();

                //Check if data object was received, if not use set default values in object
                if (typeof msg.data == "undefined") {
                    msg.data = {
                        countdown: $scope.armTime
                    }
                }

                switch (topic) {
                    case 'clock:color':
                        $scope.bgColor = msg.data.color;
                        break;
                    case 'clock:arm':
                        $scope.arm(msg.data.countdown);
                        break;
                    case 'clock:start':
                        $scope.start(msg.data.stamp,msg.data.countdown);
                        break;
                    case 'clock:stop':
                        $scope.stop();
                        break;
                    case 'clock:pause':
                        $scope.pause(msg.data.stamp);
                        break;
                    case 'clock:nudge':
                        $scope.pos[msg.data.direction] += msg.data.amount;
                        break;
                    case 'clock:size':
                        $scope.size += msg.data.amount;
                        break;
                }
            };

            $scope.arm = function(countdown) {
                $scope.armTime = countdown||$scope.armTime;
                $scope.pauseTime = false;
                $scope.time = $scope.armTime*1000;
                $scope.state = 'armed';
                $tracks.reset();
                $scope.$apply();
            };

            $scope.pause = function(pauseStamp) {
                pauseStamp = pauseStamp||(+new Date());
                if ($scope.state === 'started') {
                    var startTime = ($scope.pauseTime||$scope.armTime);
                    var t = (startTime*1000) - (pauseStamp - ($scope.startStamp||pauseStamp));
                    $scope.time = t;
                    $scope.state = 'paused';
                    $tracks.pause();
                    $scope.pauseTime = t/1000;
                } else {
                    $scope.start(pauseStamp);
                }
            };

            $scope.start = function(startStamp,countdown) {
                if (countdown) {
                    $scope.arm(countdown);
                }
                $scope.startStamp = startStamp||(+(new Date()));
                $scope.state = 'started';
                $tracks.trigger('start', $scope.time);
                $scope.tick();
            };

            $scope.stop = function() {
                $scope.state = 'stopped';
                $scope.pauseTime = false;
                $tracks.trigger(['end','stop'], $scope.time);
            };

            $scope.toggle = function() {
                if ($scope.state == 'started') {
                    $scope.stop();
                } else {
                    $scope.start();
                }
            };

            $scope.mode = function() {
                $scope.tenths = !$scope.tenths;
            };

            $scope.tick = function() {
                if ($scope.state === 'started') {
                    var now = +(new Date());
                    var startTime = ($scope.pauseTime||$scope.armTime);
                    $scope.time = (startTime*1000) - (now - $scope.startStamp);
                    $tracks.trigger(Math.floor($scope.time / 1000), Math.floor($scope.time / 1000));
                    if ($scope.time <= 0) {
                        $scope.time = 0;
                        $scope.stop();
                    } else {
                        $timeout($scope.tick,10);
                    }
                }
            };

            $scope.clockStyle = function() {
                return {
                    fontSize: $scope.size +'px',
                    left: $scope.pos.x + 'px',
                    top: $scope.pos.y + 'px'
                };
            };

            $scope.bodyStyle = function() {
                return {
                    backgroundColor: $scope.bgColor
                };
            };

            $scope.handleKey = function(key) {
                switch(key) {
                    case 65:    //a
                        $scope.arm();
                        break;
                    case 88:    //x
                        $scope.stop();
                        break;
                    case 83:    //s
                        $scope.toggle();
                        break;
                    case 32:    //space
                    case 80:    //p
                        $scope.pause();
                        break;
                    case 219:   //[
                        $scope.size -= 2;
                        break;
                    case 221:   //]
                        $scope.size += 2;
                        break;
                    case 84:    //t
                        $scope.mode();
                        break;
                    case 38:    //up
                        $scope.pos.y -= 2;
                        break;
                    case 40:    //down
                        $scope.pos.y += 2;
                        break;
                    case 37:    //left
                        $scope.pos.x -= 2;
                        break;
                    case 39:    //right
                        $scope.pos.x += 2;
                        break;
                    case 77:    //m
                        $scope.state = 'edit';
                        break;
                    case 13:    //enter
                        if ($scope.state == 'edit') {
                            $scope.arm();
                        }
                        break;
                    case 67:    //c
                        $window.open('controls.html','fllClockControlWindow','resize=yes,width=600,height=300');
                        break;
                };
            }

            //TODO: simplify these two
            angular.element(document.body).bind('keydown',function(e) {
                var key = e.which||e.keyCode;
                $scope.handleKey(key);
                $scope.$apply();
            });

        }
    ]);