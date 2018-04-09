import angular from 'angular'
import './ClockModule'
import './ng-config'
import './ng-audio'

angular.module('Clock').service('$tracks', ['$config', '$audio', function ($config, $audio) {
  let globalListeners = []

  function trigger (event, time) {
    if (event instanceof Array) {
      event.forEach(e => trigger(e, time))
      return
    }

    if (typeof event !== 'string') {
      event = event.toString()
    }

    globalListeners.forEach(listener => {
      if (listener && listener.event === event) {
        if (listener.action === 'set') {
          set(listener, time)
          return
        }
        ACTIONS[listener.action](listener, time)
      }
    })
  }

  const ACTIONS = {
    start: (listener, time) => {
      listener.track.play()
      listener.playing = true
      if (listener.name) {
        trigger(listener.name, time)
      }
    },
    stop: listener => {
      listener.track.stop()
      listener.playing = false
    },
    reset: listener => {
      listener.track.reset()
      listener.playing = false
      listener.paused = false
    },
    pause: listener => {
      listener.track.pause()
      listener.paused = true
    }
  }

  function set (listener, time) {
    const event = Math.floor(time / 1000) - listener.timeAfterEvent
    const newListenerName = listener.name + '_set'
    if (!globalListeners.find(li => li.name === newListenerName)) {
      globalListeners.push({
        name: newListenerName,
        event: event.toString(),
        track: listener.track,
        action: listener.metaAction
      })
    }
  }

  function resolveTimeEvent (str, config) {
    let match
    // The xxxs | xxx% | xxx secs | xxx seconds | xxx percents case
    // With the option for xxx after yyy
    // Where xxx is the original number-unit trigger, and the yyy is a
    // reference to another trigger
    if ((match = str.match(/^(\d+)(s| secs| seconds|%| percents)( (after) (.+))?$/))) {
      const quantity = parseInt(match[1])

      let startCountingAt = config.seconds // Start from the beginning
      if (match[3]) { // Start at a specific time
        startCountingAt = resolveTimeEvent(match[5], config)
      }

      if (isFinite(startCountingAt)) {
        startCountingAt = parseInt(startCountingAt)
        const time = startCountingAt - quantity
        return time.toString()
      } else {
        if (startCountingAt.match(/^(after)/)) {
          console.error(`Illegal trigger: ${str}`)
          return undefined
        }
        return {
          event: startCountingAt,
          timeAfter: quantity
        }
      }

      // The mm:ss case
    } else if ((match = str.match(/^(\d+):(\d+)$/))) {
      const minutes = parseInt(match[1])
      const seconds = parseInt(match[2])
      const time = minutes * 60 + seconds
      return time.toString()
      // The generic word case
    } else {
      // Remove all ignorable trigger words
      str = str.replace(/^(on |with )/, '')
      return str
    }
  }

  function resolveListeners (trackConfig, track, generalConfig) {
    const listeners = []

    // Iterates over all possible actions,
    // If and action has an attribute for it, it will assign it accordingly
    Object.keys(ACTIONS).forEach(action => {
      if (!trackConfig.hasOwnProperty(action)) return

      const event = resolveTimeEvent(trackConfig[action], generalConfig)
      if (typeof event === 'string') {
        listeners.push({
          name: trackConfig.name,
          event: event,
          track: track,
          action: action
        })
        // This is in case of complecated events, i.e. start: 50s after start
        // In that case, the resolveTimeEvent will return an object,
        // with a property "event" containing the event to start counting from (in our case "start")
        // and a property "timeAfter" containing the time to set the event to be triggered after the inital event.
        // For this there is a special action 'set' which will set a new event when the initial event triggers
        // Because that's the firsdt time we can know the time of the new event.
      } else if (typeof event !== 'undefined') {
        listeners.push({
          name: trackConfig.name,
          event: event.event,
          timeAfterEvent: event.timeAfter,
          track: track,
          action: 'set',
          metaAction: action
        })
      }

      if (trackConfig.name) {
        track.onEnded(() => {
          // Notice: this is the only place we don't pass the time parameter,
          // Because there can't be a trigger "302 after after start",
          // That's illegal.
          trigger(`after ${trackConfig.name}`)
        })
      }
    })
    return listeners
  }

  return {
    init: function () {
      const config = $config.get()

      if (!config.tracks) {
        return
      }

      config.tracks.forEach(trackConfig => {
        $audio.init(trackConfig.source, (err, track) => {
          if (err) {
            console.error(err)
            return
          }

          if (!globalListeners.find(listener => listener.name === trackConfig.name)) {
            globalListeners = globalListeners.concat(resolveListeners(trackConfig, track, config))
          }
        })
      })
    },
    trigger: trigger,
    pause: function () {
      globalListeners.forEach(listener => {
        if (listener.playing) {
          listener.track.pause()
          listener.paused = true
        }
      })
    },
    unpause: function () {
      globalListeners.forEach(listener => {
        if (listener.paused) {
          listener.track.play()
          delete listener.paused
        }
      })
    },
    reset: function () {
      globalListeners.forEach(listener => listener.track.reset())
    }
  }
}])
