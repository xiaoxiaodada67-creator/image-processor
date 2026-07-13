const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  processImages: async (files, options) => {
    return await ipcRenderer.invoke("process-images", files, options);
  },

  selectInputFolder: async () => {
    return await ipcRenderer.invoke("select-input-folder");
  },

  selectOutputFolder: async () => {
    return await ipcRenderer.invoke("select-output-folder");
  },

  selectImages: async () => {
    return await ipcRenderer.invoke("select-images");
  }
});
