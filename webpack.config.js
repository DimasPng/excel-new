const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const plugins = () => {
		const base = [
				new HTMLWebPackPlugin({
						template: './index.html',
						minify: {
								collapseWhitespace: isProd
						}
				}),
				new MiniCssExtractPlugin({
						filename: filename('css')
				}),
				new CopyWebpackPlugin({
						patterns: [
								{
										from: path.resolve(__dirname, './src/favicon.ico'),
										to: path.resolve(__dirname, 'dist')
								}
						]
				})
		];

		if (isProd) {
				base.push(new BundleAnalyzerPlugin());
		}

		return base;

};

const optimization = () => {
		const config = {
				splitChunks: {
						chunks: 'all'
				}
		};

		if (isProd) {
				config.minimizer = [
						new TerserWebpackPlugin(),
						new CssMinimizerPlugin()
				];
		}

		return config;


};

module.exports = {
		devtool: isDev ? 'source-map' : false,
		devServer: {
				port: 4200,
				hot: isDev,
				watchFiles: ['./src/*'],
		},
		context: path.resolve(__dirname, 'src'),
		entry: './index.js',
		output: {
				filename: filename('js'),
				path: path.resolve(__dirname, 'dist'),
				clean: true,
		},
		plugins: plugins(),
		optimization: optimization(),
		module: {
				rules: [
						{
								test: /\.s[ac]ss$/i,
								use: [
										MiniCssExtractPlugin.loader,
										'css-loader',
										'sass-loader'
								],
						},
						{
								test: /\.(png|jpg|svg|gift)$/,
								use: ['file-loader']
						},
						{
								test: /\.(ttf|woff|woff|eot)$/,
								type: 'asset/resource'
						},
						{
								test: /\.m?js$/,
								exclude: /node_modules/,
								use: {
										loader: 'babel-loader',
										options: {
												presets: ['@babel/preset-env']
										}
								}
						}
				]
		},
};