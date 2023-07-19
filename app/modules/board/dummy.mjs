import PxMessage from '/modules/components/px-message.mjs';

class BoardDummy {
	board = document.createElement('div');
	className = 'board-dummy';
	#pxMessage = new PxMessage();

	constructor(onClick, init=true) {
		this.initBoard(onClick, init);
	}

	initBoard(onClick, init) {
		if (init) {
			this.board.style.width = '100vw';
			this.board.style.height = '100vh';
			this.board.classList.add(this.className);
			document.body.prepend(this.board);

			this.board.append(this.#pxMessage.content);
			this.board.addEventListener('click', this.click.bind(this));
		}
	}

	click(event) {
		let options = {x: event.pageX, y: event.pageY};
		this.#pxMessage.setError('Please select a board before you add a walker.', options);
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

	getPixelData() {
		throw new Error('Unsupported method');
	}

	setPixelData(data) {
		throw new Error('Unsupported method');
	}

	getPixelColor(x, y) {
		throw new Error('Unsupported method');
	}

	setPixelColor(x, y, color) {
		throw new Error('Unsupported method');
	}
}

export default BoardDummy;
