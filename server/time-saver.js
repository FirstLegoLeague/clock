const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')

const writeFile = Promise.promisify(fs.writeFile)
const readFile = Promise.promisify(fs.readFile)

const DATA_DIR = process.env.DATA_DIR
const FILE_NAME = 'timer-start-time.json'

exports.TimeSaver = class {
  writeTimeToFile (time) {
    return writeFile(path.join(DATA_DIR, FILE_NAME), time.getTime())
  }

  getTimeFromFile () {
    return readFile(path.join(DATA_DIR, FILE_NAME), 'utf-8').then(time => {
      time = JSON.parse(time)
      if (time) {
        return new Date(parseInt(time))
      }
      return null
    })
  }

  clearFile () {
    return writeFile(path.join(DATA_DIR, FILE_NAME), null)
  }
}
