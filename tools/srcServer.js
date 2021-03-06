import express from 'express';
import path from 'path';
import webpack from 'webpack';
import open from 'open';
import config from '../webpack.config.prod';

/*eslint-disable no-console*/

const port = 3000;
const host = 'http://localhost';
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, function(err){
  if(err){
    console.log(err);
  }
  else{
    open(`${host}:${port}`, 'chrome');
  }
});
