import lastSecsToGoSound from '../../mp3/30SecstoGo.mp3'
import endSound from '../../mp3/End.mp3'
import startSound from '../../mp3/Start.mp3'

export default {
  host: `ws://${window.location.hostname}:13900/`,
  node: 'default',
  seconds: 150,
  tracks: [{
    name: '30secs_left_track',
    source: lastSecsToGoSound,
    start: '120 seconds after start'
  }, {
    name: 'end_track',
    source: endSound,
    start: 'on stop'
  }, {
    name: 'start_track',
    source: startSound,
    start: 'on start'
  }]
}
