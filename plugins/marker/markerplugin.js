var async = require("async");

/**
 * MarkerPlugin
 * @namespace
 *
 * @description
 * 
 *
 * ### Introduction
 *
 * When enabled, the MarkerPlugin will make sure that 1) all markers of a project are rendered in view, 
 * 2) will create dummy markers based on the clicks of the user, 3) allow you to persist a dummy marker 
 * to the database. 
 * 
 */
var MarkerPlugin = function(SlimLabsBimViewer) {



	'use strict';



	//////////
	// Init //
	//////////



	var MarkerPlugin = {
		enabled: false,
		newMarkerEventDispatchers: []
	};



	////////////
	// Events //
	////////////


	// Listen for model progress load
	SlimLabsBimViewer.DataController.registerModelProgressCallback(function(progress) {
		if (progress === 1) {
			processActiveModels();
		}
	});

	// Listen for active storey mapping
	SlimLabsBimViewer.DataController.registerActiveStoreyMappingCallback(function(storeyMapping) {
		if (storeyMapping) {
			MarkerPlugin.activeStoreyMapTime = new Date().getTime();
			processMarkersForFloorPlan();
		}
	});

	// Set active models
	SlimLabsBimViewer.DataController.registerActiveModelsCallback(function(models) {
		MarkerPlugin.activeModels = models;
	});

	// Register clicked points
	SlimLabsBimViewer.BuildingViewService.registerClickedPointCallback(function(event, point, guid) {
		if (MarkerPlugin.enabled) {
			point.z = point.z * -1;
			handlePointCallback({
				event: event,
				point: point,
				guid: guid
			});
		}
	});

	SlimLabsBimViewer.FloorPlanService.registerClickedPointCallback(function(event, point, guid) {
		if (MarkerPlugin.enabled) {
			var elevation = 0;
			for (var i = 0; i < SlimLabsBimViewer.DataController.activeStoreyMap.storeys.length; i++) {
				if (SlimLabsBimViewer.DataController.activeStoreyMap.storeys[i].Elevation && SlimLabsBimViewer.DataController.activeStoreyMap.storeys[i].Elevation > elevation) {
					elevation = SlimLabsBimViewer.DataController.activeStoreyMap.storeys[i].Elevation;
				}
			}
			point.z = point.y;
			point.y = elevation / 1000 + 1; // Convert millis to meters and add meter height
			handlePointCallback({
				event: event,
				point: point,
				guid: guid
			});
		}
	});



	///////////////
	// Functions //
	///////////////


	/**
	 * Enable the marker plugin, this will add all markers of the 
	 * current activeProject to view.
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @return   {Object}                   MarkerPlugin
	 */
	MarkerPlugin.enable = function() {
		this.enabled = true;
		processActiveModels();
		return MarkerPlugin;
	};

	/**
	 * Disable the marker plugin, this will remove all markers from view
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @return   {Object}                   MarkerPlugin
	 */
	MarkerPlugin.disable = function() {
		this.enabled = false;
		clearMarkersFromViews();
		return MarkerPlugin;
	};

	/**
	 * Toggle the marker plugin
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @return   {Object}                   MarkerPlugin
	 */
	MarkerPlugin.toggle = function() {

		if (this.enabled) {
			MarkerPlugin.disable();
		} else {
			MarkerPlugin.enable();
		}

		return MarkerPlugin;
	};

	/**
	 * Register a new marker callback. Can be used as a hook to add markers to a model. 
	 * Will convert any click into a dummy marker object. You can persist this (altered) 
	 * dummy marker to the database by using {@link MarkerPlugin.addMarker}.
	 *
	 * Dummy markers will be created based on the point the user clicks on; e.g. the edge
	 * of a wall. The SDK will calculate the point and create a dummy marker based on that
	 * point.
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @param    {Function}                 callback Callback to run when a temporary marker is created.
	 */
	MarkerPlugin.registerNewMarkerCallback = function(callback) {
		MarkerPlugin.newMarkerEventDispatchers.push(callback);
		return MarkerPlugin;
	};

	/**
	 * Add a marker to the database. Use {@link MarkerPlugin.registerNewMarkerCallback} to
	 * listen for dummy markers. 
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @param    {Object}                   options 				Options object
	 * @param    {Object}                   options.marker 			Marker object
	 * @param    {Boolean}                  options.skipObjectLink	Whether to link the marker to the object or not
	 */
	MarkerPlugin.addMarker = function(options, callback) {

		SlimLabsBimViewer.LoggerService.log("Create marker", options.marker);

		return new Promise(function(resolve, reject) {

			async.waterfall([

				function(callback) {
					if (options.marker) {
						callback();
					} else {
						callback("[MarkerPlugin.addMarker] No marker in options");
					}
				},

				function(callback) {
					if (options.marker.GlobalId) {
						callback();
					} else {
						callback("[MarkerPlugin.addMarker] No GlobalId found in marker");
					}
				},

				function(callback) {
					SlimLabsBimViewer.DatabaseService.getData({
						project: SlimLabsBimViewer.DataController.activeProject,
						simple: true,
						query: {
							GlobalId: options.marker.GlobalId
						}
					}, function(err, results) {
						if (!err) {
							callback(null, results);
						} else {
							callback("[MarkerPlugin.addMarker] Something went wrong retreiving item for marker:", err);
						}
					});
				},

				function(results, callback) {
					if (results && Array.isArray(results) && results.length > 0) {
						callback(null, results[0]);
					} else {
						callback("[MarkerPlugin.addMarker] No object found for GlobalId:", options.marker.GlobalId);
					}
				},
				function(element, callback) {
					if (options.skipObjectLink) {
						delete options.marker.GlobalId;
					}
					callback(null, element);
				},

				function(element, callback) {
					SlimLabsBimViewer.DatabaseService.addMarker({
						projectId: element.projectId,
						modelId: element.modelId,
						marker: options.marker
					}, function(err, marker) {
						callback(err, marker);
					});
				},

			], function(err, marker) {

				if (err) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, marker);
				} else {
					processActiveModels();
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, err);
				}

			});

		});

	};

	/**
	 * Update a marker
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @param    {Object}                   marker 	Marker object
	 */
	MarkerPlugin.updateMarker = function(marker, callback) {

		SlimLabsBimViewer.LoggerService.log("[MarkerPlugin.updateMarker] Update marker: " + marker);

		return new Promise(function(resolve, reject) {

			async.waterfall([

				function(callback) {
					if (marker) {
						callback();
					} else {
						callback("[MarkerPlugin.updateMarker] Marker is undefined");
					}
				},

				function(callback) {

					SlimLabsBimViewer.DatabaseService.updateMarker({
						marker: marker,
						modelId: marker.model._id,
						projectId: marker.model.project._id
					}, function(err, result) {

						if (!err) {
							callback(null, result);
						} else {
							callback("[MarkerPlugin.updateMarker] Something went wrong updateing marker: " + err);
						}
					});
				},

			], function(err, marker) {

				if (err) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, marker);
				} else {
					processActiveModels();
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, err);
				}

			});

		});

	};

	/**
	 * Remove a marker
	 *
	 * @access   public
	 * @memberof MarkerPlugin
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-28
	 * @param    {Object}                   marker Marker object
	 */
	MarkerPlugin.removeMarker = function(marker, callback) {

		SlimLabsBimViewer.LoggerService.log("[MarkerPlugin.removeMarker] Remove marker: " + marker);

		return new Promise(function(resolve, reject) {

			async.waterfall([

				function(callback) {
					if (marker) {
						callback();
					} else {
						callback("[MarkerPlugin.removeMarker] Marker is undefined");
					}
				},

				function(callback) {
					SlimLabsBimViewer.DatabaseService.deleteMarkerById({
						markerId: marker._id,
						modelId: marker.model._id,
						projectId: marker.model.project._id
					}, function(err, result) {
						if (!err) {
							callback(null, result);
						} else {
							callback("[MarkerPlugin.removeMarker] Something went wrong removing marker: " + err);
						}
					});
				},

			], function(err, result) {

				if (err) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, result);
				} else {
					processActiveModels();
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, err);
				}

			});

		});

	};



	/////////////
	// Helpers //
	/////////////

	function handlePointCallback(options) {

		if (MarkerPlugin.enabled) {

			var marker = createDummyMarker({
				position: options.point,
				GlobalId: options.guid
			});
			dispatchNewMarkerCallbacks(options.event, marker);

		}

	}


	function processActiveModels() {

		MarkerPlugin.lastProcessActiveModelsTime = new Date().getTime();
		var tmpTime = MarkerPlugin.lastProcessActiveModelsTime;

		MarkerPlugin.activeModelsMarkers = [];

		async.each(MarkerPlugin.activeModels, function(model, callback) {

			SlimLabsBimViewer.DatabaseService.getMarkers({
				projectId: model.project._id,
				modelId: model._id
			}, function(err, markers) {

				if (tmpTime === MarkerPlugin.lastProcessActiveModelsTime) {
					MarkerPlugin.activeModelsMarkers = MarkerPlugin.activeModelsMarkers.concat(markers);
				}

				callback();
			});

		}, function(err) {

			////////////////////
			// Handle Markers //
			////////////////////

			clearMarkersFromViews();
			processMarkersForFloorPlan();
			processMarkersForBuilding();

		});

	}

	function processMarkersForBuilding() {
		SlimLabsBimViewer.BuildingViewService.addMarkers(MarkerPlugin.activeModelsMarkers);
	}

	function processMarkersForFloorPlan() {

		var activeStoreyMapTime = MarkerPlugin.activeStoreyMapTime;
		var lastStoreyTime = new Date().getTime();
		MarkerPlugin.lastStoreyTime = lastStoreyTime;

		async.waterfall([

			function(callback) {
				if (SlimLabsBimViewer.DataController.activeStoreyMap && MarkerPlugin.activeModelsMarkers) {
					callback();
				} else {
					callback("Not all requirements met");
				}
			},

			function(callback) {

				var storeyMarkers = [];

				async.each(MarkerPlugin.activeModelsMarkers, function(marker, callback) {

					if (marker.element) {
						async.each(SlimLabsBimViewer.DataController.activeStoreyMap.storeys, function(storey, callback) {
							if (marker.element.buildingstorey.viewerId === storey.viewerId) {
								storeyMarkers.push(marker);
							}
							callback();
						}, function(err) {
							callback();
						});
					} else {
						storeyMarkers.push(marker);
						callback();
					}

				}, function(err) {
					callback(null, storeyMarkers);
				});

			},

		], function(err, storeyMarkers) {
			if (activeStoreyMapTime === MarkerPlugin.activeStoreyMapTime && MarkerPlugin.lastStoreyTime === lastStoreyTime) {
				SlimLabsBimViewer.FloorPlanService.setMarkers(storeyMarkers);
			}
		});

	}

	function clearMarkersFromViews() {
		SlimLabsBimViewer.FloorPlanService.setMarkers(null);
		SlimLabsBimViewer.BuildingViewService.removeMarkers();
	}

	function createDummyMarker(options) {

		var marker = {
			"name": options.name || "Marker name",
			"GlobalId": options.GlobalId,
			"position": options.position || {
				"x": 0,
				"y": 0,
				"z": 0
			},
			"meta": {},
			"image": "data:image/png;base64,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"
		};

		return marker;
	}


	function dispatchNewMarkerCallbacks(event, marker) {
		if (MarkerPlugin.enabled) {
			for (var i = 0; i < MarkerPlugin.newMarkerEventDispatchers.length; i++) {
				MarkerPlugin.newMarkerEventDispatchers[i](event, marker);
			}
		}
	}



	////////////
	// Return //
	////////////



	return MarkerPlugin;



};

export default MarkerPlugin;