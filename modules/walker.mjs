class Walker {
	size = {width: 300, height: 300};
	maxColor = 255;

	x = this.getRandomIntInclusive(this.size.width);
	y = this.getRandomIntInclusive(this.size.height);
	prevX = null;
	prevY = null;
	
	red = this.getRandomIntInclusive(this.maxColor);
	green = this.getRandomIntInclusive(this.maxColor);
	blue = this.getRandomIntInclusive(this.maxColor);
	mergeFactor = 0.5;

	/**
		* forbid certain motions
		* just return false, if all motions should be allowed
		*/
	isPositionForbidden(x, y) {
		return
			// forbid standing still
			(x === 0 && y === 0)
			// forbid backward movement
			|| (this.prevX !== null && x === this.prevX
					&& this.prevY !== null && y === this.prevY);
	}

	setPosition(x, y) {
		this.prevX = this.x;
		this.prevY = this.y;
		this.x = x;
		this.y = y;
	}

	getMergedColor(strColor) {
		if (strColor) {
			let [strColor2, red, green, blue] = /[^\d]*(\d{1,3})[^\d]*(\d{1,3})[^\d]*(\d{1,3}).*/.exec(strColor);
			red   = Math.round(this.mergeFactor * this.red   + (1 - this.mergeFactor) * red);
			blue  = Math.round(this.mergeFactor * this.blue  + (1 - this.mergeFactor) * blue);
			green = Math.round(this.mergeFactor * this.green + (1 - this.mergeFactor) * green);
			return `rgb(${red}, ${green}, ${blue})`;
		} else {
			return `rgb(${this.red}, ${this.green}, ${this.blue})`;
		}
	}

	constructor(x, y, size) {
		this.x = x ?? this.x;
		this.y = y ?? this.y;
		this.size = size;
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
			x = this.moveValue(this.x, 0, this.size.width);
			y = this.moveValue(this.y, 0, this.size.height);
		} while (this.isPositionForbidden(x, y));
		this.setPosition(x, y);
		this.red = this.moveValue(this.red, 0, this.maxColor);
		this.green = this.moveValue(this.green, 0, this.maxColor);
		this.blue = this.moveValue(this.blue, 0, this.maxColor);
		return {x, y};
	}
}

export default Walker;
