const { run } = require('./lib/run');

function download(src, dest) {
  run(`curl -L --fail ${src} > ${dest}`);
}

function downloadFromGcloud(src, dest) {
  run(`gsutil cp ${src} ${dest}`);
}

module.exports = {
  download,
  downloadFromGcloud
}
