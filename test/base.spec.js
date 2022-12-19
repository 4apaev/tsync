import {
  equal,
  rejects,
  deepStrictEqual as eqDeep,
} from 'assert'
import Base from '../src/base.js'

describe('Base', () => {
  Base.BASE = 'http://0.0.0.0/'

  describe('Base.URL', () => {
    it('should set default method', () => {
      equal((new Base).method, 'get')
      equal(new Base('put').method, 'put')
      equal(Base.post().method, 'post')
      equal(Base.del().method, 'delete')
    })

    it('should set default base url', () => {
      equal(Base.put().url.toString(), Base.BASE)
    })

    it('should set url as URL', () => {
      const u = new URL('http://example.com')
      equal(Base.put(u).url.toString(), u.toString())
    })

    it('should ignore base url when protocol specified', () => {
      const u = 'http://1.1.1.1/'
      equal(Base.put(u).url.toString(), u)
    })

    it('should use base url and path', () => {
      const u = 'api'
      equal(Base.BASE + u, Base.put(u).url.toString())
    })
  })

  describe('Base constructor', () => {
    it('should send body or query params', () => {
      const body = { a: 1, b: 2 }
      const str = JSON.stringify(body)

      let rq = new Base('post', '/', body)

      equal('post', rq.method)
      equal('application/json', rq.type())
      equal(str, rq.body)


      rq = new Base('get', '/', body)

      equal('get', rq.method)
      equal('', rq.type())
      equal('?a=1&b=2', rq.url.search)
    })
  })

  describe('Base.headers', () => {
    it('should return this', () => {
      const rq = Base.get()
      equal(rq, rq.set())
      eqDeep({}, Object.fromEntries(rq.head))
    })

    it('should return headers as object', () => {
      const hd = { a: 'b', c: 'd' }
      const rq = Base.put().set(hd)
      eqDeep(hd, Object.fromEntries(rq.head))
    })

    it('should set headers as object and key/value', () => {
      const ctx = Base.put().set('a', 'b').set({ c: 'd' })

      eqDeep(ctx.head.get('a'), 'b')
      eqDeep(ctx.head.get('c'), 'd')

      eqDeep(ctx.headers.get('a'), 'b')
      eqDeep(ctx.headers.get('c'), 'd')
    })

    it('should get header', () => {
      equal(Base.put().set('a', 'b').get('a'), 'b')
    })

    it('should check if header exist', () => {
      const rq = Base.put().set('a', 'b')
      equal(rq.has('a'), true)
      equal(rq.has('b'), false)
    })
  })

  describe('Base.send', () => {

    it('should stringify and set body', () => {
      let n, b
      const rq = Base.put()

      rq.send(b = '1234')
      equal(b, rq.body, 'should set body to 1234')
      equal(n = Buffer.byteLength(b), +rq.get('content-length'), 'should update (content-length was not set manualy)')

      rq.send(b = '123')
      equal(b, rq.body, 'should set body to 123')
      equal(n, +rq.get('content-length'), 'should not update (content-length was set manualy)')

      rq.set('content-length', 10).send()
      equal(b, rq.body, 'body should remain 123')
      equal(10, +rq.get('content-length'), 'should not update (content-length was set manualy to 10)')
    })

    it('should set body and update content-type', () => {
      let b
      const rq = Base.put()

      rq.send(b = { a: 1 })
      equal(b = JSON.stringify(b), rq.body)
      equal('application/json', rq.type())
      equal(b.length, +rq.get('content-length'))
    })

    it('should not update content-type if exist', () => {
      let b
      const rq = Base.put()
      rq.type('xml')
      rq.send(b = { a: 1 })

      equal(b = JSON.stringify(b), rq.body)
      equal('text/xml', rq.type())
      equal(b.length, +rq.get('content-length'))
    })
  })

  describe('Base.query', () => {
    it('should ignore query params if empty', () => {
      const rq = Base.get()

      rq.query()
      equal(rq.url.toString(), Base.BASE)
    })

    it('should set query params as key/value', () => {
      const rq = Base.get()

      rq.query('a', 'b')
      equal(rq.url.search, '?a=b')

      rq.query('c', 'd')
      equal(rq.url.search, '?a=b&c=d')
    })

    it('should set query params as object', () => {
      const rq = Base.get()
      rq.query({ a: 1, b: [ 2, 3 ]})
      equal('?a=1&b=2&b=3', rq.url.search)

      rq.query({ c: 4 })
      equal('?a=1&b=2&b=3&c=4', rq.url.search)
    })

    it('should append query params', () => {
      const rq = Base.get()
      rq.query({ a: 'b' })
      equal(rq.url.search, '?a=b')

      rq.query('a', 'c')
      rq.query('a', 'd')
      equal(rq.url.search, '?a=b&a=c&a=d')
    })

  })

  describe('Base.then', () => {
    it('await request without calling then', async () => {
      const rq = Base.get()
      rq.end = () => 1
      rq.parse = x => x + 1
      const rs = await rq
      equal(2, rs)
    })

    it('should call then directly', async () => {
      const rq = Base.get()
      rq.end = () => 1
      rq.parse = x => x + 1

      const rs = await rq.then()
      equal(2, rs)
    })

    it('should throw', async () => {
      rejects(() => Base.get().then())
    })
  })
})
