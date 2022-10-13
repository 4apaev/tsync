import { Dict, Each } from '.';
export declare const µ: undefined;
export declare const CT: string;
export declare const CL: string;
export declare const isNODE: boolean;
export declare const mime: {
    [k: string]: string;
};
export declare function get(alias: string): string;
export declare function fromHead(ctx: Headers | Dict): any;
export declare function fromPath(path: string): string;
export declare function extname(file: string | URL): string;
export declare function is(expected: string, actual: string | Headers | Dict): boolean;
export declare function each<T>(it: Dict | Headers | URLSearchParams, cb: Each, ctx?: T): T;
export declare const Len: (x: string) => number;
export declare const txt: string, css: string, less: string, csv: string, jsx: string, md: string, yaml: string, yml: string, xml: string, gif: string, png: string, jpg: string, jpeg: string, svg: string, svgz: string, ico: string, webp: string, woff: string, otf: string, bdf: string, pcf: string, snf: string, ttf: string, zip: string, tar: string, json: string, js: string, bin: string, dmg: string, iso: string, img: string, form: string, query: string;
