import { Buffer } from 'buffer';

import type { IColorRGB } from './color';
import { invert, decToUInt32LE } from './util';

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

const FULL_HEADER_LENGTH = 54;
const DEFAULT_PIXELS_PER_METER = 2835;
const APP_TAG = [0x36, 0x37];

/**
 * Generates a bitmap header based on `dataArraySize`.
 * @param dataArraySize - The size of the data array portion of the bitmap.
 * @returns A `Buffer` representing the bitmap header.
 *
 * @internal
 */
function getHeader(dataArraySize: number): Buffer {
	try {
		const size = decToUInt32LE(FULL_HEADER_LENGTH + dataArraySize);
		return Buffer.from([
			/* id field */ 0x42,
			0x4d,
			/* size  */ ...size.values(),
			/* app specific 2x2 */ ...APP_TAG,
			0,
			0,
			/* offset */
			...decToUInt32LE(FULL_HEADER_LENGTH).values(),
		]);
	} catch (err) {
		throw err as Error;
	}
}

/**
 * Generates a bitmap DIB header.
 * @param width - The width of the bitmap.
 * @param height - The height of the bitmap.
 * @param dataArraySize - The size of the data array portion of the bitmap.
 * @param ppmX - Pixels per meter horizontally.
 * @param ppmY - Pixels per meter vertically.
 * @returns A `Buffer` representing the bitmap DIB header.
 *
 * @internal
 */
function getDIBHeader(
	width: number,
	height: number,
	dataArraySize: number,
	ppmX: number,
	ppmY: number
): Buffer {
	try {
		const cWidth = decToUInt32LE(width);
		const cHeight = decToUInt32LE(height);
		const cDataArraySize = decToUInt32LE(dataArraySize);
		const cPPMX = decToUInt32LE(ppmX);
		const cPPMY = decToUInt32LE(ppmY);
		return Buffer.from([
			/* header length */ 40,
			0,
			0,
			0,
			/* width */ ...cWidth.values(),
			/* height */ ...cHeight.values(),
			/* color planes */ 1,
			0,
			/* bpp */ 24,
			0,
			/* compression */ 0,
			0,
			0,
			0,
			/* data array and padding size */ ...cDataArraySize.values(),
			/* ppm/dpi x */ ...cPPMX.values(),
			/* ppm/dpi y */ ...cPPMY.values(),
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
		]);
	} catch (err) {
		throw err as Error;
	}
}

/**
 * Generates `bytes` worth of padding (i.e. `0x0[bytes]`).
 * @param bytes - The number of bytes of padding.
 * @returns A `Buffer` of padding.
 *
 * @internal
 */
function getPadding(bytes: number): Buffer {
	return Buffer.alloc(bytes);
}

/**
 * Generates a bitmap data array.
 * @param width - The width of the bitmap.
 * @param height - The height of the bitmap.
 * @param procedure - The bitmap generator function.
 * @returns A `Buffer` representing the bitmap data array.
 *
 * @internal
 */
function getDataArray(
	width: number,
	height: number,
	procedure: BMPProcedure
): Buffer {
	try {
		const tempDataArray: Buffer[] = [];
		const pixLen = procedure(0, 0, 0).toLEBytes().length;
		const paddingBytes =
			Math.ceil((pixLen * width) / 4) * 4 - pixLen * width;
		for (let pixIndex = width * height - 1; pixIndex >= 0; pixIndex--) {
			const x = invert(pixIndex % width, width - 1);
			const y = Math.floor(pixIndex / width);
			const pixel = procedure(pixIndex, x, y).toLEBytes();
			tempDataArray.push(pixel);
			if (x === width - 1) {
				tempDataArray.push(getPadding(paddingBytes));
			}
		}
		return Buffer.concat(tempDataArray);
	} catch (err) {
		throw err as Error;
	}
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
export async function bmp(
	width: number,
	height: number,
	procedure: BMPProcedure,
	opts?: BMPOptions
): Promise<Buffer> {
	const dataArray: Buffer = getDataArray(width, height, procedure);
	const header: Buffer = getHeader(dataArray.length);
	const dibHeader: Buffer = getDIBHeader(
		width,
		height,
		dataArray.length,
		opts
			? opts.pixelsPerMeterX ?? DEFAULT_PIXELS_PER_METER
			: DEFAULT_PIXELS_PER_METER,
		opts
			? opts.pixelsPerMeterY ?? DEFAULT_PIXELS_PER_METER
			: DEFAULT_PIXELS_PER_METER
	);
	return Buffer.concat([header, dibHeader, dataArray]);
}
