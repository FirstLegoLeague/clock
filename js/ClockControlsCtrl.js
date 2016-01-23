angular.module('Clock',['ngStorage'])
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
        '$scope','$timeout','$opener','$localStorage',
        function($scope,$timeout,$opener,$localStorage) {

            $scope.seconds = $opener.armTime;
            $scope.config = $localStorage.config;

            var actions = ['arm','start','stop','mode','playPause'];

            actions.forEach(function(action) {
                $scope[action] = function() {
                    $opener[action].apply(this,arguments);
                    $opener.$apply();
                };
            });

            $scope.update = function(config) {
                $opener.updateConfig(config);
            }
        }
    ]);