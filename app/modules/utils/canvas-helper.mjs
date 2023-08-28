import config from '/config.js';
import ColorConversion from './color-conversion.mjs';

class CanvasHelper {
	#canvas = null;
	#context = null;
	#width = 0;
	#height = 0;
	
	constructor(width, height,  {offscreen = true} = {}) {
		this.#width = width;
		this.#height = height;
		if (offscreen) {
			this.#canvas = new OffscreenCanvas(width, height);
			this.#context = this.#canvas.getContext('2d');
		} else {
			this.#canvas = document.createElement('canvas');
			this.#canvas.width = width;
			// for some unknown reason, you get scrollbars if you use the full innerHeight
			this.#canvas.height = height - 4;
			// https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
			// on my computer this setting has no effect on the performance
			// only one less warning in the chrome developer console
			this.#context = this.#canvas.getContext('2d', {willReadFrequently: true, alpha: false});
		}
	}

	get content() {
		return this.#canvas;
	}

	get context() {
		return this.#context;
	}

	clearPixelData() {
		this.#context.fillStyle = 'white';
		this.#context.fillRect(0, 0, this.#width, this.#height);
	}

	setPixelData(data, clear=false) {
		if (clear) this.clearPixelData();
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

	getPixelColor(x, y) {
		let imgData = this.#context.getImageData(0, 0, this.#width, this.#height).data;
		let coord = this.#getRedIndexForCoord(x, y, this.#width);
		let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
		if (alpha !== 0) return ColorConversion.numberToString(config.colorType, red, green, blue);
		return;
	}

	setPixelColor(x, y, color) {
		if (this.#context) {
			this.#context.fillStyle = color;
			this.#context.fillRect(x, y, 1, 1);
		}
	}

	#getRedIndexForCoord(x, y, width) {
		return y * (width * 4) + x * 4;
	}

	convertToBlob() {
		return this.#canvas.convertToBlob(...arguments);
	}
}

export default CanvasHelper;
