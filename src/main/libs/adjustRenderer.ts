import { protocol } from 'electron'
import { join, isAbsolute, normalize } from 'path'

export const adjustRenderer = (directory: string) => {
  const isWindows = process.platform === 'win32'

  protocol.interceptFileProtocol('file', (request, callback) => {
    // Windows: file:///C:/sample
    // Mac: file:///sample
    let path = request.url.substr(isWindows ? 10 : 7)

    if (isAbsolute(path)) {
      if (isWindows) {
        path = normalize(path)
      }
      path = join(directory, path)
    }

    path = decodeURIComponent(path)

    callback({ path })
  })
}
