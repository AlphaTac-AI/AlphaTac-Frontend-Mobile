
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const isProd = process.env.NODE_ENV === 'production';
const publicUrl = isProd ? paths.servedPath.slice(0, -1) : '';
const env = getClientEnvironment(publicUrl);

// Note: defined here because it will be used more than once.
const cssFilename = 'static/css/[name].[contenthash:8].css';

const plugins = [
  new InterpolateHtmlPlugin(env.raw),
  new webpack.optimize.CommonsChunkPlugin({
    name: "common",
    // ( 公共chunk(commnons chunk) 的名称)
    filename: 'static/js/[name].[hash:8].js',
    // ( 公共chunk 的文件名)
    // minChunks: 3,
  }),
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV was set to production here.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin(env.stringified),
  // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
  new ExtractTextPlugin({
    filename: cssFilename,
  }),
  // Generate a manifest file which contains a mapping of all asset filenames
  // to their corresponding output file so that tools can pick it up without
  // having to parse `index.html`.
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
  }),
  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  new SWPrecacheWebpackPlugin({
    // By default, a cache-busting query parameter is appended to requests
    // used to populate the caches, to ensure the responses are fresh.
    // If a URL is already hashed by Webpack, then there is no concern
    // about it being stale, and the cache-busting can be skipped.
    dontCacheBustUrlsMatching: /\.\w{8}\./,
    filename: 'service-worker.js',
    logger(message) {
      if (message.indexOf('Total precache size is') === 0) {
        // This message occurs for every build and is a bit too noisy.
        return;
      }
      if (message.indexOf('Skipping static resource') === 0) {
        // This message obscures real errors so we ignore it.
        // https://github.com/facebookincubator/create-react-app/issues/2612
      }
    },
    minify: true,
    // For unknown URLs, fallback to the index page
    navigateFallback: `${publicUrl}/index.html`,
    // Ignores URLs starting from /__ (useful for Firebase):
    // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
    navigateFallbackWhitelist: [/^(?!\/__).*/],
    // Don't precache sourcemaps (they're large) and build asset manifest:
    staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
  }),
  // Moment.js is an extremely popular library that bundles large locale files
  // by default due to how Webpack interprets its code. This is a practical
  // solution that requires the user to opt into importing specific locales.
  // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
  // You can remove this if you don't use Moment.js:
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
]
if (isProd) {
  plugins.push(
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      mangle: {
        safari10: true,
      },
      output: {
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebookincubator/create-react-app/issues/2488
        ascii_only: true,
      },
      sourceMap: !isProd,
    })
  )
} else {
  plugins.push(
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.HotModuleReplacementPlugin(),
  )
}

const entry = paths.getEntry();

const htmlPlugins = Object.keys(entry).map(chunk => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
    filename: `${chunk}.html`,
    chunks: ['common', chunk],
    // minify: isProd ? {
    //   removeComments: true,
    //   collapseWhitespace: true,
    //   removeRedundantAttributes: true,
    //   useShortDoctype: true,
    //   removeEmptyAttributes: true,
    //   removeStyleLinkTypeAttributes: true,
    //   keepClosingSlash: true,
    //   minifyJS: true,
    //   minifyCSS: true,
    //   minifyURLs: true,
    // } : false,
  });
});

module.exports = [
  ...plugins,
  ...htmlPlugins,
];