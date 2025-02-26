// File: preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose API ke renderer process
contextBridge.exposeInMainWorld('electron', {
    notify: (message) => {
        ipcRenderer.send('notify', message);
    }
});