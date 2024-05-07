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
		this.#wndContent.classList.add('px-error');
		if (options.autoclear) {
			this.#autoclear();
		}
	}

	setInfo(options = {}) {
		this.#wndContent.classList.add('px-info');
		if (options.autoclear) {
			this.#autoclear();
		}
	}

	#autoclear() {
		// we need to stop an old animation, to start a new one
		for (let animation of this.#wndContent.getAnimations()) {
			this.#wndContent.classList.remove('px-clear');
			animation.finish();
		}
		// if there was an old animation we need to get in the next event loop
		setTimeout(() => {
			this.#wndContent.classList.add('px-clear');
			this.#wndContent.addEventListener('animationend', this.clear);
		});
	}
	
	clear = () => {
		this.#wndContent.classList.remove('px-error', 'px-info', 'px-clear');
	}

	remove() {
		this.#wndContent.remove();
	}
}

export default PxButton;
