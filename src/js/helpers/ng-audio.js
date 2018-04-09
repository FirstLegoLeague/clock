import angular from 'angular'
import Audio5js from 'audio5'
import audioSwf from 'audio5/swf/audio5js.swf'
import './ClockModule'

angular.module('Clock').factory('$audio', [
  function () {
    return {
      init (file, cb) {
        const audio5js = new Audio5js({
          swf_path: audioSwf,
          ready: () => {
            audio5js.load(file)
            audio5js.reset = () => {
              audio5js.pause()
              audio5js.load(file)
            }
            cb(null, audio5js)
          }
        })
      }
    }
  }
])
