class BoardSVG {
	board = null;

	constructor(onClick) {
		this.board = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.board.style.width = '100vw';
		this.board.style.height = '100vh';
		this.board.classList.add('board-svg');
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
	}

	setPixel(walker) {
		if (this.board) {
			let id = `x${walker.x}_y${walker.y}`;
			let pixel = this.board.querySelector('#' + id);
			if (!pixel) {
				pixel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
				pixel.id = id;
				pixel.classList.add('pixel');
			}
			pixel.setAttribute('cx', walker.x);
			pixel.setAttribute('cy', walker.y);
			pixel.style = `fill: ${walker.getMergedColor(pixel.style.fill)}`;
			// if the pixel is already in the dom tree, we need to move it to the end
			// svg always respect the order of the dom tree
			this.board.append(pixel);
		}
	}
}

export default BoardSVG;
