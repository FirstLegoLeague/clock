const path = require('path')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const common = require('./webpack.common.js')

const distPath = path.join(__dirname, 'dist')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new CopyWebpackPlugin([{ from: 'module.yml', to: distPath }]),
    new CopyWebpackPlugin([{ from: 'package.json', to: distPath }]),
    new CopyWebpackPlugin([{ from: 'src/server', to: path.join(distPath, 'server') }])
  ]
})
