import { IPayload } from '.'
import Base from './base.js'
import * as Util from './util.js'

export default class Fetch extends Base {

  async end(): Promise<Response> {
    return fetch(this.url, {
      body: this.body,
      method: this.method.toUpperCase(),
      headers: this.head,
    })
  }

  async parse(re: Response) {
    const payload: IPayload = {
      ok: re.ok,
      code: re.status,
      headers: re.headers,
    }
    try {
      payload.body = Util.is('json', re.headers)
        ? await re.json()
        : await re.text()
    }
    catch (e) {
      payload.error = e
    }
    return re.ok
      ? payload
      : Promise.reject(payload)
  }
}
