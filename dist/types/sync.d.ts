/// <reference types="node" />
import Http from 'http';
import { IPayload } from '.';
import Base from './base.js';
export default class Sync extends Base {
    static canRead: any;
    send(body: any): this;
    end(): Promise<Http.IncomingMessage>;
    parse(re: Http.IncomingMessage): Promise<IPayload>;
}
