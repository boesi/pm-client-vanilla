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
		console.log('===> selector.ProviderFile.save', {handle});
		const stream = await handle.createWritable();
		await stream.write(JSON.stringify(data));
		await stream.close();
	}

	load(name) {
	}

	remove(name) {
	}
}

export default ProviderFile;
