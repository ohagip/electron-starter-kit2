import type { IpcRenderer } from 'electron'
import type { ElectronLog } from 'electron-log'

declare global {
  interface Window {
    ipc: IpcRenderer
    log: ElectronLog
  }
}
