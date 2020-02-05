const webpack = require('webpack');

// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const FileManagerPlugin = require('filemanager-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const WebpackOnBuildPlugin = require('on-build-webpack');
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const ftpClient = require('ftp-client');

const path = require('path');
const fs = require('fs');
const copydir = require('copy-dir');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const nodedelete = require('node-delete');

var BASE_DIR = "_dist";
var DOCS_DIR = "_docs";
var CONFIG_PATH = "./ftp-config.json";
var FTP_USER;
var FTP_PASS;

module.exports = env => {

	const target = env.TARGET || "BUILD";
	const version = require("./package.json").version;

	console.log("\x1b[31m%s\x1b[0m", "!!! Got version " + version + " from package.json !!!");
	console.log("Building version", version, "with build target:", target);

	switch (target) {
		case "DEV":
			return createConfig({
				name: 'slimlabs-viewer-sdk.min',
				minify: false,
				env: env,
				target: "umd",
				version: version
			});
		case "LOCAL_BUILD":

			return [
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "commonjs",
					version: version,
				}),
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "amd",
					version: version,
				}),
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "umd",
					version: version,
				})
		];

		case "BUILD":

			return [
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "commonjs",
					version: version,
					subfolder: version,
				}),
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "amd",
					version: version,
					subfolder: version,
				}),
				createConfig({
					name: 'slimlabs-viewer-sdk.min',
					minify: true,
					env: env,
					target: "umd",
					version: version,
					subfolder: version,
					deploy: true
				})
			];
	}

};

function createConfig(options) {

	var config = {
		context: __dirname,
		entry: {},
		output: {
			path: path.join(__dirname, BASE_DIR, (options.subfolder || "")),
			publicPath: '/' + BASE_DIR,
			filename: '[name].' + options.target + '.js',
			libraryTarget: options.target,
		},
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [{
						loader: "style-loader"
					}, {
						loader: "css-loader"
					}],
				}, {
					test: /\.gif$/,
					loader: "file-loader",
					exclude: [/node_modules/, /bower_components/],
				}, {
					test: /\.jpg$/,
					loader: 'url-loader',
					exclude: [/node_modules/, /bower_components/],
				}, {
					test: /\.png$/,
					loader: 'url-loader',
					exclude: [/node_modules/, /bower_components/],
				}, {
					test: /\.worker\.js$/,
					loader: "worker-loader",
					options: {
						inline: true,
						fallback: false
					},
					exclude: [/node_modules/, /bower_components/],
				}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				'process.env.VERSION': JSON.stringify(options.version)
			}),
			new webpack.ProvidePlugin({
				"window.jQuery": "jquery",
				"jQuery": "jquery",
				"$": "jquery",
				"window.$": "jquery",
			}),
		]
	};

	config.entry[options.name] = './build.js';

	if (options.minify) {
		config.plugins.push(new webpack.optimize.UglifyJsPlugin({
			include: /\.min\./,
			minimize: true,
			parallel: true,
			output: {
				comments: false
			}
		}));
	}

	if (options.deploy) {

		var ftpConfigByte = fs.readFileSync(CONFIG_PATH);
		fs.unlinkSync(CONFIG_PATH);
		var ftpConfig = JSON.parse(ftpConfigByte.toString());

		if (ftpConfig.FTP_USER && ftpConfig.FTP_PASS) {
			FTP_USER = ftpConfig.FTP_USER;
			FTP_PASS = ftpConfig.FTP_PASS;
		} else {
			console.log("No FTP_USER and/or FTP_PASS found.");
			return;
		}

		config.plugins.push(new WebpackBeforeBuildPlugin(function(compiler, callback) {

			nodedelete.sync([path.join(BASE_DIR, "*.js")]);
			mkdirp.sync(path.join(BASE_DIR, options.version));
			copydir.sync(path.join(BASE_DIR, DOCS_DIR), path.join(BASE_DIR, options.version, DOCS_DIR));
			rimraf.sync(path.join(BASE_DIR, DOCS_DIR));
			callback();

		}));

		config.plugins.push(new WebpackOnBuildPlugin(function() {

			copydir.sync(path.join(__dirname, BASE_DIR, options.subfolder + "/"), path.join(__dirname, BASE_DIR, "latest"));

			var client = new ftpClient({
				host: 'ftp.pcextreme.nl',
				port: 21,
				user: FTP_USER,
				password: FTP_PASS
			}, {
				logging: "basic"
			});

			client.connect(function() {
				client.upload([path.join(".", BASE_DIR, "**")], '/viewer_sdk', {
					overwrite: 'all',
					baseDir: BASE_DIR,
				}, function(result) {
					console.log("SDK version", options.version, "has been successfully deployed");
				});
			});

		}));

	}


	return config;

}