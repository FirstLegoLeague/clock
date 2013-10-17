angular.module('Clock',[])
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
        '$scope','$timeout','$audio','$window',
        function($scope,$timeout,$audio,$window) {
            //initial values
            $audio.init('mp3/lossetrack-A +6.mp3',function(track) {
                $scope.runTrack = track;
            });
            $audio.init('mp3/lossetrack-B.mp3',function(track) {
                $scope.stopTrack = track;
            });
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

            $scope.arm = function(time) {
                $scope.armTime = time||$scope.armTime;
                $scope.time = $scope.armTime*1000;
                $scope.state = 'armed';
            };

            $scope.start = function() {
                $scope.startTime = +(new Date());
                $scope.state = 'started';
                $scope.runTrack.play();
                $scope.tick();
                $timeout(function() {
                    $scope.stopTrack.reset();
                },500);
            };

            $scope.stop = function() {
                $scope.state = 'stopped';
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
                    $scope.time = ($scope.armTime*1000) - (now - $scope.startTime);
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
                    case 32:    //space
                        $scope.toggle();
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
                }
                $scope.$apply();
            });

            if (window.io) {
                var socket = io.connect('http://io.example.com:1390/');
                socket.on('clock', function (data) {
                    var bd = data.cmd||null;
                    switch (bd) {
                        case 'color':
                            $scope.bgColor = data.color;
                            break;
                        case 'arm':
                            $scope.arm(data.countdown);
                            break;
                        case 'start':
                            $scope.start(null,data.countdown);
                            break;
                        case 'stop':
                            $scope.stop();
                            break;
                        case 'nudge':
                            $scope.pos[data.direction] += data.amount;
                            break;
                        case 'size':
                            $scope.size += data.amount;
                            break;
                    }
                    $scope.$apply();
                });
            }
        }
    ]);