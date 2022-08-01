/* eslint-disable no-unused-vars */

import { deepStrictEqual as equal } from 'assert'

import * as Util from '../dist/util.js'

const Log = console.log

describe('Mim', () => {

  const ext = 'png'
  const type = 'image/png'

  const pOk = '/path/to/img.' + ext
  const uOk = new URL('file:/' + pOk)

  const pNope = '/path/to/xxx'
  const uNope = new URL('file:/' + pNope)

  describe('get & exports', () => {
    const mimeIt = (k, v) => it(`get mime.${ k }`, () => {
      equal(v, Util.get(k), `Mim.get(${ k })`)
      equal(v, Util[ k ], `Mim[ ${ k } ]`)
      equal(v, Util.mime[ k ], `Mim.mime[ ${ k } ]`)
    })

    it('CL', () => equal(Util.CL, 'Content-Length'))
    it('CT', () => equal(Util.CT, 'Content-Type'))

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
    it('[ URL ]  should return correct extension', () => equal(ext, Util.extname(pOk)))
    it('[ PATH ] should return correct extension', () => equal(ext, Util.extname(uOk)))

    it('[ URL ]  should return empty string if extension dont exist', () => equal('', Util.extname(pNope)))
    it('[ PATH ] should return empty string if extension dont exist', () => equal('', Util.extname(uNope)))
  })

  describe('Len', () => {
    it('[ URL ]  should return correct extension', () => equal(Buffer.byteLength('123'), Util.Len('123')))
  })

  describe('fromPath', () => {
    it('[ URL ]  should return correct type', () => equal(type, Util.fromPath(pOk)))
    it('[ PATH ] should return correct type', () => equal(type, Util.fromPath(uOk)))

    it('[ URL ]  should return empty string if type dont exist', () => equal('', Util.fromPath(pNope)))
    it('[ PATH ] should return empty string if type dont exist', () => equal('', Util.fromPath(uNope)))
  })

  describe('fromHead', () => {

    const oup = { 'Content-Type': type }
    const olw = { 'content-type': type }

    const hup = new Headers(oup)
    const hlw = new Headers(olw)

    it('[ OBJECT: lower case ] should return correct type', () => equal(type, Util.fromHead(oup)))
    it('[ OBJECT: lower case ] should return correct type', () => equal(type, Util.fromHead(olw)))
    it('[ OBJECT ] should return empty string if type dont exist', () => equal('', Util.fromHead({})))

    it('[ HEADER ] should return correct type', () => equal(type, Util.fromHead(hup)))
    it('[ HEADER ] should return correct type', () => equal(type, Util.fromHead(hlw)))
    it('[ HEADER ] should return empty string if type dont exist', () => equal('', Util.fromHead(new Headers)))
  })

  describe('is', () => {
    const png = Util.png
    const gif = Util.gif

    it('string', () => {
      equal(true,  Util.is('png', png))
      equal(true,  Util.is(png, png))
      equal(false, Util.is(png, gif))
      equal(false, Util.is('xxx', gif))
      equal(false, Util.is('xxx', 'yyy'))
    })

    it('object', () => {
      equal(true,  Util.is('png', { [ Util.CT ]: png }))
      equal(true,  Util.is(png, { [ Util.CT ]: png }))
      equal(false, Util.is(png, { [ Util.CT ]: gif }))
      equal(false, Util.is('xxx', { [ Util.CT ]: gif }))
      equal(false, Util.is('xxx', { [ Util.CT ]: 'yyy' }))
    })

    it('headers', () => {
      equal(true,  Util.is('png', new Headers([[ Util.CT, png ]])))
      equal(true,  Util.is(png, new Headers([[ Util.CT, png ]])))
      equal(false, Util.is(png, new Headers([[ Util.CT, gif ]])))
      equal(false, Util.is('xxx', new Headers([[ Util.CT, gif ]])))
      equal(false, Util.is('xxx', new Headers([[ Util.CT, 'yyy' ]])))
    })
  })

})
