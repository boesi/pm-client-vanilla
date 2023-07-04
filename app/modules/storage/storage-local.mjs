class StorageLocal {
	static storage = window.localStorage;

	static save(data) {
		console.log('===> storage.StorageLocal.save', data.pixels[0][0]);
		window.localStorage.setItem(data.name, JSON.stringify(data));
	}

	static load(name) {
		let data = window.localStorage.getItem(name);
		return data;
	}

	static remove(name) {
		if (window.localStorage.getItem(name)) {
			window.localStorage.removeItem(name);
		}
	}
}

export default StorageLocal;
