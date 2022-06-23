Electron Starter Kit
====================

## Engines
```
node: 16.15.1
npm: 8.11.0
```

## Setup
```
npm ci
```

## Development
```
$ npm dev:renderer
$ npm dev:main
```
renderer側でローカルサーバが立ち上がってからmain側を実行する

## Create Production app
```
$ npm run dist
$ npm run dist:win（MacでWindows用ビルドする場合）
```

## MacでWindows用ビルドする場合
- `wine` をインストールする必要がある
- [`Homebrew`](https://brew.sh/index_ja) でインストールするのが楽
```
brew install --cask wine-stable
```
