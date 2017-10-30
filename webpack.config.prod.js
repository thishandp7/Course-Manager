import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};

export default{
  devtool:'source-map',
  entry: path.resolve(__dirname + '/src/index'),
  target: 'web',
  output:{
    path: __dirname + '/dist',
    filename:'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  plugins:[
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module:{
    loaders:[
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      {test: /(\.css)$/, loader: ["style-loader","css-loader"]},
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=public/fonts/[name].[ext]' }
    ]
  }
};
