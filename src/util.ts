import { Buffer } from 'buffer';

/**
 * Clamps `a` between `min` and `max`.
 * @param a - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped value of `a`.
 *
 * @internal
 */
export function clamp(a: number, min: number, max: number): number {
	return Math.min(Math.max(a, min), max);
}

/**
 * Inverts `a` in some range `zeroIndexedRange`.
 *
 * @remarks
 * The exact formula is `a * -1 + zeroIndexedRange`. This function will, for example, map the range [0, 1] to [1, 0].
 *
 * @param a - The number to invert.
 * @param zeroIndexedRange - The range to invert `a` in. Defaults to 1.
 * @returns The inverted value of `a`.
 *
 * @internal
 */
export function invert(a: number, zeroIndexedRange = 1): number {
	return a * -1 + zeroIndexedRange;
}

/**
 * Converts a decimal value to a {@link https://en.wikipedia.org/wiki/Endianness little-endian} 32-bit unsigned integer.
 * @param a - The decimal value to convert.
 * @returns A `Buffer` representing a little-endian 32-bit unsigned integer.
 *
 * @internal
 */
export function decToUInt32LE(a: number): Buffer {
	const buf = Buffer.alloc(4);
	buf.writeUInt32LE(a);
	return buf;
}
