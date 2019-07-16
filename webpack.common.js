/* eslint-disable node/exports-style */

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    main: './client/index.jsx',
    sound: './client/sound.jsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'index.html',
      chunks: ['main'],
      favicon: './node_modules/@first-lego-league/user-interface/current/assets/images/first-favicon.ico'
    }),
    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: 'sound.html',
      chunks: ['sound'],
      favicon: './node_modules/@first-lego-league/user-interface/current/assets/images/first-favicon.ico'
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/env',
              '@babel/react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg|png|jpeg|jpg|tif|gif|ico|mp3)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  }
}
