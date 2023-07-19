import BoardHTML from './html.mjs';
import ColorConversion from '/modules/utils/color-conversion.mjs';
import config from '/config.js';

class BoardSVG extends BoardHTML {
	board = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	className = 'board-svg';

	constructor(onClick, init=true) {
		super(onClick, false);
		this.initBoard(onClick, init);
	}

	getPixelData() {
		let size = this.size;
		let data = Array(size.width);
		for (let x=0; x<data.length; x++) data[x] = Array(size.height);
		for (let pixel of this.board.querySelectorAll('.pixel')) {
			data[pixel.getAttribute('cx')][pixel.getAttribute('cy')] = ColorConversion.stringToString(config.colorType, pixel.style.fill);
		}
		return data;
	}

	setPixelData(data) {
		this.clearPixelData();
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let color = data[x][y];
				if (color) {
					let pixel = this.#createPixel(x, y);
					pixel.style.fill = color;
					this.board.append(pixel);
				}
			}
		}
	}

	getPixelColor(x, y) {
		return ColorConversion.stringToString(config.colorType, this.getPixel(x, y)?.style.fill);
	}

	setPixelColor(x, y, color) {
		if (this.board) {
			let pixel = this.getPixel(x, y) ?? this.#createPixel(x, y);
			pixel.style.fill = color;
			// if the pixel is already in the dom tree, we need to move it to the end
			// svg always respect the order of the dom tree
			this.board.append(pixel);
		}
	}

	#createPixel(x, y) {
		let pixel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		pixel.id = `x${x}_y${y}`;
		pixel.classList.add('pixel');
		pixel.setAttribute('cx', x);
		pixel.setAttribute('cy', y);
		return pixel;
	}
}

export default BoardSVG;
