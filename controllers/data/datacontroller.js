import async from 'async';

/**
 * DataController
 * @namespace
 *
 * @description
 * 
 *
 * ### Introduction
 *
 * The DataController is part of the controller layer of the viewer API SDK. The controller layer
 * makes it easier to integrate the barebone API into your application.
 *
 * What the DataController does is mostyle manageing states for the aplpication. It keeps
 * track of the current project, initialize and destroy views.
 *
 * ### How to use
 *
 * Using the DataController is fairly simple. There are several things you need to know:
 *
 * #### 1. activeProject
 *
 * The Viewer API is based on projects with models. This allows for multiple aspect models
 * to be shown in view. 
 *
 * #### 2. Showing and hiding views.
 *
 * A view is for example the floorplan or the buildingview. With the DataController it is
 * easy to manage these views along with the activeProject. You can destroy, clear and 
 * set activeProjects in any order you like, to allow the user for example to choose 
 * between split view, flooorplan view or buildingview.
 * 
 */
var DataController = function(SlimLabsBimViewer) {

	'use strict';

	var DataController = {
		projects: [],
		models: [],
		activeModels: [],
		storeyMapping: {},
		initializeEventDispatchers: [],
		dataEventDispatchers: [],
		activeDataEventDispatchers: [],
		activeProjectEventDispatchers: [],
		activeModelsEventDispatchers: [],
		storeyMappingEventDispatchers: [],
		activeStoreyMappingEventDispatchers: [],
		modelProgressEventDispatchers: [],
		floorplanRenderedEventDispatchers: [],
		modelRenderedEventDispatchers: [],
		modelStreams: [],
	};

	var DataControllerDefaults = cloneObject(DataController);

	/**
	 * Initialize the DataController. 
	 * 
	 * **Note:** This function is asynchronous, use the callback to make sure the initialization process
	 * has completed.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @param    {Object}                   options  Options object
	 * @param    {Object}                   options.modeloptions A BuildingViewService#init options object. When specified, this method
	 *                                                           calls the DataController.initializeBuildingView method.
	 * @param    {Object}                   options.floorplanoptions A {@link FloorPlanService#init} options object. When speficified,
	 *                                                               this method calls the DataController.initializeFloorPlan method.
	 * @param    {String}                   [options.projectId]  Project id to set active
	 * @param    {Array}                    [options.activeModelIds] List of model ids in the project to set active
	 * @param    {Function}                 [options.activeModelIds] List of model ids in the project to set active
	 * 
	 * @example
	 *
	 * // 1. Initialize all views and set active project
	 * 
	 * SlimLabsBimViewer.DataController.init({
	 *	modeloptions: {
	 *		viewParentId: "modelcontainer",
	 *		backgroundColor: "#fff",
	 *	},
	 *	floorplanoptions: {
	 *		viewParentId: "svg",
	 *		backgroundColor: "#fff",
	 *	},
	 *	projectId: "<Some project id>",
	 * }, function(err) {
	 *	if (!err) {
	 *		console.log("DataController initialized");
	 *	} else {
	 *		console.debug(err);
	 *	}
	 * });
	 *
	 * // 2. Just set an active project and initialize views later
	 * 
	 * SlimLabsBimViewer.DataController.init({
	 *	projectId: "<Some project id>",
	 * }, function(err) {
	 *	if (!err) {
	 *		console.log("DataController initialized");
	 *	} else {
	 *		console.debug(err);
	 *	}
	 * });
	 *
	 * // 3. Just set an active project without a callback
	 * 
	 * SlimLabsBimViewer.DataController.init({
	 *	projectId: "<Some project id>",
	 * });
	 * 
	 */
	DataController.init = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (DataController.url || options.url) {

				if (!DataController.initialized) {

					if (options.url) {
						DataController.setUrl(options.url);
					}

					if (options.userToken) {

						SlimLabsBimViewer.DatabaseService.setUserToken(options.userToken);

						DataController.initialized = true;

						// Set options object
						options = options || {};

						if (options.floorplanoptions) {
							DataController.initializeFloorPlan(options.floorplanoptions);
						}

						if (options.modeloptions) {
							DataController.initializeBuildingView(options.modeloptions);
						}

						setProjects(function(err, projects) {

							if (options.projectId) {

								var activeProject = null;

								// Try to find the id with the specified id
								for (var i = 0; i < projects.length; i++) {
									if (projects[i]._id === options.projectId) {
										activeProject = projects[i];
									}
								}

								if (!activeProject) {
									dispatchInitializeEvents(true);
									SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, "[DataController.init] No project found with id: " + options.projectId);
								} else {

									var subOptions = {
										project: activeProject
									};

									if (options.activeModelIds) {
										subOptions.activeModelIds = options.activeModelIds;
									}

									DataController.setActiveProject(subOptions, function() {
										SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
										dispatchInitializeEvents(true);
									});
								}
							} else {
								SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, "[DataController.init] No projectId found in options");
								dispatchInitializeEvents(true);
							}

						});

					} else {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.init] Please specify userToken in options");
					}

				} else {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.init] BuildingViewService.DataController was already initialized");
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.init] Please set the API url with DataController.setUrl, or specify url in options");
			}

		});

	};

	/**
	 * Clears ALL views. Views that have not been initialized yet, are skipped. Use the 
	 * individual services to clear specific views.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-11-24
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.clear();
	 * 
	 */
	DataController.clear = function() {

		if (SlimLabsBimViewer.BuildingViewService.initialized) {
			SlimLabsBimViewer.BuildingViewService.clear();
		}

		if (SlimLabsBimViewer.FloorPlanService.initialized) {
			SlimLabsBimViewer.FloorPlanService.clear();
		}

	};

	/**
	 * Destroys ALL views. This resets alls views to their initial state and
	 * destroys any DOM elements and event listeners that were created by those
	 * views.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-11-24
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.destroy();
	 * 
	 */
	DataController.destroy = function() {
		SlimLabsBimViewer.BuildingViewService.destroy();
		SlimLabsBimViewer.FloorPlanService.destroy();
		cloneObjectProperties(DataController, DataControllerDefaults);
		DataController.initialized = false;
	};

	/**
	 * Initialize the floorplan. If an active project has been set, the models in
	 * those project will be rendered in view immediately.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-11-06
	 * @param    {Object}                   options FloorPlanService#init options object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.initializeFloorPlan(floorplanoptions);
	 */
	DataController.initializeFloorPlan = function(options) {

		SlimLabsBimViewer.FloorPlanService.init(options).then(function() {

			SlimLabsBimViewer.FloorPlanService.registerClickedElementCallback(function(type, guids) {
				if (!type) {
					DataController.setActiveData(null, null);
				} else {
					DataController.setActiveData(type + "s", guids);
				}
			});

			if (DataController.activeModels) {
				handleActiveModelsForFloorPlan();
			}

		}).catch(function(err) {
			SlimLabsBimViewer.LoggerService.warn("[DataController.initializeFloorPlan]" + err);
		});

	};

	/**
	 * Initialize the buildingview. If an active project has been set, the models in
	 * those project will be rendered in view immediately.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-11-06
	 * @param    {Object}                   options BuildingViewService#init options object
	 *
	 * @example
	 *
	 * * SlimLabsBimViewer.DataController.initializeBuildingView(modelviewoptions);
	 */
	DataController.initializeBuildingView = function(options) {

		options.enableSections = true;
		options.antialias = false;
		options.precision = "lowp";

		SlimLabsBimViewer.BuildingViewService.init(options).then(function(err, val) {

			if (err) {
				console.debug("[DataController.initializeBuildingView]" + err);
			} else {
				SlimLabsBimViewer.BuildingViewService.registerClickedElementCallback(function(type, data) {
					DataController.setActiveData(type, data);
				});

				if (DataController.activeModels) {
					handleActiveModelsForBuildingView();
				}
			}

		}).catch(function(err) {
			SlimLabsBimViewer.LoggerService.warn("[DataController.initializeBuildingView]" + err);
		});

	};

	/**
	 * Register a new data callback. Will fire an if either on the floorplan or in the
	 * modelview an object is selected. 
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @param    {Function}                 callback Callback function
	 * @return   {Array}                   		 	 Data Array
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.registerDataCallback(function(data) {
	 * console.log("[DataController] dataCallback: " + data);
	 * });
	 */
	DataController.registerDataCallback = function(callback) {
		DataController.dataEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a new active guid callback. This differs from the data callback
	 * in that this only returns the active guid instead of the data object 
	 * returned from the database.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2018-02-08
	 * @param    {Function}                 callback The callback function
	 * @return   {Object}                            Object containing a guid and type field
	 */
	DataController.registerActiveDataCallback = function(callback) {
		DataController.activeDataEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a callback for when the active project changes
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2018-03-28
	 * @param    {Function}                 callback Callback function to run
	 */
	DataController.registerActiveProjectCallback = function(callback) {
		DataController.activeProjectEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a callback for when the active models change
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2018-03-28
	 * @param    {Function}                 callback Callback function to run
	 */
	DataController.registerActiveModelsCallback = function(callback) {
		DataController.activeModelsEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a new storey mapping callback
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @param    {Function}                 callback Callback function
	 * @return   {Object}                   		 Storey Mapping object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.registerStoreyMappingCallback(function(mapping) {
	 *	console.log("[DataController] storeyMappingCallback: " + mapping);
	 * });
	 */
	DataController.registerStoreyMappingCallback = function(callback) {
		DataController.storeyMappingEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a new active storey mapping callback
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @param    {Function}                 callback Callback function
	 * @return   {Object}                   		 Storey Mapping object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.registerStoreyMappingCallback(function(mapping) {
	 *	console.log("[DataController] storeyMappingCallback: " + mapping);
	 * });
	 */
	DataController.registerActiveStoreyMappingCallback = function(callback) {
		DataController.activeStoreyMappingEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a new initialize callback
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @param    {Function}                 callback Callback function
	 * @return   {Boolean}                   		 Whether or not the DataController has finished initializing
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.registerInitializedCallback(function(bool) {
	 *	console.log("[DataController] registerInitializedCallback", bool);
	 * });
	 */
	DataController.registerInitializedCallback = function(callback) {
		DataController.initializeEventDispatchers.push(callback);
		return DataController;
	};


	DataController.registerFloorPlanRenderedCallback = function(callback) {
		DataController.floorplanRenderedEventDispatchers.push(callback);
		return DataController;
	};

	DataController.registerModelRenderedCallback = function(callback) {
		DataController.modelRenderedEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Register a new modelProgress callback
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-12-13
	 * @param    {Function}                 callback Callback function
	 * @return   {Float}                             Number between 0 and 1
	 */
	DataController.registerModelProgressCallback = function(callback) {
		DataController.modelProgressEventDispatchers.push(callback);
		return DataController;
	};

	/**
	 * Set the URL of the SlimLabs BIM API.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @param    {String}                   url The API URL
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.setUrl(baseUrl);
	 */
	DataController.setUrl = function(url) {
		DataController.url = url;
		SlimLabsBimViewer.DatabaseService.setUrl(url);
		SlimLabsBimViewer.FileService.setUrl(url);
	};

	/**
	 * Get the current url
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @return   {String}                   The API url
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.getUrl();
	 */
	DataController.getUrl = function() {
		return DataController.url;
	};

	/**
	 * Set the projects
	 *
	 * @access   private
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback when projects are fetched
	 */
	function setProjects(callback) {
		SlimLabsBimViewer.DatabaseService.getProjects({}, function(err, projects) {

			// Set property
			DataController.projects = projects;

			// run callback
			if (callback) {
				callback(err, projects);
			}
		});
	}

	/**
	 * Get the current projects
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @return   {Array}                   List of projects
	 *
	 * @example
	 *
	 * var projects = SlimLabsBimViewer.DataController.getProjects();
	 *
	 * console.log(projects);
	 */
	DataController.getProjects = function() {
		return DataController.projects;
	};

	/**
	 * Set active project by its _id
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2018-01-15
	 * @param    {Object}                   options  Options object
	 * @param    {String}                   options.projectId  Some project _id
	 * @param    {String}                   options.clearView  Whether to clear the view
	 * @param    {Array}                    options.activeModelIds  A list of ids to set active
	 * @param    {Function}                 callback Callback function
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.setActiveProjectById({
	 *  id: "Some project _id"
	 * }, function(){
	 * 	console.log("[DataController] set active project done");
	 * });
	 */
	DataController.setActiveProjectById = function(options, callback) {

		resetProjectStates();

		if (options.clearView) {
			DataController.clear();
		}

		return new Promise(function(resolve, reject) {

			// Allow for options to be a projectId
			if (options.constructor === String) {
				options = {
					projectId: options
				};
			}

			if (options.projectId) {

				if (DataController.projects) {

					var project;

					for (var i = 0; i < DataController.projects.length; i++) {
						if (DataController.projects[i]._id === options.projectId) {
							project = DataController.projects[i];
						}
					}

					if (project) {

						DataController.setActiveProject({
							project: project,
							activeModelIds: options.activeModelIds
						}, function() {
							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
						});

					} else {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.setActiveProjectById] No project found with id: " + options.projectId);
					}

				} else {

					DatabaseService.getProjectById({
						id: options.projectId
					}, function(err, project) {
						if (err) {
							SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.setActiveProjectById] Something went wrong setting active project: " + err);
						} else if (project) {
							DataController.setActiveProject({
								project: project,
								activeModelIds: options.activeModelIds
							}, function() {
								SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
							});
						} else {
							SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.setActiveProjectById] No project found with id: " + options.projectId);
						}
					});

				}
			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(reject, callback, "[DataController.setActiveProjectById] Specify projectId in the options");
			}

		});

	};

	/**
	 * Set the current active project
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @param    {Object}                   options Options object
	 * @param    {Object}                   options.project SlimLabsBimViewer project object
	 * @param    {String}                   options.clearView  Whether to clear the view
	 * @param    {Array}                    options.activeModelIds  A list of ids to set active
	 * @param 	 {Function}					callback Callback function
	 *
	 * @example
	 * 
	 * SlimLabsBimViewer.DataController.setActiveProject({
	 * 	project: {...},
	 * 	activeModelIds: ["...", "..."]
	 * }, function() {
	 *	console.log("Done");
	 * });
	 */
	DataController.setActiveProject = function(options, callback) {

		resetProjectStates();

		if (options.clearView) {
			DataController.clear();
		}

		return new Promise(function(resolve, reject) {

			if (options.project.constructor === Object) {

				DataController.activeProject = options.project;
				dispatchActiveProjectEvents(DataController.activeProject);

				setModels({
					models: options.project.models,
					activeModelIds: options.activeModelIds
				}, function() {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[DataController.setActiveProject] options.project is not an Object. If you want to set an active project by id, use DataController.setActiveProject.setActiveProjectById");
			}

		});

	};

	DataController.unsetActiveProject = function(callback) {

		return new Promise(function(resolve, reject) {

			// DataController.activeProject = null;
			resetProjectStates();
			dispatchActiveProjectEvents(DataController.activeProject);


			SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

		});

	};

	/**
	 * Get the current active project
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @return   {Object}                   SlimLabs Building viewer project object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.getActiveProject();
	 */
	DataController.getActiveProject = function() {
		return DataController.activeProject;
	};

	DataController.clearActiveProjects = function() {
		resetProjectStates();
	};

	/**
	 * Set the current active models.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @param    {Array}                   models List of models
	 */
	function setModels(options, callback) {

		if (options.models) {

			DataController.models = options.models;

			var models = options.models;

			// Check if the activeModels field is specified
			if (options.activeModelIds) {

				models = [];

				// Gather the models to set active
				for (var i = 0; i < options.models.length; i++) {
					for (var j = 0; j < options.activeModelIds.length; j++) {
						if (options.models[i]._id === options.activeModelIds[j]) {
							models.push(options.models[i]);
						}
					}
				}

			}

			DataController.setActiveModels({
				models: models
			}).then(function() {
				callback();
			});

		} else {
			SlimLabsBimViewer.LoggerService.debug("[DataController.setModels] Specify the models in the options");
			callback("[DataController.setModels] Specify the models in the options");
		}

	}

	/**
	 * Get the current models
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-16
	 * @return   {Array}                   Array of SlimLabs Building viewer model objects
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.getModels();
	 */
	DataController.getModels = function() {
		return DataController.models;
	};

	/**
	 * Set the current active models.
	 * 
	 * **NOTE**: We do not run DataController.clear, FloorPlanService.clear or 
	 * BuildingViewService.clear! You may load multiple copies of a model
	 * if you do not clear views.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-17
	 * @param    {Array}                   models Array of model objects
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.setActiveModels({
	 *	models: models
	 * }, function() {
	 *	console.log("Done");
	 * });
	 */
	DataController.setActiveModels = function(options, callback) {

		return new Promise(function(resolve, reject) {

			var models = [];

			async.each(options.models, function(model, callback) {
				SlimLabsBimViewer.DatabaseService.getModelById({
					projectId: model.project._id,
					modelId: model._id
				}, function(err, model) {

					if (!err) {
						models.push(model);
					}

					if (callback) {
						callback(err);
					}

				});
			}, function(err) {
				DataController.activeModels = models;
				dispatchActiveModelsEvents(DataController.activeModels);
				handleNewActiveModels();
				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, models);
			});

		});

	};

	/**
	 * Clear all active models
	 *
	 * **NOTE:** Will not clear views! Just the model state
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-17
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.clearActiveModels();
	 */
	DataController.clearActiveModels = function() {
		DataController.setActiveModels([]);
		handleNewActiveModels();
	};

	/**
	 * Add a model to the active models
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-17
	 * @param    {Object}                   model Model object
	 *
	 * SlimLabsBimViewer.DataController.addActiveModel({...});
	 */
	DataController.addActiveModel = function(model) {

		var found = false;

		for (var i = 0; i < DataController.activeModels.length; i++) {
			if (model._id === DataController.activeModels[i]._id) {
				found = true;
			}
		}

		if (!found) {
			DataController.activeModels.push(model);
			handleNewActiveModels();
		}

	};

	/**
	 * Remove a model from the active model array by id. Does not fail if the 
	 * id is not in the array.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-17
	 * @param    {String}                   modelId Id of the to remove model
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.removeActiveModel("...");
	 */
	DataController.removeActiveModel = function(modelId) {

		var i = DataController.activeModels.length;

		while (i--) {
			if (DataController.activeModels[i]._id === modelId) {
				DataController.activeModels.splice(i, 1);
				SlimLabsBimViewer.BuildingViewService.removeModel({
					modelId: modelId
				});
			}
		}

		handleNewActiveModels();

	};

	/**
	 * Get the current stories. Each key has the name of the aggregated floor plans. So if for example 2 models
	 * have a storey with the name "01", they will be put in the list under key "01". This way, we can make it so
	 * that we combine the different floor plans from different models.
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @return   {Object}                   Object containing storey numbers as keys with all stories from
	 *                                             the models gathered.
	 *
	 * @example
	 *
	 *
	 * SlimLabsBimViewer.DataController.getStoreys();
	 *
	 * // {
	 * //	-1: [{...}, ...],
	 * //	00: [{...}, ...],
	 * //	01: [{...}, ...],
	 * //	02: [{...}, ...],
	 * // }
	 * 
	 */
	DataController.getStoreys = function() {
		return DataController.storeyMapping;
	};

	/**
	 * Get the active storey
	 *
	 * @access   public
	 * @memberof public
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @return   {Object}                   Active storey map
	 *
	 * @example
	 *
	 *
	 * SlimLabsBimViewer.DataController.getActiveStorey();
	 *
	 * // {
	 * // 	name: "00",
	 * //	storeys: [{...}, ...],
	 * // }
	 * 
	 */
	DataController.getActiveStorey = function() {
		return DataController.activeStoreyMap;
	};

	/**
	 * Set active storey
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-10-23
	 * @param    {String}                   storeyMappingKey   Key of the storeyMap to set
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.DataController.setActiveStorey("00");
	 * 
	 */
	DataController.setActiveStorey = function(storeyMappingKey) {

		DataController.activeStoreyMap = {
			name: storeyMappingKey,
			storeys: DataController.storeyMapping[storeyMappingKey],
		};

		dispatchActiveStoreyMappingEvents(DataController.activeStoreyMap);

		setFloorPlan(DataController.activeStoreyMap);

	};

	/**
	 * Set active data by element
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2018-04-17
	 * @param    {Object}                   element Database element object (e.g. a door or wall)
	 */
	DataController.setActiveDataByElement = function(element) {
		DataController.setActiveData(DataController.resolveElementType(element), [element.GlobalId]);
	};

	DataController.resolveElementType = function(element) {

		// Default is objects
		var type = "objects";

		// Catch spaces
		if (element.IfcType === "IfcSpace") {
			type = "spaces";
		}

		// Catch markers
		if (element.type === "marker") {
			type = "markers";
		}

		return type;

	};

	/**
	 * Set active data
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-06-04
	 * @param    {String}                   type Type of data "objects"|"spaces"|"markers"
	 * @param    {Array}                    data List of guids
	 */
	DataController.setActiveData = function(type, data) {

		if (data) {
			DataController.activeData = {
				type: type,
				data: data,
			};
		} else {
			return DataController.unsetActiveData();
		}

		dispatchActiveDataEvents(DataController.activeData);

		handleActiveData(DataController.activeData.type, DataController.activeData.data);

		return DataController;

	};

	DataController.unsetActiveData = function() {

		DataController.activeData = null;
		dispatchActiveDataEvents(DataController.activeData);
		handleActiveData();

	};

	/**
	 * Get the current active data
	 *
	 * @access   public
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-06-04
	 * @return   {Object}                            Current active data object
	 */
	DataController.getActiveData = function(callback) {
		return DataController.activeData;
	};

	/*********************************
				HELPERS
	*********************************/

	function handleActiveModelsForBuildingView(callback) {

		if (SlimLabsBimViewer.BuildingViewService.initialized) {

			var progress = {};

			async.waterfall([

				function(callback) {

					var currentModelIds = SlimLabsBimViewer.BuildingViewService.getModelIds();
					var newModels = [];

					async.each(DataController.activeModels, function(activeModel, callback) {
						if (currentModelIds.indexOf(activeModel._id) === -1) {
							newModels.push(activeModel);
						}
						callback();
					}, function(err) {
						callback(err, newModels);
					});

				},

				function(newModels, callback) {

					var modelLength = newModels.length;

					async.eachSeries(newModels, function(model, callback) {

						SlimLabsBimViewer.LoggerService.debug("[DataController.handleActiveModelsForBuildingView] Adding model to 3D view");

						var callbackSend = false;

						addModelToBuildingView(model, function(err) {

						}, function(modelId, modelProgress) {

							var mainProgress = 0;
							progress[modelId] = modelProgress;

							for (var modelKey in progress) {
								mainProgress += progress[modelKey] / modelLength;
							}

							dispatchModelProgressEvents(mainProgress);

							if (modelProgress === 1 && !callbackSend) {
								callbackSend = true;
								setTimeout(function() {
									callback();
								}, 16); // 60 fps
							}

						});

					}, function(err) {
						if (callback) {
							callback(err);
						}
					});

				},

			], function(err) {

			});

		} else {
			callback();
		}

	}

	function cancelModelStreams() {
		for (var i = DataController.modelStreams.length - 1; i >= 0; i--) {
			cancelModelStream(DataController.modelStreams[i]);
		}
		dispatchModelProgressEvents(1);
	}

	function cancelModelStream(modelId) {
		DataController.modelStreams.splice(modelId, 1);
		SlimLabsBimViewer.DatabaseService.cancelDaeJsonStream({
			modelId: modelId,
		});
	}

	function addModelToBuildingView(model, callback, progressCallback) {

		var asset;
		var libraryEffects = [];
		var libraryMaterials = [];
		var libraryVisualSceneNodes = [];

		var geomLength = 0;
		var nodesDone = 0;
		var nodeSize = 0;
		var nodes = [];
		var chunkSize = 150;
		var firstNodes = true;

		function resetNodes() {

			for (var i = nodes.length - 1; i >= 0; --i) {
				nodes[i] = null;
			}

			if (progressCallback) {
				progressCallback(model._id, Math.round(nodeSize / model.daeJson.size * 100) / 100);
			}

			nodes = null;
			nodes = [];
		}

		async.waterfall([

			/////////////////
			// Get objects //
			/////////////////
			function(callback) {
				if (DataController.activeModelsData[model._id]) {
					callback(null, DataController.activeModelsData[model._id].objects);
				} else {
					callback("No data found");
				}
			},

			//////////////////////
			// Get material map //
			//////////////////////
			function(objects, callback) {

				if (model.version < 2) {
					var i = objects.length;
					var objectMaterials = {};

					while (i--) {
						if (objects[i].materials.length === 1) {
							objectMaterials[objects[i].GlobalId] = {
								material: objects[i].materials[0].Name,
								IfcType: objects[i].IfcType
							};
						}
					}

					callback(null, objectMaterials);
				} else {
					callback(null, null);
				}

			},

			////////////////
			// Get spaces //
			////////////////
			function(objectMaterials, callback) {
				callback(null, objectMaterials, DataController.activeModelsData[model._id].spaces);
			},

			function(objectMaterials, spaces, callback) {

				var grossGuids = [];
				var spaceGuids = [];

				for (var i = 0; i < spaces.length; i++) {
					if (spaces[i].LongName) {
						if (spaces[i].LongName.indexOf("gross") !== -1 || spaces[i].LongName.indexOf("bouwlaagoppervlakteobject") !== -1) {
							grossGuids.push(spaces[i].GlobalId);
						} else {
							spaceGuids.push(spaces[i].GlobalId);
						}
					}
				}

				callback(null, {
					objectMaterials: objectMaterials,
					grossGuids: grossGuids,
					spaceGuids: spaceGuids,
				});

			},

			// Process spaces and fetch 3D model
			function(options, callback) {

				var grossGuids = options.grossGuids || [];
				var spaceGuids = options.spaceGuids || [];

				if (model.daeJson) {

					DataController.modelStreams.push(model._id);

					SlimLabsBimViewer.DatabaseService.streamDaeJson({
						batchSize: 10,
						modelId: model._id,
						location: model.daeJson.streamLocation,
						nodeSelectors: [
							{
								selector: "*.asset",
								type: "asset",
							}, {
								selector: "*.library_effects.*",
								type: "library_effect",
							}, {
								selector: "*.library_materials.*",
								type: "library_material",
							}, {
								selector: "*.library_geometries.*",
								type: "library_geometry",
							}, {
								selector: "*.library_visual_scenes.*.nodes.*",
								type: "library_visual_scene_node",
							},
						],
					}, function nodeCallback(nodes) {
						for (var i = 0; i < nodes.length; i++) {
							handleNode(nodes[i].nodeType, nodes[i].node);
						}
					}, function finalCallback(err, data) {
						if (err) {
							SlimLabsBimViewer.LoggerService.warn("[addModelToBuildingView]", err);
							callback(err);
						} else {

							for (var i = 0; i < data.length; i++) {
								if (data[i].type === "library_geometries") {

									if (geomLength && nodesDone === geomLength) {

										if (DataController.activeProject && DataController.activeProject._id === model.project._id) {
											if (DataController.modelStreams.indexOf(model._id) !== -1) {
												SlimLabsBimViewer.BuildingViewService.addObject({
													nodes: nodes,
													modelId: model._id,
													grossguids: grossGuids,
													spaceguids: spaceGuids,
													skipCameraLookat: firstNodes ? false : true,
													clearCache: true,
													generateClippingPlanes: true,
													objectMaterials: options.objectMaterials,
												}, function() {
													resetNodes();
													if (progressCallback) {
														progressCallback(model._id, 1);
													}
													libraryVisualSceneNodes = null;
												});
											}
										}

									}
								}
							}
						}

						if (DataController.modelStreams.indexOf(model._id) !== -1) {
							DataController.modelStreams.splice(DataController.modelStreams.indexOf(model._id), 1);
						}

						callback();

					});

					function handleNode(nodeType, node) {

						nodeSize += JSON.stringify(node).length;

						switch (nodeType) {

							case "asset":

								asset = node;

								break;

							case "library_effect":

								libraryEffects.push(node);

								break;

							case "library_material":

								async.detect(libraryEffects, function(libraryEffect, callback) {
									callback(null, node.effect === libraryEffect.id);
								}, function(err, effect) {
									node.effect = effect;
									libraryMaterials.push(node);
								});

								break;

							case "library_visual_scene_node":

								if (libraryEffects) {
									libraryEffects = null;
								}

								async.eachOf(node.materials, function(nodeMaterial, index, callback) {
									async.detect(libraryMaterials, function(libraryMaterial, callback) {
										callback(null, nodeMaterial === libraryMaterial.id);
									}, function(err, libMaterial) {
										node.materials[index] = libMaterial;
										callback();
									});
								}, function() {
									libraryVisualSceneNodes.push(node);
								});

								break;

							case "library_geometry":

								geomLength++;

								if (libraryMaterials) {
									libraryMaterials = null;
								}

								for (var i = libraryVisualSceneNodes.length - 1; i >= 0; --i) {
									if (libraryVisualSceneNodes[i] && libraryVisualSceneNodes[i].geometry === node.id) {
										libraryVisualSceneNodes[i].geometry = node;
										libraryVisualSceneNodes[i].asset = asset;
										nodes.push(libraryVisualSceneNodes[i]);
										libraryVisualSceneNodes.splice(i, 1);
									}
								}

								nodesDone++;

								if (nodes.length >= chunkSize) {

									if (DataController.activeProject && DataController.activeProject._id === model.project._id) {
										if (DataController.modelStreams.indexOf(model._id) !== -1) {
											SlimLabsBimViewer.BuildingViewService.addObject({
												nodes: nodes,
												modelId: model._id,
												grossguids: grossGuids,
												spaceguids: spaceGuids,
												skipBoundsCalculation: nodesDone === 1 ? false : true,
												skipCameraLookat: firstNodes ? false : true,
												objectMaterials: options.objectMaterials,
											});
										}

										if (firstNodes) {
											firstNodes = false;
										}

										resetNodes();
									}

								}

								break;

						}
					}

				} else if (model.dae) {
					SlimLabsBimViewer.FileService.getFileByPath({
						path: model.dae.streamLocation,
					}, function finalCallback(err, fileContents) {

						if (!err) {

							SlimLabsBimViewer.BuildingViewService.addModel({
								modelxml: fileContents,
								grossguids: grossGuids,
								spaceguids: spaceGuids,
								modelId: model._id
							});

							callback();

						} else {
							callback(err);
						}

					}, function progressCallback(progressEvent) {
						if (progressCallback) {
							progressCallback(model._id, Math.round((progressEvent.loaded / model.dae.size) * 100) / 100);
						}
					});
				} else {
					callback();
				}

			},

		], function(err) {
			callback(err);
		});

	}

	function handleActiveModelsForFloorPlan(callback) {
		if (SlimLabsBimViewer.FloorPlanService.initialized) {
			DataController.storeyMapping = {};
			async.each(DataController.activeModels, function(model, callback) {
				addModelToFloorPlan(model, function(err) {
					callback(err);
				});
			}, function(err) {
				if (callback) {
					callback(err);
				}
			});
		}
	}

	function addModelToFloorPlan(model, callback) {
		SlimLabsBimViewer.DatabaseService.getData({
			type: "storeys",
			model: model,
			simple: true,
		}, function(err, storeys) {
			generateFloorPlanMapping(storeys);
			callback(err, storeys);
		});
	}

	function handleNewActiveModels() {

		var newActiveModels = [];

		if (DataController.activeModels && Array.isArray(DataController.activeModels) && DataController.activeModels.length > 0) {

			var startTime = new Date().getTime();

			dispatchModelProgressEvents(0.01);

			async.waterfall([

				function(callback) {
					if (!DataController.activeModelsData) {
						DataController.activeModelsData = {};
					}
					callback();
				},

				function(callback) {

					// generate model id list
					var modelIds = DataController.activeModels.map(function(model) {
						return model._id;
					});

					// Check if the modeldata is still needed
					async.eachOf(DataController.activeModelsData, function(value, key, callback) {
						if (modelIds.indexOf(key) === -1) {
							delete DataController.activeModelsData[key];
						}
						callback();
					}, function(err) {
						callback(err);
					});

				},

				function(callback) {

					async.each(DataController.activeModels, function(model, callback) {
						if (!DataController.activeModelsData[model._id]) {
							newActiveModels.push(model);
							DataController.activeModelsData[model._id] = {};
						}
						callback();
					}, function(err) {
						callback(err);
					});

				},

				///////////////////////////
				// Set model id variable //
				///////////////////////////
				function(callback) {

					async.each(newActiveModels, function(model, callback) {
						DataController.activeModelsData[model._id] = {};
						callback();
					}, function(err) {
						callback(err);
					});

				},

				/////////////////////////////////////
				// Determine highest model version //
				/////////////////////////////////////
				function(callback) {

					var lowestModelVersion;

					async.each(newActiveModels, function(model, callback) {
						if (!lowestModelVersion || model.version < lowestModelVersion) {
							lowestModelVersion = model.version;
						}
						callback();
					}, function(err) {
						callback(null, lowestModelVersion);
					});

				},

				/////////////////////////////////////
				// Process models based on version //
				/////////////////////////////////////
				function(lowestModelVersion, callback) {

					switch (lowestModelVersion) {
						case 2:

							async.waterfall([

								////////////////
								// Get spaces //
								////////////////
								function(callback) {

									async.each(newActiveModels, function(model, callback) {
										SlimLabsBimViewer.DatabaseService.getData({
											type: "spaces",
											model: model,
											simple: true,
										}, function(err, spaces) {
											if (!err) {
												DataController.activeModelsData[model._id].spaces = spaces;
												callback();
											} else {
												callback(err);
											}
										});
									}, function(err) {
										callback(err);
									});

								},

								//////////////////////////////////////
								// Start model load and get objects //
								//////////////////////////////////////
								function(callback) {

									async.parallel([

										function(callback) {
											handleActiveModelsForBuildingView(function() {
												callback();
											});
										},

										function(callback) {

											async.waterfall([

												function(callback) {
													async.each(newActiveModels, function(model, callback) {
														SlimLabsBimViewer.DatabaseService.getData({
															type: "objects",
															model: model,
															simple: true,
														}, function(err, objects) {
															if (!err) {
																DataController.activeModelsData[model._id].objects = objects;
																callback(null);
															} else {
																callback(err);
															}
														});
													}, function(err) {
														callback(err);
													});
												},

												///////////////////
												// Set FloorPlan //
												///////////////////
												function(callback) {
													handleActiveModelsForFloorPlan(function() {
														callback();
													});
												},

											], function(err) {
												callback(err);
											});

										},

									], function(err) {
										callback(err);
									});

								},

							], function(err) {
								callback(err);
							});

							break;
						default:

							async.waterfall([

								////////////////////////////
								// Get objects and spaces //
								////////////////////////////
								function(callback) {

									async.each(newActiveModels, function(model, callback) {

										async.parallel([

											function(callback) {

												var options = {
													type: "objects",
													model: model,
													simple: false,
													query: {
														_joinfields: [
															"materials"
														].join(",")
													}
												};

												SlimLabsBimViewer.DatabaseService.getData(options, function(err, objects) {
													if (!err) {
														DataController.activeModelsData[model._id].objects = objects;
														callback(null);
													} else {
														callback(err);
													}
												});

											},

											function(callback) {

												SlimLabsBimViewer.DatabaseService.getData({
													type: "spaces",
													model: model,
													simple: true,
												}, function(err, spaces) {

													if (!err) {
														DataController.activeModelsData[model._id].spaces = spaces;
														callback(null);
													} else {
														callback(err);
													}

												});

											},

										], function(err) {
											callback(err);
										});

									}, function(err) {
										callback(err);
									});
								},

								/////////////////////////////
								// Set FloorPlan and model //
								/////////////////////////////
								function(callback) {
									async.parallel([

										function(callback) {
											handleActiveModelsForBuildingView(function() {
												callback();
											});
										},

										function(callback) {
											handleActiveModelsForFloorPlan(function() {
												callback();
											});
										},

									], function(err) {
										callback(err);
									});
								}

							], function(err) {
								callback(err);
							});

							break;
					}

				},

			], function(err) {
				SlimLabsBimViewer.LoggerService.debug("[DataController.handleNewActiveModels] Handling active models took: " + (new Date().getTime() - startTime) + " ms");
			});

		}

	}

	function generateFloorPlanMapping(storeys) {

		var sortedStoreys = storeys.sort(function(a, b) {
			return a.Elevation - b.Elevation;
		});

		for (var i = 0; i < sortedStoreys.length; i++) {

			var tempStorey = sortedStoreys[i];
			var twoChar = tempStorey.Name.charAt(0) + tempStorey.Name.charAt(1);

			if (!isNaN(twoChar)) {
				addStoreyToMapping(twoChar, tempStorey);
			} else {
				addStoreyToMapping(tempStorey.Name, tempStorey);

				// Insert height logic here afterwards
			}

		}

		resolveStorey();

		function addStoreyToMapping(name, storey) {

			if (DataController.storeyMapping[name]) {
				DataController.storeyMapping[name].push(storey);
			} else {
				DataController.storeyMapping[name] = [storey];
			}

			dispatchStoreyMappingEvents(DataController.storeyMapping);

		}

	}

	function setFloorPlan(activeStoreyMap) {

		var planSpaces = [];
		var planObjects = [];

		async.each(activeStoreyMap.storeys, function(storey, callback) {

			var model;

			for (var i = 0; i < DataController.getModels().length; i++) {
				if (DataController.getModels()[i]._id === storey.modelId) {
					model = DataController.getModels()[i];
				}
			}

			if (model) {

				async.parallel([

					function(callback) {

						for (var i = 0; i < DataController.activeModelsData[model._id].objects.length; i++) {
							if (DataController.activeModelsData[model._id].objects[i].buildingstorey === storey.viewerId) {
								planObjects.push(DataController.activeModelsData[model._id].objects[i]);
							}
						}
						callback();

					},

					function(callback) {

						for (var i = 0; i < DataController.activeModelsData[model._id].spaces.length; i++) {
							if (DataController.activeModelsData[model._id].spaces[i].buildingstorey === storey.viewerId) {
								planSpaces.push(DataController.activeModelsData[model._id].spaces[i]);
							}
						}
						callback();

					},

				], function(err) {
					callback(err);
				});

			} else {
				callback();
			}

		}, function(err) {
			if (SlimLabsBimViewer.FloorPlanService.initialized) {

				async.parallel([

					function(callback) {
						SlimLabsBimViewer.FloorPlanService.setObjects(planObjects, function() {
							callback();
						});
					},

					function(callback) {
						SlimLabsBimViewer.FloorPlanService.setSpaces(planSpaces, null, function() {
							callback();
						});
					},

				], function(err) {
					dispatchFloorplanRenderedEvents();
				});

			}
		});

	}

	function handleActiveData(type, data) {

		if (data && data.length > 0) {

			switch (type) {
				case "markers":

					DataController.activeDataElements = {
						type: type,
						data: data
					};

					dispatchDataEvents(DataController.activeDataElements);

					break;

				default:

					SlimLabsBimViewer.DatabaseService.getData({
						project: DataController.activeProject,
						simple: false,
						query: {
							GlobalId: data.join("|")
						}
					}, function(err, results) {

						DataController.activeDataElements = {
							type: type,
							data: results
						};

						dispatchDataEvents(DataController.activeDataElements);

					});
			}

		} else {
			DataController.activeDataElements = null;
			dispatchDataEvents(DataController.activeDataElements);
		}
	}

	function dispatchDataEvents(data) {
		for (var i = 0; i < DataController.dataEventDispatchers.length; i++) {
			DataController.dataEventDispatchers[i](data);
		}
	}

	function dispatchActiveDataEvents(data) {
		for (var i = 0; i < DataController.activeDataEventDispatchers.length; i++) {
			DataController.activeDataEventDispatchers[i](data);
		}
	}

	function dispatchActiveProjectEvents(project) {
		for (var i = 0; i < DataController.activeProjectEventDispatchers.length; i++) {
			DataController.activeProjectEventDispatchers[i](project);
		}
	}

	function dispatchActiveModelsEvents(models) {
		for (var i = 0; i < DataController.activeModelsEventDispatchers.length; i++) {
			DataController.activeModelsEventDispatchers[i](models);
		}
	}

	function dispatchInitializeEvents(boolean) {
		for (var i = 0; i < DataController.initializeEventDispatchers.length; i++) {
			DataController.initializeEventDispatchers[i](boolean);
		}
	}

	function dispatchStoreyMappingEvents(storeyMapping) {
		for (var i = 0; i < DataController.storeyMappingEventDispatchers.length; i++) {
			DataController.storeyMappingEventDispatchers[i](storeyMapping);
		}
	}

	function dispatchActiveStoreyMappingEvents(activeStoreyMap) {
		for (var i = 0; i < DataController.activeStoreyMappingEventDispatchers.length; i++) {
			DataController.activeStoreyMappingEventDispatchers[i](activeStoreyMap);
		}
	}

	function dispatchModelProgressEvents(loaded) {
		for (var i = 0; i < DataController.modelProgressEventDispatchers.length; i++) {
			DataController.modelProgressEventDispatchers[i](loaded);
		}
	}

	function dispatchFloorplanRenderedEvents() {
		for (var i = 0; i < DataController.floorplanRenderedEventDispatchers.length; i++) {
			DataController.floorplanRenderedEventDispatchers[i]();
		}
	}

	function dispatchModelRenderedEvents() {
		for (var i = 0; i < DataController.modelRenderedEventDispatchers.length; i++) {
			DataController.modelRenderedEventDispatchers[i]();
		}
	}

	function resetProjectStates() {
		cancelModelStreams();
		DataController.activeProject = null;
		DataController.setActiveModels([]);
		DataController.storeyMapping = {};
	}

	/**
	 * Resolves the 'bottom' storey
	 *
	 * @access   private
	 * @memberof DataController
	 * @author Wouter Coebergh <wco@slimlabs.nl>
	 * @date     2017-01-03
	 * @param    {Array}                   storeys Storeys to determine the most bottom one in
	 */
	function resolveStorey() {

		var found = false;

		for (var storeyName in DataController.storeyMapping) {
			if (storeyName === "00 begane grond" || storeyName === "00" || storeyName === "00 ") {
				DataController.setActiveStorey(storeyName, DataController.storeyMapping[storeyName]);
				found = true;
			}
		}

		if (!found) {
			for (var storeyName in DataController.storeyMapping) {
				DataController.setActiveStorey(storeyName, DataController.storeyMapping[storeyName]);
				break;
			}
		}

	}

	function cloneObject(source) {
		return $.extend(true, {}, source);
	}

	function cloneObjectProperties(target, source) {
		var tmpSource = cloneObject(source);
		for (var key in tmpSource) {
			target[key] = tmpSource[key];
		}
	}

	return DataController;

};

export default DataController;