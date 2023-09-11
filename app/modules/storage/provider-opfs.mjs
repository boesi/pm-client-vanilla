class ProviderOpfs {

	/**
	 * How can I use this method? Knowing if this provider is usable on this
	 * system in advance, is clearly an advantage. But where should I call this
	 * method?
	 */
	supported() {
		return navigator.storage.getDirectory === 'function';
	}

	async getItems() {
		let items = [];
		const handle = await navigator.storage.getDirectory();
		console.log('===> storage.ProviderOpfs.items 1', {handle, entries: handle.entries(), values: handle.values(), keys: handle.keys()});
		for await (const [key, value] of handle.entries()) {
			console.log('===> storage.ProvdierOpfs.items 2', {key, value});
			items.push(key);
		}
		return items;
	}

	get items() {
		return this.getItems();
	}

	async save(data) {
		let stream = null;
		try {
			const handle = await navigator.storage.getDirectory();
			const file = await handle.getFileHandle(data.name, {create: true});
			stream = await file.createWritable();
			stream.write(JSON.stringify(data));
			return true;
		} finally {
			if (stream !== null) stream.close();
		}
		return false;
	}

	async load(name) {
		const handle = await navigator.storage.getDirectory();
		const filehandle = await handle.getFileHandle(name);
		const file = await filehandle.getFile();
		const text = await file.text();
		return JSON.parse(text);
	}

	async remove(name) {
		const handle = await navigator.storage.getDirectory();
		const filehandle = await handle.getFileHandle(name);
		await filehandle.remove();
	}
}

export default ProviderOpfs;
