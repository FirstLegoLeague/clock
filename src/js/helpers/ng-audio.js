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
          ready () {
            this.load(file)
            this.reset = () => {
              this.pause()
              this.load(file)
            }
            cb(null, this)
          }
        })

        audio5js.on('error', err => {
          console.error(err)
        })
      }
    }
  }
])
