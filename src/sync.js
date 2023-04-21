// @ts-check
import Fs from 'fs'
import Http from 'http'
import Https from 'https'
import Stream from 'stream'

import Base from './base.js'
import { is } from './util.js'

/**  @typedef { import('./base.js').Payload } Payload */

/**
 * @class
 * @implements {Base}
 */
export default class Sync extends Base {
  /**
   * @param  {any} x
   * @return {boolean}
   */
  static isReadable(x) {
    return Stream.Readable[ Symbol.hasInstance ](x)
  }

  /**
   * @param  {any} body
   * @return {this}
   */
  send(body) {
    if (Sync.isReadable(body)) {
      this.body = body
      return this
    }
    return super.send(body)
  }

  /**
   * @return {Promise<Http.IncomingMessage>}
   */
  async end() {
    return new Promise((done, fail) => {
      const agent = /https:/i.test(this.url.protocol) /* c8 ignore next */ ? Https : Http

      const rq = agent.request(this.url, {
        method: this.method,
        headers: Object.fromEntries(this.head),
      }, done)

      rq.once('error', fail)
      return Sync.isReadable(this.body)
        ? this.body.pipe(rq)
        : rq.end(this.body)
    })
  }

  /**
   * @param  {Stream.Writable|string} trg
   * @return {this}
   */
  pipe(trg) {
    if (typeof trg == 'string')
      this.pipeTo = Fs.createWriteStream(trg)
    else
      this.pipeTo = trg
    return this
  }

  /**
   * @param  {Http.IncomingMessage} rs
   * @return {Promise<Payload>}
   */
  async parse(rs) {
    rs.setEncoding('utf8')

    /** @type { Payload } */
    const pay = {
      ok: rs.statusCode < 400,
      code: rs.statusCode,  // @ts-ignore
      headers: new Headers(rs.headers),
      body: '',
    }

    const write = this.pipeTo
      ? (/** @type { string | Buffer } */ chunk) => this.pipeTo.write(pay.body += chunk)
      : (/** @type { string | Buffer } */ chunk) => pay.body += chunk

    for await (const chunk of rs)
      write(chunk)

    if (is('json', pay.headers) && pay.body.length) {
      try {
        pay.body = JSON.parse(pay.body)
      }
      catch (e) {
        pay.error = e
      }
    }

    return pay.error || !pay.ok
      ? Promise.reject(pay)
      : Promise.resolve(pay)
  }
}
