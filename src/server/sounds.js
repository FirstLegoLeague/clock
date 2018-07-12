
const path = require('path')
const Promise = require('bluebird')
const Player = require('play-sound')

const { logger } = require('./logger')

const player = new Player()

Promise.promisifyAll(player)

function playSound (file) {
  logger.debug(`Playing sound file: ${file}`)
  return player.playAsync(file)
}

exports.playStartSound = playSound.bind(null, path.join(__dirname, './mp3/Start.mp3'))

exports.playStopSound = playSound.bind(null, path.join(__dirname, './mp3/Stop.mp3'))

exports.playEndSound = playSound.bind(null, path.join(__dirname, './mp3/End.mp3'))

exports.playEndGameSound = playSound.bind(null, path.join(__dirname, './mp3/30SecstoGo.mp3'))
