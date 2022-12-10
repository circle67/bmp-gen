/// <reference types="node" />
import { Buffer } from 'buffer';
import type { IColorRGB } from './color';
/**
 * Procedural color generator for generating a bitmap. Passed the index and x and y coordinates of a selected pixel in the generation process.
 * @public
 */
export type BMPProcedure = (i: number, x: number, y: number) => IColorRGB;
/**
 * Bitmap generation options.
 * @public
 */
export interface BMPOptions {
    pixelsPerMeterX?: number;
    pixelsPerMeterY?: number;
}
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
export declare function bmp(width: number, height: number, procedure: BMPProcedure, opts?: BMPOptions): Promise<Buffer>;
