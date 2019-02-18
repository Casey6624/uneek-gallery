const path = require('path');

module.exports = (env, argv) => {
  let production = argv.mode === 'production'

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin()
  
  return {
    entry: {
      'js/admin': path.resolve(__dirname, 'app/admin.js'),
      'js/shortcode': path.resolve(__dirname, 'app/shortcode.js'),
      'js/widget': path.resolve(__dirname, 'app/widget.js'),
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'assets'),
    },

    devtool: production ? '' : 'source-map',
  
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
  
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  };
}
