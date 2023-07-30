import Selector from './selector.mjs';
import PxMessage from '/modules/components/px-message.mjs';
import PxButton from '/modules/components/px-button.mjs';
import StorageData from './data.mjs';

class StorageSettings {
	#save = async () => {
		if (! this.#selector.provider) {
			this.#message.setError('Please select a storage provider');
			return;
		}
		this.#message.clear();
		try {
			await this.#selector.provider.save(this.#createStorageData());
			this.#message.setInfo('PixelData saved');
		} catch(error) {
			this.#message.setError('Failed to save PixelData', {error});
			this.#btnSave.setError({autoclear: true});
			console.error('===> storage/settings.save', {error});
		}
	}

	#load = async () => {
		if (! this.#selector.provider) {
			this.#message.setError('Please select a storage provider');
			return;
		}
		if (! this.#boardData.supportPixelData()) {
			this.#message.setError('Please select a board supporting pixel data');
			return;
		}
		this.#message.clear();
		try {
			let data = await this.#selector.provider.load('Pixel Mover Data');
			this.#boardData.setPixelData(data.pixels);
			this.#boardData.clearWalkerControllers();
			const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
			document.dispatchEvent(event);
			this.#message.setInfo('PixelData loaded');
		} catch(error) {
			this.#message.setError('Failed to load PixelData', {error});
			this.#btnLoad.setError({autoclear: true});
			console.error('===> storage/settings.load', {error});
		}
	}

	#wndSetting = document.createRange().createContextualFragment(`
		<div class="settings setting-storage">
		</div>
	`).firstElementChild;
	#selector = new Selector();
	#boardData = null;
	#message = new PxMessage();
	#btnSave = new PxButton('Save', this.#save);
	#btnLoad = new PxButton('Load', this.#load);
	
	constructor(boardData) {
		this.#boardData = boardData;
		this.#wndSetting.append(this.#selector.content);
		this.#wndSetting.append(this.#btnSave.content);
		this.#wndSetting.append(this.#btnLoad.content);
		this.#wndSetting.append(this.#message.content);
	}

	get content() {
		return this.#wndSetting;
	}

	#createStorageData() {
		let data = new StorageData();
		data.pixels = this.#boardData.getPixelData();
		data.walkers = this.#boardData.getWalkerData();
		return data;
	}

}

export default StorageSettings;
