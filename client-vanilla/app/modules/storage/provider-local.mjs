class ProviderLocal {

	#type = window.localStorage;

	constructor(type) {
		this.#type = type ?? this.#type;
	}

	save(data) {
		return new Promise((resolve, reject) => {
			try {
				this.#type.setItem(data.name, JSON.stringify(data));
				resolve(true);
			} catch(error) {
				reject(error);
			}
		});
	}

	getItems() {
		return new Promise((resolve, reject) => {
			let len = this.#type.length;
			let keys = new Array(len);
			for (let ind = 0; ind < len; ind++) {
				keys[ind] = this.#type.key(ind);
			}
			resolve(keys);
		});
	}

	load(name) {
		return new Promise((resolve, reject) => {
			try {
				let data = this.#type.getItem(name);
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
				if (this.#type.getItem(name)) {
					this.#type.removeItem(name);
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
