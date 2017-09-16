//mount angular services and controllers
angular.module('Clock', ['ngStorage'])
    .filter('time', timeFilter)
    .factory('$audio', AudioService)
    .service('$config', ConfigService)
    .controller('ClockCtrl', ClockController);
