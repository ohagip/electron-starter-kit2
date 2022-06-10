module.exports = {
  productName: 'AppName',
  mac: {
    icon: 'build/icon.icns',
    target: 'zip',
  },
  win: {
    artifactName: '${productName}.${ext}', // デフォルトは `${productName}-${version}.${ext}` バージョンを消す
    icon: 'build/icon.ico',
    target: {
      target: 'portable', // デフォルトは `nsis` でSetup.exeが出力されるため変更
      arch: 'x64',
    },
  },
  files: ['out'],
}
