class StorageSelectorName {
	#content = document.createRange().createContextualFragment(`
		<label for="input-storage-selector-name">
			Name: 
			<input list="storage-selector-names" id="input-storage-selector-name"/>
		</label>
		<datalist id="storage-selector-names">
			<option value="test"/>
		</datalist>
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

	set names(names) {
		console.log('===> storage/selector-name.setNames', {names});
	}
}

export default StorageSelectorName;
