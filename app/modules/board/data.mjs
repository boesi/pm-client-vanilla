class BoardData {
	#board = null;
	#walkerControllers = [];

	setBoard(board) {
		let pixelData = null;
		if (this.#board) {
			pixelData = this.getPixelData();
			this.#board.remove();
		}
		this.#board = board;
		if (pixelData) {
			this.setPixelData(pixelData);
		}
		this.#walkerControllers.forEach(wc => wc.setBoard(board));
	}

	get size() {
		return this.#board.size;
	}

	getPixelData() {
		return this.#board.getPixelData();
	}

	setPixelData(pixels) {
		this.#board.setPixelData(pixels)
	}

	addWalkerController(walkerController) {
		walkerController.setBoard(this.#board);
		this.#walkerControllers.push(walkerController);
	}

	getWalkerData() {
		return this.#walkerControllers.map(wc => wc.getData());
	}

	clearWalkerControllers() {
			this.#walkerControllers.forEach(wc => wc.remove());
			this.#walkerControllers.length = 0;
	}
}

export default BoardData;
