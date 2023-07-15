import Walker from './walker.mjs';
import WalkerController from './walker-controller.mjs';
import BoardSVG from './board-svg.mjs';
import BoardHTML from './board-html.mjs';
import BoardCanvas from './board-canvas.mjs';
import StorageLocal from './storage/storage-local.mjs';
import StorageData from './storage/storage-data.mjs';

class StorageSettings {
	board = null;
	wndSetting = null;
	wndWalkerList = null;
	lstWalkerController = [];
	storage = StorageLocal;

	constructor() {
		this.wndSetting = document.createElement('div');
		this.wndSetting.classList.add('setting-storage');
		this.wndSetting.insertAdjacentHTML('afterbegin', `
			<button id="btn-load">Load</button>
			<button id="btn-save">Save</button>
		`);
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
}

export default StorageSettings;
