'use strict';
import PxWindow from './modules/px-window.mjs';
import Settings from './modules/settings.mjs';
import config from './config.js';

document.title = `${config.name} ${config.version}`
let pxWindow = new PxWindow(`${config.name} ${config.version} Settings`, {closeable: false, minimizeable: true});
let settings = new Settings();
pxWindow.addContent(settings.content);
