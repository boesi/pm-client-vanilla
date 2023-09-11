class ProviderLocal {

	save(data) {
		return new Promise((resolve, reject) => {
			try {
				window.localStorage.setItem(data.name, JSON.stringify(data));
				resolve(true);
			} catch(error) {
				reject(error);
			}
		});
	}

	getItems() {
		return new Promise((resolve, reject) => {
			let len = window.localStorage.length;
			let keys = new Array(len);
			for (let ind = 0; ind < len; ind++) {
				keys[ind] = window.localStorage.key(ind);
			}
			resolve(keys);
		});
	}

	load(name) {
		return new Promise((resolve, reject) => {
			try {
				let data = window.localStorage.getItem(name);
				if (data) {
					data = JSON.parse(data);
				} else {
					throw new Error(`Item with name "${name}" not available`);
				}
				resolve(data);
			} catch(error) {
				reject(error);
			}
		});
	}

	remove(name) {
		return new Promise((resolve, reject) => {
			try {
				if (window.localStorage.getItem(name)) {
					window.localStorage.removeItem(name);
					resolve();
				} else {
					reject(new Error(`Local Storage has no item with key '${name}'`));
				}
			} catch(error) {
				reject(error);
			}
		});
	}
}

export default ProviderLocal;
