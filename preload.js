const {contextBridge, ipcRenderer} = require('electron');
const lib = require('./lib.js');

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
Object.entries(lib).forEach(([key, value]) => contextBridge.exposeInMainWorld(key, value));
