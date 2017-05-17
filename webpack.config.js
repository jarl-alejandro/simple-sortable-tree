var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var cssExtractor = new ExtractTextWebpackPlugin('sortable-tree.css');
require('dotenv').config({silent: true});

const dev = {
  entry: {
     js: ['babel-polyfill','./src/main.jsx']
  },
  output: {
    publicPath: (process.env.APP_ROOT || ''),
    path: __dirname + 'sandbox',
    filename: 'js/sortable-tree.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
        {
            enforce: 'pre',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['eslint-loader'],
        },
        {    // CSS/Sass loader config
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader', 'postcss-loader' ]
        },
        {    // ES6 loader config
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components|imports.scss)/,
            use: ['babel-loader']
        }
    ]
  },
  resolve: {
      extensions: ['.js', '.jsx']
  },
  plugins: [
        new HtmlWebpackPlugin({
            title: 'Sortable Tree Dev Build',
            template: './sandbox/index.html'
        }),
        new webpack.LoaderOptionsPlugin({ options: { postcss: [ autoprefixer ] } }),
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"development"'
		})
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: './sandbox',
        proxy: {
            // Proxy the url /api to an external API.  This way you don't have to install the server on your computer and can get coding faster.
            '/api': {
                target: process.env.API_HOST,
                xfwd: true,
                changeOrigin: true
            }
        }
    }
};



const build = {
  entry: {
     js: ['whatwg-fetch','babel-polyfill','./src/main.jsx']
  },
  output: {
    publicPath: (process.env.APP_ROOT || ''),
    path: __dirname + '/dist',
    filename: 'sortable-tree.js'
  },
  module: {
    rules: [
        {
            enforce: 'pre',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: ['eslint-loader'],
        },
        {    // CSS/Sass loader config
            test: /\.css$/,
            use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: "css-loader!postcss-loader",
            })
        },
        {    // ES6 loader config
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components|imports.scss)/,
            use: ['babel-loader']
        }
    ]
  },
  resolve: {
      extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
        new webpack.LoaderOptionsPlugin({ options: { postcss: [ autoprefixer ] } }),
        new webpack.DefinePlugin({
			'process.env.NODE_ENV': '"production"'
		}),
        new CleanWebpackPlugin(['dist']),
        cssExtractor,
        new webpack.optimize.UglifyJsPlugin({
            mangle: true, //note: this is has potential negative side effects - so far it is not breaking production build and helps reduct the dist src almost a mb
            compress: {
                warnings: false, // Suppress uglification warnings
                unsafe: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            },
            exclude: [/\.min\.js$/gi] // skip pre-minified libs
        }),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
};


/*
SELECT WHICH CONFIG TO USE
*/
switch (process.env.npm_lifecycle_event) {
    case 'build':
    module.exports = build;
    break;
    default:
    module.exports = dev;
    break;
}
