class BoardHTML {
	board = document.createElement('div');
	className = 'board-html';

	constructor(onClick, init=true) {
		this.initBoard(onClick, init);
	}

	initBoard(onClick, init) {
		if (init) {
			this.board.style.width = '100vw';
			this.board.style.height = '100vh';
			this.board.classList.add(this.className);
			document.body.prepend(this.board);

			this.board.addEventListener('click', onClick);
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
			data[x][y] = pixel.style['background-color'];
		}
		return data;
	}

	setPixelData(data) {
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
		return this.getPixel(x, y)?.style['background-color'];
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
		return pixel;
	}

	setPixelColor(x, y, color) {
		if (this.board) {
			let pixel = this.getPixel(x, y) ?? this.#createPixel(x, y);
			pixel.style['background-color'] = color;
			// if the pixel is already in the dom tree, we need to move it to the end
			// svg always respect the order of the dom tree
			this.board.append(pixel);
		}
	}
}

export default BoardHTML;
