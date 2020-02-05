import oboe from "./js/oboe_buffer_increased";
import OboeWorker from "./workers/oboe.worker.js";

/**
 * DatabaseService
 * @namespace
 *
 * @description
 * Lowest level Database API. 
 * 
 */
var DatabaseService = function(SlimLabsBimViewer) {

	'use strict';

	var DatabaseService = {
		cancelledModelStreams: [],
		OboeWorker: OboeWorker,
	};

	/**
	 * Set the url
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @param    {String}                   url The API url
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DatabaseService.setUrl("https://viewer.slimlabs.nl")
	 * 
	 */
	DatabaseService.setUrl = function(url) {
		DatabaseService.baseUrl = url;
	};

	/**
	 * Get the set API url
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @return   {String}                   The API url
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DatabaseService.getUrl()
	 *
	 * // "https://viewer.slimlabs.nl"
	 * 
	 */
	DatabaseService.getUrl = function() {
		return DatabaseService.baseUrl;
	};

	/**
	 * <span style="color:red; font-weight:800;">Only use this if you know what you are doing and use at own risk!</span>
	 *
	 * This method sets the setTimeout value for each individiual node (IFC element) callback
	 * from  the streamDaeJson method. Increasing this value will result in increasingly
	 * slower model creation performance. 
	 *
	 * Default value is 0, simulates {@link https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/|NodeJS process.nextTick()}
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-20
	 * @param    {Int}                   timeout Milliseconds to wait for each node
	 */
	DatabaseService.setStreamTimeout = function(timeout) {
		DatabaseService.streamTimeout = timeout;
	};

	/**
	 * Set the current access API user token
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-08
	 * @param    {String}                   token Access API user token
	 */
	DatabaseService.setUserToken = function(token) {
		DatabaseService.userToken = token;
	};

	/**
	 * Get the current access API user token
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-08
	 */
	DatabaseService.getUserToken = function() {
		return DatabaseService.userToken;
	};

	/**
	 * Create a new project
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.name  Name of the project
	 * @param    {Function}                 callback Callback function
	 *
	 * #example
	 *
	 * SlimLabsBimViewer.DatabaseService.createProject("Test Project", function(err, data){
	 * 	console.log(err, data);
	 * })
	 */
	DatabaseService.createProject = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.name) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/new",
					"method": "POST",
					"headers": {
						"user-token": DatabaseService.userToken,
						"content-type": "application/json"
					},
					"processData": false,
					"data": {
						"name": options.name
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.createProject] No name specified");
			}

		});

	};

	/**
	 * Update a project by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the project to update
	 * @param    {string}                   options.name  the new name
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.updateProject = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.name) {

				if (options.id) {

					var settings = {
						"async": true,
						"crossDomain": true,
						"url": DatabaseService.baseUrl + "/project/id/" + options.id,
						"method": "PUT",
						"headers": {
							"user-token": DatabaseService.userToken,
							"content-type": "application/json"
						},
						"processData": false,
						"data": {
							"name": options.name
						}
					};

					$.ajax(settings).done(function(response) {
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
					}).fail(function(error) {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
					});

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateProject] No id specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateProject] No name specified");
			}

		});

	};

	/**
	 * Delete a project by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the project to delete
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.deleteProject = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.id) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.id,
					"method": "DELETE",
					"headers": {
						"user-token": DatabaseService.userToken,
					},
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateProject] No id specified");
			}

		});

	};

	/**
	 * Get a project by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the project to get
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.getProjectById = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.id) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.id,
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getProjectById] No id specified");
			}

		});

	};

	/**
	 * Get project list
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @param    {Object}                   options  Options object
	 * @param    {Function}                 callback Callback function on complete
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DatabaseService.getProjects({}, function(err, projects){
	 * 	if(!err){
	 * 		console.log(projects);
	 * 	} else {
	 * 		console.err(err)
	 * 	}
	 * });
	 * 
	 */
	DatabaseService.getProjects = function(options, callback) {

		return new Promise(function(resolve, reject) {

			var settings = {
				"async": true,
				"url": DatabaseService.baseUrl + "/project/list",
				"method": "GET",
				"headers": {
					"user-token": DatabaseService.userToken,
				},
			};

			$.ajax(settings).done(function(response) {
				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
			}).fail(function(error) {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
			});

		});

	};

	/**
	 * Create a new model
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.name  Name of the model
	 * @param    {Function}                 callback Callback function
	 *
	 */
	DatabaseService.createModel = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId) {

				if (options.form) {

					var settings = {
						"async": true,
						"crossDomain": true,
						"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/add",
						"method": "POST",
						"headers": {
							"user-token": DatabaseService.userToken,
						},
						"processData": false,
						"contentType": false,
						"mimeType": "multipart/form-data",
						"data": options.form
					};

					$.ajax(settings).done(function(response) {
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
					}).fail(function(error) {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
					});

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.createModel] No form specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.createModel] No projectId specified");
			}

		});

	};

	/**
	 * Update a model by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the model to update
	 * @param    {string}                   options.name  the new name
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.updateModel = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.name) {

				if (options.projectId) {

					if (options.modelId) {

						var settings = {
							"async": true,
							"crossDomain": true,
							"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id" + options.modelId,
							"method": "PUT",
							"headers": {
								"user-token": DatabaseService.userToken,
								"content-type": "application/json"
							},
							"processData": false,
							"data": {
								"name": options.name
							}
						};

						$.ajax(settings).done(function(response) {
							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
						}).fail(function(error) {
							SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
						});

					} else {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateModel] No modelId specified");
					}

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateModel] No projectId specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateModel] No name specified");
			}

		});

	};

	/**
	 * Delete a model by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the model to delete
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.deleteModel = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId) {

				if (options.modelId) {

					var settings = {
						"async": true,
						"crossDomain": true,
						"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id" + options.modelId,
						"method": "DELETE",
						"headers": {
							"user-token": DatabaseService.userToken,
						}
					};

					$.ajax(settings).done(function(response) {
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
					}).fail(function(error) {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
					});

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.deleteModel] No modelId specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.deleteModel] No projectId specified");
			}

		});

	};

	/**
	 * Get a model by id
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.id  id of the model to get
	 * @param    {Function}                 callback Callback function
	 */
	DatabaseService.getModelById = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId) {

				if (options.modelId) {

					var settings = {
						"async": true,
						"crossDomain": true,
						"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId,
						"method": "GET",
						"headers": {
							"user-token": DatabaseService.userToken,
						}
					};

					$.ajax(settings).done(function(response) {
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
					}).fail(function(error) {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
					});

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getModelById] No modelId specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getModelById] No projectId specified");
			}

		});

	};

	/**
	 * Get models
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-02
	 * @param    {Object}                   options  Options object
	 * @param    {Function}                 callback Callback function on complete
	 *
	 */
	DatabaseService.getModels = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.project) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.project._id + "/model/list",
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getModels] No projectId specified");
			}

		});

	};

	/**
	 * Get data from the database
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}                   options  Options object
	 * @param    {string}                   options.type  Type to get. e.g. "spaces","objects" or "storeys"
	 * @param    {Object}                   [options.project]  Database project object. ONLY optional model specified. e.g.
	 *                                                         either project or model must be specified.
	 * @param    {Object}                   [options.model]  Database model object. ONLY optional project specified. e.g.
	 *                                                       either project or model must be specified.
	 * @param    {Integer}                  [options.skip]  Amount of results to skip
	 * @param    {Integer}                  [options.limit]  Amount of results to limit
	 * @param    {Boolean}                  [options.simple=true]  Whether to return simple objects instead of nested. Note: nested calls
	 *                                                        take longer and are database expensive. Use them with care.
	 * @param    {Object}                   [options.query]  Query object
	 * @param    {Function}                 callback Callback function
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DatabaseService.getData({
	 * 	type: "spaces",
	 * 	model: cacheModels[cacheModels.length - 1],
	 * 	simple: true,
	 * 	skip: 0,
	 * 	limit: 1,
	 * 	query: {
	 * 		GlobalId: guids.join("|")
	 * 	}
	 * }, function(err, results) {
	 * 	if(!err){
	 * 		console.log(results);
	 * 	} else {
	 * 		console.error(err);
	 * 	}
	 * });
	 * 
	 */
	DatabaseService.getData = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.project || options.model) {

				var simple = true;

				if (options.hasOwnProperty("simple")) {
					simple = options.simple;
				}

				// Construct base url
				var url = DatabaseService.baseUrl + "/project/id/";

				// Add project id
				url += options.project ? options.project._id : (options.model ? options.model.project._id : "");

				// If model is specified, add model id
				url += options.model ? "/model/id/" + options.model._id : "";

				// Append /data
				url += "/data";

				// Resolve the data type if specified
				url += options.type ? "/" + options.type : "";

				// Add simple if specified (no joins)
				url += simple ? "/simple" : "";

				// Apply skip limit if specified
				if (options.hasOwnProperty("skip") && options.hasOwnProperty("limit")) {
					url += "/skip/" + options.skip + "/limit/" + options.limit;
				}

				// Construct ajax settings
				var settings = {
					"async": true,
					"crossDomain": true,
					"url": url,
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					},
					"data": options.query || {}
				};

				// Make the call
				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getData], No model or project specified");
			}

		});

	};

	DatabaseService.getChildren = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId) {

				if (options.modelId) {

					if (options.GlobalId) {

						var settings = {
							"async": true,
							"crossDomain": true,
							"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/data/guid/" + options.GlobalId + "/children",
							"method": "GET",
							"headers": {
								"user-token": DatabaseService.userToken,
							}
						};

						$.ajax(settings).done(function(response) {
							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
						}).fail(function(error) {
							SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
						});

					} else {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getChildren] No GlobalId specified");
					}

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getChildren] No modelId specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getChildren] No projectId specified");
			}

		});

	};

	/**
	 * Get data by GlobalId
	 *
	 * @access   public
	 * @memberof DatabaseService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-06
	 * @param    {Object}                   options  Options object
	 * @param    {Function}                 callback Callback functions
	 */
	DatabaseService.getByGlobalId = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId) {

				if (options.modelId) {

					if (options.GlobalId) {

						var settings = {
							"async": true,
							"crossDomain": true,
							"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/data/guid/" + options.GlobalId,
							"method": "GET",
							"headers": {
								"user-token": DatabaseService.userToken,
							}
						};

						$.ajax(settings).done(function(response) {
							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
						}).fail(function(error) {
							SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
						});

					} else {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getByGlobalId] No GlobalId specified");
					}

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getByGlobalId] No modelId specified");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getByGlobalId] No projectId specified");
			}

		});

	};

	DatabaseService.getMarkers = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId && options.modelId) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/marker/list",
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getMarkers] No projectId or modelId specified");
			}

		});

	};

	DatabaseService.addMarker = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId && options.modelId && options.marker) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/marker/new",
					"method": "POST",
					"headers": {
						"user-token": DatabaseService.userToken,
						"Content-Type": "application/json",
					},
					"processData": false,
					"data": JSON.stringify(options.marker)
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.addMarker] No projectId, modelId or marker specified");
			}

		});

	};

	DatabaseService.getMarkerById = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId && options.modelId && options.markerId) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/marker/id/" + options.markerId,
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getMarkerById] No projectId, modelId or markerId specified");
			}

		});

	};

	DatabaseService.updateMarker = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId && options.modelId && options.marker) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/marker/id/" + options.marker._id,
					"method": "PUT",
					"headers": {
						"user-token": DatabaseService.userToken,
						"Content-Type": "application/json",
					},
					"processData": false,
					"data": JSON.stringify(options.marker)
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.updateMarker] No projectId, modelId or marker specified");
			}

		});

	};

	DatabaseService.deleteMarkerById = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.projectId && options.modelId && options.markerId) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/project/id/" + options.projectId + "/model/id/" + options.modelId + "/marker/id/" + options.markerId,
					"method": "DELETE",
					"headers": {
						"user-token": DatabaseService.userToken,
						"Content-Type": "application/json",
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(xhr, status, error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.deleteMarkerById] No projectId, modelId or markerId specified");
			}

		});

	};

	DatabaseService.getSession = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (options.id && options.email && options.accessKey && options.sessionKey) {

				var settings = {
					"async": true,
					"crossDomain": true,
					"url": DatabaseService.baseUrl + "/session/id/" + options.id + "/email/" + options.email + "/accesskey/" + options.accessKey + "/sessionkey/" + options.sessionKey,
					"method": "GET",
					"headers": {
						"user-token": DatabaseService.userToken,
					}
				};

				$.ajax(settings).done(function(response) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, response);
				}).fail(function(error) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, error);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DatabaseService.getSession] No id, email, accessKey or sessionKey specified");
			}

		});

	};

	DatabaseService.cancelDaeJsonStream = function(options) {
		DatabaseService.cancelledModelStreams.push(options.modelId);
	};

	DatabaseService.streamDaeJson = function(options, nodeCallback, callback) {

		var oboeWorker = new DatabaseService.OboeWorker();

		var batchSize = options.batchSize || 1;
		var batch = [];

		oboeWorker.onmessage = function(e) {

			if (DatabaseService.cancelledModelStreams.indexOf(options.modelId) !== -1) {
				oboeWorker.terminate();
				DatabaseService.cancelledModelStreams.splice(DatabaseService.cancelledModelStreams.indexOf(options.modelId), 1);
			} else {

				switch (e.data.status) {
					case "error":
						callback(e.data.data);
						break;
					case "in_progress":

						batch.push({
							nodeType: e.data.data.nodeType,
							node: e.data.data.node
						});

						if (batch.length >= batchSize) {
							var tmpBatch = [].concat(batch);
							batch = [];
							setTimeout(function() {
								nodeCallback(tmpBatch);
							}, DatabaseService.streamTimeout || 0);
						}

						break;
					case "done":

						oboeWorker.terminate();

						setTimeout(function() {
							nodeCallback(batch);
						}, DatabaseService.streamTimeout || 0);

						if (DatabaseService.cancelledModelStreams.indexOf(options.modelId) !== -1) {
							DatabaseService.cancelledModelStreams.splice(DatabaseService.cancelledModelStreams.indexOf(options.modelId), 1);
						}

						setTimeout(function() {
							callback(null, e.data.data);
						}, DatabaseService.streamTimeout || 0);

						break;
				}
			}

		};

		oboeWorker.postMessage([{
			oboeConfig: {
				url: DatabaseService.baseUrl + options.location,
				"headers": {
					"user-token": DatabaseService.userToken,
				},
			},
			nodeSelectors: options.nodeSelectors
		}]);

	};

	function addStreamCallback(options) {
		options.stream.node(options.nodeSelector, function(node) {
			setTimeout(function() {
				options.callback(options.nodeType, node);
			});
			// return oboe.drop;
		});
	}

	return DatabaseService;

};

export default DatabaseService;