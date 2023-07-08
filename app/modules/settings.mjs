import Walker from './walker.mjs';
import WalkerController from './walker-controller.mjs';
import BoardSVG from './board-svg.mjs';
import BoardHTML from './board-html.mjs';
import BoardCanvas from './board-canvas.mjs';
import StorageLocal from './storage/storage-local.mjs';
import StorageData from './storage/storage-data.mjs';

class Settings {
	board = null;
	wndSetting = null;
	wndWalkerList = null;
	lstWalkerController = [];
	storage = StorageLocal;

	constructor() {
		this.wndSetting = document.createElement('div');
		this.wndSetting.classList.add('settings');
		this.wndSetting.insertAdjacentHTML('afterbegin', `
			<label class="board-type">
				Board:
				<select>
					<option value="---">---</option>
					<option value="canvas">Canvas</option>
					<option value="html">HTML</option>
					<option value="svg">SVG</option>
				</select>
			</label>
			<button id="btn-load">Load</button>
			<button id="btn-save">Save</button>
			<div class="walker-list"/>
		`);
		this.wndWalkerList = this.wndSetting.querySelector('.walker-list');
		let selectorBoard = this.wndSetting.querySelector('.board-type select');
		selectorBoard.addEventListener('input', this.selectBoard.bind(this));
		let btnSave = this.wndSetting.querySelector('#btn-save');
		btnSave.addEventListener('click', this.save.bind(this));
		this.wndSetting.querySelector('#btn-load').addEventListener('click', this.load.bind(this));
	}

	get content() {
		return this.wndSetting;
	}

	createStorageData() {
		let data = new StorageData();
		data.pixels = this.board.getPixelData();
		data.walkers = this.lstWalkerController.map(wc => wc.getData());
		return data;
	}

	save() {
		this.storage.save(this.createStorageData());
	}

	load() {
		let data = this.storage.load('Pixel Mover Data');
		if (data) {
			this.board.setPixelData(data.pixels);
			this.lstWalkerController.forEach(wc => {
				wc.remove();
			});
			this.lstWalkerController.length = 0;
			for (let walkerData of data.walkers) {
				this.createWalkerController(new Walker({data: walkerData}));
			}
		}
	}

	selectBoard(event) {
		let pixelData = null;
		if (this.board) {
			pixelData = this.board.getPixelData();
			this.board.remove();
		}
		switch (event.srcElement.value) {
			case 'canvas':
				this.board = new BoardCanvas(this.createWalker.bind(this));
				break;
			case 'html':
				this.board = new BoardHTML(this.createWalker.bind(this));
				break;
			case 'svg':
				this.board = new BoardSVG(this.createWalker.bind(this));
				break;
			default:
				break;
		}
		if (this.board) {
			if (pixelData) this.board.setPixelData(pixelData);
			this.lstWalkerController.forEach(wc => wc.setBoard(this.board));
		}
	}

	createWalker(event) {
		let walker = new Walker({x: event.offsetX, y: event.offsetY, size: this.board.size});
		this.createWalkerController(walker);
	}

	createWalkerController(walker) {
		let walkerController = new WalkerController(walker);
		walkerController.setBoard(this.board);
		walkerController.start();
		this.lstWalkerController.push(walkerController);
		this.wndWalkerList.append(walkerController.controller);
	}
}

export default Settings;
