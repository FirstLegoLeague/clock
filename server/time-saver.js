const Promise = require('bluebird')
const fs = require('fs')
const path = require('path')

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
        if (time.trim()) {
          return new Date(Number(time))
        }
        
        return null
      }, err => {
        if (err.code !== 'ENOENT') {
          throw err
        }
      })
  }

  clearTime () {
    return writeFile(FILE_PATH, '')
  }
}
