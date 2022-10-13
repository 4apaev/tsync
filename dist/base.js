import { CL, CT, Len, get, each } from './util.js'
export default class Base {
  static BASE = 'http://localhost:3000'
  static HEAD = new Headers
  url
  head = new Headers
  method
  body
  constructor(method, url) {
    const Ctor = this.constructor
    this.method = method || 'get'
    this.url = /^https?:/i.test(`${ url }`)
      ? new URL(url)
      : new URL(url ?? '/', Ctor.BASE)
    each(Ctor.HEAD, this.set, this)
  }

  get headers() { return this.head }
  has(k) { return this.head.has(k) }
  get(k) { return this.head.get(k) ?? '' }
  set(k, v) {
    if (typeof k == 'object')
      each(k, this.set, this)
    else
      this.head.set(k, `${ v }`)
    return this
  }

  query(k, v) {
    if (k == null)
      return this
    if (typeof k == 'object')
      each(k, this.query, this)
    else
      this.url.searchParams[ this.url.searchParams.has(k) ? 'append' : 'set' ](k, `${ v }`)
    return this
  }

  send(body) {
    if (body == null)
      return this
    if (typeof body == 'object') {
      this.type() || this.type('json')
      this.body = JSON.stringify(body)
    }
    else {
      this.body = `${ body }`
    }
    this.get(CL) || this.set(CL, Len(this.body))
    return this
  }

  type(alias) {
    return typeof alias == 'string'
      ? this.set(CT, get(alias))
      : this.get(CT)
  }

  async then(done, fail) {
    try {
      const res = await this.end()
      const pay = await this.parse(res)
      return done
        ? done(pay)
        : pay
    }
    catch (e) {
      return fail
        ? fail(e)
        : Promise.reject(e)
    }
  }

  static get(url, body) { return Reflect.construct(this, [ 'get', url ]).query(body) }
  static put(url, body) { return Reflect.construct(this, [ 'put', url ]).send(body) }
  static post(url, body) { return Reflect.construct(this, [ 'post', url ]).send(body) }
  static del(url, body) { return Reflect.construct(this, [ 'delete', url ]).send(body) }
}
