// @ts-check
import * as U from './util.js'

/**
 * @interface
 */
export default class Base {

  static /** @type {string}  */ BASE = 'http://localhost:3000'
  static /** @type {Headers} */ HEAD = new Headers

  /** @type {any}        */ body               // @ts-ignore
  /** @type {Headers}    */ head = new Headers(this.constructor.HEAD)
  /** @type {HttpMethod} */ method = 'get'
  /** @type {URL}        */ url

  /**
   * @constructor
   * @param { HttpMethod } method
   * @param { string | URL } [url]
   * @param { any } [body]
   */
  constructor(method, url, body) {
    this.method = method || 'get'
    this.url = /^https?:/i.test(`${ url ??= '/' }`)
      ? new URL(url)          // @ts-ignore
      : new URL(url, this.constructor.BASE)

    if (body != null) {
      if (this.method.toLowerCase() === 'get')
        this.query(body)
      else
        this.send(body)
    }
  }

  /** @alias */
  get headers() { return this.head }

  /** @alias */
  get params() { return this.url.searchParams }

  /**
   * @param  { string } k
   * @return { boolean }
   */
  has(k) { return this.head.has(k) }

  /**
   * @param  { string } k
   * @return { string }
   */
  get(k) {
    return this.head.get(k) ?? ''
  }

  /**
   * @param  { string | Dict } k
   * @param  { Prmtv } v
   * @return { this }
   */
  set(k, v) {
    if (k == null)
      return this

    if (typeof k == 'object')
      U.each(k, this.set, this)
    else
      this.head.set(k, `${ v }`)
    return this
  }

  /**
   * @param  { string | Dict } k
   * @param  { Prmtv | Prmtv[] } [v]
   * @return { this }
   */
  query(k, v) {
    if (k == null)
      return this

    if (typeof k == 'object')
      U.each(k, this.query, this)

    else if (Array.isArray(v))
      v.forEach(x => this.params.append(k, `${ x }`))

    else
      this.params[ this.params.has(k) ? 'append' : 'set' ](k, `${ v }`)
    return this
  }

  /**
   * @param  { any } body
   * @return { this }
   */
  send(body) {
    if (body == null)
      return this

    if (typeof body == 'object') {

      // this.type() || this.type('application/json')
      this.type() || this.type(U.json)
      this.body = JSON.stringify(body)
    }
    else {
      this.body = `${ body }`
    }
    this.get('content-length') || this.set('content-length', U.Len(this.body))
    return this
  }

  /**
   * @param  { string } [alias]
   * @return { this | string }
   */
  type(alias) {
    return typeof alias == 'string'
      ? this.set('content-type', U.get(alias))
      : this.get('content-type')
  }

  /**
   * @param { (p: Payload) => Promise } [done]
   * @param { (e: Error) => Promise } [fail]
   */
  async then(done, fail) {
    try {

      const /** @type { Response } */ rs = await this.end()
      const /** @type { Payload } */ pay = await this.parse(rs)

      return done
        ? done(pay)
        : Promise.resolve(pay)
    }
    catch (e) {
      return fail
        ? fail(e)
        : Promise.reject(e)
    }
  }

  /**
   * @return { Promise<Response> }
   */
  async end() { throw new ReferenceError('not implemented') }

  /**
   * @param  { Response } rs
   * @return { Promise<Payload> }
   */
  async parse(rs) { throw new ReferenceError('not implemented') }

  /** @type { Method } */ static get(url, body)  { return new this('get', url, body) }
  /** @type { Method } */ static put(url, body)  { return new this('put', url, body) }
  /** @type { Method } */ static post(url, body) { return new this('post', url, body) }
  /** @type { Method } */ static del(url, body)  { return new this('delete', url, body) }
}

/** @typedef {{ [ k: string ]: any }} Dict */
/** @typedef { string | number | boolean } Prmtv */
/** @typedef { (url: string | URL, body?: any) => Base } Method */
/** @typedef { 'get' | 'post' | 'put' | 'delete' } HttpMethod */

/**
 * @typedef { Object } Payload
 * @prop { boolean } ok
 * @prop { number  } code
 * @prop { Headers } headers
 * @prop { Error } [error]
 * @prop { any } [body]
 */
