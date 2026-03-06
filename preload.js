const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  getVersion: () => ipcRenderer.invoke('app:version'),
  readSettings: () => ipcRenderer.invoke('settings:read'),
  writeSettings: (settings) => ipcRenderer.invoke('settings:write', settings)
});
