import CSSHelpers from '/modules/utils/css-helpers.mjs';

class PxMessage {
	wndContent = document.createElement('div');
	messageTypes = ['info', 'error', 'warning'];
	
	constructor() {
		this.wndContent.classList.add('px-message');
		CSSHelpers.addCSS('modules/components/px-message.css');
	}

	get content() {
		return this.wndContent;
	}

	setMessage(type, message) {
		this.wndContent.textContent = message;
		this.wndContent.classList.remove(
			...this.messageTypes.filter(aType => aType !== type).map(aType => 'px-' + aType)
		);
		this.wndContent.classList.add('px-' + type, 'px-show');
	}

	setPosition({x, y} = {}) {
		if (x == null && y == null) {
			this.wndContent.classList.remove('px-absolute');
		} else {
			this.wndContent.classList.add('px-absolute');
		}
		this.wndContent.style['left'] = x == null ? null : `${x}px`;
		this.wndContent.style['top'] = y == null ? null : `${y}px`;
	}

	setInfo(message, options = {}) {
		this.setMessage('info', message);
		this.setPosition(options);
	}

	setError(message, options = {}) {
		this.setMessage('error', message);
		this.setPosition(options);
	}

	clear() {
		this.wndContent.textContent = '';
		this.wndContent.classList.remove('px-show');
	}
}

export default PxMessage;
