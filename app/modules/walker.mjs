import ColorConversion from './utils/ColorConversion.mjs';
import config from '../config.js';

class WalkerData {
	maxColor = 255;
	maxX = 300;
	maxY = 300;

	x = null;
	y = null;
	prevX = null;
	prevY = null;
	
	red = null;
	green = null;
	blue = null;
	mergeFactor = 0.5;

	constructor(x, y, maxX, maxY) {
		this.x = x;
		this.y = y;
		this.maxX = maxX;
		this.maxY = maxY;
	}
}

class Walker {
	#data = null;

	/**
		* forbid certain motions
		* just return false, if all motions should be allowed
		*/
	isPositionForbidden(x, y) {
		// forbid standing still
		return (x === 0 && y === 0) ||
			// forbid backward movement
			(this.#data.prevX !== null && x === this.#data.prevX &&
					this.#data.prevY !== null && y === this.#data.prevY);
	}

	getData() {
		return this.#data;
	}

	setPosition(x, y) {
		this.#data.prevX = this.#data.x;
		this.#data.prevY = this.#data.y;
		this.#data.x = x;
		this.#data.y = y;
	}

	getMergedColor(strColor) {
		if (strColor) {
			let [red, green, blue] = ColorConversion.stringToNumber(config.colorType, strColor);
			if (red != undefined && blue != undefined && green != undefined) {
				red   = Math.round(this.#data.mergeFactor * this.#data.red   + (1 - this.#data.mergeFactor) * red);
				blue  = Math.round(this.#data.mergeFactor * this.#data.blue  + (1 - this.#data.mergeFactor) * blue);
				green = Math.round(this.#data.mergeFactor * this.#data.green + (1 - this.#data.mergeFactor) * green);
				return ColorConversion.numberToString(config.colorType, red, green, blue);
			}
		}
		return ColorConversion.numberToString(config.colorType, this.#data.red, this.#data.green, this.#data.blue);
	}

	getPosition() {
		return {x: this.#data.x, y: this.#data.y};
	}

	constructor({x, y, size, data} = {}) {
		if (data) {
			this.#data = data;
		} else {
			x = x ?? this.getRandomIntInclusive(size.width);
			y = y ?? this.getRandomIntInclusive(size.height);
			this.#data = new WalkerData(x, y, size.width - 1, size.height - 1);
			this.#data.red = this.getRandomIntInclusive(this.#data.maxColor);
			this.#data.green = this.getRandomIntInclusive(this.#data.maxColor);
			this.#data.blue = this.getRandomIntInclusive(this.#data.maxColor);
		}
	}

	getRandomIntInclusive(min, max) {
		if (min && max) return Math.floor(Math.random() * (max - min + 1) + min);
		else return Math.floor(Math.random() * (min + 1));
	}

	moveValue(c, min, max) {
		c += this.getRandomIntInclusive(-1, 1);
		if (c < min) return min;
		else if (c > max) return max;
		else return c;
	}

	move() {
		let x = null,
				y = null;
		do {
			x = this.moveValue(this.#data.x, 0, this.#data.maxX);
			y = this.moveValue(this.#data.y, 0, this.#data.maxY);
		} while (this.isPositionForbidden(x, y));
		this.setPosition(x, y);
		this.#data.red = this.moveValue(this.#data.red, 0, this.#data.maxColor);
		this.#data.green = this.moveValue(this.#data.green, 0, this.#data.maxColor);
		this.#data.blue = this.moveValue(this.#data.blue, 0, this.#data.maxColor);
		return {x, y};
	}
}

export default Walker;
