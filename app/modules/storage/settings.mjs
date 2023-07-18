import ProviderLocal from './provider-local.mjs';
import StorageData from './data.mjs';

class StorageSettings {
	wndSetting = null;
	provider = ProviderLocal;
	boardData = null;
	
	constructor(boardData) {
		this.boardData = boardData;
		this.wndSetting = document.createElement('div');
		this.wndSetting.classList.add('setting-storage');
		this.wndSetting.insertAdjacentHTML('afterbegin', `
			<button id="btn-load">Load</button>
			<button id="btn-save">Save</button>
		`);
		let btnSave = this.wndSetting.querySelector('#btn-save');
		this.bindEvents();
		btnSave.addEventListener('click', this.save);
		this.wndSetting.querySelector('#btn-load').addEventListener('click', this.load);
	}

	bindEvents() {
		this.load = this.load.bind(this);
		this.save = this.save.bind(this);
	}

	get content() {
		return this.wndSetting;
	}

	createStorageData() {
		let data = new StorageData();
		data.pixels = this.boardData.getPixelData();
		data.walkers = this.boardData.getWalkerData();
		return data;
	}

	save() {
		this.provider.save(this.createStorageData());
	}

	load() {
		let data = this.provider.load('Pixel Mover Data');
		if (data) {
			this.boardData.setPixelData(data.pixels);
			this.boardData.clearWalkerControllers();
			const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
			document.dispatchEvent(event);
		}
	}
}

export default StorageSettings;
