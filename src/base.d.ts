/**
 * @interface
 */
export default class Base {
    static BASE: string
    static HEAD: Headers

    static get(url: string | URL, body?: any): Base
    static put(url: string | URL, body?: any): Base
    static post(url: string | URL, body?: any): Base
    static del(url: string | URL, body?: any): Base

    /**
     * @constructor
     * @param { HttpMethod } method
     * @param { string | URL } [url]
     * @param { any } [body]
     */
    constructor(method: HttpMethod, url?: string | URL, body?: any)

    /** @type {any}        */ body: any
    /** @type {Headers}    */ head: Headers
    /** @type {HttpMethod} */ method: HttpMethod
    /** @type {URL}        */ url: URL

    /** @alias */
    get headers(): Headers

    /** @alias */
    get params(): URLSearchParams

    /**
     * @param  { string } k
     * @return { boolean }
     */
    has(k: string): boolean

    /**
     * @param  { string } k
     * @return { string }
     */
    get(k: string): string

    /**
     * @param  { string | Dict } k
     * @param  { Prmtv } v
     * @return { this }
     */
    set(k: string | Dict, v: Prmtv): this

    /**
     * @param  { string | Dict } k
     * @param  { Prmtv | Prmtv[] } [v]
     * @return { this }
     */
    query(k: string | Dict, v?: Prmtv | Prmtv[]): this

    /**
     * @param  { any } body
     * @return { this }
     */
    send(body: any): this

    /**
     * @param  { string } [alias]
     * @return { this | string }
     */
    type(alias?: string): string | Base

    /**
     * @param { (p: Payload) => Promise } [done]
     * @param { (e: Error) => Promise } [fail]
     */
    then(done?: (p: Payload) => Promise<any>, fail?: (e: Error) => Promise<any>): Promise<any>

    /**
     * @return { Promise<any> }
     */
    end(): Promise<any>

    /**
     * @param  { any } rs
     * @return { Promise<Payload> }
     */
    parse(rs: any): Promise<Payload>
}
export type Dict = {
    [ k: string ]: any
}

export type Prmtv = string | number | boolean
export type Method = (url: string | URL, body?: any) => Base
export type HttpMethod = 'get' | 'post' | 'put' | 'delete'
export type Payload = {
    ok: boolean
    code: number
    headers: Headers
    error?: Error
    body?: any
}
