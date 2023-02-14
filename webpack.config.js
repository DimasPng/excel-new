const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
		devServer: {
				port: 4200,
				hot: true,
				watchFiles: ['./src/*'],
		},
		context: path.resolve(__dirname, 'src'),
		entry: './index.js',
		output: {
				filename: '[name].[contenthash].js',
				path: path.resolve(__dirname, 'dist'),
				clean: true,
		},
		plugins: [
				new HTMLWebPackPlugin({
						template: './index.html'
				}),
				new MiniCssExtractPlugin({
						filename: '[name].css'
				})
		],
		optimization: {
				splitChunks: {
						chunks: 'all'
				}
		},
		module: {
				rules: [
						{
								test: /.(sass|less|css)$/,
								use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
						},
						{
								test: /\.(png|jpg|svg|gift)$/,
								use: ['file-loader']
						},
						{
								test: /\.(ttf|woff|woff|eot)$/,
								type: 'asset/resource'
						}
				]
		}
};