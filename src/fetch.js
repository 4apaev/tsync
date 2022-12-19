import Base from './base.js'
import { is } from './util.js'

/** @typedef { import('./base.js').Payload } Payload */

/**
 * @class
 * @implements {Base}
 */
export default class Fetch extends Base {
  /**
   * @return {Promise<Response>}
   */
  async end() {
    return fetch(this.url, {
      body: this.body,
      method: this.method.toUpperCase(),
      headers: this.head,
    })
  }

  /**
   * @param  {Response} rs
   * @return {Promise<Payload>}
   */
  async parse(rs) {
    /** @type {Payload} */
    const payload = {
      ok: rs.ok,
      code: rs.status,
      headers: rs.headers,
    }
    try {
      payload.body = is('json', rs.headers)
        ? await rs.json()
        : await rs.text()
    }
    catch (e) {
      payload.error = e
    }
    return rs.ok
      ? payload
      : Promise.reject(payload)
  }
}
