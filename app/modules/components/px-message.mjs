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

	setInfo(message) {
		this.setMessage('info', message);
	}

	setError(message) {
		this.setMessage('error', message);
	}

	clear() {
		this.wndContent.textContent = '';
		this.wndContent.classList.remove('px-show');
	}
}

export default PxMessage;
