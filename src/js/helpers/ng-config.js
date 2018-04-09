import angular from 'angular'

import clockConfig from './config'
import './ClockModule'

angular.module('Clock').service('$config', ['$q', '$window', function ($q, $window) {
  let _config

  function params () {
    const str = window.location.search.split('?')[1]
    return str.split('&').reduce((map, pair) => {
      const parts = pair.split('=')
      map[parts[0]] = decodeURIComponent(parts[1])
      return map
    }, {})
  }

  return {

    get: function () {
      if (!_config) {
        // initialize config with the angular configuration
        let urlConfig
        try {
          // console.log(params().state);
          urlConfig = JSON.parse(params().state)
        } catch (e) {
          // no url Config
        }

        _config = urlConfig || clockConfig
      }
      return _config
    },
    setToUrl: function (config) {
      console.log(config)
      $window.history.pushState(config, '', '/?state=' + JSON.stringify(config))
    }
  }
}])
