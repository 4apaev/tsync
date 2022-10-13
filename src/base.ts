import {
  Dict,
  IBase,
  IPayload,
  Method,
  Done,
  Fail,
} from '.'
import * as Uitl from './util.js'

export default abstract class Base implements IBase {

  static BASE: string = 'http://localhost:3000'
  static HEAD: Headers = new Headers

  url: URL
  head: Headers = new Headers
  method: Method
  body?: any

  constructor(method: Method, url?: string | URL) {
    const Ctor = <typeof Base>this.constructor
    this.method = method || 'get'
    this.url = /^https?:/i.test(`${ url }`)
      ? new URL(url)
      : new URL(url ?? '/', Ctor.BASE)
    Uitl.each(Ctor.HEAD, this.set, this)
  }

  get headers(): Headers { return this.head }

  has(k: string): boolean { return this.head.has(k) }
  get(k: string): string { return this.head.get(k) ?? '' }

  set(k: string | Dict | Headers, v?: string | number | boolean): this {
    if (typeof k == 'object')
      Uitl.each(k, this.set, this)
    else
      this.head.set(k, `${ v }`)
    return this
  }

  query(k?: string | Dict | URLSearchParams, v?: string | number | boolean): this {
    if (k == null)
      return this

    if (typeof k == 'object')
      Uitl.each(k, this.query, this)
    else
      this.url.searchParams[ this.url.searchParams.has(k) ? 'append' : 'set' ](k, `${ v }`)
    return this
  }

  send(body?: any): this {
    if (body == null)
      return this

    if (typeof body == 'object') {
      this.type() || this.type('json')
      this.body = JSON.stringify(body)
    }
    else {
      this.body = `${ body }`
    }

    this.get(Uitl.CL) || this.set(Uitl.CL, Uitl.Len(this.body))
    return this
  }

  type(alias?: string): this | string {
    return typeof alias == 'string'
      ? this.set(Uitl.CT, Uitl.get(alias))
      : this.get(Uitl.CT)
  }

  async then(done?: Done, fail?: Fail): Promise<any> {
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

  abstract end(): Promise<any>
  abstract parse(re: any): Promise<IPayload>

  static get(url: string | URL, body?: any) { return Reflect.construct(this, [ 'get', url ]).query(body) }
  static put(url: string | URL, body?: any) { return Reflect.construct(this, [ 'put', url ]).send(body) }
  static post(url: string | URL, body?: any) { return Reflect.construct(this, [ 'post', url ]).send(body) }
  static del(url: string | URL, body?: any) { return Reflect.construct(this, [ 'delete', url ]).send(body) }
}
