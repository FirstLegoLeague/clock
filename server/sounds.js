
const path = require('path')
const Promise = require('bluebird')
const Player = require('play-sound')

const { logger } = require('./logger')

const playerFile = process.platform === 'win32' ? path.join(__dirname, './win-mplayer/mplayer.exe') : 'mplayer'

const player = new Player({ player: playerFile })

Promise.promisifyAll(player)

function playSound (file) {
  logger.debug(`Playing sound file: ${file}`)
  return player.playAsync(file)
}

exports.playStartSound = playSound.bind(null, path.join(__dirname, './mp3/start.mp3'))

exports.playStopSound = playSound.bind(null, path.join(__dirname, './mp3/stop.mp3'))

exports.playEndSound = playSound.bind(null, path.join(__dirname, './mp3/end.mp3'))

exports.playEndGameSound = playSound.bind(null, path.join(__dirname, './mp3/end-game.mp3'))
