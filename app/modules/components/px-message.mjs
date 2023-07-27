import CSSHelpers from '/modules/utils/css-helpers.mjs';

class PxMessage {
	#wndContent = document.createRange().createContextualFragment(`
		<div class="px-message">
			<div>
				<span class="message"></span>
				<span class="detail-button"></span>
			</div>
			<div class="detail"></div>
		</div>
	`);
	#wndMessage = this.#wndContent.querySelector('.message');
	#wndDetail = this.#wndContent.querySelector('.detail');
	#wndDetailButton = this.#wndContent.querySelector('.detail-button');
	#messageTypes = ['info', 'error', 'warning'];
	#pxMessageTypes = this.#messageTypes.map(aType => 'px-' + aType);
	
	constructor() {
		CSSHelpers.addCSS('modules/components/px-message.css');
		this.#wndContent = this.#wndContent.querySelector('.px-message');
		this.#wndDetailButton.addEventListener('click', this.#showDetail);
	}

	get content() {
		return this.#wndContent;
	}

	#showDetail = event => {
		this.#wndDetail.classList.toggle('px-show');
		this.#wndDetailButton.classList.toggle('selected');
	};

	#setMessage(type, message, options = {}) {
		this.#setPosition(options);
		this.#wndMessage.textContent = message;
		this.#wndContent.classList.remove(
			...this.#pxMessageTypes.filter(aType => aType !== 'px-' + type)
		);
		this.#wndContent.classList.add('px-' + type, 'px-show');
		if (options.autohide) {
			this.#wndContent.classList.add('px-hide');
			this.#wndContent.addEventListener('animationend', this.clear);
		}
		if (options.error) {
			this.#wndDetailButton.classList.add('px-show');
			this.#wndDetail.textContent = options.error.message;
		} else {
			this.#wndDetailButton.classList.remove('px-show');
			this.#wndDetail.classList.remove('px-show');
		}
	}

	#setPosition({x, y} = {}) {
		if (x == null && y == null) {
			this.#wndContent.classList.remove('px-absolute');
		} else {
			this.#wndContent.classList.add('px-absolute');
		}
		this.#wndContent.style['left'] = x == null ? null : `${x}px`;
		this.#wndContent.style['top'] = y == null ? null : `${y}px`;
	}

	setInfo(message, options = {}) {
		this.#setMessage('info', message, options);
	}

	setError(message, options = {}) {
		this.#setMessage('error', message, options);
	}

	clear = () => {
		this.#wndMessage.textContent = '';
		this.#wndContent.classList.remove('px-show', 'px-hide', 'px-absolute', ...this.#pxMessageTypes);
		this.#wndContent.removeAttribute('style');
		this.#wndContent.removeEventListener('animationend', this.clear);
	};
}

export default PxMessage;
