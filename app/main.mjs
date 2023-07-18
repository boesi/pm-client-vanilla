'use strict';
import PxWindow from './modules/components/px-window.mjs';
import PxTabs from './modules/components/px-tabs.mjs';
import Settings from './modules/settings.mjs';
import StorageSettings from './modules/storage/settings.mjs';
import config from './config.js';
import BoardData from './modules/board-data.mjs';

function main() {
	document.title = `${config.name} ${config.version}`
	let pxWindow = new PxWindow(`${config.name} ${config.version} Settings`, {closeable: false, minimizeable: true});
	let pxTabs = new PxTabs();
	pxWindow.addContent(pxTabs.content);
	let boardData = new BoardData();
	let settings = new Settings(boardData);
	pxTabs.addTab('Walkers', settings.content);
	let storage = new StorageSettings(boardData);
	pxTabs.addTab('Storage', storage.content);
}

main();
