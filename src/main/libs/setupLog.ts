import { app } from 'electron'
import log from 'electron-log'

// YYYY-MM-DDのフォーマットで年月日を返す
const getDate = (): string => {
  const date = new Date()
  const y = date.getFullYear()
  const m = ('00' + (date.getMonth() + 1)).slice(-2)
  const d = ('00' + date.getDate()).slice(-2)
  return `${y}-${m}-${d}`
}

export const setupLog = () => {
  // ログ・ファイル名に年月日を付加
  log.transports.file.fileName = `${getDate()}_${log.transports.file.fileName}`
  // [catchErrors](https://github.com/megahertz/electron-log/blob/master/docs/catch.md)
  log.catchErrors({
    showDialog: false,
    onError() {
      app.quit()
    },
  })
}
