import { IColorRGB } from './color';
import type { BMPProcedure } from './bmp';
/**
 * Returns a bitmap generator that fills every pixel with `color`.
 * @param color - The fill color.
 * @returns A bitmap generator.
 *
 * @public
 */
export declare const fill: (color?: IColorRGB) => BMPProcedure;
/**
 * Returns a bitmap generator that alternates between `colorLow` and `colorHigh` every pixel.
 * @param colorLow - The low color. Defaults to black.
 * @param colorHigh - The high color. Defaults to white.
 * @returns A bitmap generator.
 *
 * @public
 */
export declare const checker: (colorLow?: IColorRGB, colorHigh?: IColorRGB) => BMPProcedure;
