import CSSHelpers from '/modules/utils/css-helpers.mjs';

class PxMessage {
	wndContent = document.createElement('div');
	messageTypes = ['info', 'error', 'warning'];
	pxMessageTypes = this.messageTypes.map(aType => 'px-' + aType);
	
	constructor() {
		this.wndContent.classList.add('px-message');
		CSSHelpers.addCSS('modules/components/px-message.css');
		this.clear = this.clear.bind(this);
	}

	get content() {
		return this.wndContent;
	}

	setMessage(type, message, options = {}) {
		this.setPosition(options);
		this.wndContent.textContent = message;
		this.wndContent.classList.remove(
			...this.pxMessageTypes.filter(aType => aType !== 'px-' + type)
		);
		this.wndContent.classList.add('px-' + type, 'px-show');
		if (options.autohide) {
			this.wndContent.classList.add('px-hide');
			this.wndContent.addEventListener('animationend', this.clear);
		}
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
		this.setMessage('info', message, options);
	}

	setError(message, options = {}) {
		this.setMessage('error', message, options);
	}

	clear() {
		console.log('===> PxMessage.clear');
		this.wndContent.textContent = '';
		this.wndContent.classList.remove('px-show', 'px-hide', 'px-absolute', ...this.pxMessageTypes);
		this.wndContent.removeAttribute('style');
		//this.wndContent.style['left'] = null;
		//this.wndContent.style['top'] = null;
		this.wndContent.removeEventListener('animationend', this.clear);
	}
}

export default PxMessage;
