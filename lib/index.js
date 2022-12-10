var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/color.ts
import { Buffer as Buffer3 } from "buffer";

// src/util.ts
import { Buffer as Buffer2 } from "buffer";
function clamp(a, min, max) {
  return Math.min(Math.max(a, min), max);
}
function invert(a, zeroIndexedRange = 1) {
  return a * -1 + zeroIndexedRange;
}
function decToUInt32LE(a) {
  const buf = Buffer2.alloc(4);
  buf.writeUInt32LE(a);
  return buf;
}

// src/color.ts
var _Color24 = class {
  _r = 0;
  _g = 0;
  _b = 0;
  constructor(r, g, b) {
    this._r = Math.round(clamp(r, 0, _Color24._MAX_INT_VALUE));
    this._g = Math.round(clamp(g, 0, _Color24._MAX_INT_VALUE));
    this._b = Math.round(clamp(b, 0, _Color24._MAX_INT_VALUE));
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
  toLEBytes() {
    return Buffer3.from([this._b, this._g, this._r]);
  }
};
var Color24 = _Color24;
__publicField(Color24, "_MAX_INT_VALUE", 255);

// src/bmp.ts
import { Buffer as Buffer4 } from "buffer";
var FULL_HEADER_LENGTH = 54;
var DEFAULT_PIXELS_PER_METER = 2835;
var APP_TAG = [54, 55];
function getHeader(dataArraySize) {
  try {
    const size = decToUInt32LE(FULL_HEADER_LENGTH + dataArraySize);
    return Buffer4.from([
      66,
      77,
      ...size.values(),
      ...APP_TAG,
      0,
      0,
      ...decToUInt32LE(FULL_HEADER_LENGTH).values()
    ]);
  } catch (err) {
    throw err;
  }
}
function getDIBHeader(width, height, dataArraySize, ppmX, ppmY) {
  try {
    const cWidth = decToUInt32LE(width);
    const cHeight = decToUInt32LE(height);
    const cDataArraySize = decToUInt32LE(dataArraySize);
    const cPPMX = decToUInt32LE(ppmX);
    const cPPMY = decToUInt32LE(ppmY);
    return Buffer4.from([
      40,
      0,
      0,
      0,
      ...cWidth.values(),
      ...cHeight.values(),
      1,
      0,
      24,
      0,
      0,
      0,
      0,
      0,
      ...cDataArraySize.values(),
      ...cPPMX.values(),
      ...cPPMY.values(),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]);
  } catch (err) {
    throw err;
  }
}
function getPadding(bytes) {
  return Buffer4.alloc(bytes);
}
function getDataArray(width, height, procedure) {
  try {
    const tempDataArray = [];
    const pixLen = procedure(0, 0, 0).toLEBytes().length;
    const paddingBytes = Math.ceil(pixLen * width / 4) * 4 - pixLen * width;
    for (let pixIndex = width * height - 1; pixIndex >= 0; pixIndex--) {
      const x = invert(pixIndex % width, width - 1);
      const y = Math.floor(pixIndex / width);
      const pixel = procedure(pixIndex, x, y).toLEBytes();
      tempDataArray.push(pixel);
      if (x === width - 1) {
        tempDataArray.push(getPadding(paddingBytes));
      }
    }
    return Buffer4.concat(tempDataArray);
  } catch (err) {
    throw err;
  }
}
async function bmp(width, height, procedure, opts) {
  const dataArray = getDataArray(width, height, procedure);
  const header = getHeader(dataArray.length);
  const dibHeader = getDIBHeader(
    width,
    height,
    dataArray.length,
    opts ? opts.pixelsPerMeterX ?? DEFAULT_PIXELS_PER_METER : DEFAULT_PIXELS_PER_METER,
    opts ? opts.pixelsPerMeterY ?? DEFAULT_PIXELS_PER_METER : DEFAULT_PIXELS_PER_METER
  );
  return Buffer4.concat([header, dibHeader, dataArray]);
}

// src/presets.ts
var fill = (color = new Color24(255, 255, 255)) => {
  return function() {
    return color;
  };
};
var checker = (colorLow = new Color24(0, 0, 0), colorHigh = new Color24(255, 255, 255)) => {
  return function(i, _x, y) {
    const index = i + y;
    const color = Math.round((Math.cos(Math.PI * index) + 1) / 2);
    return color === 0 ? colorLow : colorHigh;
  };
};
export {
  Color24,
  bmp,
  checker,
  fill
};
//# sourceMappingURL=index.js.map
