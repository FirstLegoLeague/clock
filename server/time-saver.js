const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')

const { logger } = require('./logger')

const writeFile = Promise.promisify(fs.writeFile)
const readFile = Promise.promisify(fs.readFile)

const DATA_DIR = process.env.DATA_DIR
const FILE_NAME = 'timer-start-time.txt'
const FILE_PATH = path.join(DATA_DIR, FILE_NAME)

exports.TimeSaver = class {
  saveTime (time) {
    return writeFile(FILE_PATH, time.getTime())
  }

  getTime () {
    return readFile(FILE_PATH, 'utf-8')
      .then(time => {
        time = JSON.parse(time)
        if (time) {
          return new Date(parseInt(time))
        }
      })
      .catch(err => {
        if (err.code === undefined || err.code !== 'ENOENT') { // Could be file read error or SyntaxError
          logger.warn(`Error reading TimeSaver file ${FILE_PATH}`)
          throw err
        }
      })
  }

  clearTime () {
    return writeFile(FILE_PATH, null)
  }
}
