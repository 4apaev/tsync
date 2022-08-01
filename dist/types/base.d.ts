import { Dict, IBase, IPayload, Method, Done, Fail } from '.';
export default abstract class Base implements IBase {
    static BASE: string;
    static HEAD: Headers;
    url: URL;
    head: Headers;
    method: Method;
    body?: any;
    constructor(method: Method, url?: string | URL);
    get headers(): Headers;
    has(k: string): boolean;
    get(k: string): string;
    set(k: string | Dict | Headers, v?: string | number | boolean): this;
    query(k?: string | Dict | URLSearchParams, v?: string | number | boolean): this;
    send(body?: any): this;
    type(alias?: string): this | string;
    then(done?: Done, fail?: Fail): Promise<any>;
    abstract end(): Promise<any>;
    abstract parse(re: any): Promise<IPayload>;
    static get(url: string | URL, body?: any): any;
    static put(url: string | URL, body?: any): any;
    static post(url: string | URL, body?: any): any;
    static del(url: string | URL, body?: any): any;
}
