const { existsSync } = require('fs')
const { run } = require('./run')

function download (src, dest, force = false) {
  if (!force && existsSync(dest)) {
    console.log(`${dest} already exists.`)
    return
  }

  run(`curl -L --fail ${src} > ${dest}`)
}

function downloadFromGcloud (src, dest) {
  run(`gcloud storage cp ${src} ${dest}`)
}

module.exports = {
  download,
  downloadFromGcloud
}
