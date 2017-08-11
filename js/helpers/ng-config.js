angular.module('Clock').service('$config',['$localStorage',function($localStorage) {
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
}]);