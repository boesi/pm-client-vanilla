class ProviderRemote {

	#url = '/pm-server-node-http';
	#urlItem = this.#url + '/item';

	constructor() {
	}

	async save(data) {
		const response = await window.fetch(this.#urlItem, {method: 'PUT', body: JSON.stringify(data)});
		console.log('===> storage.ProviderRemote.save', {response});
	}

	async getItems() {
	}

	async load(name) {
	}

	async remove(name) {
	}
}

export default ProviderRemote;
