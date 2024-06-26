import Selector from './selector.mjs';
import SelectorName from './selector-name.mjs';
import PxMessage from '/modules/components/px-message.mjs';
import PxButton from '/modules/components/px-button.mjs';
import StorageData from './data.mjs';

class StorageSettings {
	#check({provider = true, name = true, pixelData = true} = {}) {
		// TODO: implement that ProviderFile doesn't support the argument name -
		// the user has to choose the file name in the file dialog and there is no
		// way to preselect it
		if (provider && ! this.#selector.provider) {
			this.#message.setError('Please select a storage provider');
			return false;
		}
		if (name && ! this.#selectorName.name) {
			this.#message.setError('Please input or select a name');
			return false;
		}
		if (pixelData && ! this.#boardData.supportPixelData()) {
			this.#message.setError('Please select a board supporting pixel data');
			return false;
		}
		this.#message.clear();
		return true;
	}

	#save = async () => {
		if (this.#check()) {
			try {
				let success = await this.#selector.provider.save(this.#createStorageData(this.#selectorName.name));
				if (success) {
					this.#message.setInfo(`${this.#selectorName.name} saved`);
					this.#selectorName.names = await this.#selector.provider.getItems?.();
				}
			} catch(error) {
				this.#message.setError(`Failed to save ${this.#selectorName.name}`, {error});
				this.#btnSave.setError({autoclear: true});
				console.error('===> storage/settings.save', {error});
			}
		}
	}

	#load = async () => {
		if (this.#check()) {
			try {
				let data = await this.#selector.provider.load(this.#selectorName.name);
				// Provider.load must throw an error if the requested item doesn't
				// exist. So in theory we should alsways have a data object. But just
				// in case we get null or undefined we check for it.
				if (data != null) {
					this.#boardData.setPixelData(data.pixels);
					this.#boardData.clearWalkerControllers();
					const event = new CustomEvent('new-walkers', {detail: {walkers: data.walkers}});
					document.dispatchEvent(event);
					this.#message.setInfo(`${this.#selectorName.name} loaded`);
				}
			} catch(error) {
				this.#message.setError(`Failed to load ${this.#selectorName.name}`, {error});
				this.#btnLoad.setError({autoclear: true});
				console.error('===> storage/settings.load', {error});
			}
		}
	}

	#remove = async () => {
		if (this.#check({pixelData: false})) {
			try {
				await this.#selector.provider.remove(this.#selectorName.name);
				this.#message.setInfo(`${this.#selectorName.name} removed`);
				this.#selectorName.names = await this.#selector.provider.getItems?.();
			} catch(error) {
				this.#message.setError(`Failed to remove ${this.#selectorName.name}`, {error});
				this.#btnRemove.setError({autoclear: true});
				console.error('===> storage/settings.remove', {error});
			}
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
		this.#selector.onSelect = async provider => this.#selectorName.names = await provider?.getItems?.();
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
