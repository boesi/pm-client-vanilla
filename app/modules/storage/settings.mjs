import Selector from './selector.mjs';
import SelectorName from './selector-name.mjs';
import PxMessage from '/modules/components/px-message.mjs';
import PxButton from '/modules/components/px-button.mjs';
import StorageData from './data.mjs';

class StorageSettings {
	#check() {
		if (! this.#selector.provider) {
			this.#message.setError('Please select a storage provider');
			return false;
		}
		if (! this.#selectorName.name) {
			this.#message.setError('Please input or select a name');
			return false;
		}
		return true;
	}

	#save = async () => {
		if (this.#check()) {
			this.#message.clear();
			try {
				let success = await this.#selector.provider.save(this.#createStorageData(this.#selectorName.name));
				if (success) this.#message.setInfo('PixelData saved');
			} catch(error) {
				this.#message.setError('Failed to save PixelData', {error});
				this.#btnSave.setError({autoclear: true});
				console.error('===> storage/settings.save', {error});
			}
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
			if (data !== null) {
				this.#boardData.setPixelData(data.pixels);
				this.#boardData.clearWalkerControllers();
				const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
				document.dispatchEvent(event);
				this.#message.setInfo('PixelData loaded');
			}
		} catch(error) {
			this.#message.setError('Failed to load PixelData', {error});
			this.#btnLoad.setError({autoclear: true});
			console.error('===> storage/settings.load', {error});
		}
	}

	#remove = async () => {
		if (! this.#selector.provider) {
			this.#message.setError('Please select a storage provider');
			return;
		}
		this.#message.clear();
		try {
			await this.#selector.provider.remove('Pixel Mover Data');
			this.#message.setInfo('Pixel Mover Data is removed');
		} catch(error) {
			this.#message.setError('Failed to remove PixelData', {error});
			this.#btnRemove.setError({autoclear: true});
			console.error('===> storage/settings.remove', {error});
		}
	}

	#wndSetting = document.createRange().createContextualFragment(`
		<div class="settings setting-storage">
		</div>
	`).firstElementChild;
	#selector = new Selector();
	#selectorName = new SelectorName();
	#boardData = null;
	#message = new PxMessage();
	#btnSave = new PxButton('Save', this.#save);
	#btnLoad = new PxButton('Load', this.#load);
	#btnRemove = new PxButton('Remove', this.#remove);
	
	constructor(boardData) {
		this.#boardData = boardData;
		this.#wndSetting.append(this.#selector.content);
		this.#wndSetting.append(this.#selectorName.content);
		this.#wndSetting.append(this.#btnSave.content);
		this.#wndSetting.append(this.#btnLoad.content);
		this.#wndSetting.append(this.#btnRemove.content);
		this.#wndSetting.append(this.#message.content);
	}

	get content() {
		return this.#wndSetting;
	}

	#createStorageData(name) {
		let data = new StorageData();
		data.name = name;
		data.pixels = this.#boardData.getPixelData();
		data.walkers = this.#boardData.getWalkerData();
		return data;
	}

}

export default StorageSettings;
