import Http from 'http'
import Https from 'https'
import { Readable } from 'stream'

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
    return Readable[ Symbol.hasInstance ](x)
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
   * @param  {Http.IncomingMessage} rs
   * @return {Promise<Payload>}
   */
  async parse(rs) {
    rs.setEncoding('utf8')

    /** @type { Payload } */
    const pay = {
      ok: rs.statusCode < 400,
      code: rs.statusCode,
      headers: rs.headers,
      body: '',
    }

    for await (const chunk of rs)
      pay.body += chunk

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
