import PxButton from '/modules/components/px-button.mjs';

class WalkerController {
	#walker = null;
	#intervalID = null;

	#controller = new PxButton();
	#board = null;
	#walkerHighlighter = document.createRange().createContextualFragment(`
		<span class="walker-highlighter"></span>
	`).firstElementChild;

	#walkerHighlighterHeight = 0;
	#walkerHighlighterWidth = 0;

	constructor(walker) {
		this.#walker = walker;
		this.#controller.addEventListener('click', this.#click);
		this.#controller.addEventListener('mouseenter', this.#mouseenter);
		this.#controller.addEventListener('mouseleave', this.#mouseleave);
		this.#walkerHighlighter.addEventListener('mouseleave', this.#mouseleave);
		this.#walkerHighlighter.addEventListener('mouseenter', this.#mouseenter);
		document.body.append(this.#walkerHighlighter);
		// clientHeight and clientWidth are a bit time consuming, and because they never change, we just need to call them once
		this.#walkerHighlighterHeight = this.#walkerHighlighter.clientHeight;
		this.#walkerHighlighterWidth = this.#walkerHighlighter.clientWidth;
	}

	get content() {
		return this.#controller.content;
	}

	setBoard(board) {
		this.#board = board;
	}

	start() {
		this.#controller.setText('Started');
		this.#intervalID = setInterval(this.#doWork, 0);
	}

	#doWork = () => {
		let {x, y} = this.#walker.move();
		this.#walkerHighlighter.style.left = `${x - this.#walkerHighlighterWidth / 2}px`;
		this.#walkerHighlighter.style.top = `${y - this.#walkerHighlighterHeight / 2}px`;
		if (this.#board?.supportPixelData()) {
			let color = this.#walker.getMergedColor(this.#board.getPixelColor(x, y));
			this.#board.setPixelColor(x, y, color);
		}
	};
	
	stop() {
		clearInterval(this.#intervalID);
		this.#controller.setText('Stopped');
		this.#intervalID = null;
	}

	#mouseenter = () => {
		this.#controller.setInfo();
		this.#walkerHighlighter.classList.add('highlight');
	};

	#mouseleave = () => {
		this.#controller.clear();
		this.#walkerHighlighter.classList.remove('highlight');
	};

	#click = () => {
		if (this.#intervalID) this.stop();
		else this.start();
	}

	remove() {
		this.stop();
		this.#controller.removeEventListener('click', this.#click);
		this.#controller.removeEventListener('mouseenter', this.#mouseenter);
		this.#controller.removeEventListener('mouseleave', this.#mouseleave);
		this.#walkerHighlighter.remove();
		this.#controller.remove();
		this.#controller = null;
	}

	getData() {
		return this.#walker.getData();
	}
}

export default WalkerController;
