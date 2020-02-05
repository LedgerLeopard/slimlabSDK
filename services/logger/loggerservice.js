/**
 * LoggerService
 * @namespace
 *
 * @description
 * Lowest level LoggerService API. 
 * 
 */
var LoggerService = function(SlimLabsBimViewer) {

	'use strict';

	var LoggerService = {
		enabled: false,
		verbose: false,
	};

	LoggerService.enable = function() {
		this.enabled = true;
	};

	LoggerService.disable = function() {
		this.enabled = false;
	};

	LoggerService.toggle = function() {
		if (this.enabled) {
			LoggerService.disable();
		} else {
			LoggerService.enable();
		}
	};

	LoggerService.enableVerbose = function() {
		this.verbose = true;
	};

	LoggerService.disableVerbose = function() {
		this.verbose = false;
	};

	LoggerService.log = function() {
		if (LoggerService.enabled) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift("[Info]");
			console.log(args.join(" "));
		}
	};

	LoggerService.debug = function() {
		if (LoggerService.enabled && LoggerService.verbose) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift("[Debug]");
			console.debug(args.join(" "));
		}
	};

	LoggerService.warn = function() {
		if (LoggerService.enabled) {
			var args = Array.prototype.slice.call(arguments);
			args.unshift("[Warning]");
			console.warn(args.join(" "));
		}
	};


	return LoggerService;

};

export default LoggerService;