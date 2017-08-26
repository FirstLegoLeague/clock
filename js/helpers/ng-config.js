angular.module('Clock').service('$config',['$localStorage' ,'$q' ,function($localStorage, $q) {
	var _config;

	function params() {
	    var str = window.location.search.split('?')[1];
	    return str.split('&').reduce(function(map,pair) {
	        var parts = pair.split('=');
	        map[parts[0]] = decodeURIComponent(parts[1]);
	        return map;
	    }, {});
	}

	return {

	    get: function() {
	    	if(!_config) {
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

	            _config = $storage.config;
	    	}
	    	return _config;
	    },
	    setToUrl: function(config) {
	        console.log(config);
	        $window.history.pushState(config,'','/?state='+JSON.stringify(config));
	    }
	};
}]);