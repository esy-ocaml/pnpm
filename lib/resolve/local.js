'use strict'
const resolve = require('path').resolve
const spawn = require('cross-spawn')
const readJSON = require('../read_json').readJSON

/**
 * Resolves a package hosted on the local filesystem
 */

module.exports = function resolveLocal (pkg) {
  const dependencyPath = resolve(pkg.root, pkg.spec)

  return Promise.all([
    pack(dependencyPath),
    readJSON(resolve(dependencyPath, 'package.json'))
  ])
  .then(result => {
    const tgzFilename = result[0]
    const localPkg = result[1]
    return {
      name: localPkg.name,
      fullname: localPkg.name.replace('/', '!') + [
        '@file',
        escapePkgPath(dependencyPath)
      ].join('!'),
      dist: {
        local: true,
        tarball: resolve(dependencyPath, tgzFilename)
      }
    }
  })
}

function pack (dependencyPath) {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['pack'], {
      cwd: dependencyPath
    })

    let stdout = ''

    proc.stdout.on('data', data => {
      stdout += data.toString()
    })

    proc.on('error', reject)

    proc.on('close', code => {
      if (code > 0) return reject(new Error('Exit code ' + code))
      let tgzFilename = stdout.trim()
      return resolve(tgzFilename)
    })
  })
}

function escapePkgPath (pkgPath) {
  return pkgPath.replace(/[/\\:]/g, '!').replace(/^!/, '')
}
