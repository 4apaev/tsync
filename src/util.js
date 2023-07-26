// @ts-check

import mime from '../scripts/mime.types.js'

const CT = 'Content-Type'
const ct = 'content-type'

export { mime }
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
 * @template K, T, C
 * @param  { T | T[] | IterableIterator<[ K, T ]> } it
 * @param  { (k: K, v: T) => void } cb
 * @param  { C } [ctx]
 * @return { C }
 */
export function each(it, cb, ctx) {
                         // @ts-ignore
  for (const [ k, v ] of it?.entries?.() ?? Object.entries(it))
    cb.call(ctx, k, v)
  return ctx
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** @typedef {{[ k: PropertyKey ]: any }} Dict */
/** @typedef { import('http').IncomingHttpHeaders | Headers | Dict | Map } Head */
/** @typedef {(string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer)} Buff */
