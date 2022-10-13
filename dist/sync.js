import Http from 'http'
import Https from 'https'
import { Readable } from 'stream'
import Base from './base.js'
import * as Util from './util.js'
export default class Sync extends Base {
  static isReadable(x) {
    return Readable[ Symbol.hasInstance ](x)
  }

  send(body) {
    if (Sync.isReadable(body)) {
      this.body = body
      return this
    }
    return super.send(body)
  }

  async end() {
    const { url, body, method } = this
    const headers = Object.fromEntries(this.head)
    return new Promise((done, fail) => {
      const agent = /https:/i.test(url.protocol)
                /* c8 ignore next */
        ? Https
        : Http
      const opt = { method, headers }
      const req = agent.request(url, opt, done)
      req.once('error', fail)
      return Sync.isReadable(body)
        ? body.pipe(req)
        : req.end(body)
    })
  }

  async parse(re) {
    re.setEncoding('utf8')
    const ok = re.statusCode < 400
    const code = re.statusCode
    const head = re.headers
    const headers = new Headers(head)
    let body = ''
    let error = null
    for await (const chunk of re)
      body += chunk
    if (Util.is('json', headers) && body.length) {
      try {
        body = JSON.parse(body)
      }
      catch (e) {
        error = e
      }
    }
    const payload = { ok, code, headers, body, error }
    return error || !ok
      ? Promise.reject(payload)
      : payload
  }
}
