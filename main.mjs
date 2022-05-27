'use strict';
import PxWindow from './modules/px-window.mjs';
import Settings from './modules/settings.mjs';

let pxWindow = new PxWindow('Pixel Mover Settings');
let settings = new Settings();
pxWindow.addContent(settings.content);
