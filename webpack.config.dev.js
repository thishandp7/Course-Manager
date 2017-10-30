import webpack from 'webpack';
import path from 'path';

export default{
  devtool:'cheap-module-eval-source-map',
  entry:[
          'eventsource-polyfill',
          'webpack-hot-middleware/client?reload=true',
          path.resolve(__dirname + '/src/index')
        ],
  target: 'web',
  output:{
    path: path.resolve(__dirname + 'dist'),
    filename:'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: './src',
    historyApiFallback: true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module:{
    loaders:[
      {test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel-loader']},
      {test: /(\.css)$/, loaders: ["style-loader","css-loader"]},
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=public/fonts/[name].[ext]' }
    ]
  }
};
