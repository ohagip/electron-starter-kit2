/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const glob = require('glob')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')

const env = process.env.NODE_ENV || 'development'
const config = require(path.resolve(__dirname, `../env/${env}.js`))
config.env = env

const entries = {}
// js
glob
  .sync('**/!(_)*.js', {
    cwd: path.resolve(__dirname, '../js/pages/'),
  })
  .forEach((fileName) => {
    const key = `assets/js/${fileName.replace(/.js$/, '')}`
    entries[key] = path.resolve(__dirname, `../js/pages/${fileName}`)
  })

// ts
glob
  .sync('**/!(_)*.ts', {
    cwd: path.resolve(__dirname, '../js/pages/'),
  })
  .forEach((fileName) => {
    const key = `assets/js/${fileName.replace(/.ts$/, '')}`
    entries[key] = path.resolve(__dirname, `../js/pages/${fileName}`)
  })

// css
entries['assets/css/app'] = path.resolve(__dirname, '../css/app.scss')
// ページ別にする場合
// glob
//   .sync('**/!(_)*.scss', {
//     cwd: path.resolve(__dirname, '../css/pages/'),
//   })
//   .forEach((fileName) => {
//     const key = `assets/css/${fileName.replace(/.scss$/, '')}`
//     entries[key] = path.resolve(__dirname, `../css/pages/${fileName}`)
//   })

// html
const htmlPlugins = glob
  .sync('**/!(_)*.ejs', {
    cwd: path.resolve(__dirname, '../html/pages/'),
  })
  .map((fileName) => {
    const outputFilename = `${fileName.replace(/.ejs$/, '')}.html`
    return new HtmlWebpackPlugin({
      filename: outputFilename,
      template: path.resolve(__dirname, `../html/pages/${fileName}`),
      minify: false, // html-loader側でminifyされるため
      inject: false, // htmlにscriptタグを追加しない
    })
  })

module.exports = {
  // target: ['web', 'es5'], // ES5(IE11等)向けの指定
  target: ['web', 'es5'], // ES5(IE11等)向けの指定

  entry: entries,

  output: {
    path: path.resolve(__dirname, '../../../out/renderer'),
  },

  plugins: [
    // static
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
        },
      ],
    }),
    // html
    ...htmlPlugins,

    // js
    new DefinePlugin({
      CONFIG: JSON.stringify(config),
    }),

    // css
    new RemoveEmptyScriptsPlugin(), // cssと同じファイル名のjsを出力させない
    new MiniCSSExtractPlugin(), // js内にcssをバンドルさせない
  ],

  module: {
    rules: [
      // html
      {
        test: /\.(ejs)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              sources: false,
              // minimize: false,
            },
          },
          {
            loader: 'template-ejs-loader',
            options: {
              data: {
                CONFIG: config,
              },
            },
          },
        ],
      },

      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },

      // ts
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },

      // shader
      // {
      //   test: /\.(glsl|vs|fs|vert|frag)$/,
      //   exclude: /node_modules/,
      //   use: [
      //     'raw-loader',
      //     'glslify-loader',
      //   ],
      // },

      // css
      {
        test: /\.scss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // https://github.com/webpack-contrib/css-loader#options
              url: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer', {}],
                  ['node-css-mqpacker', {}],
                ],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, `../js/`),
    },
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'assets/js/vendors.bundle',
          chunks: 'all',
          enforce: true,
        },
        modules: {
          test: /src\/js\/(?!pages)/,
          name: 'assets/js/modules.bundle',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
}
