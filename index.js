var ndjson = require('ndjson')
var through = require('through2')
var pump = require('pumpify')

module.exports = function (osm) {
  var pipeline = pump(ndjson.parse(), through.obj(processDoc, flush))

  var appended = 0
  var skipped = 0

  function flush (done) {
    done()
    console.log('' + skipped, 'skipped')
    console.log('' + appended, 'appended')
    process.exit(0)
  }

  function processDoc (doc, _, next) {
    var self = this
    osm.log.get(doc._version, function (err) {
      if (!err) {
        skipped++
        // console.log('skip', doc._version)
        next()
      } else {
        appended++
        // console.log('append', doc._version)
        handleDoc.call(self, doc, next)
      }
    })
  }

  function handleDoc (doc, next) {
    var self = this
    var links = doc._links
    var version = doc._version
    var id = doc.id
    delete doc._log
    delete doc._version
    delete doc._links
    delete doc.id
    if (doc.deleted) {
      var fields = {}
      if (doc._points) fields.points = doc._points
      if (doc._refs) fields.refs = doc._refs

      var row = {
        type: 'del',
        key: id,
        fields: fields,
        links: links
      }

      osm.kv.batch([row], function (err, nodes) {
        if (err) return self.emit('error', err)
        var node = nodes[0]
        if (node.key !== version) {
          console.log('version mismatch', node.key, version)
        }
        next()
      })
    } else {
      osm.kv.put(id, doc, { links: links }, function (err, node) {
        if (err) return self.emit('error', err)
        if (node.key !== version) {
          console.log('version mismatch', node.key, version)
        }
        next()
      })
    }
  }

  return pipeline
}
