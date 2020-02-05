/* jshint esnext: true */
(function() {

	'use strict';

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	const oboe = require("oboe");
	const request = require("request");
	const fs = require("fs");
	const url = "obeodata.json";
	// const url = "https://localhost:445/id/caffcbc9-4c46-4453-9b03-7dc19683c9d3/email/wco@slimlabs.nl/file/json";

	oboe(fs.createReadStream("obeodata.json"))
		.done((things) => {
			// oboe({
			// 	url: url,
			// 	withCredentials: false
			// }).done((things) => {
			console.log("Done");
		}).fail((err) => {
			console.log("Fail", err);
		}).node("asset.*", (node) => {
			console.log("asset");
			console.log(node);
		}).node("library_effects.*", (node) => {
			// console.log("library_effect");
			// console.log(node);
		}).node("library_materials.*", (node) => {
			// console.log("library_material");
			// console.log(node);
		}).node("library_visual_scenes.*", (node) => {
			// console.log("library_visual_scene");
			// console.log(node);
		}).node("library_geometries.*", (node) => {
			// console.log("library_geometrie");
			// console.log(node);
		});

})();