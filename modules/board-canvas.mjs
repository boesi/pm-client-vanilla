class BoardCanvas {
	board = null;
	ctx = null;

	constructor(onClick) {
		this.board = document.createElement('canvas');
		this.board.width = window.innerWidth;
		// for some unknown reason, you get scrollbars if you use the full innerHeight
		this.board.height = window.innerHeight - 4;
		this.board.classList.add('board-canvas');
		this.ctx = this.board.getContext('2d');
		document.body.prepend(this.board);

		this.board.addEventListener('click', onClick);
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

		let imgData = this.ctx.getImageData(0, 0, this.board.width, this.board.height).data;
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let coord = this.getRedIndexForCoord(x, y, this.board.width);
				let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
				if (alpha !== 0) {
					data[x][y] = `rgb(${red}, ${green}, ${blue})`;
				}
			}
		}
		return data;
	}

	setPixelData(data) {
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let color = data[x][y];
				if (color) {
					this.ctx.fillStyle = color;
					this.ctx.fillRect(x, y, 1, 1);
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

	getColor(x, y) {
		let imgData = this.ctx.getImageData(0, 0, this.board.width, this.board.height).data;
		let coord = this.getRedIndexForCoord(x, y, this.board.width);
		let [red, green, blue, alpha] = imgData.slice(coord, coord+4);
		if (alpha === 0) return;
		return `rgb(${red}, ${green}, ${blue})`;
	}

	setPixel(walker) {
		if (this.ctx) {
			this.ctx.fillStyle = walker.getMergedColor(this.getColor(walker.x, walker.y));
			this.ctx.fillRect(walker.x, walker.y, 1, 1);
		}
	}
}

export default BoardCanvas;
