var HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path');

var hashType, devtool;


    hashType = 'hash';

    devtool = '';


module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [
      'jquery', 'flexslider'
    ]
  },
  // resolve: {
  //   alias: {
  //     'flexslider': path.resolve(process.cwd(), 'src/lib/flexslider/2.5.0/jquery.flexslider.js')
  //   }
  // },
  output: {
    path: 'dist',
    filename: '[name].[' + hashType + '].js',
    chunkFilename: '[name].[' + hashType + '].js',
    publicPath: '/dist/'
  },
  module: {
    noParse: ['jquery', 'jquery-migrate', 'flexslider'],
    loaders: [
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
      {
            test: /\.(jpe?g|png|gif)$/i,
            loaders: ['url?limit=10000&name=image/[hash:8].[name].[ext]']
      },
      { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
      { test: /\.eot$/,  loader: "file-loader" },
      { test: /\.svg$/,  loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
    ]
  },
  plugins: [
    //index和register页面中的公共部分提取出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'commons.[' + hashType + '].js',
      chunks: ['index']
    }),
    //把commons中属于vendor的部分提取出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[' + hashType + '].js',
      chunks: ['commons', 'vendor']
    }),
    // 提取manifest，webpack的runtime环境
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      filename: 'manifest.[' + hashType + '].js',
      chunks: ['vendor']
    }),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    //首页
    new HtmlWebpackPlugin({
      template: './page/index.template.html',
      filename: '../index.html',
      title: 'xs\'s blog',
      chunks: ['commons', 'index', 'vendor', 'manifest']
    }),
    new ExtractTextPlugin('styles.[' + hashType + '].css')
  ],
  devtool: devtool
};
