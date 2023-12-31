const path = require('path')

module.exports = {
  context: path.resolve('src'),
  mode: 'production',
  entry: './index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: require.resolve('./src/index.ts'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {targets: "defaults"}]
              ],
            }
          },
          {
            loader: 'ts-loader',
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: {
      name: 'SequenceCanvas',
      type: 'var',
      export: 'default',
    },
    path: path.resolve(__dirname, 'build'),
    filename: 'sequence-canvas.js'
  }
}
