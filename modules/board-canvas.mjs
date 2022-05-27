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

	remove() {
		this.board.remove();
		this.board = null;
		this.ctx = null;
	}

	getRedIndexForCoord(x, y, width) {
		return y * (width * 4) + x * 4;
	}

	getColor(x, y) {
		let data = this.ctx.getImageData(0, 0, this.board.width, this.board.height).data;
		let coord = this.getRedIndexForCoord(x, y, this.board.width);
		let [red, green, blue] = data.slice(coord, coord+3);
		if (red === 0 && green === 0 && blue === 0) return;
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
