/**
 * @param  { string } s
 * @param  { string } [fallback]
 * @return { string }
 */
export function get(s: string, fallback?: string): string

/**
 * @param  { Head } ctx
 * @param  { string } [fallback]
 * @return { string }
 */
export function fromHead(ctx: Head, fallback?: string): string

/**
 * @param  { string | URL } s
 * @param  { string } [fallback]
 * @return { string }
 */
export function fromPath(s: string | URL, fallback?: string): string

/**
 * @param  { string | URL } file
 * @return { string }
 */
export function extname(file: string | URL): string

/**
 * @param  { string } expected
 * @param  { string | Head } actual
 * @return { boolean }
 */
export function is(expected: string, actual: string | Head): boolean

/**
 * @template T, C
 * @param   { Dict | Headers | URLSearchParams | Map | Set } it
 * @param   { (k: string, v: T) => void } cb
 * @param   { C } ctx
 * @returns { C }
 */
export function each<T, C>(it: Dict | Headers | URLSearchParams | Map<any, any> | Set<any>, cb: (k: string, v: T) => void, ctx: C): C

export function populate(template: {
    raw: readonly string[] | ArrayLike<string>
}, ...substitutions: any[]): string

export const mime: any
export function Len(x: Buff): number
export type Dict = {
    [ k: string ]: any
    [ k: number ]: any
    [ k: symbol ]: any
}
export type Head = import('http').IncomingHttpHeaders | Headers | Dict | Map<any, any>
export type Buff = (string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer)
