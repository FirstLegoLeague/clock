/* eslint-disable node/exports-style */

const merge = require('webpack-merge')

const common = require('./webpack.common')

module.exports = config => {
  config.set({
    files: [
      'test/client/**/*.test.jsx',
      'client/*/**/*.js{x,}',
      'client/!(index|sound).jsx'
    ],

    frameworks: [ 'mocha' ],

    plugins: [
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-webpack'
    ],

    preprocessors: {
      'test/client/**/*.test.js{x,}': [ 'webpack' ],
      'client/**/*.js{x,}': [ 'webpack' ]
    },

    reporters: [ 'mocha' ],

    webpack: merge(common, {
      entry: null,
      output: null,
      devtool: 'inline-source-map',
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
                ],
                plugins: ['istanbul']
              }
            }
          }
        ]
      }
    }),

    coverageReporter: {
      type: process.env.CI ? 'lcovonly' : 'text',
      dir: 'coverage/',
      subdir: 'ui',
      includeAllSources: true
    }
  })
}
