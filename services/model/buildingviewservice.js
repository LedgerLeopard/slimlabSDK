import "./css/style.css";
import "./js/detect-element-resize";
import _ from "lodash";
import * as THREE from "./js/v89/three";
var clock = new THREE.Clock();
import cl from "./js/v89/ColladaLoader";
var ColladaLoader = cl(THREE);
import oc from "./js/v85/OrbitControls";
var OrbitControls = oc(THREE);
import tc from "./js/v89/TransformControls";
var TransformControls = tc(THREE);
import fpc from "./js/v89/FirstPersonControls";
var FirstPersonControls = fpc(THREE);

import TWEEN from "@tweenjs/tween.js";


/**
 * BuildingViewService.
 * @namespace
 *
 * @description
 *
 * ### Introduction
 * 
 * The BuildingViewService is the lowest level BuildingView API. It handles the creation
 * of DOM elements and events, and interacts with the WebGL engine.
 *
 * There are several things you need to know before working with the BuildingViewService:
 *
 * #### 1. View updates
 * 
 * It is important to understand that all the calls
 * that change the appearance of an object do not directly change the view. You have
 * to call the render call first. This allows you to change multiple properties of 
 * different objects without having to process all those changes immediately. This 
 * makes the renderer very efficient.
 *
 * For example, making all objects transluscent, then setting a color for some objects,
 * then showing (make non-transluscent) some elements to make them pop out and THEN
 * rendering, only calls the GPU once (see examples).
 *
 * #### 2. Controls
 *
 * The BuildingViewService has two types of controls:
 *
 * ##### a. OrbitControls
 *
 * The OrbitControls allow a user to interact with the scene using the mouse. Holding down
 * the left mouse button and dragging will rotate the view. Holding down the right mouse button
 * and dragging will pan the view and scrolling will zoom the view.
 *
 * ##### b. DroneControls
 *
 * With the DroneControls, the user can fly through the scene. Using "WASD" to controls
 * the position, and using the mouse location to change the viewing directions. The user
 * can also freeze the controls using "F". Furthermore the user can use "C" to go down, and
 * "SPACE" to go up. Last but not least, the user can run using "SHIFT". It is a good idea
 * to inform the user about these controls when enabling them.
 *
 * @example
 *
 * // 1. Updating the view
 * 
 * SlimLabsBimViewer.BuildingViewService.transluscentAll().setColor([GlobalIds], "#EEEEEE").show([GlobalIds]).render();
 *
 *
 */
