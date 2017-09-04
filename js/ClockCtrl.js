angular.module('Clock').controller('ClockCtrl',[
    '$scope','$timeout','$window','$config','$tracks',
    function($scope,$timeout,$window,$config,$tracks) {
        $scope.config = $config.get();
        $scope.time = $scope.config.seconds * 1000;
        $scope.armTime = $scope.config.seconds * 1;
        
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
            $scope.connect();
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
                $tracks.unpause();
                $scope.start(pauseStamp);
            }
        };

        $scope.start = function(startStamp,countdown) {
            if (countdown) {
                $scope.arm(countdown);
            }
            $tracks.trigger('start', $scope.time);
            $scope.startStamp = startStamp||(+(new Date()));
            $scope.state = 'started';
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
                var newTime = (startTime*1000) - (now - $scope.startStamp);
                if(Math.floor(newTime / 1000) != Math.floor($scope.time / 1000)) {
                    $tracks.trigger(Math.floor(newTime / 1000), $scope.time);
                }
                $scope.time = newTime;
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
                    $window.open('controls.html','fllClockControlWindow','resize=yes,width=600,height=800');
                    break;
            };
        }

        $scope.connect();

        $tracks.init();

        //TODO: simplify these two
        angular.element(document.body).bind('keydown',function(e) {
            var key = e.which||e.keyCode;
            $scope.handleKey(key);
            $scope.$apply();
        });

    }
]);