import angular from 'angular';
import './ClockModule';

angular.module('Clock').filter('time',function() {
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
});