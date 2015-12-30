angular.module('Clock',['Clock.config'])
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

    .controller('ClockCtrl',[
        '$scope','$timeout','$audio','$window','wsHost','mserverNode',
        function($scope,$timeout,$audio,$window,wsHost,mserverNode) {
            //initial values
            $audio.init('mp3/lossetrack-A +6.mp3',function(track) {
                $scope.runTrack = track;
            });
            $audio.init('mp3/lossetrack-B.mp3',function(track) {
                $scope.stopTrack = track;
            });
            var handlers = {};
			$scope.bgColor = 'black';
            $scope.state = 'stopped';
            $scope.time = 150000;
            $scope.armTime = 150;
            $scope.tenths = false;
            $scope.size = 340;
            
			$scope.pos = {
                x: 0,
                y: 0
            };
			
			$scope.initWebsocket = function() {
				ws = new WebSocket(wsHost);
				ws.onopen = function() {
					if (mserverNode) {
						ws.send(JSON.stringify({
							type: "subscribe",
							node: mserverNode
						}));
					}
				};
				ws.onerror = function(e){
					console.log("error", e);
				};
				ws.onclose = function() {
					console.log("close");
				};
				ws.onmessage = function(msg) {
					var data = JSON.parse(msg.data);
					$scope.handleMessage(data);
					
				};
			};
			$scope.initWebsocket();	
			
			
			$scope.handleMessage = function(msg){
				if (msg && msg.topic) {
					var topic = msg.topic.toLowerCase();
				
					//Check if data object was received, if not use set default values in object
					if (typeof msg.data == "undefined") {
						msg['data'] = {};
						msg.data['countdown'] = $scope.armTime;
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
                            $scope.playPause(msg.data.stamp);
                            break;
                        case 'clock:nudge':
                            $scope.pos[msg.data.direction] += msg.data.amount;
                            break;
                        case 'clock:size':
                            $scope.size += msg.data.amount;
							break;		
					}
				}
			};

            $scope.arm = function(countdown) {
				$scope.armTime = countdown||$scope.armTime;
                $scope.pauseTime = false;
                $scope.time = $scope.armTime*1000;
                $scope.state = 'armed';
                $scope.runTrack.reset();
				$scope.$apply();
            };
			
            $scope.playPause = function(pauseStamp) {
                pauseStamp = pauseStamp||(+new Date());
                if ($scope.state === 'started') {
                    var startTime = ($scope.pauseTime||$scope.armTime);
                    var t = (startTime*1000) - (pauseStamp - ($scope.startStamp||pauseStamp));
                    $scope.time = t;
                    $scope.state = 'paused';
                    $scope.runTrack.pause();
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
                $scope.runTrack.play();
                $scope.tick();
                $timeout(function() {
                    $scope.stopTrack.reset();
                },500);
            };

            $scope.stop = function() {
                $scope.state = 'stopped';
                $scope.pauseTime = false;
                $scope.runTrack.reset();
            };

            $scope.zero = function() {
                $scope.time = 0;
                $scope.stopTrack.play();
                $scope.stop();
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
                    $timeout($scope.tick,10);
                }
            };

            $scope.$watch('time',function(newVal) {
                if ($scope.time <= 0) {
                    $scope.zero();
                }
            });

            $scope.clockStyle = function() {
                return {
                    fontSize: $scope.size,
                    left: $scope.pos.x,
                    top: $scope.pos.y
                };
            };

            $scope.bodyStyle = function() {
                return {
                    backgroundColor: $scope.bgColor
                };
            };

            //TODO: simplify these two
            angular.element(document.body).bind('keydown',function(e) {
                var key = e.which||e.keyCode;
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
                        $scope.playPause();
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
				
				$scope.$apply();
				
            });

        }
    ]);