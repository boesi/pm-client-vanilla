import config from '/config.js';
import ColorConversion from './color-conversion.mjs';

class CanvasHelper {
	#canvas = null;
	#context = null;
	#width = 0;
	#height = 0;
	
	constructor(width, height, options = {offscreen: true}) {
		this.#width = width;
		this.#height = height;
		this.#canvas = options.offscreen ? 
			new OffscreenCanvas(width, height) :
			document.createElement('canvas');
		this.#context = this.#canvas.getContext('2d');
	}

	get content() {
		return this.#canvas;
	}

	get context() {
		return this.#context;
	}

	setPixelData(data) {
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let color = data[x][y];
				if (color) {
					this.#context.fillStyle = color;
					this.#context.fillRect(x, y, 1, 1);
				}
			}
		}
	}

	getPixelData() {
		let width = this.#width,
				height = this.#height,
				data = Array(width);
		for (let x=0; x<data.length; x++) data[x] = Array(height);
		console.log('===> canvas-helpoer.getPixelData', {width, height, data});

		let imgData = this.#context.getImageData(0, 0, width, height).data;
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let coord = this.#getRedIndexForCoord(x, y, width);
				let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
				if (alpha !== 0) {
					// although white is just a regular color, we assume that here is no pixel, so the other boards do not overload
					// and for the canvas board "no pixel" means the same as "white pixel"
					if (red !== 255 && green !== 255 && blue !== 255) {
						data[x][y] = ColorConversion.numberToString(config.colorType, red, green, blue);
					}
				}
			}
		}
		return data;
	}

	#getRedIndexForCoord(x, y, width) {
		return y * (width * 4) + x * 4;
	}

	convertToBlob() {
		return this.#canvas.convertToBlob(...arguments);
	}
}

export default CanvasHelper;
