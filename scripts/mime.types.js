import Fs from 'fs'
import Pt from 'path'

export const MT = Object.create(null)
export default MT

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

const cwd = process.cwd()
const MTLocal = Pt.join(cwd, '/scripts/mime.types')
const MTApache = '/etc/apache2/mime.types'

Fs.existsSync(MTApache) && populate(Fs.readFileSync(MTApache, 'utf8'))
populate(Fs.readFileSync(MTLocal, 'utf8'))

Fs.writeFileSync(MTLocal + '.json',
  JSON.stringify(
    Object.fromEntries(
      Object.entries(MT)
          .sort((a, b) => a[ 0 ].length - b[ 0 ].length || a[ 0 ].localeCompare(b[ 0 ]))), 0, 2))
