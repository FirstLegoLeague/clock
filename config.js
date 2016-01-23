var config_module = angular.module('Clock.config', [])
    .constant('wsConfig',{
        host: 'ws://localhost:13900/',
        node: 'clock'
    });
;