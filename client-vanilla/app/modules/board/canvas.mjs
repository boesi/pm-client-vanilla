import ColorConversion from '/modules/utils/color-conversion.mjs';
import CanvasHelper from '/modules/utils/canvas-helper.mjs';
import { rerouteEvent } from '/modules/utils/helpers.mjs';
import config from '/config.js';

class BoardCanvas {
	#canvas = new CanvasHelper(window.innerWidth, window.innerHeight, {offscreen: false});
	#board = this.#canvas.content;

	constructor() {
		this.#board.classList.add('board-canvas');
		this.#canvas.clearPixelData();
		document.body.prepend(this.#board);
		rerouteEvent('click', 'create-walker', this.#board);
	}

	get size() {
		return {
			width: this.#board?.scrollWidth ?? 0,
			height: this.#board?.scrollHeight ?? 0
		};
	}

	getPixelData() {
		return this.#canvas.getPixelData();
	}

	supportPixelData() {
		return true;
	}

	setPixelData(data) {
		this.#canvas.setPixelData(data, true);
	}

	remove() {
		this.#board.remove();
		this.#canvas = null;
	}

	getPixelColor(x, y) {
		return this.#canvas.getPixelColor(x, y);
	}

	setPixelColor(x, y, color) {
		this.#canvas.setPixelColor(x, y, color);
	}
}

export default BoardCanvas;
