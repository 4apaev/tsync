export const MT = Object.create(null)
export default MT

////////////////////////////////////////////////////////////////////////////

function populate(rows) {
  for (let row of rows.split('\n')) {
    let [ mime, ...exts ] = row.match(/\S+/g) ?? []
    if (mime && /^[A-z]/.test(mime)) {
      MT[ mime ] = mime
      for (let ext of exts) {
        if (ext.length)
          MT[ ext ] = mime
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////
// import Fs from 'fs'
// import Pt from 'path'
////////////////////////////////////////////////////////////////////////////
// const file = import.meta.url.replace(/^file:\/+/, '/')
// const path = Pt.join(Pt.dirname(file), 'mtypes.txt')
////////////////////////////////////////////////////////////////////////////
// populate(Fs.readFileSync(path, 'utf8'))
////////////////////////////////////////////////////////////////////////////

populate(`
  text/event-stream                  sse
  text/plain                         txt
  text/html                          html
  text/css                           css
  text/less                          less
  text/csv                           csv
  text/jsx                           jsx
  text/x-markdown                    md
  text/csv                           csv
  text/jsx                           jsx
  text/yaml                          yml yaml
  text/xml                           xml
  image/gif                          gif
  image/png                          png
  image/jpeg                         jpg jpeg
  image/webp                         webp
  image/svg+xml                      svg svgz
  image/x-icon                       ico
  font/woff                          woff
  font/opentype                      otf
  application/zip                    zip
  application/zip                    tar
  application/x-font-bdf             bdf
  application/x-font-pcf             pcf
  application/x-font-snf             snf
  application/x-font-ttf             ttf
  application/octet-stream           bin dmg iso img
  application/x-www-form-urlencoded  query
  application/javascript             js
  application/json                   json
  multipart/form-data                form
`)
