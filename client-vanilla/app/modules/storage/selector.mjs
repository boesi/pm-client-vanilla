import ProviderLocal from './provider-local.mjs';
import ProviderFile from './provider-file.mjs';
import ProviderOpfs from './provider-opfs.mjs';
import ProviderIndexedDb from './provider-indexed-db.mjs';

class Selector {
	#wndSelect = document.createRange().createContextualFragment(`
		<label id="provider-type">
			Provider:
			<select>
				<option value="dummy" selected="selected">---</option>
				<optgroup label="Local">
					<option value="file">File</option>
					<option value="indexed-db">Indexed DB</option>
					<option value="local">LocalStorage</option>
					<option value="opfs">OPFS</option>
					<option value="session">SessionStorage</option>
				</optgroup>
				<optgroup label="Remote">
				</optgroup>
			</select>
		</label>
	`);

	#provider = null;
	onSelect = null;

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
				this.#provider = new ProviderLocal(window.localStorage);
				break;
			case 'session':
				this.#provider = new ProviderLocal(window.sessionStorage);
				break;
			case 'indexed-db':
				this.#provider = new ProviderIndexedDb();
				break;
			case 'file':
				this.#provider = new ProviderFile();
				break;
			case 'opfs':
				this.#provider = new ProviderOpfs();
				break;
			case 'dummy':
			default:
				this.#provider = null;
				break;
		}
		this.onSelect?.(this.#provider);
	}
}

export default Selector;
