import { IColorRGB, Color24 } from './color';
import type { BMPProcedure } from './bmp';

/**
 * Returns a bitmap generator that fills every pixel with `color`.
 * @param color - The fill color.
 * @returns A bitmap generator.
 *
 * @public
 */
export const fill = (
	color: IColorRGB = new Color24(255, 255, 255)
): BMPProcedure => {
	return function () {
		return color;
	};
};

/**
 * Returns a bitmap generator that alternates between `colorLow` and `colorHigh` every pixel.
 * @param colorLow - The low color. Defaults to black.
 * @param colorHigh - The high color. Defaults to white.
 * @returns A bitmap generator.
 *
 * @public
 */
export const checker = (
	colorLow: IColorRGB = new Color24(0, 0, 0),
	colorHigh: IColorRGB = new Color24(255, 255, 255)
): BMPProcedure => {
	return function (i, _x, y) {
		const index = i + y;
		const color = Math.round((Math.cos(Math.PI * index) + 1) / 2);
		return color === 0 ? colorLow : colorHigh;
	};
};
