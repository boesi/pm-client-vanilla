class StorageSelectorName {
	#content = document.createRange().createContextualFragment(`
		<label for="input-storage-selector-name">
			Name: 
			<input list="storage-selector-names" id="input-storage-selector-name"/>
		</label>
		<datalist id="storage-selector-names"/>
	`);
	#input = null;
	#lstNames = null;

	constructor() {
		this.#input = this.#content.querySelector("#input-storage-selector-name");
		this.#lstNames = this.#content.querySelector("#storage-selector-names");
	}

	get content() {
		return this.#content;
	}

	get name() {
		return this.#input.value;
	}

	set name(value) {
		this.#input.value = value;
	}

	set names(names) {
		let options = [];
		if (names && typeof names.sort === 'function') {
			names.sort();
			for (let name of names) {
				let option = document.createElement("option");
				option.setAttribute("value", name);
				options.push(option);
			}
		}
		this.#lstNames.replaceChildren(...options);
	}
}

export default StorageSelectorName;
