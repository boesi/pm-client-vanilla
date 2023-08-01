import PxButton from '/modules/components/px-button.mjs';

class WalkerController {
	#walker = null;
	intervalID = null;

	#controller = new PxButton();
	board = null;

	walkerHighlighterHeight = 0;
	walkerHighlighterWidth = 0;

	constructor(walker) {
		this.#walker = walker;
		this.#controller.addEventListener('click', this);
		this.walkerHighlighter = document.createElement('span');
		this.walkerHighlighter.classList.add('walker-highlighter');
		document.body.append(this.walkerHighlighter);
		// clientHeight and clientWidth are a bit time consuming, and because they never change, we just need to call them once
		this.walkerHighlighterHeight = this.walkerHighlighter.clientHeight;
		this.walkerHighlighterWidth = this.walkerHighlighter.clientWidth;
	}

	get content() {
		return this.#controller.content;
	}

	setBoard(board) {
		this.board = board;
	}

	start() {
		this.#controller.setText('Started');
		this.intervalID = setInterval(this.doWork.bind(this), 0);
	}

	doWork() {
		let {x, y} = this.#walker.move();
		this.walkerHighlighter.style.left = `${x - this.walkerHighlighterWidth / 2}px`;
		this.walkerHighlighter.style.top = `${y - this.walkerHighlighterHeight / 2}px`;
		if (this.board?.supportPixelData()) {
			let color = this.#walker.getMergedColor(this.board.getPixelColor(x, y));
			this.board.setPixelColor(x, y, color);
		}
	}
	
	stop() {
		clearInterval(this.intervalID);
		this.#controller.setText('Stopped');
		this.intervalID = null;
	}

	handleEvent() {
		if (this.intervalID) this.stop();
		else this.start();
	}

	remove() {
		this.stop();
		this.#controller.removeEventListener('click', this);
		this.walkerHighlighter.remove();
		this.#controller.remove();
		this.#controller = null;
	}

	getData() {
		return this.#walker.getData();
	}
}

export default WalkerController;
