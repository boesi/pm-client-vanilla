class ProviderFile {

	/**
	 * How can I use this method? Knowing if this provider is usable on this
	 * system in advance, is clearly an advantage. But where should I call this
	 * method?
	 */
	supported() {
		return window.showOpenFilePicker === 'function';
	}

	save(data) {
	}

	load(name) {
	}

	remove(name) {
	}
}

export default ProviderFile;
