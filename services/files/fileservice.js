/**
 * FileService
 * @namespace
 *
 * @description
 * Lowest level FileService API. 
 * 
 */
var FileService = function(SlimLabsBimViewer) {

	'use strict';

	var FileService = {};

	/**
	 * Set the url
	 *
	 * @access   public
	 * @memberof FileService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @param    {String}                   url The API url
	 */
	FileService.setUrl = function(url) {
		this.baseUrl = url || "https://beta.viewer.slimlabs.nl";
	};


	/**
	 * Get the set API url
	 *
	 * @access   public
	 * @memberof FileService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @return   {String}                   The API url
	 */
	FileService.getUrl = function() {
		return this.baseUrl;
	};


	/**
	 * Get file by path
	 *
	 * @access   public
	 * @memberof FileService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-11
	 * @param    {Object}                   options  Options object
	 * @param    {String}                   options.path  The path of the file
	 * @param    {Function}                 callback Callback function
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FileService.getFileByPath({
	 *	path: model.dae.streamLocation, // Assuming we already retreived a model from the API
	 * }, function(err, fileContents) {
	 *	console.log(err, fileContents);
	 * });
	 * 
	 */
	FileService.getFileByPath = function(options, callback, progressCallback) {

		return new Promise(function(resolve, reject) {

			var url = this.baseUrl + options.path;

			var settings = {
				"async": true,
				"crossDomain": true,
				"url": url,
				"method": "GET",
				"headers": {},
				xhr: function() {
					var xhr = $.ajaxSettings.xhr();
					xhr.onprogress = function(e) {
						if (progressCallback) {
							progressCallback(e);
						}
					};
					return xhr;
				}
			};

			$.ajax(settings).done(function(response) {
				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
			}).fail(function(error) {
				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, reject, error);
			});

		});

	};

	return FileService;

};

export default FileService;