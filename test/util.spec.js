import { deepStrictEqual as equal } from 'assert'
import * as Util from '../src/util.js'


describe('Mim', () => {

  const ext = 'png'
  const type = 'image/png'

  describe('get', () => {
    const yml = 'text/yaml'

    it('by alias', () => equal(yml,  Util.get('yml')))
    it('by alias', () => equal(yml,  Util.get('yaml')))
    it('by mime type', () => equal(yml,  Util.get(yml)))
    it('by fallback', () => equal(yml,  Util.get('xxx', yml)))
  })

  describe('exports', () => {
    const mimeIt = (k, v) => it(`get mime.${ k }`, () => {
      equal(v, Util.get(k), `Mim.get(${ k })`)
      equal(v, Util.mime[ k ], `Mim.mime[ ${ k } ]`)
    })

    mimeIt('txt', 'text/plain')
    mimeIt('css', 'text/css')
    mimeIt('less', 'text/less')
    mimeIt('csv', 'text/csv')
    mimeIt('jsx', 'text/jsx')
    mimeIt('md', 'text/x-markdown')
    mimeIt('yaml', 'text/yaml')
    mimeIt('yml', 'text/yaml')
    mimeIt('xml', 'text/xml')
    mimeIt('gif', 'image/gif')
    mimeIt('png', 'image/png')
    mimeIt('jpg', 'image/jpeg')
    mimeIt('jpeg', 'image/jpeg')
    mimeIt('svg', 'image/svg+xml')
    mimeIt('svgz', 'image/svg+xml')
    mimeIt('ico', 'image/x-icon')
    mimeIt('webp', 'image/webp')
    mimeIt('woff', 'font/woff')
    mimeIt('otf', 'font/opentype')
    mimeIt('bdf', 'application/x-font-bdf')
    mimeIt('pcf', 'application/x-font-pcf')
    mimeIt('snf', 'application/x-font-snf')
    mimeIt('ttf', 'application/x-font-ttf')
    mimeIt('zip', 'application/zip')
    mimeIt('tar', 'application/zip')
    mimeIt('json', 'application/json')
    mimeIt('js', 'application/javascript')
    mimeIt('bin', 'application/octet-stream')
    mimeIt('dmg', 'application/octet-stream')
    mimeIt('iso', 'application/octet-stream')
    mimeIt('img', 'application/octet-stream')
    mimeIt('form', 'multipart/form-data')
    mimeIt('query', 'application/x-www-form-urlencoded')
  })

  describe('extname', () => {
    it('[ URL ]  should return correct extension', () => equal(ext, Util.extname('/path/to/file.' + ext)))
    it('[ PATH ] should return correct extension', () => equal(ext, Util.extname(new URL('file://path/to/file.' + ext))))

    it('[ URL ]  should return empty string if extension dont exist', () => equal('', Util.extname('xxx')))
    it('[ PATH ] should return empty string if extension dont exist', () => equal('', Util.extname(new URL('file://xxx'))))
  })

  describe('Len', () => {
    it('[ URL ]  should return correct extension', () => equal(Buffer.byteLength('123'), Util.Len('123')))
  })

  describe('fromPath', () => {
    it('[ URL  ] should return correct type', () => equal(type, Util.fromPath('/path/to/file.png')))
    it('[ PATH ] should return correct type', () => equal(type, Util.fromPath(new URL('file://path/to/file.png'))))

    it('[ URL  ] should return empty string if type dont exist', () => equal('', Util.fromPath('/path/to/some.ext')))
    it('[ PATH ] should return empty string if type dont exist', () => equal('', Util.fromPath(new URL('file://path/to/xxx'))))

    it('[ URL  ] should return fallback if type dont exist', () => equal(type, Util.fromPath('/path/xxxx', type)))
    it('[ PATH ] should return fallback if type dont exist', () => equal(type, Util.fromPath(new URL('file://xxx'), type)))
  })

  describe('fromHead', () => {

    const objUpper = { 'Content-Type': type }
    const objLower = { 'content-type': type }

    const headUpper = new Headers(objUpper)
    const headLower = new Headers(objLower)

    it('[ OBJECT: upper case ] should return correct type', () => equal(type, Util.fromHead(objUpper)))
    it('[ OBJECT: lower case ] should return correct type', () => equal(type, Util.fromHead(objLower)))

    it('[ OBJECT ] should return empty string if type dont exist', () => equal('', Util.fromHead({})))
    it('[ OBJECT ] should return fallback if type dont exist', () => equal(type, Util.fromHead({}, type)))

    it('[ HEADER ] should return correct type', () => equal(type, Util.fromHead(headUpper)))
    it('[ HEADER ] should return correct type', () => equal(type, Util.fromHead(headLower)))
    it('[ HEADER ] should return empty string if type dont exist', () => equal('', Util.fromHead(new Headers)))
    it('[ HEADER ] should return fallback if type dont exist', () => equal(type, Util.fromHead(new Headers, type)))
  })

  describe('is', () => {
    const png = Util.mime.png
    const gif = Util.mime.gif
    const CT = 'content-type'

    it('nada', () => {
      equal(false,  Util.is())
      equal(false,  Util.is(''))
      equal(false,  Util.is({}))
      equal(false,  Util.is(new Headers))
    })

    it('string', () => {
      equal(true,  Util.is('png', png))
      equal(true,  Util.is(png,   png))

      equal(false, Util.is(png,   gif))
      equal(false, Util.is('xxx', gif))
      equal(false, Util.is('xxx', 'yyy'))
    })

    it('object', () => {
      equal(true,  Util.is('png', { [ CT ]: png }))
      equal(true,  Util.is(png,   { [ CT ]: png }))

      equal(false, Util.is(png,   { [ CT ]: gif }))
      equal(false, Util.is('xxx', { [ CT ]: gif }))
      equal(false, Util.is('xxx', { [ CT ]: 'yyy' }))
    })

    it('headers', () => {
      equal(true,  Util.is('png', new Headers([[ CT, png ]])))
      equal(true,  Util.is(png,   new Headers([[ CT, png ]])))

      equal(false, Util.is(png,   new Headers([[ CT, gif ]])))
      equal(false, Util.is('xxx', new Headers([[ CT, gif ]])))
      equal(false, Util.is('xxx', new Headers([[ CT, 'yyy' ]])))
    })
  })

  describe('each', () => {
    const cb = function (k, v) { this.push(k + v) }
    const tuple = [
      [ 'a', 'b' ],
      [ 'c', 'd' ],
    ]

    it('dict', () => {
      const ctx = []
      equal(ctx, Util.each(new Map(tuple), cb, ctx))
      equal('abcd', ctx.join(''))
    })

    it('headers', () => {
      const ctx = []
      equal(ctx, Util.each(new Headers(tuple), cb, ctx))
      equal('abcd', ctx.join(''))
    })

    it('url search params', () => {
      const ctx = []
      equal(ctx, Util.each(new URLSearchParams(tuple), cb, ctx))
      equal('abcd', ctx.join(''))
    })

    it('map', () => {
      const ctx = []
      equal(ctx, Util.each(Object.fromEntries(tuple), cb, ctx))
      equal('abcd', ctx.join(''))
    })

    it('array', () => {
      const ctx = []
      equal(ctx, Util.each(tuple.flat(), cb, ctx))
      equal('0a1b2c3d', ctx.join(''))
    })
  })

})
