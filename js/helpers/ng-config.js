function params() {
    var str = window.location.search.split('?')[1];
    return str.split('&').reduce(function(map, pair) {
        var parts = pair.split('=');
        map[parts[0]] = decodeURIComponent(parts[1]);
        return map;
    }, {});
}

function ConfigService($localStorage, $window, $q) {
    var _config;

    return {
        load: function() {
            if (!_config) {
                var urlConfig;
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
                if ($storage.config.version !== clockConfig.version) {
                    $storage.config = clockConfig;
                }

                _config = $storage.config;
            }

            return _config;
        },
        setToUrl: function(config) {
            $window.history.pushState(config, '', '/?state=' + JSON.stringify(config));
        }
    };
}
ConfigService.$inject = ['$localStorage', '$window', '$q'];