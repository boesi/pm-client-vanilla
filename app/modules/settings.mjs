import Walker from './walker.mjs';
import WalkerController from './walker-controller.mjs';
import BoardSVG from './board-svg.mjs';
import BoardHTML from './board-html.mjs';
import BoardCanvas from './board-canvas.mjs';

class Settings {
	boardData = null;
	wndSetting = document.createElement('div');
	wndWalkerList = null;

	constructor(boardData) {
		this.boardData = boardData;
		this.wndSetting.classList.add('settings');
		this.wndSetting.insertAdjacentHTML('afterbegin', `
			<label id="board-type">
				Board:
				<select>
					<option value="---">---</option>
					<option value="canvas">Canvas</option>
					<option value="html">HTML</option>
					<option value="svg">SVG</option>
				</select>
			</label>
			<div id="walker-list"/>
		`);
		this.wndWalkerList = document.getElementById('walker-list');
		let selectorBoard = this.wndSetting.querySelector('#board-type select');
		this.bindEvents();

		selectorBoard.addEventListener('input', this.selectBoard);
		document.addEventListener('new-walkers', this.receiveWalkers);
	}

	bindEvents() {
		this.createWalker = this.createWalker.bind(this);
		this.selectBoard = this.selectBoard.bind(this);
		this.receiveWalkers = this.receiveWalkers.bind(this);
	}

	get content() {
		return this.wndSetting;
	}


	selectBoard(event) {
		switch (event.srcElement.value) {
			case 'canvas':
				this.boardData.setBoard(new BoardCanvas(this.createWalker));
				break;
			case 'html':
				this.boardData.setBoard(new BoardHTML(this.createWalker));
				break;
			case 'svg':
				this.boardData.setBoard(new BoardSVG(this.createWalker));
				break;
			default:
				break;
		}
	}

	receiveWalkers(event) {
		for (let walkerData of event.detail.walkers) {
			this.createWalkerController(new Walker({data: walkerData}));
		}
	}

	createWalker(event) {
		this.createWalkerController(new Walker({x: event.pageX, y: event.pageY, size: this.boardData.size}));
	}

	createWalkerController(walker) {
		let walkerController = new WalkerController(walker);
		this.boardData.addWalkerController(walkerController);
		this.wndWalkerList.append(walkerController.controller);
		walkerController.start();
	}
}

export default Settings;
