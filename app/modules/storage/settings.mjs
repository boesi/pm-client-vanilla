import Selector from './selector.mjs';
import PxMessage from '/modules/components/px-message.mjs';
import StorageData from './data.mjs';

class StorageSettings {
	wndSetting = document.createElement('div');
	#selector = new Selector();
	boardData = null;
	message = new PxMessage();
	
	constructor(boardData) {
		this.boardData = boardData;
		this.wndSetting.classList.add('setting-storage');
		this.wndSetting.append(this.#selector.content);
		this.wndSetting.insertAdjacentHTML('beforeend', `
			<button id="btn-load">Load</button>
			<button id="btn-save">Save</button>
		`);
		this.wndSetting.append(this.message.content);
		this.wndSetting.querySelector('#btn-save').addEventListener('click', this.save.bind(this));
		this.wndSetting.querySelector('#btn-load').addEventListener('click', this.load.bind(this));
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
		if (! this.#selector.provider) {
			this.message.setError('Please select a storage provider');
			return;
		}
		this.message.clear();
		try {
			this.#selector.provider.save(this.createStorageData());
			this.message.setInfo('PixelData saved');
		} catch(error) {
			this.message.setError('Failed to save PixelData');
			console.error('===> storage/settings.save', {error});
		}
	}

	callbackLoad(data) {
		this.boardData.setPixelData(data.pixels);
		this.boardData.clearWalkerControllers();
		const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
		document.dispatchEvent(event);
	}

	load() {
		if (! this.#selector.provider) {
			this.message.setError('Please select a storage provider');
			return;
		}
		if (! this.boardData.supportPixelData()) {
			this.message.setError('Please select a board supporting pixel data');
			return;
		}
		this.message.clear();
		try {
			this.#selector.provider.load('Pixel Mover Data').onload = data => {
				this.boardData.setPixelData(data.pixels);
				this.boardData.clearWalkerControllers();
				const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
				document.dispatchEvent(event);
			};
		} catch(error) {
			this.message.setError('Failed to load PixelData');
			console.error('===> storage/settings.load', {error});
		}
	}
}

export default StorageSettings;
