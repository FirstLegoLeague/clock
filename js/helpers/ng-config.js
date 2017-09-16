function params() {
    var str = window.location.search.split('?')[1];
    return str.split('&').reduce(function(map, pair) {
        var parts = pair.split('=');
        map[parts[0]] = decodeURIComponent(parts[1]);
        return map;
    }, {});
}

var ConfigService = function($localStorage, $window, $q) {
    var _promise;

    return {
        load: function() {
            if (_promise) {
                return _promise;
            }

            var urlConfig
            try {
                // console.log(params().state);
                urlConfig = JSON.parse(params().state);
            } catch (e) {
                //no url Config
            }

            //config from localStorage, then url, then defaults from config
            var $storage = $localStorage.$default({
                config: urlConfig || clockConfig
            });

            return $q.when($storage.config);
        },
        setToUrl: function(config) {
            console.log(config);
            $window.history.pushState(config, '', '/?state=' + JSON.stringify(config));
        }
    };
};
ConfigService.$inject = ['$localStorage', '$window', '$q'];