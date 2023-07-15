import CSSHelpers from '/modules/utils/css-helpers.mjs';

class PxTabs {
	wndContent = null;
	wndTabList = null;

	constructor() {
		this.createWinContent();
		CSSHelpers.addCSS('modules/components/px-tabs.css');
		this.bindEvents();
	}

	createWinContent() {
		this.wndContent = document.createElement('div');
		this.wndContent.classList.add('px-tabs');
		this.wndTabList = document.createElement('div');
		this.wndTabList.classList.add('px-tabs-list');
		this.wndContent.append(this.wndTabList);
	}

	bindEvents() {
		this.selectTab = this.selectTab.bind(this);
	}

	get content() {
		return this.wndContent;
	}

	addTab(title, content) {
		let id = 'px-tabs-' + title.toLowerCase();

		let wndTitle = document.createElement('div');
		wndTitle.classList.add('px-tabs-link');
		wndTitle.setAttribute('aria-label', 'tab');
		wndTitle.setAttribute('data-px-tabs-id', id);
		wndTitle.textContent = title;
		this.wndTabList.append(wndTitle);

		wndTitle.addEventListener('click', this.selectTab);

		let wndContentWrapper = document.createElement('div');
		wndContentWrapper.classList.add('px-tabs-content');
		wndContentWrapper.setAttribute('id', id);
		wndContentWrapper.append(content);
		this.wndContent.append(wndContentWrapper);
	}

	selectTab(event) {
		for (let elLink of this.wndTabList.getElementsByClassName('px-tabs-link')) {
			elLink.classList.remove('active')
		}
		let elSrc = event.srcElement;
		elSrc.classList.add('active');
		let id = elSrc.getAttribute('data-px-tabs-id');
		for (let elContent of this.wndContent.getElementsByClassName('px-tabs-content')) {
			if (elContent.id === id) elContent.classList.add('active');
			else elContent.classList.remove('active');
		}
	}
}

export default PxTabs;
