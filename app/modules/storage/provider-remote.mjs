class ProviderRemote {

	#url = '/pm-server-node-http/';
	#urlItem = this.#url + 'item';

	constructor() {
	}

	async save(data) {
		const response = await window.fetch(`${this.#urlItem}?name=${data.name}`, {method: 'PUT', body: JSON.stringify(data)});
		if (! response.ok) throw new Error(response.statusText);
		return response.ok;
	}

	async getItems() {
		const response = await window.fetch(`${this.#url}`, {method: 'GET'});
		if (! response.ok) throw new Error(response.statusText);
		const json = await response.json();
		return json.names;
	}

	async load(name) {
		const response = await window.fetch(`${this.#urlItem}?name=${name}`, {method: 'GET'});
		if (! response.ok) throw new Error(response.statusText);
		return await response.json();
	}

	async remove(name) {
	}
}

export default ProviderRemote;
