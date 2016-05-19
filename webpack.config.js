var HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    webpack = require('webpack'),
    path = require('path');

var mockport, hashType, devtool, port = 80;
//开发环境和上线环境需要区分
if(process.env.NODE_ENV === 'production') {
    //上线环境
    // 配置2：hasType
    // 在上线环境使用chunkhash
    hashType = 'chunkhash';
    // 配置3：devtool
    // 在上线环境中，devtool为空值
    devtool = '';
} else {//其他都是开发环境

    //配置1：mockport
    //bizdp在启动webpack-dev-server时会默认把bizmock监听的随机端口号从命令行中传递过来
    //eg:webpack-dev-server --mockport 8888
    process.argv.forEach(function(val, index){
        if(val === '--mockport'){
            mockport = process.argv[index+1];
        } else if(val === '--port'){
            port = process.argv[index+1];
        }
    });

    //配置2：hasType
    // 在开发环境中要使用hash代替chunkhash
    // webpack-dev-server不支持chunkhash
    hashType = 'hash';
    // 配置3：devtool
    // 在上线环境中，devtool为source-map
    devtool = 'source-map';
}

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [
      'jquery'
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
