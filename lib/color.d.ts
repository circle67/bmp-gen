/// <reference types="node" />
import { Buffer } from 'buffer';
/**
 * An RGB color.
 * @public
 */
export interface IColorRGB {
    r: number;
    g: number;
    b: number;
    toLEBytes: () => Buffer;
}
/**
 * A class representing a 24-bit color.
 *
 * @remarks
 * Extraneous values are clamped to the range [0, 255].
 *
 * @example
 * ```
 * const white = new Color24(255, 255, 255);
 * const red = new Color24(255, 0, 0);
 *
 * // Expected: "FFFFFF"
 * console.log(white.toLEBytes().toString('hex'));
 *
 * // Expected: "0000FF"
 * console.log(red.toLEBytes().toString('hex'))
 * ```
 *
 * @public
 */
export declare class Color24 implements IColorRGB {
    private static _MAX_INT_VALUE;
    private _r;
    private _g;
    private _b;
    constructor(r: number, g: number, b: number);
    get r(): number;
    get g(): number;
    get b(): number;
    /**
     * Returns a {@link https://en.wikipedia.org/wiki/Endianness | little-endian} `Buffer` representing the color.
     * @returns A `Buffer` representing the color.
     */
    toLEBytes(): Buffer;
}
