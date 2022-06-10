import type { IpcRenderer } from "electron";
import { ipcRenderer } from "electron";
import type { ElectronLog } from "electron-log";
import log from "electron-log";

declare global {
  interface Window {
    ipc: IpcRenderer;
    log: ElectronLog;
  }
}

process.once("loaded", () => {
  window.ipc = ipcRenderer;
  window.log = log;
});