/**
 * HelperService
 * @namespace
 *
 * @description
 * Lowest level HelperService API. 
 * 
 */
var HelperService = function(SlimLabsBimViewer) {

	'use strict';

	var HelperService = {};

	HelperService.handleCallbackReject = function(callback, reject, error) {
		SlimLabsBimViewer.LoggerService.warn(error);
		reject(error);
		if (callback) {
			callback(error);
		}
	};

	HelperService.handleCallbackResolve = function(callback, resolve, data) {
		resolve(data);
		if (callback) {
			callback(null, data);
		}
	};

	HelperService.cloneObject = function(source) {
		return $.extend(true, {}, source);
	};

	HelperService.cloneObjectProperties = function(target, source) {
		var tmpSource = SlimLabsBimViewer.HelperService.cloneObject(source);
		for (var key in tmpSource) {
			target[key] = tmpSource[key];
		}
	};

	HelperService.getBase64ForInputFile = function(options, callback) {
		var reader = new FileReader();
		reader.readAsDataURL(options.file);
		reader.onload = function() {
			callback(null, reader.result);
		};
		reader.onerror = function(error) {
			callback(error);
		};
	};


	return HelperService;

};

export default HelperService;