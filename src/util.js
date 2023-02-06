// @ts-check

const CT = 'Content-Type'
const ct = 'content-type'

export const mime = Object.create(null)

export const Len = globalThis?.Buffer != null
  /* c8 ignore next */ ? (/** @type {Buff}   */ x) => Buffer.byteLength(x)
  /* c8 ignore next */ : (/** @type {string} */ x) => x.length

/**
 * @param  { string } s
 * @param  { string } [fallback]
 * @return { string }
 */
export function get(s, fallback) {
  return mime[ s ] ?? fallback
}

/**
 * @param  { Head } ctx
 * @param  { string } [fallback]
 * @return { string }
 */
export function fromHead(ctx, fallback) {
  const re = typeof ctx?.get == 'function'
    ? ctx.get(CT) ?? ctx.get(ct)
    : ctx?.[ CT ] ?? ctx?.[ ct ]
  return re ?? fallback ?? ''
}

/**
 * @param  { string | URL } s
 * @param  { string } [fallback]
 * @return { string }
 */
export function fromPath(s, fallback) {
  const ex = extname(s)
  return ex
    ? get(ex, fallback) ?? ''
    : fallback ?? ''
}

/**
 * @param  { string | URL } file
 * @return { string }
 */
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

/**
 * @param  { string } expected
 * @param  { string | Head } actual
 * @return { boolean }
 */
export function is(expected, actual) {
  if (actual == null)
    return false

  const e = get(expected, expected)
  const a = typeof actual == 'string'
    ? get(actual, actual)
    : fromHead(actual)
  return e.startsWith(a)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @template T, C
 * @param   { Dict | Headers | URLSearchParams | Map | Set } it
 * @param   { (k: string, v: T) => void } cb
 * @param   { C } ctx
 * @returns { C }
 */
export function each(it, cb, ctx) {
                         // @ts-ignore
  for (const [ k, v ] of it?.entries?.() ?? Object.entries(it))
    cb.call(ctx, k, v)
  return ctx
}

/** @type { typeof String.raw } */
export function populate(s, ...a) {
  for (let line of String.raw(s, ...a).split('\n')) {
    let [ mtype, ...exts ] = line.match(/\S+/g) ?? []
    if (mtype) {
      mime[ mtype ] = mtype
      for (let ex of exts)
        mime[ ex ] = mtype
    }
  }
  return ''
}

populate`
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
`

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** @typedef {{[ k: PropertyKey ]: any }} Dict */
/** @typedef { import('http').IncomingHttpHeaders | Headers | Dict | Map } Head */
/** @typedef {(string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer)} Buff */
