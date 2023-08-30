class StorageSelectorName {
	#content = document.createRange().createContextualFragment(`
		<label for="input-storage-selector-name">
			Name: 
			<input id="input-storage-selector-name"/>
		</label>
	`);
	#input = null;

	constructor() {
		this.#input = this.#content.querySelector('#input-storage-selector-name');
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
