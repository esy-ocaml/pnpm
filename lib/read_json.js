'use strict'
const fs = require('mz/fs')

function readJSON (filename) {
  return fs.readFile(filename, 'utf8')
  .then(data => JSON.parse(data))
}

function readJSONSync (filename) {
  const data = fs.readFileSync(filename, 'utf8')
  return JSON.parse(data)
}

module.exports.readJSON = readJSON
module.exports.readJSONSync = readJSONSync
