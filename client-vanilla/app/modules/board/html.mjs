import ColorConversion from '/modules/utils/color-conversion.mjs';
import { rerouteEvent } from '/modules/utils/helpers.mjs';
import config from '/config.js';

class BoardHTML {
	board = document.createElement('div');
	className = 'board-html';

	constructor(init=true) {
		this.initBoard(init);
	}

	initBoard(init) {
		if (init) {
			this.board.style.width = '100vw';
			this.board.style.height = '100vh';
			this.board.classList.add(this.className);
			document.body.prepend(this.board);
			rerouteEvent('click', 'create-walker', this.board);
		}
	}

	get size() {
		return {
			width: this.board?.scrollWidth ?? 0,
			height: this.board?.scrollHeight ?? 0
		};
	}

	getPixelData() {
		let size = this.size;
		let data = Array(size.width);
		for (let x=0; x<data.length; x++) data[x] = Array(size.height);
		for (let pixel of this.board.querySelectorAll('.pixel')) {
			let x = /^\d+/.exec(pixel.style.left)[0];
			let y = /^\d+/.exec(pixel.style.top)[0];
			data[x][y] = ColorConversion.stringToString(config.colorType, pixel.style['background-color']);
		}
		return data;
	}

	clearPixelData() {
		for (let pixel of this.board.querySelectorAll('.pixel')) {
			pixel.remove();
		}
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
					let pixel = this.#createPixel(x, y);
					pixel.style['background-color'] = color;
					this.board.append(pixel);
				}
			}
		}
	}

	remove() {
		this.board.remove();
		this.board = null;
	}

	getPixelColor(x, y) {
		return ColorConversion.stringToString(config.colorType, this.getPixel(x, y)?.style['background-color']);
	}

	getPixel(x, y) {
		return this.board?.querySelector(`#x${x}_y${y}`);
	}

	#createPixel(x, y) {
		let pixel = document.createElement('span');
		pixel.id = `x${x}_y${y}`;
		pixel.classList.add('pixel');
		pixel.style.left = `${x}px`;
		pixel.style.top = `${y}px`;
		this.board.append(pixel);
		return pixel;
	}

	setPixelColor(x, y, color) {
		if (this.board) {
			let pixel = this.getPixel(x, y) ?? this.#createPixel(x, y);
			pixel.style['background-color'] = color;
		}
	}
}

export default BoardHTML;
