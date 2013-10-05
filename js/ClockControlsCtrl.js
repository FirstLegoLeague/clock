angular.module('Clock',[])
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
        '$scope','$timeout','$opener',
        function($scope,$timeout,$opener) {
            console.log($opener);

            $scope.seconds = $opener.armTime;

            var actions = ['arm','start','stop','mode'];

            actions.forEach(function(action) {
                $scope[action] = function() {
                    console.log(action);
                    $opener[action].apply(this,arguments);
                    $opener.$apply();
                };
            });
        }
    ]);