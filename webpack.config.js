const path = require('path');

module.exports = {
  mode: 'development',
  entry: './cypress/component/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-transform-flow-strip-types',
                '@babel/plugin-transform-export-namespace-from',
                ['babel-plugin-istanbul', {
                  exclude: [
                    'coverage/**',
                    '**/*.{test,spec,cy}.{ts,tsx}',
                    'cypress/**'
                  ],
                  include: [
                    'components/**/*.{ts,tsx}'
                  ],
                  extension: ['.ts', '.tsx'],
                  require: '@babel/register'
                }]
              ]
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-transform-flow-strip-types',
                '@babel/plugin-transform-export-namespace-from',
                ['babel-plugin-istanbul', {
                  exclude: [
                    'coverage/**',
                    '**/*.{test,spec,cy}.{js,jsx}',
                    'cypress/**'
                  ],
                  include: [
                    'components/**/*.{js,jsx}'
                  ],
                  extension: ['.js', '.jsx'],
                  require: '@babel/register'
                }]
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff|woff2|eot)$/i,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react-native$': 'react-native-web',
      '@': path.resolve(__dirname, './'),
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8081,
    hot: true,
  }
}; 