class ProviderLocal {

	static save(data) {
		window.localStorage.setItem(data.name, JSON.stringify(data));
	}

	static load(name) {
		let data = window.localStorage.getItem(name);
		if (data) {
			return JSON.parse(data);
		}
		return;
	}

	static remove(name) {
		if (window.localStorage.getItem(name)) {
			window.localStorage.removeItem(name);
		}
	}
}

export default ProviderLocal;
