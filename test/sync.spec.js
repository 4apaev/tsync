import Pt from 'node:path'
import Fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import Crypto from 'node:crypto'

import {
  strictEqual as equal,
  deepStrictEqual as eqDeep,
  rejects,
} from 'assert'
import { Readable } from 'stream'

import Sync from '../src/sync.js'
import Server, {
  sleep,
  random,
} from '../scripts/test-util.js'

const PORT = 7654
const URL = `http://localhost:${ PORT }`

const baseMethod = m => {
  const method = m.toUpperCase()

  return () => {
    it(`no body`, async () => {
      const re = await Sync[ m ](URL)
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.body, '')
      equal(re.body.method, method)
      equal(re.body.headers[ 'content-type' ], undefined)
    })

    it(`send body as second argument`, async () => {
      const body = { a: 1 }
      const re = await Sync[ m ](URL, body)
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.method, method)
      equal(re.body.headers[ 'content-type' ], 'application/json')
      eqDeep(re.body.body, body)
    })

    it(`send body as method`, async () => {
      const body = { a: 1 }
      const re = await Sync[ m ](URL).send(body)
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.method, method)
      equal(re.body.headers[ 'content-type' ], 'application/json')
      eqDeep(re.body.body, body)
    })

    it(`set head`, async () => {
      let k = 'x-head'
      let v = 'qwerty'
      const re = await Sync[ m ](URL).set(k, v)
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.method, method)
      equal(re.body.headers[ k ], v)
    })
  }
}

describe('Sync', () => {
  Sync.BASE = URL

  before(() => Server.listen(PORT))
  after(() => Server.close())

  describe('PUT', baseMethod('put'))
  describe('POST', baseMethod('post'))

  describe('new Sync', () => {
    it('should set method to GET if not specified', async () => {
      const re = await new Sync
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should set method to GET', async () => {
      const re = await new Sync('GET')
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should stringify body object and set content-type to json', async () => {
      const rq = new Sync('GET')
      const body = { a: 1 }
      equal(rq, rq.send(body))
      equal(rq.type(), 'application/json')
      equal(rq.body, JSON.stringify(body))
    })
  })

  describe('Sync.GET', () => {
    it('Sync.get should set method to GET', async () => {
      const re = await Sync.get()
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should set query params', async () => {
      const re = await Sync.get().query({ a: 1 })
      equal(re.code, 200)
      equal(re.body.url, '/?a=1')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should merge query params', async () => {
      const re = await Sync.get('/?a=1').query({ b: 2 })
      equal(re.code, 200)
      equal(re.body.url, '/?a=1&b=2')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should not throw when send empty body', async () => {
      const re = await Sync.get().send()
      equal(re.code, 200)
      equal(re.body.url, '/')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
    })

    it('should set content-type to json', async () => {
      const rq = Sync.get('/api').type('json')
      const re = await rq

      equal(re.code, 200)
      equal(re.body.url, '/api')
      equal(re.body.body, '')
      equal(re.body.method, 'GET')
      equal(re.body.headers[ 'content-type' ], 'application/json')
    })
  })

  describe('Sync.send', () => {
    const CL = 'content-length'
    it('should set body and update content-type', () => {

      const o = { a: 1 }
      const s = JSON.stringify(o)

      const rq = Sync.del()
      rq.send(o)
      equal(s, rq.body)
      equal('application/json', rq.type())
      equal(s.length, +rq.get(CL))
    })

    it('should not update content-type if exist', () => {
      const o = { a: 1 }
      const s = JSON.stringify(o)
      const rq = Sync.del()

      rq.type('xml')
      rq.send(o)

      equal(s, rq.body)
      equal('text/xml', rq.type())
      equal(7, +rq.get('content-length'))
    })
  })

  describe('Streams', () => {
    it('should fail on JSON.parse due SyntaxError', async () => {
      await rejects(async () => {
        await Sync.get('/json-fail')
      })
    })

    it(`should send body as stream`, async () => {
      const body = 'SHOSHANA!'
      const readable = Readable.from((async function* (it, i = 10) {
        for (const ch of it)
          yield await sleep(ch, random(i += 10))
      })(body))

      const re = await Sync.post('/', readable)
      equal(200, re.code)
      equal(body, re.body.body)
    })

    it(`should pipe responce to specified file`, async () => {
      const path = Pt.join(process.env.TMPDIR, Crypto.randomUUID())
      const re = await Sync.get('/').pipe(path)
      const file = await Fs.readFile(path)

      equal(200, re.code)
      equal(file.toString('utf-8'), JSON.stringify(re.body, 0, 2))
    })

    it(`should pipe responce to writable stream`, async () => {
      const path = Pt.join(process.env.TMPDIR, Crypto.randomUUID())
      const re = await Sync.get('/').pipe(createWriteStream(path))
      const file = await Fs.readFile(path)

      equal(200, re.code)
      equal(file.toString('utf-8'), JSON.stringify(re.body, 0, 2))
    })
  })

})
