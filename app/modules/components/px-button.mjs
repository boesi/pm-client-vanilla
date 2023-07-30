import CSSHelpers from '/modules/utils/css-helpers.mjs';

/**
 * Facade for a <button>
 */
class PxButton {
	#wndContent = document.createRange().createContextualFragment(`
		<button class="px-button">
		</button>
	`).firstElementChild;

	constructor(text, onclick) {
		CSSHelpers.addCSS('modules/components/px-button.css');
		this.#wndContent.addEventListener('click', onclick);
		this.setText(text);
	}


	/**
	 * delegate EventTarget.addEventListener
	 */
	addEventListener() {
		this.#wndContent.addEventListener(...arguments);
	}

	/**
	 * delegate EventTarget.removeEventListener
	 */
	removeEventListener() {
		this.#wndContent.removeEventListener(...arguments);
	}

	get content() {
		return this.#wndContent;
	}

	setText(text) {
		this.#wndContent.textContent = text;
	}

	setError(options = {}) {
		console.log('===> PxButton.setError', options);
		this.#wndContent.classList.add('px-error');
		if (options.autoclear) {
			this.#wndContent.classList.add('px-clear');
			this.#wndContent.addEventListener('animationend', this.clear);
		}
	}
	
	clear = () => {
		this.#wndContent.classList.remove('px-error', 'px-clear');
	}
}

export default PxButton;
