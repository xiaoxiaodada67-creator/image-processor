const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  processImages: (files, options) => ipcRenderer.invoke('process-images', files, options),
  selectInputFolder: () => ipcRenderer.invoke('select-input-folder'),
  selectOutputFolder: () => ipcRenderer.invoke('select-output-folder'),
  selectImages: () => ipcRenderer.invoke('select-images'),
});
