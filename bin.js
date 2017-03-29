#!/usr/bin/env node

if (process.argv.length !== 3) {
  console.error('USAGE: osm-p2p-append <OSM-P2P-DB-DIR>')
  process.exit(1)
}

var append = require('./')

var hyperlog = require('hyperlog')
var level = require('level')
var fdstore = require('fd-chunk-store')
var osmdb = require('osm-p2p-db')
var path = require('path')
var tmpdir = require('os').tmpdir()

var root = process.argv[2]
if (!root) {
  root = path.join(tmpdir, 'osm-p2p-tmp')
  require('rimraf').sync(root)
  require('mkdirp').sync(root)
  console.error('placing indexes in', root)
}
var db = {
  log: level(path.join(root, 'log')),
  index: level(path.join(root, 'index')),
  storefile: path.join(root, 'kdb')
}

var osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index,
  store: fdstore(4096, db.storefile)
})

process.stdin.pipe(append(osm))
