/**
 * A library for asynchronously and procedurally generating bitmap image files (BMP).
 *
 * @remarks
 * Exposes an asynchronous API for procedurally generating bitmaps through {@link bmp}, bitmap generator presets, and types for color management.
 *
 * @packageDocumentation
 */

/// <reference types="node" />

import { Buffer as Buffer_2 } from 'buffer';

/**
 * Generates a bitmap image of the specified width and height with the specified procedure.
 *
 * @example
 * The following example generates a 16x16 bitmap filled with white pixels and writes it to the file `output.bmp`.
 * ```
 * import { writeFile } from 'fs/promises';
 *
 * import { bmp, Color24, fill } from 'bmp';
 *
 * bmp(16, 16, fill(new Color24(255, 255, 255)))
 *     .then((data) => {
 *         writeFile('output.bmp', data).then(() => {
 *             console.log('output.bmp written successfully');
 *         });
 *     })
 *     .catch((err) => {
 *         throw err;
 *     });
 * ```
 *
 * @param width - The width of the bitmap to generate.
 * @param height - The height of the bitmap to generate.
 * @param procedure - The bitmap generator function used to populate the bitmap.
 * @param opts - Optional additional options to modify the bitmap.
 * @returns A promise resolving to a `Buffer` representing a bitmap image file. Can then be written to a file.
 *
 * @public
 */
export declare function bmp(width: number, height: number, procedure: BMPProcedure, opts?: BMPOptions): Promise<Buffer_2>;

/**
 * Bitmap generation options.
 * @public
 */
export declare interface BMPOptions {
    pixelsPerMeterX?: number;
    pixelsPerMeterY?: number;
}

/**
 * Procedural color generator for generating a bitmap. Passed the index and x and y coordinates of a selected pixel in the generation process.
 * @public
 */
export declare type BMPProcedure = (i: number, x: number, y: number) => IColorRGB;

/**
 * Returns a bitmap generator that alternates between `colorLow` and `colorHigh` every pixel.
 * @param colorLow - The low color. Defaults to black.
 * @param colorHigh - The high color. Defaults to white.
 * @returns A bitmap generator.
 *
 * @public
 */
export declare const checker: (colorLow?: IColorRGB, colorHigh?: IColorRGB) => BMPProcedure;

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
    toLEBytes(): Buffer_2;
}

/**
 * Returns a bitmap generator that fills every pixel with `color`.
 * @param color - The fill color.
 * @returns A bitmap generator.
 *
 * @public
 */
export declare const fill: (color?: IColorRGB) => BMPProcedure;

/**
 * An RGB color.
 * @public
 */
export declare interface IColorRGB {
    r: number;
    g: number;
    b: number;
    toLEBytes: () => Buffer_2;
}

export { }
