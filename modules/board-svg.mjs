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

	getPixelData() {
		let size = this.size;
		let data = Array(size.width);
		for (let x=0; x<data.length; x++) data[x] = Array(size.height);
		for (let pixel of this.board.querySelectorAll('.pixel')) {
			data[pixel.getAttribute('cx')][pixel.getAttribute('cy')] = pixel.style.fill;
		}
		return data;
	}

	setPixelData(data) {
		for (let x=0; x<data.length; x++) {
			for (let y=0; y<data[x].length; y++) {
				let color = data[x][y];
				if (color) {
					let pixel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
					pixel.id = `x${x}_y${y}`;
					pixel.classList.add('pixel');
					pixel.setAttribute('cx', x);
					pixel.setAttribute('cy', y);
					pixel.style.fill = color;
					this.board.append(pixel);
				}
			}
		}
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
			pixel.style.fill = walker.getMergedColor(pixel.style.fill);
			// if the pixel is already in the dom tree, we need to move it to the end
			// svg always respect the order of the dom tree
			this.board.append(pixel);
		}
	}
}

export default BoardSVG;
