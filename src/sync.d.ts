/// <reference types="node" />

import Http from 'http'
import Base from './base.js'

export type Payload = import('./base.js').Payload

/**
 * @class
 * @implements {Base}
 */
export default class Sync extends Base implements Base {

    /**
     * @param  {any} x
     * @return {boolean}
     */
    static isReadable(x: any): boolean

    /**
     * @param  {any} body
     * @return {this}
     */
    send(body: any): this

    /**
     * @return {Promise<Http.IncomingMessage>}
     */
    end(): Promise<Http.IncomingMessage>

    /**
     * @param  {Http.IncomingMessage} rs
     * @return {Promise<Payload>}
     */
    parse(rs: Http.IncomingMessage): Promise<Payload>
}