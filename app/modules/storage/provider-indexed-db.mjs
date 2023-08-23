class ProviderIndexedDb {

	#db = null;
	#storeName = 'PixelMoverData';
	#storeVersion = 1;

	#handleUpgrade = event => {
		console.info('===> ProviderIndexedDb.handleUpgrade', {event});
		const db = event.target.result;
		if (event.oldVersion > 0 && event.oldVersion < this.#storeVersion) {
			db.deleteObjectStore(this.#storeName);
		}
		db.createObjectStore(this.#storeName, {keyPath: 'name'}).
			createIndex('name', 'name', {unique: true});
	};

	#open() {
		const request = window.indexedDB.open(this.#storeName, this.#storeVersion);
		request.onupgradeneeded = this.#handleUpgrade;
		return this.#toPromise(request);
	}

	async #transactionStore(mode) {
		if (! this.#db) {
			this.#db = await this.#open();
		}
		const store = this.#db.transaction([this.#storeName], mode).objectStore(this.#storeName);
		if (!store) throw new Error('Can not access database, transaction or store');
		return store;
	}

	#toPromise(request) {
		return new Promise((resolve, reject) => {
			request.onsuccess = event => resolve(event.target.result);
			// request.onerror = event => reject(event.target.erorr);
			request.onerror = event => {
				console.log('===> ProviderIndexedDb.toPromise.onerror', {event});
				reject(event.target.error);
			}
		});
	}

	async save(data) {
		let store = await this.#transactionStore('readwrite');
		await this.#toPromise(store.put(data));
		return true;
	}

	async load(name) {
		let store = await this.#transactionStore('readonly');
		return this.#toPromise(store.get(name));
	}

	async remove(name) {
		let store = await this.#transactionStore('readwrite');
		return this.#toPromise(store.delete(name));
	}
}

export default ProviderIndexedDb;
