# bmp-gen

[![v0.1.0](https://img.shields.io/github/package-json/v/circle67/bmp-gen?style=flat-square)](https://github.com/circle67/bmp-gen/releases)
[![Library File Size](https://img.shields.io/github/size/circle67/bmp-gen/lib/index.js?style=flat-square)](https://github.com/circle67/bmp-gen/blob/master/lib/index.js)
[![MIT License](https://img.shields.io/github/license/circle67/bmp-gen?style=flat-square)](https://github.com/circle67/bmp-gen/blob/master/LICENSE)

A library for asynchronously and procedurally generating bitmap image files (BMP).

## Installation

--> Installation here

## Example

The following example generates a 16x16 bitmap filled with white pixels and writes it to the file `test_outputs/output.bmp`.

```javascript
import { writeFile } from 'fs/promises';

import { bmp, Color24, fill } from 'bmp-gen';

bmp(16, 16, fill(new Color24(255, 255, 255)))
	.then((data) => {
		writeFile('test_outputs/output.bmp', data).then(() => {
			console.log('output.bmp written successfully');
		});
	})
	.catch((err) => {
		throw err;
	});
```

**Output:** ![Example 1 Output](https://raw.githubusercontent.com/circle67/bmp-gen/master/README/ex1.bmp)

### Example 2

The following example generates a 16x16 bitmap filled with alternating pixels and writes it to the file `test_outputs/output.bmp`.

```javascript
import { writeFile } from 'fs/promises';

import { bmp, Color24, checker } from 'bmp-gen';

bmp(16, 16, checker(new Color24(255, 128, 128), new Color24(128, 128, 255)))
	.then((data) => {
		writeFile('test_outputs/output.bmp', data).then(() => {
			console.log('output.bmp written successfully');
		});
	})
	.catch((err) => {
		throw err;
	});
```

**Output:** ![Example 2 Output](https://raw.githubusercontent.com/circle67/bmp-gen/master/README/ex2.bmp)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://github.com/circle67/bmp-gen/blob/master/LICENSE)
