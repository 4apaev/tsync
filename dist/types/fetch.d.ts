import { IPayload } from '.';
import Base from './base.js';
export default class Fetch extends Base {
    end(): Promise<Response>;
    parse(re: Response): Promise<IPayload>;
}
