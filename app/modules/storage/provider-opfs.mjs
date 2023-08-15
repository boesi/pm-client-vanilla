class ProviderOpfs {

	/**
	 * How can I use this method? Knowing if this provider is usable on this
	 * system in advance, is clearly an advantage. But where should I call this
	 * method?
	 */
	supported() {
		return navigator.storage.getDirectory === 'function';
	}

	async save(data) {
		let stream = null;
		try {
			const handle = await navigator.storage.getDirectory();
			const file = await handle.getFileHandle(data.name, {create: true});
			stream = await file.createWritable();
			stream.write(JSON.stringify(data));
		} finally {
			if (stream !== null) stream.close();
		}
	}

	async load(name) {
		const handle = await navigator.storage.getDirectory();
		const filehandle = await handle.getFileHandle(name);
		const file = await filehandle.getFile();
		const text = await file.text();
		return JSON.parse(text);
	}

	remove(name) {
	}
}

export default ProviderOpfs;
