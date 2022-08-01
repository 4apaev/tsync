export const µ = undefined
export const CT = 'Content-Type'
export const CL = 'Content-Length'
export const isNODE = globalThis?.process?.versions?.node != µ
export const mime = Object.create(null)
export function get(alias) {
  return mime[ alias ] ?? ''
}
export function fromHead(ctx) {
  return (ctx instanceof Headers
    ? ctx.get('Content-Type') ?? ctx.get('content-type')
    : ctx?.[ 'Content-Type' ] ?? ctx?.[ 'content-type' ]) ?? ''
}
export function fromPath(path) {
  return get(extname(path))
}
export function extname(file) {
  let ext = ''
  let path = typeof file == 'string'
    ? file
    : file.pathname
  for (let i = path.length; i--;) {
    if (path[ i ] == '.')
      return ext
    ext = path[ i ] + ext
  }
  return ''
}
export function is(expected, actual) {
  const e = get(expected) || expected
  const a = typeof actual == 'string'
    ? get(actual) || actual
    : fromHead(actual)
  return e.startsWith(a)
}
export function each(it, cb, ctx) {
  for (const [ k, v ] of Symbol.iterator in it ? it.entries() : Object.entries(it))
    cb.call(ctx, k, v)
  return ctx
}
export const Len = isNODE
  ? x => Buffer.byteLength(x)
    /* c8 ignore next */
  : x => x.length
mime.txt = 'text/plain'
mime.html = 'text/html'
mime.css = 'text/css'
mime.less = 'text/less'
mime.csv = 'text/csv'
mime.jsx = 'text/jsx'
mime.md = 'text/x-markdown'
mime.yaml = 'text/yaml'
mime.yml = 'text/yaml'
mime.xml = 'text/xml'
mime.gif = 'image/gif'
mime.png = 'image/png'
mime.jpg = 'image/jpeg'
mime.jpeg = 'image/jpeg'
mime.svg = 'image/svg+xml'
mime.svgz = 'image/svg+xml'
mime.ico = 'image/x-icon'
mime.webp = 'image/webp'
mime.woff = 'font/woff'
mime.otf = 'font/opentype'
mime.bdf = 'application/x-font-bdf'
mime.pcf = 'application/x-font-pcf'
mime.snf = 'application/x-font-snf'
mime.ttf = 'application/x-font-ttf'
mime.zip = 'application/zip'
mime.tar = 'application/zip'
mime.json = 'application/json'
mime.js = 'application/javascript'
mime.bin = 'application/octet-stream'
mime.dmg = 'application/octet-stream'
mime.iso = 'application/octet-stream'
mime.img = 'application/octet-stream'
mime.form = 'multipart/form-data'
mime.query = 'application/x-www-form-urlencoded'
export const { // eslint-disable-next-line max-len
  txt, css, less, csv, jsx, md, yaml, yml, xml, gif, png, jpg, jpeg, svg, svgz, ico, webp, woff, otf, bdf, pcf, snf, ttf, zip, tar, json, js, bin, dmg, iso, img, form, query } = mime
// <T extends It | Dict>
