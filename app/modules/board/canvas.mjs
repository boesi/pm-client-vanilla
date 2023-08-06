import ColorConversion from '/modules/utils/color-conversion.mjs';
import { rerouteEvent } from '/modules/utils/helpers.mjs';
import config from '/config.js';

class BoardCanvas {
	board = null;
	ctx = null;

	constructor() {
		this.board = document.createElement('canvas');
		this.board.width = window.innerWidth;
		// for some unknown reason, you get scrollbars if you use the full innerHeight
		this.board.height = window.innerHeight - 4;
		this.board.classList.add('board-canvas');
		// https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
		// on my computer this setting has no effect on the performance
		// only one less warning in the chrome developer console
		this.ctx = this.board.getContext('2d', {willReadFrequently: true, alpha: false});
		// this.ctx = this.board.getContext('2d');
		// with the parameter alpha: false we get a black background, but we want a white one
		this.clearPixelData();
		document.body.prepend(this.board);
		rerouteEvent('click', 'create-walker', this.board);
	}

	get size() {
		return {
			width: this.board?.scrollWidth ?? 0,
			height: this.board?.scrollHeight ?? 0
		};
	}

	clearPixelData() {
		this.ctx.fillStyle = 'white';
		this.ctx.fillRect(0, 0, this.board.width, this.board.height);
	}

	getPixelData() {
		let size = this.size;
		let data = Array(size.width);
		for (let x=0; x<data.length; x++) data[x] = Array(size.height);

		let imgData = this.ctx.getImageData(0, 0, this.board.width, this.board.height).data;
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let coord = this.getRedIndexForCoord(x, y, this.board.width);
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

	supportPixelData() {
		return true;
	}

	setPixelData(data) {
		this.clearPixelData();
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let color = data[x][y];
				if (color) {
					this.setPixelColor(x, y, color);
				}
			}
		}
	}

	remove() {
		this.board.remove();
		this.board = null;
		this.ctx = null;
	}

	getRedIndexForCoord(x, y, width) {
		return y * (width * 4) + x * 4;
	}

	getPixelColor(x, y) {
		let imgData = this.ctx.getImageData(0, 0, this.board.width, this.board.height).data;
		let coord = this.getRedIndexForCoord(x, y, this.board.width);
		let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
		if (alpha !== 0) return ColorConversion.numberToString(config.colorType, red, green, blue);
		return;
	}

	setPixelColor(x, y, color) {
		if (this.ctx) {
			this.ctx.fillStyle = color;
			this.ctx.fillRect(x, y, 1, 1);
		}
	}
}

export default BoardCanvas;
