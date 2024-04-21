class ProviderRemote {

	#url = '/pm-server-node-http/';
	#urlItem = this.#url + 'item';

	constructor() {
	}

	async save(data) {
		const response = await window.fetch(`${this.#urlItem}?name=${data.name}`, {method: 'PUT', body: JSON.stringify(data)});
		console.log('===> storage.ProviderRemote.save', {response});
	}

	async getItems() {
		const response = await window.fetch(`${this.#url}`, {method: 'GET'});
		const json = await response.json();
		return json.names;
	}

	async load(name) {
	}

	async remove(name) {
	}
}

export default ProviderRemote;
