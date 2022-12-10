import { Buffer } from 'buffer';

import { clamp } from './util';

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
export class Color24 implements IColorRGB {
	private static _MAX_INT_VALUE = 255 as const;
	private _r = 0;
	private _g = 0;
	private _b = 0;

	constructor(r: number, g: number, b: number) {
		this._r = Math.round(clamp(r, 0, Color24._MAX_INT_VALUE));
		this._g = Math.round(clamp(g, 0, Color24._MAX_INT_VALUE));
		this._b = Math.round(clamp(b, 0, Color24._MAX_INT_VALUE));
	}

	get r() {
		return this._r;
	}

	get g() {
		return this._g;
	}

	get b() {
		return this._b;
	}

	/**
	 * Returns a {@link https://en.wikipedia.org/wiki/Endianness | little-endian} `Buffer` representing the color.
	 * @returns A `Buffer` representing the color.
	 */
	toLEBytes(): Buffer {
		return Buffer.from([this._b, this._g, this._r]);
	}
}
