class PxWindow {
	wnd = null;
	wndTitle = null;
	btnClose = null;
	btnMinimize = null;
	wndContent = null;

	offsetX = null;
	offsetY = null;

	closeable = false;
	minimizeable = false;

	constructor(title, options = {}) {
		this.closeable = options.closeable ?? this.closeable;
		this.minimizeable = options.minimizeable ?? this.minimizeable;

		this.createWindow(title);
		this.addCSS();
		this.bindEvents();

		this.wndTitle.addEventListener('mousedown', this.startMove);
		this.btnMinimize?.addEventListener('click', this.minimize);
		this.btnClose?.addEventListener('click', this.close);
	}

	addCSS() {
		var head = document.getElementsByTagName('HEAD')[0];
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'modules/px-window.css';
		head.appendChild(link);
	}

	createWindow(title) {
		this.wnd = document.createElement('div');
		this.wnd.classList.add('px-window');
		this.wnd.insertAdjacentHTML('afterbegin', `
			<div class="px-window-title">
				<span class="px-window-title-text">${title}</span>
			</div>
			<div class="px-window-content"/>
		`);
		this.wndTitle = this.wnd.querySelector('.px-window-title');
		if (this.minimizeable) {
			this.btnMinimize = document.createElement('button');
			this.btnMinimize.classList.add('px-window-button', 'px-window-minimize');
			this.wndTitle.append(this.btnMinimize);
		}
		if (this.closeable) {
			this.btnClose = document.createElement('button');
			this.btnClose.classList.add('px-window-button', 'px-window-close');
			this.wndTitle.append(this.btnClose);
		}
		this.wndContent = this.wnd.querySelector('.px-window-content');

		// initialize left and top, so the transition for closing works
		this.wnd.style.left = this.wnd.offsetLeft;
		this.wnd.style.top = this.wnd.offsetTop;

		document.body.append(this.wnd);
	}

	/**
	 * we need to bind the functions so they works as event listeners
	 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#other_notes
	 */
	bindEvents() {
		this.move = this.move.bind(this);
		this.startMove = this.startMove.bind(this);
		this.open = this.open.bind(this);
		if (this.minimizeable) this.minimize = this.minimize.bind(this);
		if (this.closeable) this.close = this.close.bind(this);
		this.openDone = this.openDone.bind(this);
	}

	addContent(item) {
		this.wndContent.append(item);
	}

	minimize(event) {
		if (this.minimizeable) {
			this.wnd.classList.add('transition');
			this.wnd.classList.add('closed');
			window.removeEventListener('mousemove', this.move);
			this.wndTitle.removeEventListener('mouseDown', this.startMove);
			this.btnMinimize?.removeEventListener('click', this.minimize);
			this.btnClose?.removeEventListener('click', this.close);
			// if we don't stop the event, the window will be opened again immediately
			event.stopImmediatePropagation();
			this.wnd.addEventListener('click', this.open);
		}
	}
	
	close(event) {
		if (this.closeable) {
			window.removeEventListener('mousemove', this.move);
			this.wndTitle.removeEventListener('mousedown', this.startMove);
			this.wnd.removeEventListener('click', this.open);
			this.btnMinimize?.removeEventListener('click', this.minimize);
			this.btnClose?.removeEventListener('click', this.close);
			this.wnd.removeEventListener('transitionend', this.openDone);
			this.wnd.remove();
		}
	}

	open(event) {
		this.wnd.classList.remove('closed');
		// this doesn't work, there ist just no transition
		// this.wnd.classList.remove('transition');
		// this works, but would break, if we change the transition duration and is therefore a bit unreliable
		// setTimeout(() => this.wnd.classList.remove('transition'), 500);
		// this event works as expected, but would break if we have a more complex transition with multiple durations
		this.wnd.addEventListener('transitionend', this.openDone);

		this.wnd.removeEventListener('click', this.open);
		this.wndTitle.addEventListener('mouseDown', this.startMove);
		this.btnMinimize?.addEventListener('click', this.minimize);
		this.btnClose?.addEventListener('click', this.close);
	}

	openDone(event) {
		this.wnd.classList.remove('transition');
		this.wnd.removeEventListener('transitionend', this.openDone);
	}

	startMove(event) {
		this.offsetX = event.offsetX;
		this.offsetY = event.offsetY;
		// we must add the event mousemove to window, because otherwise we could
		// loose track, if the mouse moves to fast
		window.addEventListener('mousemove', this.move);
	}

	move(event) {
		if (event.buttons === 1) {
			// Make sure that the window is always in the visible area.
			this.wnd.style.left = `${Math.min(
					document.documentElement.scrollWidth - this.wnd.clientWidth - 2,
					Math.max(0, event.clientX - this.offsetX))}px`;
			this.wnd.style.top = `${Math.min(
					document.documentElement.scrollHeight - this.wnd.clientHeight - 2,
					Math.max(0, event.clientY - this.offsetY))}px`;
		} else {
			window.removeEventListener('mousemove', this.move);
		}
	}
}

export default PxWindow;