var BuildingViewService = function(SlimLabsBimViewer) {

	"use strict";

	// require("./css/style.css");
	// require("./js/detect-element-resize");
	// var _ = require("lodash");
	// var THREE = require("./js/v89/three");
	// var clock = new THREE.Clock();
	// require("./js/v89/ColladaLoader")(THREE);
	// require("./js/v85/OrbitControls")(THREE);
	// require("./js/v89/TransformControls")(THREE);
	// require("./js/v89/FirstPersonControls")(THREE);

	var BuildingViewService = {

		colladaLoader: new THREE.ColladaLoader(),

		backgroundColor: "#ffffff",
		fps: 1000 / 60,

		hoverEventDispatchers: [],
		clickedElementEventDispatchers: [],
		clickedPointEventDispatchers: [],
		renderStateEventDispatchers: [],
		viewFilterDispatchers: [],
		cameraChangeDispatchers: [],
		modelloading: true,
		lastEventDown: {},
		colladas: {},
		objectMap: {},
		modelMap: {},
		modelObjects: [],
		markers: [],
		modelGroups: {
			all: [],
			spaces: [],
			objects: [],
		},
		hoveredObjects: [],
		clickedObjects: [],
		interactionEnabled: true,
		controlsEnabled: true,

		useProgressiveDisplay: true,

		clipPlanes: [],
		clipPlaneEnabled: {
			"X": false,
			"Y": false,
			"Z": false,
		},

		materialMap: {
			fromColor: {
				regular: {},
				transluscent: {},
			},
			fromMaterial: {
				regular: {},
				transluscent: {},
			}
		},

		defaults: {
			translucency: 0.03,
			highlightcolor: '#e74c3c',
		},

		viewFilterOptions: [
			"all",
			"spaces",
			"objects"
		],

		viewFilter: "all",

		cameraDetails: {
			position: {},
			target: {},
			rotation: {},
			controls: "orbit",
		},

		controlsOptions: [
			"Orbit",
			"Drone"
		],

	};

	var BuildingViewServiceDefaults = SlimLabsBimViewer.HelperService.cloneObject(BuildingViewService);


	/**
	 * Initialize the BuildingViewService
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * 
	 * @param    {Object}                   options  Options object, see example below
	 * @param    {Object}                   options.enableSections  Whether to enable sections or not
	 * @param    {Object}                   options.viewParentId  The id of the DOM element to put the buildingview in
	 * @param    {Object}                   options.antialias  Whether to enable anti alias
	 * @param    {Object}                   options.precision  precision of the renderer (lowp, mediump or highp)
	 * @param    {Function}                 callback Callback function when finished
	 *
	 * @example
	 *
	 *  // With callback
	 * 	BuildingViewService.init({
	 *  	enableSections: true,
	 *		viewParentId: "modelcontainer",
	 *		antialias: true,
	 *		precision: "lowp",
	 *	}, function(err) {
	 *		console.log(err || "Initialized");
	 *	});
	 *
	 */
	BuildingViewService.init = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (!BuildingViewService.initialized) {

				BuildingViewService.options = options;

				BuildingViewService.viewParentId = BuildingViewService.options.viewParentId || 'modelcontainer';
				BuildingViewService.backgroundColor = options.backgroundColor || BuildingViewService.backgroundColor || 0xffffff;
				BuildingViewService.parentContainer = document.getElementById(BuildingViewService.viewParentId);

				if (!BuildingViewService.parentContainer) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(reject, callback, "[BuildingViewService.init] There is no element with id:", BuildingViewService.viewParentId);
					return;
				}

				//////////////////////////
				// Clear view container //
				//////////////////////////

				BuildingViewService.parentContainer.innerHTML = "";


				BuildingViewService.vertexShaderScript = document.createElement('script');
				BuildingViewService.vertexShaderScript.setAttribute("type", "x-shader/x-vertex");
				BuildingViewService.vertexShaderScript.id = "vertexShader";
				BuildingViewService.vertexShaderScript.innerHTML = "\tvarying vec3 vWorldPosition;\n\tvoid main() {\n\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\t\tvWorldPosition = worldPosition.xyz;\n\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t}";
				document.body.appendChild(BuildingViewService.vertexShaderScript);

				BuildingViewService.fragmentShaderScript = document.createElement('script');
				BuildingViewService.fragmentShaderScript.setAttribute("type", "x-shader/x-fragment");
				BuildingViewService.fragmentShaderScript.id = "fragmentShader";
				BuildingViewService.fragmentShaderScript.innerHTML = "uniform vec3 topColor;\nuniform vec3 bottomColor;\nuniform float offset;\nuniform float exponent;\nvarying vec3 vWorldPosition;\nvoid main() {\n\tfloat h = normalize( vWorldPosition + offset ).y;\n\tgl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );\n}";
				document.body.appendChild(BuildingViewService.fragmentShaderScript);

				//////////////////////
				// Save the options //
				//////////////////////
				BuildingViewService.options.devicePixelRatio = BuildingViewService.options.devicePixelRatio || 1;

				///////////////////////////////////////////////////
				// Set initialized to prevent multiple instances //
				///////////////////////////////////////////////////
				BuildingViewService.initialized = true;

				BuildingViewService.prefix = options.projectprefix || "";

				////////////
				// Camera //
				////////////

				// var aspect = window.innerWidth / window.innerHeight;
				// var frustumSize = 1000;
				// BuildingViewService.camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 1, 2000);

				BuildingViewService.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 2000);
				BuildingViewService.camera.fov = 60.0;
				BuildingViewService.camera.position.set(0, 50, 50);
				BuildingViewService.camera.updateProjectionMatrix();

				///////////
				// Clock //
				///////////

				BuildingViewService.clock = new THREE.Clock();

				///////////
				// Scene //
				///////////

				BuildingViewService.scene = null;
				BuildingViewService.scene = new THREE.Scene();

				////////////
				// Camera //
				////////////

				BuildingViewService.scene.add(BuildingViewService.camera);

				/////////////////
				// MarkerGroup //
				/////////////////

				BuildingViewService.markerGroup = new THREE.Group();
				BuildingViewService.scene.add(BuildingViewService.markerGroup);

				//////////////
				// Renderer //
				//////////////

				var rendererOptions = {
					antialias: BuildingViewService.options.antialias || true,
					precision: BuildingViewService.options.precision || 'lowp',
					// preserveDrawingBuffer: true,
				};

				BuildingViewService.renderer = new THREE.WebGLRenderer(rendererOptions);
				BuildingViewService.renderer.setClearColor(BuildingViewService.backgroundColor);
				BuildingViewService.renderer.setPixelRatio(BuildingViewService.options.devicePixelRatio);

				onWindowResize();

				if (BuildingViewService.options.enableSections) {
					BuildingViewService.renderer.localClippingEnabled = true;
				}

				BuildingViewService.parentContainer.appendChild(BuildingViewService.renderer.domElement);



				////////////
				// Lights //
				////////////

				if (options.pretty) {

					BuildingViewService.renderer.shadowMap.enabled = true;

					BuildingViewService.scene.fog = new THREE.Fog(BuildingViewService.scene.background, 1, 5000);

					// GROUND
					var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
					var groundMat = new THREE.MeshPhongMaterial({
						color: 0x606060,
						specular: 0x050505,
					});
					groundMat.color.setHSL(0.095, 0.1, 0.75);
					var ground = new THREE.Mesh(groundGeo, groundMat);
					ground.rotation.x = -Math.PI / 2;
					ground.position.y = 0;
					BuildingViewService.scene.add(ground);
					ground.receiveShadow = true;

					var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
					hemiLight.color.setHSL(0.6, 1, 0.6);
					hemiLight.groundColor.setHSL(0.095, 1, 0.75);
					hemiLight.position.set(0, 50, 0);
					BuildingViewService.scene.add(hemiLight);

					var dirLight = new THREE.DirectionalLight(0xffffff, 1);
					dirLight.color.setHSL(0.1, 1, 0.95);
					dirLight.position.set(-1, 1.75, 1);
					dirLight.position.multiplyScalar(30);
					BuildingViewService.scene.add(dirLight);
					dirLight.castShadow = true;
					dirLight.shadow.mapSize.width = 4096;
					dirLight.shadow.mapSize.height = 4096;
					var d = 50;
					dirLight.shadow.camera.left = -d;
					dirLight.shadow.camera.right = d;
					dirLight.shadow.camera.top = d;
					dirLight.shadow.camera.bottom = -d;
					dirLight.shadow.camera.far = 3500;
					dirLight.shadow.bias = -0.0001;

					var helper = new THREE.DirectionalLightHelper(dirLight);
					BuildingViewService.scene.add(helper);

					// SKYDOME
					var vertexShader = document.getElementById('vertexShader').textContent;
					console.log(vertexShader);
					var fragmentShader = document.getElementById('fragmentShader').textContent;
					var uniforms = {
						topColor: {
							value: new THREE.Color(0x0077ff)
						},
						bottomColor: {
							value: new THREE.Color(0xffffff)
						},
						offset: {
							value: 33
						},
						exponent: {
							value: 0.6
						}
					};
					uniforms.topColor.value.copy(hemiLight.color);
					BuildingViewService.scene.fog.color.copy(uniforms.bottomColor.value);
					var skyGeo = new THREE.SphereGeometry(4000, 32, 15);
					var skyMat = new THREE.ShaderMaterial({
						vertexShader: vertexShader,
						fragmentShader: fragmentShader,
						uniforms: uniforms,
						side: THREE.BackSide
					});
					var sky = new THREE.Mesh(skyGeo, skyMat);
					BuildingViewService.scene.add(sky);



				} else {

					// Attach a pointlight to the camera
					BuildingViewService.pointLight = new THREE.DirectionalLight(0x959595, 0.5);
					BuildingViewService.pointLight.position.set(0, 50, 50);
					BuildingViewService.pointLight.intensity = 0.4;
					BuildingViewService.camera.add(BuildingViewService.pointLight);
					BuildingViewService.camera.rotationAutoUpdate = false;


					BuildingViewService.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
					BuildingViewService.hemiLight.position.set(0, 500, 0);
					BuildingViewService.scene.add(BuildingViewService.hemiLight);
					//
					BuildingViewService.dirLight = new THREE.DirectionalLight(0xffffff, 0.75);
					BuildingViewService.dirLight.color.setHSL(0.1, 1, 0.95);
					BuildingViewService.dirLight.position.set(-1, 1.75, 1);
					BuildingViewService.dirLight.position.multiplyScalar(50);
					BuildingViewService.scene.add(BuildingViewService.dirLight);

				}



				// Make sure we have no black background
				BuildingViewService.render();


				//////////////
				// Controls //
				//////////////

				BuildingViewService.setControls({
					controls: "Orbit",
					center: true
				});

				/////////////
				// Helpers //
				/////////////

				BuildingViewService.raycaster = new THREE.Raycaster();
				BuildingViewService.mouse = new THREE.Vector2();

				/////////////////////////
				// Add event listeners //
				/////////////////////////

				addResizeListener(BuildingViewService.parentContainer, function() {
					onWindowResize();
				});

				if (isEventSupported("onpointerdown")) {
					BuildingViewService.parentContainer.childNodes[0].addEventListener('pointerup', onDocumentEventUp, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('pointerdown', onDocumentEventDown, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('pointermove', onDocumentEventMove, false);
				} else if (isEventSupported("ontouchstart")) {
					BuildingViewService.parentContainer.childNodes[0].addEventListener('touchend', onDocumentEventUp, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('touchstart', onDocumentEventDown, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('touchmove', onDocumentEventMove, false);
				} else if (isEventSupported("onmousedown")) {
					BuildingViewService.parentContainer.childNodes[0].addEventListener('mouseup', onDocumentEventUp, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('mousedown', onDocumentEventDown, false);
					BuildingViewService.parentContainer.childNodes[0].addEventListener('mousemove', onDocumentEventMove, false);
				}

				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[BuildingViewService.init] Already initialized");
			}

		});

	};

	/**
	 * Register a new hover event callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on hover
	 * @return   {Object}                   		 BuildingViewService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.registerHoverCallback(function(type, guid){
	 *  console.log(type, guid);
	 * });
	 */
	BuildingViewService.registerHoverCallback = function(callback) {
		BuildingViewService.hoverEventDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Register a new click callback
	 *
	 * @deprecated
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on click
	 * @return   {Object}                   		 BuildingViewService object
	 *
	 */
	BuildingViewService.registerClickCallback = function(callback) {
		console.warn("[BuildingViewService.registerClickCallback] registerClickCallback is deprecated, use BuildingViewService.registerClickedElementCallback instead. registerClickCallback will be removed in future version");
		BuildingViewService.registerClickedElementCallback(callback);
		return BuildingViewService;
	};

	/**
	 * Register a new clicked element callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on click
	 * @return   {Object}                   		 BuildingViewService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.registerClickedElementCallback(function(type, guid){
	 *  console.log(type, guid);
	 * });
	 */
	BuildingViewService.registerClickedElementCallback = function(callback) {
		BuildingViewService.clickedElementEventDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Register a new clicked point callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-27
	 * @param    {Function}                callback 		Callback to run on event
	 * @param    {Object}                  callback.event 	initial event
	 * @param    {Object}                  callback.point 	clicked point
	 * @return   {Object}                            		BuildingViewService
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.registerClickedPointCallback(function(event, point){
	 *  console.log(event, point);
	 * });
	 */
	BuildingViewService.registerClickedPointCallback = function(callback) {
		BuildingViewService.clickedPointEventDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Register a new renderstate event callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on renderstate change
	 * @return   {Object}                   		 BuildingViewService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.registerRenderstateCallback(function(state){
	 *  console.log(state);
	 * });
	 */
	BuildingViewService.registerRenderstateCallback = function(callback) {
		BuildingViewService.renderStateEventDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Register view filter state change event callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run when viewfilter changes
	 * @return   {Object}                   		 BuildingViewService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.registerViewFilterCallback(function(viewfilter){
	 *  console.log(viewfilter);
	 * });
	 */
	BuildingViewService.registerviewFilterCallback = function(callback) {
		BuildingViewService.viewFilterDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Register camera change callback
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-29
	 * @param    {Function}                 callback Callback to run when the camera changes
	 * @return   {Object}                   		 BuildingViewService object
	 */
	BuildingViewService.registerCameraChangeCallback = function(callback) {
		BuildingViewService.cameraChangeDispatchers.push(callback);
		return BuildingViewService;
	};

	/**
	 * Event handler for the document mouse up event
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param    {Object}                   event jQuery event
	 *
	 */
	function onDocumentEventUp(event) {

		var coordinates = getXYCoordinatesFromEvent(event);

		// Get mousecoordinates to check if the user has moved the mouse significantly
		var mouseCoordinates = {
			x: event.pageX,
			y: event.pageY,
		};

		if (
			((mouseCoordinates.x - BuildingViewService.lastEventDown.x < 5 && mouseCoordinates.x - BuildingViewService.lastEventDown.x >= 0) ||
				(mouseCoordinates.x - BuildingViewService.lastEventDown.x > -5 && mouseCoordinates.x - BuildingViewService.lastEventDown.x <= 0)) &&
			((mouseCoordinates.y - BuildingViewService.lastEventDown.y < 5 && mouseCoordinates.y - BuildingViewService.lastEventDown.y >= 0) ||
				(mouseCoordinates.y - BuildingViewService.lastEventDown.y > -5 && mouseCoordinates.y - BuildingViewService.lastEventDown.y <= 0))
		) {

			if (event.target.parentNode.id === BuildingViewService.viewParentId) {

				BuildingViewService.clickedObject = null;

				var start = new Date().getTime();

				// Cast from camera
				BuildingViewService.raycaster.setFromCamera(BuildingViewService.mouse, BuildingViewService.camera);

				var intersectionObjects = [];
				intersectionObjects = intersectionObjects.concat(BuildingViewService.modelGroups.all);

				// Get the intersections with the raycast
				var intersects = BuildingViewService.raycaster.intersectObjects(intersectionObjects);

				// NO INTERSECTIONS
				if (intersects.length === 0) {

					if (!event.shiftKey) {
						if (BuildingViewService.interactionEnabled) {
							setActiveGuids(null, null);
						}
						return;
					}

				} else {

					/*************************************************************
					 * 		Check if there is an object closer to the camera, 
					 * 		set that as clickedObject (is the first object 
					 * 		that intersects. IGNORES TRANSPARENT OBJECTS
					 *************************************************************/

					for (var i = 0; i < intersects.length; i++) {

						var intersect = intersects[i];

						if (!BuildingViewService.clickedObject && pointNotClipped(intersect.point)) {

							if (intersect.object.material.isMultiMaterial) {

								if (intersect.object.material.materials && intersect.object.material.materials.length) {

									var foundNonTransparentMaterial = false;

									for (var i = 0; i < intersect.object.material.materials.length; i++) {
										if (intersect.object.material.materials[i].name.toLowerCase().indexOf("glas") === -1) {
											if (!intersect.object.material.materials[i].transparent || intersect.object.userData.type === "space") {
												foundNonTransparentMaterial = true;
											}
										}
									}

									if (foundNonTransparentMaterial) {
										BuildingViewService.clickedObject = intersect;
									}
								}

							} else {
								if (!intersect.object.userData.slimHidden && !intersect.object.userData.slimOpaque) {
									BuildingViewService.clickedObject = intersect;
								}
							}
						}

					}

					if (BuildingViewService.clickedObject) {

						// Calculate point offset of 10cm on line from camera to intersection point
						var intersectionLine = new THREE.Line3(BuildingViewService.camera.position, BuildingViewService.clickedObject.point);
						var distanceFromOriginalPoint = 0.2; // 20cm
						var ratio = distanceFromOriginalPoint / intersectionLine.distance();
						var at = 1 - ratio;
						var newPoint = intersectionLine.at(at);

						if (BuildingViewService.clickedObject.object.userData.type) {
							if (BuildingViewService.interactionEnabled) {

								if (BuildingViewService.clickedObject.object.userData.type) {
									switch (BuildingViewService.clickedObject.object.userData.type) {
										case "marker":
											setActiveGuids("markers", [BuildingViewService.clickedObject.object.userData.marker]);
											break;
										default:
											setActiveGuids(BuildingViewService.clickedObject.object.userData.type + "s", [BuildingViewService.prefix + BuildingViewService.clickedObject.object.name]);
											dispatchClickedPointEvents(event, newPoint, BuildingViewService.prefix + BuildingViewService.clickedObject.object.name);
									}
								}
							}
						} else {
							if (BuildingViewService.interactionEnabled) {
								setActiveGuids(null, null);
							}
						}

					} else {

						if (BuildingViewService.interactionEnabled) {
							setActiveGuids(null, null);
						}

					}

					return;

				}

			}

		}

	}

	/**
	 * Event handler for the document mouse down event.
	 * The mouse down event makes sure that the click
	 * event is being called with the right arguments
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param    {Object}                   event jQuery event object
	 *
	 */
	function onDocumentEventDown(event) {
		var coordinates = getXYCoordinatesFromEvent(event);
		BuildingViewService.lastEventDown.x = event.pageX;
		BuildingViewService.lastEventDown.y = event.pageY;
		BuildingViewService.mouse.x = coordinates.x;
		BuildingViewService.mouse.y = coordinates.y;
	}

	/**
	 * Event handler for the mouse move event.
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param    {Object}                   event jQuery event object
	 *
	 */
	function onDocumentEventMove(event) {
		var coordinates = getXYCoordinatesFromEvent(event);
		BuildingViewService.mouse.x = coordinates.x;
		BuildingViewService.mouse.y = coordinates.y;
	}

	/**
	 * Handle the window resize event
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 */
	function onWindowResize() {

		if (BuildingViewService.camera) {
			BuildingViewService.camera.aspect = BuildingViewService.parentContainer.clientWidth / BuildingViewService.parentContainer.clientHeight;
			BuildingViewService.camera.updateProjectionMatrix();
		}

		if (BuildingViewService.renderer) {
			BuildingViewService.renderer.setSize(BuildingViewService.parentContainer.clientWidth, BuildingViewService.parentContainer.clientHeight);
		}

		BuildingViewService.render();

	}

	/**
	 * Destroy the current view. The service needs
	 * to be reinitialized after destroy is called.
	 *
	 * This function will also call the 
	 * {@link BuildingViewService.clear} function.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.destroy();
	 *
	 */
	BuildingViewService.destroy = function() {

		// Check if the service is initialized
		if (BuildingViewService.initialized) {

			// Set flag
			BuildingViewService.initialized = false;

			// Clear service
			BuildingViewService.clear();

			// Remove shaders
			BuildingViewService.vertexShaderScript.remove();
			BuildingViewService.fragmentShaderScript.remove();

			// Remove event listeners
			if (BuildingViewService.parentContainer.childNodes[0]) {
				BuildingViewService.parentContainer.childNodes[0].removeEventListener('resize', onWindowResize, false);
				BuildingViewService.parentContainer.childNodes[0].removeEventListener('mouseup', onDocumentEventUp, false);
				BuildingViewService.parentContainer.childNodes[0].removeEventListener('mousedown', onDocumentEventDown, false);
				BuildingViewService.parentContainer.childNodes[0].removeEventListener('mousemove', onDocumentEventMove, false);
			}

			// Clear html contents
			BuildingViewService.parentContainer.innerHTML = "";

			// Set default state
			SlimLabsBimViewer.HelperService.cloneObjectProperties(BuildingViewService, BuildingViewServiceDefaults);

			// Remove WebGL objects
			if (BuildingViewService.scene) {
				BuildingViewService.renderer.clear();
				delete BuildingViewService.raycaster;
				delete BuildingViewService.mouse;
				delete BuildingViewService.camera;
				delete BuildingViewService.scene;
				delete BuildingViewService.pointLight;
				delete BuildingViewService.hemiLight;
				delete BuildingViewService.dirLight;
				delete BuildingViewService.renderer;
			}

		}

	};

	/**
	 * Clear the current view. Difference with destroy is that this only clears the
	 * data, where destroy also removes the DOM elements and events.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-23
	 */
	BuildingViewService.clear = function() {

		if (BuildingViewService.initialized) {

			removeClippingPlanes();
			BuildingViewService.removeMarkers();

			var i = BuildingViewService.modelGroups.all.length;
			while (i--) {
				if (BuildingViewService.modelGroups.all[i].parent) {
					BuildingViewService.modelGroups.all[i].parent.remove(BuildingViewService.modelGroups.all[i]);
				}
			}
			BuildingViewService.modelGroups.all = [];

			for (var modelId in BuildingViewService.modelMap) {
				for (var i = 0; i < BuildingViewService.modelMap[modelId].length; i++) {
					BuildingViewService.scene.remove(BuildingViewService.modelMap[modelId][i]);
				}
				delete BuildingViewService.modelMap[modelId];
			}

			BuildingViewService.objectMap = {};

			BuildingViewService.modelGroups = {
				all: [],
				spaces: [],
				objects: [],
			};

			BuildingViewService.materialMap = {
				fromColor: {
					regular: {},
					transluscent: {},
				},
				fromMaterial: {
					regular: {},
					transluscent: {},
				}
			};

			BuildingViewService.modelMap = {};
			BuildingViewService.colladas = {};

			BuildingViewService.render();

		}

	};

	/**
	 * Remove a model from view by id
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-23
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.modelId The id of the model to remove
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.removeModel({
		modelId: model._id
	 * });
 	 */
	BuildingViewService.removeModel = function(options) {

		if (options.modelId) {

			// Remove modelobjects, otherwise clicking will still do something
			var i = BuildingViewService.modelGroups.all.length;
			while (i--) {
				if (BuildingViewService.modelGroups.all[i].userData && BuildingViewService.modelGroups.all[i].userData.modelId && BuildingViewService.modelGroups.all[i].userData.modelId === options.modelId) {
					BuildingViewService.modelGroups.all.splice(i, 1);
				}
			}

			if (BuildingViewService.modelMap[options.modelId]) {
				for (var j = 0; j < BuildingViewService.modelMap[options.modelId].length; j++) {
					BuildingViewService.scene.remove(BuildingViewService.modelMap[options.modelId][j]);
					delete BuildingViewService.colladas[BuildingViewService.modelMap[options.modelId][j].uuid];
				}
				delete BuildingViewService.modelMap[options.modelId];
			}

			BuildingViewService.render();

		} else {
			SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.removeModel] modelId not specified in options object");
		}

	};

	BuildingViewService.getModelIds = function() {

		var modelIds = [];

		for (var modelId in BuildingViewService.modelMap) {
			modelIds.push(modelId);
		}

		return modelIds;

	};

	/**
	 * Add an object or objects to view
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-06
	 * @param    {Object}                   options  Options object
	 * @param    {Function}                 callback Callback function
	 */
	BuildingViewService.addObject = function(options, callback) {

		return new Promise(function(resolve, reject) {

			var colladaString;

			if (options.node) {

				colladaString = createColladaXml({
					node: options.node
				});

				// delete options.node;
				options.modelxml = colladaString;

			} else if (options.nodes) {

				colladaString = createColladaXml({
					nodes: options.nodes
				});

				// delete options.nodes;

				options.modelxml = colladaString;

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[BuildingViewService.addObject] No node field specified in options");
				return;
			}

			if (options.modelxml) {
				BuildingViewService.addModel(options, function(err) {
					if (err) {
						SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject);
					} else {
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
					}
				});
			} else {
				SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.addObject] no modelxml found in options");
			}

		});

	};

	/**
	 * Add a new model
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param {string} modelxml      ColladaXML in string format
	 * @param {Array} grossguids     Array containing guids of the grosses of the model
	 * @param {Array} spaceguids     Array containing guids of the spaces of the model
	 * @param {string} projectprefix The prefix of the project, used to determine the right
	 *                               guid for elements in the model, since the model contains
	 *                               the original IFC guid
	 */
	BuildingViewService.addModel = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (BuildingViewService.initialized) {

				BuildingViewService.setLoading(true);

				BuildingViewService.colladaLoader.parse(options.modelxml, null, function(collada) {

					// setTimeout(function() {

					BuildingViewService.colladas[collada.scene.uuid] = collada;

					BuildingViewService.scene.add(collada.scene);

					if (options.modelId) {
						if (BuildingViewService.modelMap[options.modelId]) {
							BuildingViewService.modelMap[options.modelId].push(collada.scene);
						} else {
							BuildingViewService.modelMap[options.modelId] = [collada.scene];
						}
					}

					// Calculate min and max of the model
					BuildingViewService.modelBbox = new THREE.Box3().setFromObject(BuildingViewService.scene);


					var objectsToRemove = [];

					function initializeChild(child) {

						child.matrixAutoUpdate = false;
						child.updateMatrix();

						if (BuildingViewService.options.pretty) {
							child.castShadow = true;
							child.receiveShadow = true;
						}

						if (child.material) {
							child.material = applyDefaultMaterialProperties(child.material);
							child.originalMaterial = child.material;
							child.previousMaterial = child.material;
						}

						if (child.name && child.name !== "" && options.grossguids && options.grossguids.indexOf(child.name) !== -1) {

							/////////////
							// Grosses //
							/////////////
							objectsToRemove.push(child);

						} else if (child.name && child.name !== "" && options.spaceguids.indexOf(child.name) !== -1) {

							////////////
							// Spaces //
							////////////
							BuildingViewService.modelGroups.spaces.push(child);
							child.userData.type = "space";

							var material = getMaterialForColor({
								opacity: 0.3,
								color: "#4CAF50",
							}, child).regular;

							child.material = material;
							child.originalMaterial = material;

							for (var i = 0; i < child.children.length; i++) {
								initializeChild(child.children[i], "space");
							}

						} else if (child.name !== "") {

							/////////////
							// Objects //
							/////////////
							child.userData.type = "object";
							BuildingViewService.modelGroups.objects.push(child);

							if (child.material) {
								if (child.material.constructor === Array) {
									for (var i = 0; i < child.material.length; i++) {
										child.material[i] = getMaterialForColor({
											material: child.material[i]
										}, child).regular;
									}
								} else {

									if (options.objectMaterials && options.objectMaterials[child.name]) {
										var mat = child.material.clone();
										mat.name = options.objectMaterials[child.name].material;
										child.material = mat;
										child.originalMaterial = child.material;
										child.previousMaterial = child.material;
									}

									child.material = getMaterialForColor({
										material: child.material
									}, child).regular;
								}
							}

							for (var i = 0; i < child.children.length; i++) {
								initializeChild(child.children[i], "object");
							}

						}

						if (options.grossguids && options.grossguids.indexOf(child.name) === -1) {
							BuildingViewService.objectMap[BuildingViewService.prefix + child.name] = child;
							BuildingViewService.modelGroups.all.push(child);
						}

					}

					for (var i = 0; i < collada.scene.children.length; i++) {
						initializeChild(collada.scene.children[i]);
					}

					// Remove objects from the model here, 
					// otherwise the traverse function crashes
					for (var i = 0; i < objectsToRemove.length; i++) {
						collada.scene.remove(objectsToRemove[i]);
					}

					collada.scene.updateMatrix();

					if (!options.skipCameraLookat) {

						var position = {};
						position.x = (BuildingViewService.modelBbox.min.x + BuildingViewService.modelBbox.max.x) / 2;
						position.y = (BuildingViewService.modelBbox.min.y + BuildingViewService.modelBbox.max.y) / 2;
						position.z = (BuildingViewService.modelBbox.min.z + BuildingViewService.modelBbox.max.z) / 2;


						if (isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
							BuildingViewService.cameraControls.target.set(0, 0, 0);
						} else {
							BuildingViewService.cameraControls.target.set(
								position.x,
								position.y,
								position.z
							);
						}

						BuildingViewService.cameraControls.update(clock.getDelta());

						// heavy objects are hidden because we call update
						// BuildingViewService.renderer.setPixelRatio(BuildingViewService.options.devicePixelRatio);
						// showHeavyObjects();

					}

					filterModelByViewType(false);
					BuildingViewService.render(100);

					BuildingViewService.setLoading(false);

					if (options.generateClippingPlanes) {
						setClippingPlanes();
					}

					if (options.clearCache) {
						BuildingViewService.colladas = {};
					}

					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

					// });

				});

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[BuildingViewService.addModel] Initialize BuildingViewService first");
			}

		});

	};

	/**
	 * Set a new model
	 *
	 * @access   public
	 * @deprecated Use addModel instead
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param {string} modelxml      ColladaXML in string format
	 * @param {Array} grossguids     Array containing guids of the grosses of the model
	 * @param {Array} spaceguids     Array containing guids of the spaces of the model
	 * @param {string} projectprefix The prefix of the project, used to determine the right
	 *                               guid for elements in the model, since the model contains
	 *                               the original IFC guid
	 */
	BuildingViewService.setModel = function(modelxml, grossguids, spaceguids, projectprefix) {
		console.debug("[BuildingViewService] setModel is deprecated, use addModel instead");
		BuildingViewService.addModel({
			modelxml: modelxml,
			grossguids: grossguids,
			spaceguids: spaceguids,
			projectprefix: projectprefix
		});
	};

	BuildingViewService.addMarkers = function(markers, callback) {

		return new Promise(function(resolve, reject) {

			var done = 0;

			for (var i = 0; i < markers.length; i++) {
				BuildingViewService.addMarker(markers[i]).then(function() {
					done++;
					if (done === markers.length) {
						BuildingViewService.render();
						SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
					}
				});
			}

		});

	};

	BuildingViewService.addMarker = function(marker, callback) {

		return new Promise(function(resolve, reject) {

			var textureLoader = new THREE.TextureLoader();
			textureLoader.crossOrigin = "Anonymous";
			textureLoader.load(marker.image, function(texture) {

				var mat = new THREE.SpriteMaterial({
					transparent: true,
					opacity: 1,
					map: texture,
					clippingPlanes: BuildingViewService.clipPlanes
				});

				mat = applyDefaultMaterialProperties(mat);

				var sprite = new THREE.Sprite(mat);
				sprite.name = marker.name;
				sprite.userData = {
					type: "marker",
					marker: marker,
				};

				// We flip the z position since we also do that on the floorplan
				sprite.position.set(marker.position.x || 0, marker.position.y || 0, (-1 * marker.position.z) || 0);
				BuildingViewService.markerGroup.add(sprite);
				BuildingViewService.markers.push(sprite);
				BuildingViewService.modelGroups.all.push(sprite);
				BuildingViewService.objectMap[BuildingViewService.prefix + marker._id] = sprite;

				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

			});

		});

	};

	BuildingViewService.removeMarkers = function() {
		for (var i = 0; i < BuildingViewService.markers.length; i++) {
			BuildingViewService.removeMarker(BuildingViewService.markers[i]);
		}

		if (BuildingViewService.scene) {
			BuildingViewService.scene.remove(BuildingViewService.markerGroup);
			BuildingViewService.markerGroup = new THREE.Group();
			BuildingViewService.scene.add(BuildingViewService.markerGroup);
		}

	};

	BuildingViewService.removeMarker = function(marker) {
		BuildingViewService.markerGroup.remove(marker);
		var markerLength = BuildingViewService.markers.length;
		while (markerLength--) {
			if (BuildingViewService.markers[markerLength]._id === marker._id) {
				BuildingViewService.markers.splice(markerLength, 1);
			}
		}
	};

	/**
	 * Get the current loading state of the view
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @return   {Boolean}                  Whether or not the view is loading
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.isLoading();
	 *
	 * // true
	 */
	BuildingViewService.isLoading = function() {
		return BuildingViewService.modelloading;
	};

	/**
	 * Set the current loading state of the view
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param    {Boolean}                   bool true for loading, false for not loading
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.setLoading(true);
	 *
	 * // do something
	 *
	 * SlimLabsBimViewer.BuildingViewService.setLoading(false);
	 */
	BuildingViewService.setLoading = function(bool) {
		dispatchRenderstateEvents(bool);
		BuildingViewService.modelloading = bool;
	};


	/**
	 * Reset the current view (under development)
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.resetView();
	 *
	 */
	BuildingViewService.resetView = function() {
		console.debug("[BuildingViewService] This feature is under development.");
	};


	/**
	 * Get the current active space guids
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @return   {Array}                   A list of space object GlobalIds
	 *
	 * @example
	 *
	 * var activeGuids = BuildingViewService.getActiveGuids();
	 *
	 * for(var i = 0; i < activeGuids.length; i++){
	 * 	console.log(activeGuids[i]);
	 * }
	 *
	 * // 1YiMjdM8LDmwaehbOQ1ma8
	 * // 3p7n2M7br1VB8xfoDPn4mz
	 * // 3_gGbJ1L17UP8z1VVIOPak
	 * 
	 */
	BuildingViewService.getActiveGuids = function() {
		return BuildingViewService.activeGuids;
	};

	/**
	 * Get the active guid type
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @return   {string}                   The active guids type (spaces|objects)
	 *
	 * @example
	 *
	 * var activeGuidsType = BuildingViewService.getActiveGuidsType();
	 *
	 * // spaces
	 * 
	 */
	BuildingViewService.getActiveGuidsType = function() {
		return BuildingViewService.activeGuidsType;
	};

	/**
	 * Sets the active guids
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * @param    {String}                   type The type of the guids 'spaces'|'objects'
	 * @param    {Array}                   guids Array with guids
	 */
	function setActiveGuids(type, guids) {
		BuildingViewService.activeGuids = guids;
		BuildingViewService.activeGuidsType = type;
		dispatchClickedElementEvents(type, guids);
	}


	/**
	 * Shows the object for the specified GUID(s).
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * @param    {string|string[]}           guids             The guids to show
	 * @param    {Boolean}                   [renderAfterwards=false] Whether to make a render call after the function is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.show([guids], true);
	 *
	 * // Chaining
	 * SlimLabsBimViewer.BuildingViewService.show([guids], true).setColor([guids]);
	 *
	 * // omitting the renderAfterwards value is valid, defaults to false
	 * SlimLabsBimViewer.BuildingViewService.show([guids]); 
	 * 
	 */
	BuildingViewService.show = function(guids, renderAfterwards) {

		if (guids) {
			if (guids.constructor === Array) {

				for (var i = 0; i < guids.length; i++) {
					BuildingViewService.show(guids[i]);
				}

			} else {
				var object = getModelObjectByGuid(guids);
				showObject(object);
			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}
		}

		return BuildingViewService;

	};

	/**
	 * Shows all objects in the model
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * @param    {Function}                 callback Function to call when the call is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.showAll();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.showAll().setColor([guids]);
	 */
	BuildingViewService.showAll = function(skipFilter, renderAfterwards) {

		if (BuildingViewService.modelGroups.all) {

			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {

				showObject(BuildingViewService.modelGroups.all[i]);

				if (BuildingViewService.modelGroups.all[i].children) {
					showObject(BuildingViewService.modelGroups.all[i].children);
				}

			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		if (!skipFilter) {
			filterModelByViewType(true);
		}

		return BuildingViewService;

	};

	/**
	 * Shows a specific model object, is used by the 
	 * show and showAll API calls
	 * 
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * 
	 * @access private
	 * @param  {Object|Object[]} objects A model object or array of model objects
	 */
	function showObject(objects) {

		if (objects) {

			if (objects.constructor === Array) {

				for (var i = 0; i < objects.length; i++) {
					showObject(objects[i]);
				}

			} else {

				if (objects.children) {
					showObject(objects.children);
				}

				objects.userData.slimHidden = false;
				objects.userData.slimOpaque = false;
				objects.visible = true;

				if (objects.material) {

					if (objects.material.constructor === THREE.SpriteMaterial) {
						objects.material.opacity = 1;
					} else {
						if (objects.material.constructor === Array) {
							for (var i = 0; i < objects.material.length; i++) {
								objects.material[i] = getMaterialForColor({
									material: objects.material[i]
								}, objects).regular;
							}
						} else {
							objects.material = getMaterialForColor({
								material: objects.material
							}, objects).regular;
						}
					}

				}

			}

		}

	}


	/**
	 * Hide objects in the model for the specified GUID(s).
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Array}                   guids           		Guids to hide
	 * @param    {Boolean}                 [renderAfterwards=false] 	Whether to render a frame after the function is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.hide([guids]);
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.showAll([guids]).setColor([guids]);
	 * 
	 */
	BuildingViewService.hide = function(guids, renderAfterwards) {

		if (guids) {

			if (guids.constructor === Array) {

				for (var i = 0; i < guids.length; i++) {
					BuildingViewService.hide(guids[i]);
				}

			} else {
				var object = getModelObjectByGuid(guids);
				hideObject(object);
			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};

	/**
	 * Hides all objects in the model. Usefull for reset situations, or when to show only a few objects in the model
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @example
	 * 
	 * SlimLabsBimViewer.BuildingViewService.hideAll();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.hideAll().show([guids]);
	 *
	 */
	BuildingViewService.hideAll = function() {

		if (BuildingViewService.modelGroups.all) {

			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {
				hideObject(BuildingViewService.modelGroups.all[i]);

				if (BuildingViewService.modelGroups.all[i].children) {
					hideObject(BuildingViewService.modelGroups.all[i].children);
				}
			}

			BuildingViewService.render();

		}

		return BuildingViewService;

	};

	/**
	 * Shows a specific model object, is used by the 
	 * show and showAll API calls
	 *
	 * 
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param  {Object|Object[]} objects A model object or array of model objects
	 */
	function hideObject(objects) {

		if (objects) {

			if (objects.constructor === Array) {

				for (var i = 0; i < objects.length; i++) {
					hideObject(objects[i]);
				}

			} else {

				if (objects.children) {
					hideObject(objects.children);
				}

				objects.userData.slimHidden = true;
				objects.visible = false;

			}

		}

	}


	/**
	 * Makes modelobjects transparent for the specified GUID(s).
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {string|string[]}            guids             GUID(s) to make transparant
	 * @param    {Boolean }                   [renderAfterwards=false]  Whether to render a frame after the function is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.transluscent([guids]);
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.transluscent([guids]).setColor([guids]);
	 * 
	 */
	BuildingViewService.transluscent = function(guids, renderAfterwards) {

		if (guids) {

			if (guids.constructor === Array) {

				for (var i = 0; i < guids.length; i++) {
					makeOpaque(guids[i]);
				}

			} else {

				var objects = getModelObjectByGuid(guids);

				if (objects.children) {
					makeOpaque(objects.children);
				}

				makeOpaque(objects);

			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};

	/**
	 * Makes all objects in the model transluscent. Usefull for makeing a few objects visible, while the rest is transluscent
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Function}                 callback Function to call after the function completes
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.transluscentAll();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.transluscentAll(true).setColor([guids]);
	 */
	BuildingViewService.transluscentAll = function(renderAfterwards) {

		if (BuildingViewService.modelGroups.all) {

			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {
				makeOpaque(BuildingViewService.modelGroups.all[i]);
			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};


	/**
	 * Makes object(s) transluscent.
	 * 
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Array}               objects           			Array of model objects to make transluscent
	 * @param    {Boolean}             [renderAfterwards=false]  	Whether to render a frame after the function is done
	 *
	 */
	function makeOpaque(objects, renderAfterwards) {

		if (objects.constructor === Array) {

			for (var i = 0; i < objects.length; i++) {
				makeOpaque(objects[i]);
			}

		} else {

			if (objects.children) {
				makeOpaque(objects.children);
			}

			objects.renderOrder = 10;
			objects.userData.slimOpaque = true;

			if (objects.material) {

				if (objects.material.constructor === THREE.SpriteMaterial) {
					objects.material.opacity = BuildingViewService.defaults.translucency;
				} else {
					if (objects.material.constructor === Array) {
						for (var i = 0; i < objects.material.length; i++) {
							objects.material[i] = getMaterialForColor({
								material: objects.material[i]
							}, objects).transluscent;
						}
					} else {
						objects.material = getMaterialForColor({
							material: objects.material
						}, objects).transluscent;
					}
				}

			}

		}

		if (renderAfterwards) {
			BuildingViewService.render();
		}

	}

	/**
	 * Set the background color
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-20
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.color Color to set the background to
	 */
	BuildingViewService.setBackgroundColor = function(options) {
		BuildingViewService.backgroundColor = options.color;
		if (BuildingViewService.renderer) {
			BuildingViewService.renderer.setClearColor(options.color);
		}
	};

	/**
	 * Sets a color for the specified GUID(s).
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {string|string[]}          guids             		GUID(s) to set the color for
	 * @param    {string}                   color             		THREEjs valid hex color
	 * @param    {Float}                    [opacity=1]           	Opacity of the material
	 * @param    {Boolean}                  [renderAfterwards=false]  Whether to render a frame after the function is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.setColor({
	 * 	guids: [guids],
	 * 	color:"#EEEEEE"
	 * });
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.setColor({
	 * 	guids: [guids],
	 * 	color:"#EEEEEE"
	 * }).hide([guids], true);
	 *
	 */
	BuildingViewService.setColor = function(options) {

		if (options.guids) {

			if (!options.color) {
				options.color = BuildingViewService.defaults.highlightcolor;
			} else if (options.color.toLowerCase().indexOf("rgb") !== -1) {
				options.color = rgb2hex(options.color);
			}

			if (options.guids.constructor === Array) {

				for (var i = 0; i < options.guids.length; i++) {
					BuildingViewService.setColor({
						guids: options.guids[i],
						color: options.color,
					});
				}

			} else {
				var object = getModelObjectByGuid(options.guids);
				colorObject({
					object: object,
					color: options.color,
					renderAfterwards: options.renderAfterwards
				});
			}

			if (options.renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};


	/**
	 * Sets the previous color for the modelobject of the specified guid. The name is a bit vague,
	 * since it actually reverts to the previous MATERIAL instead of color. So if there is for
	 * example a brick shader as previous material, that material will be set as the current 
	 * material.
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {string|string[]}          guids             	GUID(s) to set the previous material for
	 * @param    {Function}                 [callback]          The callback function
	 * @param    {Boolean}                  [renderAfterwards=false]  Whether to render a frame after the function is done
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.setPreviousColor([guids], function(){
	 * 	console.log("");
	 * }, true);
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.setPreviousColor([guids], null, true).setColor([guids], true);
	 * 
	 */
	BuildingViewService.setPreviousColor = function(guids, renderAfterwards) {

		if (guids) {

			if (guids.constructor === Array) {

				for (var i = 0; i < guids.length; i++) {
					setPreviousColor(guids[i]);
				}

			} else if (guids) {
				var object = getModelObjectByGuid(guids);
				setPrevColor(object);
			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};

	/**
	 * Resets the color for all objects in the model to their initial color
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.resetColors();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.resetColors().setColor([guids]);
	 * 
	 */
	BuildingViewService.resetColors = function(renderAfterwards) {

		if (BuildingViewService.modelGroups.all) {

			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {

				if (BuildingViewService.modelGroups.all[i].originalMaterial) {
					BuildingViewService.modelGroups.all[i].material = BuildingViewService.modelGroups.all[i].originalMaterial;
				}

				for (var j = 0; j < BuildingViewService.modelGroups.all[i].children.length; j++) {
					if (BuildingViewService.modelGroups.all[i].children[j].originalMaterial) {
						BuildingViewService.modelGroups.all[i].children[j].material = BuildingViewService.modelGroups.all[i].children[j].originalMaterial;
					}
				}

			}

			if (renderAfterwards) {
				BuildingViewService.render();
			}

		}

		return BuildingViewService;

	};

	/**
	 * Makes modelobject(s) the specified color with the specified opacity
	 * 
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Object|Object[]}          object            Objects to set the color for
	 * @param    {string}                   color             THREEjs valid hex color
	 * @param    {Float}                    opacity           The opacity of the material. 0 is fully transparent, 1 is non transparent
	 * @param    {Boolean}                  [renderAfterwards=false]  Whether to render a frame after the function is done
	 */
	function colorObject(options) {

		if (options.object) {

			options.object.previousMaterial = options.object.material;

			var material = getMaterialForColor({
				color: options.color
			}, options.object).regular;

			options.object.material = material;

			if (options.renderAfterwards) {
				BuildingViewService.render();
			}

		}

	}

	/**
	 * Sets the previous material for the passed object
	 * 
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Object}                   object The object to set the previous material for
	 */
	function setPrevColor(object) {

		if (object && object.previousMaterial) {
			object.material = object.previousMaterial;
		}

	}

	/**
	 * Center the model in view
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-01-18
	 */
	BuildingViewService.center = function() {
		BuildingViewService.lookAt(BuildingViewService.scene);
	};


	/**
	 * Make the camera look at a specific object
	 *
	 *
	 * @ignore
	 *
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 *
	 * @param    {Object}                   object The THREEJS object to look at
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.lookAt({}});
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.lookAt({}).setColor([guids]);
	 * 
	 */
	BuildingViewService.lookAt = function(object) {

		var box = new THREE.BoxHelper(object);

		if (box.geometry && box.geometry.boundingSphere) {
			BuildingViewService.lookAtPoint({
				x: box.geometry.boundingSphere.center.x,
				y: box.geometry.boundingSphere.center.y,
				z: box.geometry.boundingSphere.center.z
			});
		}

	};

	/**
	 * Look at a point in 3D space
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-01-25
	 * @param    {Object}                   point Object containing x,y,z values
	 * 
	 */
	BuildingViewService.lookAtPoint = function(point, options) {

		if (point) {

			options = options || {};

			var controlsWereEnabled = BuildingViewService.controlsEnabled;
			var intervalTime = options.tweenDuration || 400;

			var targetClone = {
				x: BuildingViewService.cameraControls.target.x,
				y: BuildingViewService.cameraControls.target.y,
				z: BuildingViewService.cameraControls.target.z,
			};

			var tweenMove = new TWEEN.Tween(targetClone);
			tweenMove.to(point, intervalTime);
			tweenMove.easing(TWEEN.Easing.Quadratic.Out);
			tweenMove.onUpdate(function() {

				// Determine controls
				switch (BuildingViewService.getCurrentControls()) {
					case "Orbit":
						BuildingViewService.cameraControls.target.set(targetClone.x, targetClone.y, targetClone.z);
						break;
					case "Drone":
						BuildingViewService.cameraControls.lookAt(targetClone);
						break;
				}

				// Update the controls
				BuildingViewService.cameraControls.update(clock.getDelta());

				// Show heavy objects, since the controls hide them, 
				// which is weird in this case
				showHeavyObjects();

				// Render view
				BuildingViewService.render(60);
			});

			var tweenStart = new Date().getTime();
			tweenMove.start();

			var tweenInterval = setInterval(function() {

				var now = new Date().getTime();
				var difference = now - tweenStart;

				if (difference > intervalTime) {
					clearInterval(tweenInterval);

					if (controlsWereEnabled) {
						BuildingViewService.enableControls();
					}

					tweenMove.stop();
				} else {
					TWEEN.update();
				}
			}, 33);

		}

		return BuildingViewService;

	};

	/**
	 * Zoom to object
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-07-25
	 * @param    {String}                   guid    GlobalId of the object to zoom to
	 * @param    {Object}                   options Options object
	 * @param    {Float}                   	options Offset of the zoom
	 * @param    {Float}                   [options.offset=1.25] Offset of the zoom
	 */

	var zoomToCenter;

	BuildingViewService.zoomTo = function(guid, options) {

		var controlsWereEnabled = BuildingViewService.controlsEnabled;

		if (guid) {

			// Get WebGl object
			var object = getModelObjectByGuid(guid);

			if (object) {

				BuildingViewService.lookAt(object);

				// Define offset
				var offset = options.offset || 1.25;

				// Define boundingbox for calculation
				var boundingBox = new THREE.Box3();

				// Calculate center
				var zoomToCenter = boundingBox.getCenter();

				// get bounding box of object - this will be used to setup controls and camera
				boundingBox.setFromObject(object);

				var size = boundingBox.getSize();

				// get the max side of the bounding box (fits to width OR height as needed )
				var maxDim = Math.max(size.x, size.y, size.z);
				var fov = BuildingViewService.camera.fov * (Math.PI / 180);
				var cameraZ = Math.abs(maxDim / 4 * Math.tan(fov * 2));

				var overstaand = maxDim / 2;
				var schuin = (3 * maxDim) / Math.PI;

				var distOnLine = Math.sqrt(Math.pow(schuin, 2) - Math.pow(overstaand, 2));

				var intersectionLine = new THREE.Line3(BuildingViewService.camera.position, zoomToCenter);
				var ratio = distOnLine / intersectionLine.distance();
				var at = 1 - ratio;
				var tweenEnd = intersectionLine.at(at);

				var tweenStart = new Date().getTime();

				var intervalTime = options.tweenDuration || 400;

				var targetClone = {
					x: BuildingViewService.camera.position.x,
					y: BuildingViewService.camera.position.y,
					z: BuildingViewService.camera.position.z,
				};

				if (controlsWereEnabled) {
					BuildingViewService.disableControls();
				}

				var tweenMove = new TWEEN.Tween(targetClone);
				tweenMove.to(tweenEnd, intervalTime);
				tweenMove.easing(TWEEN.Easing.Quadratic.Out);
				tweenMove.onUpdate(function() {
					BuildingViewService.camera.position.set(targetClone.x, targetClone.y, targetClone.z);
					// BuildingViewService.cameraControls.update(clock.getDelta());
					BuildingViewService.render(60);
				});

				BuildingViewService.lookAtPoint();

				tweenMove.start();

				var tweenInterval = setInterval(function() {

					var now = new Date().getTime();
					var difference = now - tweenStart;

					if (difference > intervalTime) {
						clearInterval(tweenInterval);

						if (controlsWereEnabled) {
							BuildingViewService.enableControls();
						}

						tweenMove.stop();
					} else {
						TWEEN.update();
					}
				}, 33);

				// cameraZ *= offset; // zoom out a little so that objects don't fill the screen

				// BuildingViewService.camera.position.z = cameraZ;

				// var minZ = boundingBox.min.z;
				// // var cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

				// // BuildingViewService.camera.far = cameraToFarEdge * 3;
				// // BuildingViewService.camera.updateProjectionMatrix();

				// if (BuildingViewService.controls) {

				// 	// set camera to rotate around center of loaded object
				// 	BuildingViewService.controls.target = center;

				// 	// prevent camera from zooming out far enough to create far plane cutoff
				// 	// BuildingViewService.controls.maxDistance = cameraToFarEdge * 2;

				// 	BuildingViewService.controls.update();

				// } else {

				// 	BuildingViewService.camera.lookAt(center);

				// }

				// if (options.renderAfterwards) {
				// 	BuildingViewService.render();
				// }

			}

		}

		return BuildingViewService;

	};

	/**
	 * Get the current controls
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-01-18
	 * @return   {String}                   The controls type
	 */
	BuildingViewService.getCurrentControls = function() {

		if (BuildingViewService.initialized) {
			switch (BuildingViewService.cameraControls.constructor) {
				case THREE.OrbitControls:
					return "Orbit";
				case THREE.FirstPersonControls:
					return "Drone";
			}
		}

		return null;
	};

	/**
	 * Get the current control options
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-01-12
	 * @return   {Array}                   List of options
	 *
	 * @example
	 *
	 * console.log(BuildingViewService.getControlsOptions());
	 *
	 * // [
	 * //	"Orbit",
	 * //	"Drone"
	 * // ]
	 * 
	 */
	BuildingViewService.getControlsOptions = function() {
		return BuildingViewService.controlsOptions;
	};

	/**
	 * Set the current controls, use the BuildingViewService.getControlsTypes() function to
	 * retreive the current options
	 *
	 * The BuildingViewService has two types of controls:
	 *
	 * ##### a. OrbitControls
	 *
	 * The OrbitControls allow a user to interact with the scene using the mouse. Holding down
	 * the left mouse button and dragging will rotate the view. Holding down the right mouse button
	 * and dragging will pan the view and scrolling will zoom the view.
	 *
	 * ##### b. DroneControls
	 *
	 * With the DroneControls, the user can fly through the scene. Using "WASD" to controls
	 * the position, and using the mouse location to change the viewing directions. The user
	 * can also freeze the controls using "F". Furthermore the user can use "C" to go down, and
	 * "SPACE" to go up. Last but not least, the user can run using "SHIFT". It is a good idea
	 * to inform the user about these controls when enabling them.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-01-12
	 * @param    {Object}                   options 		 Options object
	 * @param    {Boolean}                  options.center 	 Boolean to indicate whether to center the model after
	 *                                                       switching controls
	 * @param    {String}                   options.controls Controls options, retreive a list of options using
	 *                                                       BuildingViewService.getControlsOptions() 
	 *
	 * @example:
	 *
	 * BuildingViewService.setControls({
	 *	controls: "Orbit",
	 *	center: true
	 * });
	 *
	 * * BuildingViewService.setControls({
	 *	controls: "Drone",
	 * });
	 */
	BuildingViewService.setControls = function(options) {

		////////////////////////////////////
		// Check if the argument is valid //
		////////////////////////////////////
		if (!options.controls) {
			console.debug("Please specify controls in options");
			return;
		}

		////////////////////////////////////
		// Check if the argument is valid //
		////////////////////////////////////
		if (BuildingViewService.controlsOptions.indexOf(options.controls) === -1) {
			console.debug(options.controls, "is not a valid controlsOption");
			return;
		}

		/////////////////////////
		// Get previous target //
		/////////////////////////
		var prevTarget;
		if (BuildingViewService.cameraControls) {
			prevTarget = BuildingViewService.cameraControls.target;
			BuildingViewService.cameraControls.dispose();
			delete BuildingViewService.cameraControls;
		}

		////////////////////////////
		// Set the right controls //
		////////////////////////////
		switch (options.controls) {
			case "Orbit":

				BuildingViewService.cameraControls = new THREE.OrbitControls(BuildingViewService.camera, BuildingViewService.renderer.domElement);
				// BuildingViewService.cameraControls.enableDamping = true; // Fiels weird, especially zooming
				BuildingViewService.cameraControls.enabled = BuildingViewService.controlsEnabled;

				BuildingViewService.camera.updateProjectionMatrix();

				break;

			case "Drone":

				BuildingViewService.cameraControls = new THREE.FirstPersonControls(BuildingViewService.camera, BuildingViewService.renderer.domElement);
				BuildingViewService.cameraControls.lookSpeed = 0.4;
				BuildingViewService.cameraControls.movementSpeed = 8;

				BuildingViewService.camera.updateProjectionMatrix();

				break;

			default:
				break;
		}

		////////////////////////////
		// Determine center point //
		////////////////////////////
		if (options.center) {
			BuildingViewService.lookAt(BuildingViewService.scene);
		} else if (prevTarget) {
			BuildingViewService.lookAtPoint(prevTarget);
		} else {
			BuildingViewService.lookAt(BuildingViewService.scene);
		}

		/////////////////////////
		// Update the controls //
		/////////////////////////
		if (BuildingViewService.cameraControls.constructor === THREE.FirstPersonControls) {
			BuildingViewService.cameraControls.update(clock.getDelta());
		}

		//////////////////////////
		// Bind event listeners //
		//////////////////////////
		BuildingViewService.cameraControls.addEventListener("change", function() {

			// Update clipping planes controls
			if (BuildingViewService.controlX) {
				BuildingViewService.controlX.update();
			}
			if (BuildingViewService.controlY) {
				BuildingViewService.controlY.update();
			}
			if (BuildingViewService.controlZ) {
				BuildingViewService.controlZ.update();
			}


			hideHeavyObjects();

			BuildingViewService.cameraDetails.position = BuildingViewService.cameraControls.object.position;
			BuildingViewService.cameraDetails.rotation = BuildingViewService.cameraControls.object.rotation;
			BuildingViewService.cameraDetails.target = BuildingViewService.cameraControls.target;

			if (BuildingViewService.cameraControls.constructor === THREE.FirstPersonControls) {
				BuildingViewService.cameraControls.update(clock.getDelta());
			}

			dispatchCameraChangeEvents();
			BuildingViewService.render(true);
		});

		BuildingViewService.cameraControls.addEventListener("idle", function() {
			if (BuildingViewService.cameraControls.constructor === THREE.FirstPersonControls) {
				BuildingViewService.cameraControls.update(clock.getDelta());
			}
		});

		BuildingViewService.cameraControls.addEventListener("end", function() {
			showHeavyObjects();
		});

	};

	/**
	 * Enable interaction controls
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.enableControls();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.enableControls().setColor([guids]);
	 * 
	 */
	BuildingViewService.enableControls = function() {
		BuildingViewService.controlsEnabled = true;
		if (BuildingViewService.cameraControls) {
			BuildingViewService.cameraControls.enabled = true;
		}
		return BuildingViewService;
	};

	/**
	 * Disable interaction controls
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.disableControls();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.disableControls().setColor([guids]);
	 *
	 */
	BuildingViewService.disableControls = function() {
		BuildingViewService.controlsEnabled = false;
		if (BuildingViewService.cameraControls) {
			BuildingViewService.cameraControls.enabled = false;
		}
		return BuildingViewService;
	};

	/**
	 * Switch between interaction controls state
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.toggleControls();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.toggleControls().setColor([guids]);
	 *
	 */
	BuildingViewService.toggleControls = function() {
		BuildingViewService.controlsEnabled = !BuildingViewService.controlsEnabled;
		if (BuildingViewService.cameraControls) {
			BuildingViewService.cameraControls.enabled = !BuildingViewService.cameraControls.enabled;
		}
		return BuildingViewService;
	};

	/**
	 * Enable progressive display of the model
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 */
	BuildingViewService.enableProgressiveDisplay = function() {
		BuildingViewService.useProgressiveDisplay = true;
	};

	/**
	 * Disable progressive display of the model.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 */
	BuildingViewService.disableProgressiveDisplay = function() {
		BuildingViewService.useProgressiveDisplay = false;
	};

	/**
	 * Toggle progressive display of the model.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 */
	BuildingViewService.toggleProgressiveDisplay = function() {
		BuildingViewService.useProgressiveDisplay = !BuildingViewService.useProgressiveDisplay;
	};

	/**
	 * Get the current progressive display value
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 * @return   {Boolean}                   Whether or not the progressive display is enabled
	 */
	BuildingViewService.getCurrentProgressiveDisplay = function() {
		return BuildingViewService.useProgressiveDisplay;
	};

	BuildingViewService.setControlsPosition = function(options) {
		if (BuildingViewService.cameraControls && BuildingViewService.cameraControls.object) {
			BuildingViewService.cameraControls.object.position.x = options.position.x || BuildingViewService.cameraControls.object.position.x;
			BuildingViewService.cameraControls.object.position.y = options.position.y || BuildingViewService.cameraControls.object.position.y;
			BuildingViewService.cameraControls.object.position.z = options.position.z || BuildingViewService.cameraControls.object.position.z;
			if (options.renderAfterwards) {
				BuildingViewService.render();
			}
		}
	};

	BuildingViewService.setControlsRotation = function(options) {
		if (BuildingViewService.cameraControls && BuildingViewService.cameraControls.object) {

			BuildingViewService.cameraControls.object.rotation.set(
				options.rotation._x || BuildingViewService.cameraControls.object.rotation._x,
				options.rotation._y || BuildingViewService.cameraControls.object.rotation._y,
				options.rotation._z || BuildingViewService.cameraControls.object.rotation._z,
				options._order || BuildingViewService.cameraControls.object.rotation._order
			);

			if (options.renderAfterwards) {
				BuildingViewService.render();
			}
		}
	};

	BuildingViewService.setControlsTarget = function(options) {
		if (BuildingViewService.cameraControls && BuildingViewService.cameraControls.target) {
			BuildingViewService.cameraControls.target.x = options.target.x || BuildingViewService.cameraControls.target.x;
			BuildingViewService.cameraControls.target.y = options.target.y || BuildingViewService.cameraControls.target.y;
			BuildingViewService.cameraControls.target.z = options.target.z || BuildingViewService.cameraControls.target.z;
			if (options.renderAfterwards) {
				BuildingViewService.render();
			}
		}
	};


	/**
	 * Enable interaction (e.g. whether the hover and click events are fired). This 
	 * is different from disableControls in that the user can still change the view
	 * (e.g. rotate, pan etc) but can not "select" elements.
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.enableInteraction();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.enableInteraction().setColor([guids]);
	 * 
	 */
	BuildingViewService.enableInteraction = function() {
		BuildingViewService.interactionEnabled = true;
		return BuildingViewService;
	};

	/**
	 * Disable interaction (e.g. whether the hover and click events are fired)
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.disableInteraction();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.disableInteraction().setColor([guids]);
	 * 
	 */
	BuildingViewService.disableInteraction = function() {
		BuildingViewService.interactionEnabled = false;
		return BuildingViewService;
	};

	/**
	 * Toggle between interaction states (e.g. whether the hover and click events 
	 * are fired)
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.toggleInteraction();
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.toggleInteraction().setColor([guids]);
	 * 
	 */
	BuildingViewService.toggleInteraction = function() {
		BuildingViewService.interactionEnabled = !BuildingViewService.interactionEnabled;
		return BuildingViewService;
	};

	/**
	 * Get the current viewfilter options
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @return   {Array}                   An array of view filter options
	 *
	 *@example
	 *
	 * var viewFilterOptions = BuildingViewService.getViewFilterOptions();
	 *
	 * // ["all", "spaces", "objects"]
	 * 
	 */
	BuildingViewService.getViewFilterOptions = function() {
		return BuildingViewService.viewFilterOptions;
	};

	/**
	 * Get the current viewfilter
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @return   {string}                   The current active viewfilter
	 *
	 * @example
	 *
	 * var currentViewFilter = BuildingViewService.getViewFilter();
	 *
	 * // all
	 *
	 */
	BuildingViewService.getViewFilter = function() {
		return BuildingViewService.viewFilter;
	};

	/**
	 * Set the current viewfilter
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 * @param    {string}                   viewFilter A valid viewfilter option
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.setViewFilter("spaces");
	 */
	BuildingViewService.setViewFilter = function(viewFilter) {
		BuildingViewService.viewFilter = viewFilter;
		filterModelByViewType(true);
		dispatchViewFilterEvents(BuildingViewService.viewFilter);
	};

	/**
	 * Get the clipping plane options
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 * @return   {String[]}                   List of possible values to set the clipping planes for
	 */
	BuildingViewService.getClippingPlaneOptions = function() {
		return Object.keys(BuildingViewService.clipPlaneEnabled);
	};

	/**
	 * Get whether or not the clipping planes are enabled
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 * @return   {Object}                   All clipping plane options as keys, with booleans as values
	 */
	BuildingViewService.getClippingPlaneEnabled = function() {
		var clone = {};
		SlimLabsBimViewer.HelperService.cloneObjectProperties(clone, BuildingViewService.clipPlaneEnabled);
		return clone;
	};

	/**
	 * Enable a clipping plane
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-22
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.direction The direction of the clipping plane. X|Y|Z
	 */
	BuildingViewService.enableClippingPlane = function(options) {

		// Check options parameters
		if (options.direction) {

			// Define allowed directions
			var allowedDirection = BuildingViewService.getClippingPlaneOptions();

			// Checck direction parameter
			if (allowedDirection.indexOf(options.direction) !== -1) {

				// Check if it is not already enabled
				if (!BuildingViewService.clipPlaneEnabled[options.direction]) {

					BuildingViewService.clipPlaneEnabled[options.direction] = true;
					BuildingViewService["control" + options.direction].enabled = true;

					BuildingViewService.scene.add(BuildingViewService["vizClipPlane" + options.direction]);
					BuildingViewService.scene.add(BuildingViewService["control" + options.direction]);
					BuildingViewService.clipPlanes.push(BuildingViewService["clipPlane" + options.direction]);

					BuildingViewService.render();

				}

			} else {
				SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.enableClippingPlane] options.direction should be one of: " + allowedDirection.join(", "));
			}
		} else {
			SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.enableClippingPlane] No direction specified in options");
		}
	};

	/**
	 * Disable a clipping plane
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-22
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.direction The direction of the clipping plane. X|Y|Z
	 */
	BuildingViewService.disableClippingPlane = function(options) {

		// Check options parameters
		if (options.direction) {

			// Define allowed directions
			var allowedDirection = BuildingViewService.getClippingPlaneOptions();

			// Checck direction parameter
			if (allowedDirection.indexOf(options.direction) !== -1) {

				// Check if it is not already enabled
				if (BuildingViewService.clipPlaneEnabled[options.direction]) {

					BuildingViewService.clipPlaneEnabled[options.direction] = false;
					BuildingViewService["control" + options.direction].enabled = false;

					BuildingViewService.scene.remove(BuildingViewService["vizClipPlane" + options.direction]);
					BuildingViewService.scene.remove(BuildingViewService["control" + options.direction]);
					var j = BuildingViewService.clipPlanes.length;
					while (j--) {
						if (BuildingViewService.clipPlanes[j].direction === options.direction) {
							BuildingViewService.clipPlanes.splice(j, 1);
						}

					}

					BuildingViewService.render();

				}

			} else {
				SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.disableClippingPlane] options.direction should be one of: " + allowedDirection.join(", "));
			}
		} else {
			SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.disableClippingPlane] No direction specified in options");
		}

	};

	/**
	 * Toggle a clipping plane
	 *
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-22
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.direction The direction of the clipping plane. X|Y|Z
	 */
	BuildingViewService.toggleClippingPlane = function(options) {

		// Check options parameters
		if (options.direction) {

			// Define allowed directions
			var allowedDirection = BuildingViewService.getClippingPlaneOptions();

			// Checck direction parameter
			if (allowedDirection.indexOf(options.direction) !== -1) {

				var opts = {
					direction: options.direction
				};

				// Check if it is not already enabled
				if (BuildingViewService.clipPlaneEnabled[options.direction]) {
					BuildingViewService.disableClippingPlane(opts);
				} else {
					BuildingViewService.enableClippingPlane(opts);
				}

			} else {
				SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.toggleClippingPlane] options.direction should be one of: " + allowedDirection.join(", "));
			}
		} else {
			SlimLabsBimViewer.LoggerService.debug("[BuildingViewService.toggleClippingPlane] No direction specified in options");
		}

	};

	// Remove all clipping planes
	function removeClippingPlanes() {

		// Remove current clipPlanes
		var j = BuildingViewService.clipPlanes.length;
		while (j--) {
			BuildingViewService.clipPlanes.splice(j, 1);
		}

		var directions = BuildingViewService.getClippingPlaneOptions();

		// Delete current planes from memory
		for (var i = 0; i < directions.length; i++) {

			// Remove control
			if (BuildingViewService["control" + directions[i]]) {
				BuildingViewService.scene.remove(BuildingViewService["control" + directions[i]]);
				BuildingViewService["control" + directions[i]].dispose();
				delete BuildingViewService["control" + directions[i]];
			}

			// Remove clipPlane
			if (BuildingViewService["clipPlane" + directions[i]]) {
				BuildingViewService.scene.remove(BuildingViewService["clipPlane" + directions[i]]);
				delete BuildingViewService["clipPlane" + directions[i]];
			}

			// Remove visual Plane
			if (BuildingViewService["vizClipPlane" + directions[i]]) {
				BuildingViewService.scene.remove(BuildingViewService["vizClipPlane" + directions[i]]);
				BuildingViewService["vizClipPlane" + directions[i]].geometry.dispose();
				delete BuildingViewService["vizClipPlane" + directions[i]];
			}

		}

	}

	/**
	 * Check if a point (Vector3) is clipped by the section planes
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-26
	 * @param    {Vector}                   point Vector object
	 * @return   {Boolean}                        Whether the point is clipped
	 */
	function pointNotClipped(point) {

		var clipped = false;

		if (BuildingViewService.clipPlaneEnabled.X) {
			if (point.z >= BuildingViewService.vizClipPlaneX.position.z) {
				clipped = true;
			}
		}

		if (!clipped) {
			if (BuildingViewService.clipPlaneEnabled.Y) {
				if (point.x >= BuildingViewService.vizClipPlaneY.position.x) {
					clipped = true;
				}
			}
		}

		if (!clipped) {
			if (BuildingViewService.clipPlaneEnabled.Z) {
				if (point.y >= BuildingViewService.vizClipPlaneZ.position.y) {
					clipped = true;
				}
			}
		}

		return !clipped;

	}

	function setClippingPlanes(options) {

		// Remove current clipPlanes
		removeClippingPlanes();

		var tmpClipEnabled = {};
		for (var dir in BuildingViewService.clipPlaneEnabled) {
			tmpClipEnabled[dir] = BuildingViewService.clipPlaneEnabled[dir] === true;
			BuildingViewService.clipPlaneEnabled[dir] = false;
		}


		// Define modelBbox here so the previous planes are not making the scene incrementally bigger
		var modelBbox = new THREE.Box3().setFromObject(BuildingViewService.scene);

		// Calculate the max bounds
		var maxXBound = modelBbox.max.x + 2;
		var maxYBound = modelBbox.max.y + 2;
		var maxZBound = modelBbox.max.z + 2;
		var middleX = (modelBbox.min.x + modelBbox.max.x) / 2;
		var middleY = (modelBbox.min.y + modelBbox.max.y) / 2;
		var middleZ = (modelBbox.min.z + modelBbox.max.z) / 2;

		// Initialize clipping Planes
		BuildingViewService.clipPlaneX = new THREE.Plane(new THREE.Vector3(0, 0, -1), maxXBound);
		BuildingViewService.clipPlaneX.direction = "X";
		BuildingViewService.clipPlaneY = new THREE.Plane(new THREE.Vector3(-1, 0, 0), maxZBound);
		BuildingViewService.clipPlaneY.direction = "Y";
		BuildingViewService.clipPlaneZ = new THREE.Plane(new THREE.Vector3(0, -1, 0), maxYBound);
		BuildingViewService.clipPlaneZ.direction = "Z";

		// Init planeGeom
		var geometryX = new THREE.PlaneGeometry(modelBbox.max.x - modelBbox.min.x + 2, modelBbox.max.y - modelBbox.min.y + 2, 1);
		var geometryY = new THREE.PlaneGeometry(modelBbox.max.z - modelBbox.min.z + 2, modelBbox.max.y - modelBbox.min.y + 2, 1);
		var geometryZ = new THREE.PlaneGeometry(modelBbox.max.x - modelBbox.min.x + 2, modelBbox.max.z - modelBbox.min.z + 2, 1);

		// Define material
		var planeMaterial = new THREE.MeshBasicMaterial({
			color: 0xa5a5a5,
			side: THREE.DoubleSide,
			transparent: true,
			opacity: 0.1,
			depthWrite: false,
		});

		// Create visual planes
		BuildingViewService.vizClipPlaneX = new THREE.Mesh(geometryX, planeMaterial);
		BuildingViewService.vizClipPlaneX.userData.direction = "X";
		BuildingViewService.vizClipPlaneX.position.set(middleX, middleY, maxZBound);

		BuildingViewService.vizClipPlaneY = new THREE.Mesh(geometryY, planeMaterial);
		BuildingViewService.vizClipPlaneY.userData.direction = "Y";
		BuildingViewService.vizClipPlaneY.position.set(maxXBound, middleY, middleZ);
		BuildingViewService.vizClipPlaneY.rotation.set(0, Math.PI / 2, 0);

		BuildingViewService.vizClipPlaneZ = new THREE.Mesh(geometryZ, planeMaterial);
		BuildingViewService.vizClipPlaneZ.userData.direction = "Z";
		BuildingViewService.vizClipPlaneZ.position.set(middleX, maxYBound, middleZ);
		BuildingViewService.vizClipPlaneZ.rotation.set(Math.PI / 2, 0, 0);

		// Init controls
		BuildingViewService.controlX = new THREE.TransformControls(BuildingViewService.camera, BuildingViewService.renderer.domElement, {
			translate: {
				direction: "Z",
				maxBounds: {
					"Z": modelBbox.min.z + 0.1
				},
				minBounds: {
					"Z": modelBbox.max.z + 2
				},
			},
		});
		BuildingViewService.controlY = new THREE.TransformControls(BuildingViewService.camera, BuildingViewService.renderer.domElement, {
			translate: {
				direction: "X",
				maxBounds: {
					"X": modelBbox.min.x + 0.1
				},
				minBounds: {
					"X": modelBbox.max.x + 2
				},
			},
		});
		BuildingViewService.controlZ = new THREE.TransformControls(BuildingViewService.camera, BuildingViewService.renderer.domElement, {
			translate: {
				direction: "Y",
				maxBounds: {
					"Y": modelBbox.min.y + 0.1
				},
				minBounds: {
					"Y": modelBbox.max.y + 2
				},
			},
		});

		// Add event listeners
		BuildingViewService.controlX.addEventListener('change', function() {
			BuildingViewService.clipPlaneX.set(BuildingViewService.clipPlaneX.normal, BuildingViewService.vizClipPlaneX.position.z);
			BuildingViewService.render(100);
		});

		BuildingViewService.controlY.addEventListener('change', function() {
			BuildingViewService.clipPlaneY.set(BuildingViewService.clipPlaneY.normal, BuildingViewService.vizClipPlaneY.position.x);
			BuildingViewService.render(100);
		});

		BuildingViewService.controlZ.addEventListener('change', function() {
			BuildingViewService.clipPlaneZ.set(BuildingViewService.clipPlaneZ.normal, BuildingViewService.vizClipPlaneZ.position.y);
			BuildingViewService.render(100);
		});

		// Attach planes
		BuildingViewService.controlX.attach(BuildingViewService.vizClipPlaneX);
		BuildingViewService.controlY.attach(BuildingViewService.vizClipPlaneY);
		BuildingViewService.controlZ.attach(BuildingViewService.vizClipPlaneZ);

		for (var direction in tmpClipEnabled) {
			if (tmpClipEnabled[direction]) {
				BuildingViewService.enableClippingPlane({
					direction: direction
				});
			}
		}

	}

	/**
	 * Render function that passes a render command 
	 * to the internal webGL engine. This enables us
	 * to only render when necessary, thus gaining 
	 * speedy improvements.
	 * 
	 * @access   public
	 * @memberof BuildingViewService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-03
	 *
	 * @param    {Boolean}                   limitFps Whether or not to limit the frames per second
	 *                                                when making loads of consecutive render calls.
	 *                                                When limitFps is set to true, the fps will be
	 *                                                limited to max 60.
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.BuildingViewService.render(false);
	 *
	 * // Using chaining:
	 * SlimLabsBimViewer.BuildingViewService.render(true).setColor([guids]).render(true);
	 * 
	 */
	BuildingViewService.render = function(fps) {

		if (BuildingViewService.renderer) {

			var now = Date.now();

			if (BuildingViewService.renderTimeout) {
				clearTimeout(BuildingViewService.renderTimeout);
			}

			if (!BuildingViewService.lastRenderTime || now - BuildingViewService.lastRenderTime > fps || BuildingViewService.fps) {
				window.requestAnimationFrame(render);
			} else {
				// BuildingViewService.renderTimeout = setTimeout(function() {
				window.requestAnimationFrame(render);
				// }, fps || BuildingViewService.fps);
			}

		}

		function render() {
			BuildingViewService.lastRenderTime = Date.now();
			BuildingViewService.renderer.render(BuildingViewService.scene, BuildingViewService.camera);
		}

		return BuildingViewService;
	};



	/**************************************************
	 * 						HELPERS
	 **************************************************/

	function filterModelByViewType(render) {

		if (BuildingViewService.viewFilter && BuildingViewService.modelGroups) {

			BuildingViewService.showAll(true, false);

			var arrayToHide = null;

			switch (BuildingViewService.viewFilter) {
				case "all":
					arrayToHide = [];
					break;
				case "spaces":
					arrayToHide = BuildingViewService.modelGroups.objects;
					break;
				case "objects":
					arrayToHide = BuildingViewService.modelGroups.spaces;
					break;
			}

			for (var i = 0; i < arrayToHide.length; i++) {
				hideObject(arrayToHide[i]);
			}

			if (render) {
				BuildingViewService.render();
			}

		}

	}

	function getMaterialForColor(options, object) {

		var regularmaterial;
		var transluscentmaterial;

		var regularmaterialOptions = {
			transparent: options.opacity ? true : false,
			depthWrite: options.opacity ? false : true,
			opacity: options.opacity || 1,
		};

		var transluscentmaterialOptions = {
			opacity: BuildingViewService.defaults.translucency,
			transparent: true,
			depthWrite: false,
		};

		if (options.color) {

			//////////////////////
			// Build from color //
			//////////////////////

			if (options.color.constructor === Object) {
				options.color = extractHexColorFromThreeColor(options.color);
			} else if (options.color.indexOf("rgb(") !== -1 || options.color.indexOf("rgba(") !== -1) {
				options.color = rgb2hex(options.color);
			}

			if (BuildingViewService.materialMap.fromColor.regular[options.color]) {

				return {
					regular: BuildingViewService.materialMap.fromColor.regular[options.color],
					transluscent: BuildingViewService.materialMap.fromColor.transluscent[options.color],
				};

			} else {

				regularmaterialOptions.color = options.color;
				transluscentmaterialOptions.color = options.color;

				regularmaterial = new THREE.MeshLambertMaterial(regularmaterialOptions);
				regularmaterial = applyDefaultMaterialProperties(regularmaterial);
				transluscentmaterial = new THREE.MeshLambertMaterial(transluscentmaterialOptions);
				transluscentmaterial = applyDefaultMaterialProperties(transluscentmaterial);

			}

			BuildingViewService.materialMap.fromColor.regular[options.color] = regularmaterial;
			BuildingViewService.materialMap.fromColor.transluscent[options.color] = transluscentmaterial;

		} else if (options.material) {

			/////////////////////////
			// Build from material //
			/////////////////////////

			if (BuildingViewService.materialMap.fromMaterial.regular[options.material.uuid]) {

				return {
					regular: BuildingViewService.materialMap.fromMaterial.regular[options.material.uuid],
					transluscent: BuildingViewService.materialMap.fromMaterial.transluscent[options.material.uuid],
				};

			} else if (options.material.userData && options.material.userData.regularMaterialUuid && BuildingViewService.materialMap.fromMaterial.regular[options.material.userData.regularMaterialUuid]) {

				return {
					regular: BuildingViewService.materialMap.fromMaterial.regular[options.material.userData.regularMaterialUuid],
					transluscent: BuildingViewService.materialMap.fromMaterial.transluscent[options.material.userData.regularMaterialUuid],
				};

			} else {

				options.material = convertMaterial(options.material);

				regularmaterialOptions.color = options.material.color;
				transluscentmaterialOptions.color = options.material.color;

				transluscentmaterial = new THREE.MeshLambertMaterial(transluscentmaterialOptions);
				transluscentmaterial = applyDefaultMaterialProperties(transluscentmaterial);
				transluscentmaterial.userData = {
					regularMaterialUuid: options.material.uuid
				};

				regularmaterial = options.material;
				regularmaterial = applyDefaultMaterialProperties(regularmaterial);

				BuildingViewService.materialMap.fromMaterial.regular[options.material.uuid] = regularmaterial;
				BuildingViewService.materialMap.fromMaterial.transluscent[options.material.uuid] = transluscentmaterial;

			}

		}

		return {
			regular: regularmaterial,
			transluscent: transluscentmaterial,
		};

	}

	function extractHexColorFromThreeColor(materialcolor) {
		return "#" + materialcolor.getHexstring();
	}

	/**
	 * Converts an rgb code to hex
	 * @access   private
	 * @memberof BuildingViewService
	 * @param    {string}                   rgb Any valid rgb or rgba string. Note: the alpha value of the rgba is neglected
	 * @return   {string}                       Hex color representation of the rgb(a) string
	 */
	function rgb2hex(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1], 10).tostring(16)).slice(-2) +
			("0" + parseInt(rgb[2], 10).tostring(16)).slice(-2) +
			("0" + parseInt(rgb[3], 10).tostring(16)).slice(-2) : '';
	}

	function getXYCoordinatesFromEvent(event) {

		if (event.touches && event.touches.length === 1) {
			event.clientX = event.touches[0].clientX;
			event.clientY = event.touches[0].clientY;
		}

		// Get bounding client rect
		var clientRect = document.getElementById(BuildingViewService.viewParentId).getBoundingClientRect();
		var width = clientRect.width;
		var height = clientRect.height;
		var top = clientRect.top;
		var left = clientRect.left;

		// Construct coordinates
		var coordinates = {};
		coordinates.x = ((event.clientX - left) / width) * 2 - 1;
		coordinates.y = -((event.clientY - top) / height) * 2 + 1;

		return coordinates;

	}

	function isEventSupported(eventName) {

		BuildingViewService.eventCheckCache = BuildingViewService.eventCheckCache || {};

		var TAGNAMES = {
				'select': 'input',
				'change': 'input',
				'submit': 'form',
				'reset': 'form',
				'error': 'img',
				'load': 'img',
				'abort': 'img',
				'unload': 'win',
				'resize': 'win'
			},
			shortEventName = eventName.replace(/^on/, '');
		if (BuildingViewService.eventCheckCache[shortEventName]) {
			return BuildingViewService.eventCheckCache[shortEventName];
		}
		var elt = TAGNAMES[shortEventName] == 'win' ? window : document.createElement(TAGNAMES[shortEventName] || 'div');
		eventName = 'on' + shortEventName;
		var eventIsSupported = (eventName in elt);
		if (!eventIsSupported) {
			elt.setAttribute(eventName, 'return;');
			eventIsSupported = typeof elt[eventName] == 'function';
		}
		elt = null;
		BuildingViewService.eventCheckCache[shortEventName] = eventIsSupported;
		return eventIsSupported;
	}

	/**
	 * Gets a model object by GUID. this uses the internal objectMap that is created in the setModel function.
	 *
	 * @access   private
	 * @memberof BuildingViewService
	 * @param    {string}                   guid The GUID to get the model object for
	 * @return   {Object}                        A THREEjs model object
	 */
	function getModelObjectByGuid(guid) {
		return BuildingViewService.objectMap[guid];
	}

	function setChildMaterialDoubleSide(child) {

		if (child.material) {
			child.material.side = THREE.DoubleSide;
		}

		if (child.children.length > 0) {

			for (var i = 0; i < child.children.length; i++) {
				setChildMaterialDoubleSide(child.children[i]);
			}

		}

	}

	function hideHeavyObjects() {
		if (!BuildingViewService.heavyObjectsHidden && BuildingViewService.useProgressiveDisplay) {
			BuildingViewService.heavyObjectsHidden = true;
			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {
				if (BuildingViewService.modelGroups.all[i].geometry && BuildingViewService.modelGroups.all[i].geometry.attributes.normal.count > 100) {
					BuildingViewService.modelGroups.all[i].userData.slimTempHidden = true;
					BuildingViewService.modelGroups.all[i].visible = false;
					BuildingViewService.modelGroups.all[i].traverse(function(child) {
						child.userData.slimTempHidden = true;
						child.visible = false;
					});
				}
			}
		}
	}

	function showHeavyObjects() {
		if (BuildingViewService.heavyObjectsHidden && BuildingViewService.useProgressiveDisplay) {
			BuildingViewService.heavyObjectsHidden = false;
			for (var i = 0; i < BuildingViewService.modelGroups.all.length; i++) {
				if (!BuildingViewService.modelGroups.all[i].userData.slimHidden) {
					if (BuildingViewService.modelGroups.all[i].userData.slimTempHidden) {
						BuildingViewService.modelGroups.all[i].userData.slimTempHidden = false;
						BuildingViewService.modelGroups.all[i].visible = true;
						BuildingViewService.modelGroups.all[i].traverse(function(child) {
							child.userData.slimTempHidden = false;
							child.visible = true;
						});
					}
				}
			}
			BuildingViewService.render();
		}
	}

	function dispatchHoverEvents(type, guid) {
		if (BuildingViewService.interactionEnabled) {
			for (var i = 0; i < BuildingViewService.hoverEventDispatchers.length; i++) {
				BuildingViewService.hoverEventDispatchers[i](type, guid);
			}
		}
	}

	function dispatchClickedElementEvents(type, guid) {
		if (BuildingViewService.interactionEnabled) {
			for (var i = 0; i < BuildingViewService.clickedElementEventDispatchers.length; i++) {
				BuildingViewService.clickedElementEventDispatchers[i](type, guid);
			}
		}
	}

	function dispatchClickedPointEvents(event, point, guid) {
		if (BuildingViewService.interactionEnabled) {
			for (var i = 0; i < BuildingViewService.clickedPointEventDispatchers.length; i++) {
				BuildingViewService.clickedPointEventDispatchers[i](event, point, guid);
			}
		}
	}

	function dispatchRenderstateEvents(renderstate) {
		for (var i = 0; i < BuildingViewService.renderStateEventDispatchers.length; i++) {
			BuildingViewService.renderStateEventDispatchers[i](renderstate);
		}
	}

	function dispatchViewFilterEvents(viewFilter) {
		for (var i = 0; i < BuildingViewService.viewFilterDispatchers.length; i++) {
			BuildingViewService.viewFilterDispatchers[i](viewFilter);
		}
	}

	function dispatchCameraChangeEvents() {
		for (var i = 0; i < BuildingViewService.cameraChangeDispatchers.length; i++) {
			BuildingViewService.cameraChangeDispatchers[i](BuildingViewService.cameraDetails);
		}
	}

	var first = true;

	function createColladaXml(options) {

		var collada = [];
		var asset;
		var library_effects = [];
		var library_effect_ids = [];
		var library_materials = [];
		var library_material_ids = [];
		var library_geometries = [];
		var library_geometry_ids = [];
		var visual_scene_nodes = [];

		function processNode(node) {

			if (!asset && node.asset && node.asset.raw) {
				asset = node.asset.raw;
			}

			// Build materials
			if (node.materials) {
				for (var i = 0; i < node.materials.length; i++) {

					if (node.materials[i].raw && library_material_ids.indexOf(node.materials[i].id) === -1) {

						library_materials.push(node.materials[i].raw);
						library_material_ids.push(node.materials[i].id);

						if (node.materials[i].effect.raw && library_effect_ids.indexOf(node.materials[i].effect.id) === -1) {
							library_effects.push(node.materials[i].effect.raw);
							library_effect_ids.push(node.materials[i].effect.id);
						}

					}

				}
			}

			if (node.geometry) {
				if (node.geometry.raw && library_geometry_ids.indexOf(node.geometry.id) === -1) {
					library_geometries.push(node.geometry.raw);
					library_geometry_ids.push(node.geometry.id);
				}
			}

			visual_scene_nodes.push(node.raw);

		}

		function assembleCollada() {

			collada.push('<?xml version="1.0" encoding="utf-8"?><COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">');
			if (asset) {
				collada.push(asset);
			} // Effects

			collada.push("<library_effects>");
			for (var i = 0; i < library_effects.length; i++) {
				collada.push(library_effects[i]);
			}
			collada.push("</library_effects>"); // Materials

			collada.push("<library_materials>");
			for (var i = 0; i < library_materials.length; i++) {
				collada.push(library_materials[i]);
			}
			collada.push("</library_materials>"); // Geometries

			collada.push("<library_geometries>");
			for (var i = 0; i < library_geometries.length; i++) {
				collada.push(library_geometries[i]);
			}
			collada.push("</library_geometries>"); // Visual scene nodes

			collada.push('<library_visual_scenes><visual_scene id="SlimLabsBimViewer">');
			for (var i = 0; i < visual_scene_nodes.length; i++) {
				collada.push(visual_scene_nodes[i]);
			}
			collada.push('</visual_scene></library_visual_scenes>');

			collada.push('<scene><instance_visual_scene url="#SlimLabsBimViewer"/></scene>');
			collada.push('</COLLADA>');

			return collada.join("");

		}

		if (options.node && options.node.raw) {
			processNode(options.node);
		} else if (options.nodes) {
			for (var i = 0; i < options.nodes.length; i++) {
				processNode(options.nodes[i]);
			}
		} else {
			return null;
		}

		return assembleCollada();
	}

	function applyDefaultMaterialProperties(material) {
		material.side = THREE.DoubleSide;
		material.clippingPlanes = BuildingViewService.clipPlanes;
		material.clipShadows = true;
		return material;
	}

	function convertMaterial(material, parentType) {

		var presets = getMaterialPresets();

		applyDefaultMaterialProperties(material);

		for (var i = 0; i < presets.length; i++) {

			var skip = false;

			// check if we should skip
			if (presets[i].skippers) {
				for (var z = 0; z < presets[i].skippers.length; z++) {
					if (material.name && material.name.toLowerCase().indexOf(presets[i].skippers[z]) !== -1) {
						skip = true;
					}
				}
			}

			// If not skip, check for matchers
			if (!skip) {
				for (var j = 0; j < presets[i].matchers.length; j++) {
					if (material.name && material.name.toLowerCase().indexOf(presets[i].matchers[j]) !== -1) {

						if (presets[i].material) {
							var tmpMat = presets[i].material.clone();
							tmpMat.name = material.name;
							material = tmpMat;
						} else {
							for (var key in presets[i].properties) {
								material[key] = presets[i].properties[key];
							}
						}

					}
				}
			}

		}

		return material;

	}


	function getMaterialPresets() {

		return [
			{
				matchers: ["glas", "raam", "window"],
				skippers: ["wol"],
				properties: {
					transparent: true,
					opacity: 0.1,
					color: new THREE.Color("rgb(112, 166, 255)"),
				}
			}, {
				matchers: ["baksteen", "bkst", "metselwerk", ],
				properties: {
					color: new THREE.Color("rgb(111, 48, 36)"),
				}
			}, {
				matchers: ["pan", ],
				properties: {
					color: new THREE.Color("rgb(205, 111, 66)"),
				}
			}, {
				matchers: ["lei", "natuursteen"],
				properties: {
					color: new THREE.Color("rgb(89, 92, 99)"),
				}
			}, {
				matchers: ["alu", ],
				properties: {
					color: new THREE.Color("rgb(132, 135, 137)"),
				}
			}, {
				matchers: ["steel", "staal", ],
				properties: {
					color: new THREE.Color("rgb(224, 223, 219)"),
				}
			}, {
				matchers: ["kzst", "kalkzandsteen", "kzt", ],
				properties: {
					color: new THREE.Color("rgb(255, 255, 255)"),
				}
			}, {
				matchers: ["isolat", ],
				properties: {
					color: new THREE.Color("rgb(255, 217, 88)"),
				}
			}, {
				matchers: ["beton", "concrete", "prefab", "ihw", "i.h.w.", ],
				properties: {
					color: new THREE.Color("rgb(159, 159, 159)"),
				}
			}, {
				matchers: ["lucht", "air", ],
				properties: {
					transparent: true,
					opacity: 0.01,
					color: new THREE.Color("rgb(171, 171, 171)"),
				}
			}, {
				matchers: ["hout", "wood", ],
				properties: {
					color: new THREE.Color("rgb(162, 124, 0)"),
				}
			}
		].concat(getRalPresets()).concat(getColorPresets());
	}

	function getRgbForRal(ralNr) {
		return getRalRgbMap()[ralNr];
	}

	var ralPresets;

	function getRalPresets() {
		var map = getRalRgbMap();

		if (!ralPresets) {

			ralPresets = [];

			for (var ral in map) {

				var preset = {
					matchers: [],
					properties: {},
				};

				preset.matchers.push("ral" + ral);
				preset.matchers.push("ral-" + ral);
				preset.matchers.push("ral " + ral);
				preset.matchers.push("ral_" + ral);

				preset.properties.color = new THREE.Color(map[ral]);

				ralPresets.push(preset);

			}

			return ralPresets;

		} else {
			return ralPresets;
		}

	}

	function getColorPresets() {
		return [
			{
				matchers: ["white", "wit"],
				properties: {
					color: new THREE.Color("rgb(255, 255, 255)")
				},
			},
			{
				matchers: ["silver", "zilver"],
				properties: {
					color: new THREE.Color("rgb(192, 192, 192)")
				},
			},
			{
				matchers: ["gray", "grijs"],
				properties: {
					color: new THREE.Color("rgb(128, 128, 128)")
				},
			},
			{
				matchers: ["black", "zwart"],
				properties: {
					color: new THREE.Color("rgb(0, 0, 0)")
				},
			},
			{
				matchers: ["red", "rood"],
				skippers: ["baksteen", "bkst", "metselwerk", "pan"],
				properties: {
					color: new THREE.Color("rgb(142, 0, 0)")
				},
			},
			{
				matchers: ["maroon", "brown", "bruin"],
				properties: {
					color: new THREE.Color("rgb(128, 0, 0)")
				},
			},
			{
				matchers: ["yellow", "geel"],
				properties: {
					color: new THREE.Color("rgb(214, 214, 25)")
				},
			},
			{
				matchers: ["olive", "olijf"],
				properties: {
					color: new THREE.Color("rgb(128, 128, 0)")
				},
			},
			{
				matchers: ["lime"],
				properties: {
					color: new THREE.Color("rgb(0, 255, 0)")
				},
			},
			{
				matchers: ["green"],
				properties: {
					color: new THREE.Color("rgb(0, 128, 0)")
				},
			},
			{
				matchers: ["aqua"],
				properties: {
					color: new THREE.Color("rgb(0, 255, 255)")
				},
			},
			{
				matchers: ["teal", "taling"],
				properties: {
					color: new THREE.Color("rgb(0, 128, 128)")
				},
			},
			{
				matchers: ["blue", "blauw"],
				properties: {
					color: new THREE.Color("rgb(60, 21, 198)")
				},
			},
			{
				matchers: ["navy", "donkerblauw"],
				properties: {
					color: new THREE.Color("rgb(30, 0, 142)")
				},
			},
			{
				matchers: ["fuchsia"],
				properties: {
					color: new THREE.Color("rgb(255, 0, 255))")
				},
			},
			{
				matchers: ["purple", "paars"],
				properties: {
					color: new THREE.Color("rgb(128, 0, 128))")
				},
			},
		];
	}

	function getRalRgbMap() {
		return {
			"1000": "rgb(204, 204, 153)",
			"1001": "rgb(210, 170, 90)",
			"1002": "rgb(208, 168, 24)",
			"1003": "rgb(255, 204, 0)",
			"1004": "rgb(224, 176, 0)",
			"1005": "rgb(201, 135, 33)",
			"1006": "rgb(227, 167, 41)",
			"1007": "rgb(221, 159, 35)",
			"1011": "rgb(173, 122, 41)",
			"1012": "rgb(227, 184, 56)",
			"1013": "rgb(255, 245, 227)",
			"1014": "rgb(240, 214, 171)",
			"1015": "rgb(252, 235, 204)",
			"1016": "rgb(255, 245, 66)",
			"1017": "rgb(255, 171, 89)",
			"1018": "rgb(255, 214, 77)",
			"1019": "rgb(163, 140, 122)",
			"1020": "rgb(156, 143, 97)",
			"1021": "rgb(252, 189, 31)",
			"1023": "rgb(252, 189, 31)",
			"1024": "rgb(181, 140, 79)",
			"1026": "rgb(255, 255, 10)",
			"1027": "rgb(153, 117, 33)",
			"1028": "rgb(255, 140, 26)",
			"1032": "rgb(227, 163, 41)",
			"1033": "rgb(255, 148, 54)",
			"1034": "rgb(247, 153, 92)",
			"2000": "rgb(224, 94, 31)",
			"2001": "rgb(186, 46, 33)",
			"2002": "rgb(204, 36, 28)",
			"2003": "rgb(255, 99, 54)",
			"2004": "rgb(242, 59, 28)",
			"2005": "rgb(252, 28, 20)",
			"2007": "rgb(255, 117, 33)",
			"2008": "rgb(250, 79, 41)",
			"2009": "rgb(235, 59, 28)",
			"2010": "rgb(212, 69, 41)",
			"2011": "rgb(237, 92, 0)",
			"2012": "rgb(222, 82, 71)",
			"3000": "rgb(171, 31, 28)",
			"3001": "rgb(163, 23, 26)",
			"3002": "rgb(163, 26, 26)",
			"3003": "rgb(138, 18, 20)",
			"3004": "rgb(105, 15, 20)",
			"3005": "rgb(79, 18, 26)",
			"3007": "rgb(46, 18, 26)",
			"3009": "rgb(94, 33, 33)",
			"3011": "rgb(120, 20, 23)",
			"3012": "rgb(204, 130, 115)",
			"3013": "rgb(150, 31, 28)",
			"3014": "rgb(217, 102, 117)",
			"3015": "rgb(232, 156, 181)",
			"3016": "rgb(166, 36, 38)",
			"3017": "rgb(209, 54, 84)",
			"3018": "rgb(207, 41, 66)",
			"3020": "rgb(199, 23, 18)",
			"3022": "rgb(217, 89, 79)",
			"3024": "rgb(252, 10, 28)",
			"3026": "rgb(252, 20, 20)",
			"3027": "rgb(181, 18, 51)",
			"3031": "rgb(166, 28, 46)",
			"4001": "rgb(130, 64, 48)",
			"4002": "rgb(143, 38, 64)",
			"4003": "rgb(201, 56, 140)",
			"4004": "rgb(92, 8, 43)",
			"4005": "rgb(99, 61, 156)",
			"4006": "rgb(145, 15, 102)",
			"4007": "rgb(56, 10, 46)",
			"4008": "rgb(125, 31, 122)",
			"4009": "rgb(158, 115, 148)",
			"4010": "rgb(191, 23, 115)",
			"5000": "rgb(23, 51, 107)",
			"5001": "rgb(10, 51, 84)",
			"5002": "rgb(0, 15, 117)",
			"5003": "rgb(0, 23, 69)",
			"5004": "rgb(3, 13, 31)",
			"5005": "rgb(0, 46, 122)",
			"5007": "rgb(38, 79, 135)",
			"5008": "rgb(26, 41, 56)",
			"5009": "rgb(23, 69, 112)",
			"5011": "rgb(0, 43, 112)",
			"5012": "rgb(41, 115, 184)",
			"5013": "rgb(0, 18, 69)",
			"5014": "rgb(77, 105, 153)",
			"5015": "rgb(23, 97, 171)",
			"5017": "rgb(0, 59, 128)",
			"5018": "rgb(56, 148, 130)",
			"5019": "rgb(10, 66, 120)",
			"5020": "rgb(5, 51, 51)",
			"5021": "rgb(26, 122, 99)",
			"5022": "rgb(0, 8, 79)",
			"5023": "rgb(46, 82, 143)",
			"5024": "rgb(87, 140, 171)",
			"6000": "rgb(51, 120, 84)",
			"6001": "rgb(38, 102, 81)",
			"6002": "rgb(38, 87, 33)",
			"6003": "rgb(61, 69, 46)",
			"6004": "rgb(13, 59, 46)",
			"6005": "rgb(10, 56, 31)",
			"6006": "rgb(41, 43, 46)",
			"6007": "rgb(28, 38, 23)",
			"6008": "rgb(33, 33, 26)",
			"6009": "rgb(23, 41, 28)",
			"6010": "rgb(54, 105, 38)",
			"6011": "rgb(94, 125, 79)",
			"6012": "rgb(31, 46, 43)",
			"6013": "rgb(117, 115, 79)",
			"6014": "rgb(51, 48, 38)",
			"6015": "rgb(41, 43, 38)",
			"6016": "rgb(15, 112, 51)",
			"6017": "rgb(64, 130, 54)",
			"6018": "rgb(79, 168, 51)",
			"6019": "rgb(191, 227, 186)",
			"6020": "rgb(38, 56, 41)",
			"6021": "rgb(133, 166, 122)",
			"6022": "rgb(43, 38, 28)",
			"6024": "rgb(36, 145, 64)",
			"6025": "rgb(74, 110, 51)",
			"6026": "rgb(10, 92, 51)",
			"6027": "rgb(125, 204, 189)",
			"6028": "rgb(38, 74, 51)",
			"6029": "rgb(18, 120, 38)",
			"6032": "rgb(41, 138, 64)",
			"6033": "rgb(66, 140, 120)",
			"6034": "rgb(125, 189, 181)",
			"7000": "rgb(115, 133, 145)",
			"7001": "rgb(135, 148, 166)",
			"7002": "rgb(122, 117, 97)",
			"7003": "rgb(112, 112, 97)",
			"7004": "rgb(156, 156, 166)",
			"7005": "rgb(97, 105, 105)",
			"7006": "rgb(107, 97, 87)",
			"7008": "rgb(105, 84, 56)",
			"7009": "rgb(77, 82, 74)",
			"7010": "rgb(74, 79, 74)",
			"7011": "rgb(64, 74, 84)",
			"7012": "rgb(74, 84, 89)",
			"7013": "rgb(71, 66, 56)",
			"7015": "rgb(61, 66, 82)",
			"7016": "rgb(38, 46, 56)",
			"7021": "rgb(26, 33, 41)",
			"7022": "rgb(61, 61, 59)",
			"7023": "rgb(122, 125, 117)",
			"7024": "rgb(48, 56, 69)",
			"7026": "rgb(38, 51, 56)",
			"7030": "rgb(145, 143, 135)",
			"7031": "rgb(77, 92, 107)",
			"7032": "rgb(189, 186, 171)",
			"7033": "rgb(122, 130, 117)",
			"7034": "rgb(143, 135, 112)",
			"7035": "rgb(212, 217, 219)",
			"7036": "rgb(158, 150, 156)",
			"7037": "rgb(122, 125, 128)",
			"7038": "rgb(186, 189, 186)",
			"7039": "rgb(97, 94, 89)",
			"7040": "rgb(158, 163, 176)",
			"7042": "rgb(143, 150, 153)",
			"7043": "rgb(64, 69, 69)",
			"7044": "rgb(194, 191, 184)",
			"7045": "rgb(143, 148, 158)",
			"7046": "rgb(120, 130, 140)",
			"7047": "rgb(217, 214, 219)",
			"8000": "rgb(125, 92, 56)",
			"8001": "rgb(145, 82, 46)",
			"8002": "rgb(110, 59, 58)",
			"8003": "rgb(115, 59, 36)",
			"8004": "rgb(133, 56, 43)",
			"8007": "rgb(94, 51, 33)",
			"8008": "rgb(99, 61, 36)",
			"8011": "rgb(71, 38, 28)",
			"8012": "rgb(84, 31, 31)",
			"8014": "rgb(56, 38, 28)",
			"8015": "rgb(77, 31, 28)",
			"8016": "rgb(61, 31, 28)",
			"8017": "rgb(46, 28, 28)",
			"8019": "rgb(43, 38, 41)",
			"8022": "rgb(13, 8, 13)",
			"8023": "rgb(156, 69, 41)",
			"8024": "rgb(110, 64, 48)",
			"8025": "rgb(102, 74, 61)",
			"8028": "rgb(64, 46, 33)",
			"9001": "rgb(252, 252, 240)",
			"9002": "rgb(240, 237, 230)",
			"9003": "rgb(255, 255, 255)",
			"9004": "rgb(28, 28, 33)",
			"9005": "rgb(3, 5, 10)",
			"9006": "rgb(166, 171, 181)",
			"9007": "rgb(125, 122, 120)",
			"9010": "rgb(250, 255, 255)",
			"9011": "rgb(13, 18, 26)",
			"9016": "rgb(252, 255, 255)",
			"9017": "rgb(20, 23, 28)",
			"9018": "rgb(219, 227, 222)",
		};
	}


	return BuildingViewService;

};

export default BuildingViewService;