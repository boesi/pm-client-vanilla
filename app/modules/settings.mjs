import Walker from './walker.mjs';
import WalkerController from './walker-controller.mjs';
import BoardSelector from '/modules/board/selector.mjs';

class Settings {
	#boardData = null;
	#wndSetting = document.createElement('div');
	#wndWalkerList = document.createElement('div');

	constructor(boardData) {
		this.#boardData = boardData;
		this.#wndSetting.classList.add('settings');
		let wndSelector = new BoardSelector(boardData);
		this.#wndSetting.append(wndSelector.content);
		this.#wndSetting.append(this.#wndWalkerList);

		document.addEventListener('new-walkers', this.#receiveWalkers);
		document.addEventListener('click', this.#createWalker);
	}

	get content() {
		return this.#wndSetting;
	}

	#receiveWalkers = event => {
		for (let walkerData of event.detail.walkers) {
			this.#createWalkerController(new Walker({data: walkerData}));
		}
	};

	#createWalker = event => {
		this.#createWalkerController(new Walker({x: event.pageX, y: event.pageY, size: this.#boardData.size}));
	};

	#createWalkerController(walker) {
		let walkerController = new WalkerController(walker);
		this.#boardData.addWalkerController(walkerController);
		this.#wndWalkerList.append(walkerController.content);
		walkerController.start();
	}
}

export default Settings;
