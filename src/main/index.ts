import { join } from 'path'
import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import log from 'electron-log'
import { setupLog } from './libs/setupLog'
import { adjustRenderer } from './libs/adjustRenderer'
;(async () => {
  setupLog()

  log.info('start')
  await app.whenReady()
  log.info('ready')

  /**
   * app
   */
  app.on('window-all-closed', app.quit)
  app.on('quit', () => {
    log.info('quit')
  })

  /**
   * 開発・本番での調整、ウィンドウ処理
   */
  if (!isDev) {
    adjustRenderer(join(__dirname, '../renderer'))
  }

  const isWindows = process.platform === 'win32'
  const mainWindow = new BrowserWindow({
    fullscreen: !isDev,
    kiosk: !isDev,
    frame: isDev,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    webPreferences: {
      // devTools: false, // ユーザーのキーボード操作がないため設定しない（本番用でもデバッグしやすいように）
      nodeIntegration: false,
      contextIsolation: false,
      webSecurity: false, // CORS対策のため設定
      preload: join(__dirname, 'preload.js'),
    },
  })

  // const url = isDev ? `http://localhost:8080/` : `file://${join(__dirname, '../renderer/index.html')}`
  const url = isDev ? `http://localhost:8080/` : isWindows ? 'file:///C:/index.html' : 'file:///index.html'
  try {
    await mainWindow.loadURL(url)
  } catch (e) {
    alert(e)
  }

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
})()
