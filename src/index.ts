
export type Dict = { [ k: string ]: any }
export type Method = 'get' | 'post' | 'put' | 'delete'
export type Each = (k: string, v: any) => void

export type Done = (pay: IPayload) => Promise<any>
export type Fail = (err: Error) => Promise<any>

export interface IPayload {
  ok: boolean
  code: number
  error?: Error | null
  headers: Headers
  body?: any
}

export interface IBase {
  url: URL
  head: Headers
  method: Method
  body?: any

  has(k: string): boolean
  get(k: string): string
  set(k: string | Dict | Headers, v?: string | number | boolean): this
  query(k: string | Dict | URLSearchParams, v?: string | number | boolean): this
  send(body?: any): this

  // type(): string
  // type(alias: string): this

  type(alias?: string): this | string
  then(done?: Done, fail?: Fail): Promise<any>
}



