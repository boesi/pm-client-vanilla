class StorageSelectorName {
	#content = document.createRange().createContextualFragment(`
		<label for="input-storage-selector-name">
			Name: 
			<input id="input-storage-selector-name"/>
		</label>
	`);

	constructor() {
		let input = this.#content.querySelector('#input-storage-selector-name');
	}

	get content() {
		return this.#content;
	}

	setNames(names) {
		console.log('===> storage/selector-name.setNames', {names});
	}
}

export default StorageSelectorName;
