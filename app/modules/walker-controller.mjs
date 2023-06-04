class WalkerController {
	walker = null;
	intervalID = null;

	controller = null;
	callback = null;

	constructor(walker) {
		this.walker = walker;
		this.controller = document.createElement('button');
		this.controller.addEventListener('click', this);
		this.walkerHighlighter = document.createElement('span');
		this.walkerHighlighter.classList.add('walker-highlighter');
		document.body.append(this.walkerHighlighter);
	}

	start() {
		this.controller.textContent = 'Started';
		this.intervalID = setInterval(this.doWork.bind(this), 0);
	}

	doWork() {
		let position = this.walker.move();
		this.walkerHighlighter.style.left = `${position.x - this.walkerHighlighter.clientWidth / 2}px`;
		this.walkerHighlighter.style.top = `${position.y - this.walkerHighlighter.clientHeight / 2}px`;
		this.callback?.(this.walker);
	}
	
	stop() {
		clearInterval(this.intervalID);
		this.controller.textContent = 'Stopped';
		this.intervalID = null;
	}

	handleEvent() {
		if (this.intervalID) this.stop();
		else this.start();
	}
}

export default WalkerController;
