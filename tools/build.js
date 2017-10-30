import webpack from 'webpack';
import webpackConfig from '../webpack.config.prod';
import colors from 'colors';

/*eslint-disable no-console*/
/*eslint-disable  no-useless-escape*/
process.env.NODE_ENV = "production";

console.log(colors.blue("Generating minified bundle for production via Webpack. This will take a moment"));

webpack(webpackConfig).run((err, stats) => {
  if(err){
    console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();

  if(jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(colors.red(error)));
  }

  if(jsonStats.hasWarnings) {
    return jsonStats.warnings.map(warning => console.log(colors.yellow(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  console.log(colors.green("Your app has been compiled in production mode and written to /dist. It\'s ready to roll!"));

  return 0;
});
