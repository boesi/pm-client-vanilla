import ProviderLocal from './provider-local.mjs';

class Selector {
	#wndSelect = document.createRange().createContextualFragment(`
		<label id="provider-type">
			Provider:
			<select>
				<option value="dummy" selected="selected">---</option>
				<option value="local">LocalStorage</option>
			</select>
		</label>
	`);

	#provider = null;

	constructor() {
		this.#wndSelect.querySelector('#provider-type select').addEventListener('input', this.select.bind(this));
	}

	get provider() {
		return this.#provider;
	}

	get content() {
		return this.#wndSelect;
	}

	select(event) {
		switch (event.srcElement.value) {
			case 'local':
				this.#provider = ProviderLocal;
				break;
			case 'dummy':
			default:
				this.#provider = null;
				break;
		}
	}
}

export default Selector;
