<h1>bmp-gen <small>v0.1.0</small></h1>

A library for asynchronously and procedurally generating bitmap image files (BMP).

## Installation

--> Installation here

## Example

The following example generates a 16x16 bitmap filled with white pixels and writes it to the file `output.bmp`.

```javascript
import { writeFile } from 'fs/promises';
import { bmp, Color24, fill } from 'bmp-gen';

bmp(16, 16, fill(new Color24(255, 255, 255)))
	.then((data) => {
		writeFile('output.bmp', data).then(() => {
			console.log('output.bmp written successfully');
		});
	})
	.catch((err) => {
		throw err;
	});
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
