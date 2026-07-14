const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("staffAlertDesktop", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (config) => ipcRenderer.invoke("save-config", config),
  testConnection: () => ipcRenderer.invoke("test-connection"),
  previewMelody: () => ipcRenderer.invoke("preview-melody"),
  onAlarmStart: (cb) => {
    ipcRenderer.on("alarm-start", (_event, melodyId) => cb(melodyId));
  },
  onAlarmStop: (cb) => {
    ipcRenderer.on("alarm-stop", () => cb());
  },
  notifyStopped: () => ipcRenderer.send("alarm-stopped-by-ui"),
});
