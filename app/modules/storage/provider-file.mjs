class ProviderFile {

	/**
	 * How can I use this method? Knowing if this provider is usable on this
	 * system in advance, is clearly an advantage. But where should I call this
	 * method?
	 */
	supported() {
		return window.showOpenFilePicker === 'function';
	}

	async save(data) {
		const handle = await window.showSaveFilePicker();
		const stream = await handle.createWritable();
		await stream.write(JSON.stringify(data));
		await stream.close();
	}

	async load(name) {
		const [handle] = await window.showOpenFilePicker();
		const file = await handle.getFile();
		const text = await file.text();
		return JSON.parse(text);
	}

	remove(name) {
		throw new Error('The storage provider File does not support removing items. Just remove the files yourself.');
	}
}

export default ProviderFile;
