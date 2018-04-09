import angular from 'angular';
import './helpers/ClockModule';
import './helpers/ng-config';

angular.module('Clock')
    .factory('$opener',[
        '$window',
        function($window) {
            if ($window.opener) {
                var body = $window.opener.document.body;
                return $window.opener.angular.element(body).scope();
            }
            return null;
        }
    ])
    .controller('ClockControlsCtrl',[
        '$scope','$timeout','$opener','$config',
        function($scope,$timeout,$opener,$config) {
            $scope.config = $config.get();

            // For backwards compatibility
            $scope.config.tracks = $scope.config.tracks || [];

            var actions = ['arm','start','stop','mode','pause'];

            actions.forEach(function(action) {
                $scope[action] = function(arg) {
                    if ($opener.connected) {
                        $opener.send('clock:'+action,arg);
                    } else {
                        $opener[action].apply(this,arguments);
                        $opener.$apply();
                    }
                };
            });

            $scope.update = function(config) {
                $opener.updateConfig(config);
            }

            //TODO: simplify these two
            angular.element(document.body).bind('keydown',function(e) {
                if (e.target.nodeName === 'INPUT') {
                    return;
                }
                var key = e.which||e.keyCode;
                $opener.handleKey(key);
                $scope.$apply();
            });
        }
    ]);