var path = require('path');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    debug:true,
    devtool: 'eval-source-map',
    entry: './client/index.js',
    output: {
        filename: 'bundle.js',
        path: './dist'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            { 
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                loader: "style-loader!css-loader" 
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        })
    ]    
}