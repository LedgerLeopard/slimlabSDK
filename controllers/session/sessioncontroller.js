var SessionController = function(SlimLabsBimViewer) {

	'use strict';

	var SessionController = {
		updateIntervalTime: 100,
		session: null,
		currentSessionId: null,
		currentParticipant: null,
		currentAccessKey: null,
		currentParticipantIsAdmin: false,
		currentParticipantIsOperator: false,
		state: {
			viewFilter: null,
			cameraDetails: {},
			sectionPlaneOffset: {},
			activeElements: {
				type: null,
				guids: null
			},
		},
	};

	/**
	 * Set the url
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 * @param    {String}                   url The API endpoint
	 */
	SessionController.setUrl = function(url) {
		SessionController.url = url;
		SessionController.wsUrl = "wss://" + url.split("://")[1] + "/session";
		SlimLabsBimViewer.DataController.setUrl(url);
	};

	/**
	 * Initialize the SessionController
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 * @param    {Object}                   options Options object
	 * @param    {String}                   options.sessionId The Id of the session to set
	 * @param    {String}                   options.participant The current participant email
	 * @param    {String}                   options.accessKey AccessKey of the current participant
	 * @param    {String}                   options.sessionKey The secret key of the session
	 */
	SessionController.init = function(options) {

		if (options.sessionId && options.participant && options.accessKey && options.sessionKey) {

			SessionController.currentSessionKey = options.sessionKey;
			SessionController.currentSessionId = options.sessionId;
			SessionController.currentParticipant = options.participant;
			SessionController.currentAccessKey = options.accessKey;

			// Init DataController
			SlimLabsBimViewer.DataController.init();

			// Register camera and section offset callback
			SlimLabsBimViewer.BuildingViewService.registerCameraChangeCallback(function(cameraDetails) {
				resolveChangedData({
					cameraDetails: cameraDetails,
				});
			}).registerSectionPlaneOffsetCallback(function(sectionPlaneOffset) {
				resolveChangedData({
					sectionPlaneOffset: sectionPlaneOffset,
				});
			}).registerClickCallback(function(type, guids) {
				resolveChangedData({
					activeElements: {
						type: type,
						guids: guids
					}
				});
			}).registerviewFilterCallback(function(viewFilter) {
				resolveChangedData({
					viewFilter: viewFilter
				});
			});

			// Register click callback
			SlimLabsBimViewer.FloorPlanService.registerClickCallback(function(type, guids) {
				resolveChangedData({
					activeElements: {
						type: type,
						guids: guids
					}
				});
			});

			if (options.modeloptions) {
				SlimLabsBimViewer.DataController.initializeBuildingView(options.modeloptions);
			}

			SlimLabsBimViewer.DatabaseService.getSession({
				id: options.sessionId,
				email: options.participant,
				accessKey: options.accessKey,
				sessionKey: options.sessionKey
			}, function(err, session) {

				if (!err) {
					SessionController.setSession(session);
				} else {
					callback(err);
				}

			});

		} else {
			SessionController.currentSessionKey = null;
			SessionController.currentSessionId = null;
			SessionController.currentParticipant = null;
			SessionController.currentAccessKey = null;
		}

	};

	/**
	 * Set the current session
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 * @param    {Object}                   session Database session object
	 */
	SessionController.setSession = function(session) {

		SessionController.currentParticipantIsOperator = false;
		SessionController.currentParticipantIsAdmin = false;

		// Determine whether user is operator
		if (session) {
			for (var i = 0; i < session.participants.length; i++) {
				if (session.participants[i].email === SessionController.currentParticipant && session.participants[i].isOperator) {
					SessionController.currentParticipantIsOperator = true;
				}
			}
		}

		// Disable or enable interaction depending on role
		if (!SessionController.currentParticipantIsOperator) {
			SessionController.stopUpdateInterval();
			SlimLabsBimViewer.BuildingViewService.disableInteraction();
			SlimLabsBimViewer.FloorPlanService.disableInteraction();
			SlimLabsBimViewer.BuildingViewService.disableControls();
			SlimLabsBimViewer.FloorPlanService.disableControls();
		} else {
			SessionController.startUpdateInterval(SessionController.updateIntervalTime);
			SlimLabsBimViewer.BuildingViewService.enableInteraction();
			SlimLabsBimViewer.FloorPlanService.enableInteraction();
			SlimLabsBimViewer.BuildingViewService.enableControls();
			SlimLabsBimViewer.FloorPlanService.enableControls();
		}

		// Determine if user is admin for the session
		if (session) {
			if (session.admin === SessionController.currentParticipant) {
				SessionController.currentParticipantIsAdmin = true;
			}
		}

		// Refresh view if the ids are not the same
		if (session && (!SessionController.session || SessionController.session._id !== session._id)) {

			// Clear the views
			SlimLabsBimViewer.DataController.clear();

			openWebSocket({
				session: session,
				sessionKey: SessionController.currentSessionKey,
				participant: SessionController.currentParticipant,
				accessKey: SessionController.currentAccessKey,
			});

			if (session.models) {

				var proceed = true;
				var projectId;
				var modelIds = session.models.map(function(model) {
					return model._id;
				});

				// Check if the models are of the same project
				for (var i = 0; i < session.models.length; i++) {
					if (!projectId) {
						// If no projectId
						projectId = session.models[i].project._id;
					} else if (session.models[i].project._id === projectId) {
						// If projectId is the same
						continue;
					} else {
						// Do not proceed
						proceed = false;
					}
				}

				// If we can proceed
				if (proceed) {

					SlimLabsBimViewer.DatabaseService.getProjectById({
						id: projectId
					}, function(err, project) {
						if (!err) {
							// Initialize the views
							SlimLabsBimViewer.DataController.setActiveProject({
								project: project,
								modelIds: modelIds
							}, function() {});

						} else {
							console.debug("[SessionController.setSession] Something went wrong");
						}
					});

				} else {
					console.debug("[SessionController.setSession] ProjectIds do not match");
				}

			}

		}

		SessionController.session = session;

	};

	/**
	 * Convert url to an object with key value pairs of the query part of the URL
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 * @param    {String}                   url Url to convert
	 * @return   {Object}                       Parameter object
	 */
	SessionController.extractUrlParameters = function(url) {

		var search = url.split("?")[1];
		var couples = search.split("&");

		var map = {};

		for (var i = 0; i < couples.length; i++) {
			var keyValue = couples[i].split("=");
			map[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
		}

		return map;

	};

	/**
	 * Construct websocket url
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 * @param    {Object}                   options Options object
	 * @param    {String}                   options.session The session
	 * @param    {String}                   options.participant The current participant email
	 * @param    {String}                   options.accessKey AccessKey of the current participant
	 * @param    {String}                   options.sessionKey The secret key of the session
	 * @return   {String}                           WebSocket connection url
	 */
	SessionController.constructWebsocketUrl = function(options) {
		var url = SessionController.wsUrl;
		url += "?sessionId=" + options.session._id;
		url += "&sessionKey=" + options.sessionKey;
		url += "&participant=" + options.participant;
		url += "&accessKey=" + options.accessKey;
		return url;
	};

	/**
	 * Start the Session update interval
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 */
	SessionController.startUpdateInterval = function(intervalTime) {

		// Start the interval
		SessionController.updateInterval = setInterval(function() {

			// Check if the state is not the default one
			if (SessionController.state.uuid) {

				var currentState = SessionController.state;

				// Check if the state is not the same as the last one we send
				if (!SessionController.lastSendState || SessionController.lastSendState !== currentState.uuid) {

					// Set last send state uuid
					SessionController.lastSendState = currentState.uuid;

					// Update over websocket
					if (SessionController.WebSocket) {
						SessionController.WebSocket.send(JSON.stringify(currentState));
					}
				}
			}
		}, intervalTime);
	};

	/**
	 * Stop the session update interval
	 *
	 * @access   public
	 * @memberof SessionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-12-01
	 */
	SessionController.stopUpdateInterval = function() {
		clearInterval(SessionController.updateInterval);
	};

	function resolveChangedData(options) {
		if (SessionController.currentParticipantIsOperator) {
			SessionController.state.cameraDetails = options.cameraDetails || SessionController.state.cameraDetails;
			SessionController.state.sectionPlaneOffset = options.sectionPlaneOffset || SessionController.state.sectionPlaneOffset;
			SessionController.state.activeElements = options.activeElements || SessionController.state.activeElements;
			SessionController.state.viewFilter = options.viewFilter || SessionController.state.viewFilter;
			SessionController.state.uuid = uuid();
		}
	}

	function handleChangedData(options) {

		if (!SessionController.currentParticipantIsOperator) {

			if (options.viewFilter) {
				SlimLabsBimViewer.BuildingViewService.setViewFilter(options.viewFilter);
			}

			if (options.sectionPlaneOffset) {
				SlimLabsBimViewer.BuildingViewService.setSectionPlaneOffset(options.sectionPlaneOffset);
			}

			if (options.activeElements) {
				SlimLabsBimViewer.InteractionController.setActiveGuids(options.activeElements.guids);
				SlimLabsBimViewer.DataController.setActiveGuids(options.activeElements.type, options.activeElements.guids);
			}

			if (options.cameraDetails) {

				SlimLabsBimViewer.BuildingViewService.setControlsPosition({
					position: options.cameraDetails.position
				});
				SlimLabsBimViewer.BuildingViewService.setControlsRotation({
					rotation: options.cameraDetails.rotation
				});
				SlimLabsBimViewer.BuildingViewService.setControlsTarget({
					target: options.cameraDetails.target,
					renderAfterwards: true
				});

			}

		}
	}

	function openWebSocket(options, callback) {

		if (options.session && options.participant && options.accessKey && options.sessionKey) {

			// Construct the websocket URL
			var url = SessionController.constructWebsocketUrl(options);

			// If there is a websocket, close the connection
			if (SessionController.WebSocket) {
				SessionController.WebSocket.close();
			}

			SessionController.WebSocket = new WebSocket(url);


			SessionController.WebSocket.onerror = function(event) {
				console.debug("[SessionController.openWebSocket] WebSocket error:", event);
			};

			SessionController.WebSocket.onclose = function(event) {
				if (!SessionController.disconnectWebsocketInterval) {
					console.debug("[SessionController.openWebSocket] Websocket closed", event);
					SessionController.disconnectWebsocketInterval = setInterval(function() {
						openWebSocket(options, function() {
							clearInterval(SessionController.disconnectWebsocketInterval);
							delete SessionController.disconnectWebsocketInterval;
						});
					}, 2000);
				}
			};

			SessionController.WebSocket.onopen = function(event) {
				console.debug("[SessionController.openWebSocket] Websocket opened");
				if (callback) {
					callback(true);
				}
			};

			SessionController.WebSocket.onmessage = function(event) {
				handleChangedData(JSON.parse(event.data));
			};


		}

	}

	function uuid() {
		var uniqueId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
		return uniqueId;
	}


	return SessionController;

};

export default SessionController;