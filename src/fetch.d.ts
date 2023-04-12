import Base from './base.js'
export type Payload = import('./base.js').Payload

/**
 * @class
 * @implements {Base}
 */
export default class Fetch extends Base implements Base {
    /**
     * @return {Promise<Response>}
     */
    end(): Promise<Response>

    /**
     * @param  {Response} rs
     * @return {Promise<Payload>}
     */
    parse(rs: Response): Promise<Payload>
}