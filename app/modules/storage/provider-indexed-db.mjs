class ProviderIndexedDb {

	#db = null;
	#storeName = 'PixelMoverData';
	#storeVersion = 1;

	onload = null;

	#error = event => {
		console.error('===> ProviderIndexedDb.error', {event, 'this': this});
	};

	#successOpen = event => {
		this.#db = event.target.result;
		// we use a central error handler for all requests and transactions
		this.#db.onerror = this.#error;
	};
	
	#upgrade = event => {
		event.target.result.
			createObjectStore(this.#storeName, {keyPath: 'name'}).
			createIndex('name', 'name', {unique: true});
	};

	constructor() {
		const request = window.indexedDB.open(this.#storeName, this.#storeVersion);
		request.onerror = this.#error;
		request.onsuccess = this.#successOpen;
		request.onupgradeneeded = this.#upgrade;
	}

	#transactionStore(mode) {
		const store = this.#db?.transaction([this.#storeName], mode).objectStore(this.#storeName);
		if (!store) throw new Error('Can not access database, transaction or store');
		return store;
	}

	save(data) {
		this.#transactionStore('readwrite').
			put(data);
	}

	load(name) {
		this.#transactionStore('readonly').
			get(name).
			onsuccess = event => {
				this.onload?.(event.target.result);
			};
		return this;
	}

	remove(name) {
		this.#transactionStore('readwrite').
			delete(name);
	}
}

export default ProviderIndexedDb;
