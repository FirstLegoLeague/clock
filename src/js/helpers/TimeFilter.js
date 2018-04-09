import angular from 'angular'
import './ClockModule'

angular.module('Clock').filter('time', () => {
  function pad (str) {
    str = '' + str
    if (str.length < 2) {
      str = '0' + str
    }
    return str
  }
  return function (msec, hundreds) {
    const secs = Math.floor(msec / 1000)
    const hsec = Math.floor((msec / 100)) % 10
    const sec = secs % 60
    const min = Math.floor((secs - sec) / 60)
    let str = min + ':' + pad(sec)
    if (hundreds) {
      str += '.' + hsec
    }
    return str
  }
})
