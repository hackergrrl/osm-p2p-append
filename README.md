# osm-p2p-append

> Append OSM documents to an osm-p2p-db.

Reads OSM documents as newline-delimited JSON on standard in and writes them to
the given [osm-p2p-db](https://github.com/digidem/osm-p2p-db).

Can be used in conjunction with
[osm-p2p-insert](https://github.com/noffle/osm-p2p-diff) to merge two
osm-p2p-db databases together.

## CLI

```
  USAGE: osm-p2p-append <OSM-P2P-DB-DIR>
```

To perform a merge between two `osm-p2p-db`s, combine with `osm-p2p-diff`:

```
$ osm-p2p-diff osm1/log osm2/log > diff
$ osm-p2p-append osm1 < diff
```

## API

```js
var append = require('osm-p2p-append')
```

### var writeable = append(osm)

Accepts an `osm-p2p-db` instance `osm`. Returns a Writeable stream that
newline-delimited JSON can be written to, containing OSM documents.

**N.B.** Certain metadata fields are expected. See the output of `osm-p2p-diff`
and look for fields that begin with an underscore (`_`).

## Install

With [npm](https://npmjs.org/) installed, run

```
$ npm install -g osm-p2p-append
```

## See Also

- [osm-p2p-diff](https://github.com/noffle/osm-p2p-diff)

## License

ISC
