import "./js/detect-element-resize";
import d3 from "./js/d3";
import pointInSvgPolygon from "point-in-svg-polygon";
import panzoom from "./js/jquery.panzoom2";
import jsPDF from "./js/jspdf-debug";
import svgToPdf from "./js/svg2pdf.js";
import "./tooltip/bootstrap.min.js";
import "./tooltip/bootstrap.min.css";

/**
 * FloorPlanService.
 * @namespace
 *
 * @description
 * Lowest level FloorPlan API. 
 *
 * It is important to understand that the floorplan is rendered through individual objects. Each object
 * in the model has its own section description, and the view is build from these objects. Setting these
 * objects can be done though the 'setSpaces' and 'setObjects' methods.
 * 
 */
var FloorPlanService = function(SlimLabsBimViewer) {

	"use strict";

	/**
	 * @memberof FloorPlan
	 * @ngdoc service
	 * @name FloorPlanService
	 *
	 * @param {service} ContentService
	 *
	 * @attr {Boolean} defaults
	 * @attr {string} renderstate
	 * 
	 * @description
	 *   Controller for floorplan component
	 */
	var FloorPlanService = {

		svgId: "svg-element",
		panzoomSelector: '#panzoomEl',

		styleSheet: require("./css/style.js"),

		backgroundColor: "#fff",

		defaults: {
			"opacity": 0.2,
			"stroke-width": 0.05,
			"color": "black",
		},

		hoverEventDispatchers: [],
		clickEventDispatchers: [],
		renderStateEventDispatchers: [],
		clickedPointEventDispatchers: [],

		SvgSpaceWorker: require("./workers/spacesvg.worker.js"),
		SvgObjectWorker: require("./workers/objectsvg.worker.js"),
		SvgAssetWorker: require("./workers/assetsvg.worker.js"),

		renderstate: true,

		positionX: 0,
		positionY: 0,
		newPositionX: 0,
		newPositionY: 0,
		initLength: 0,
		currentScale: 1,

		containerRatio: 0.75,
		margin: 0,

		lastmousedown: {},

		zoomIncrement: 5,

		minScale: 0.5,
		maxScale: 1000,

		dwg: "",
		dwgVisibility: true,

		firstZoom: true,

		tooltipOptions: {
			container: "body",
			placement: "top",
			trigger: "hover",
			animation: true
		},

		interactionEnabled: true,


	};

	var FloorPlanServiceDefaults = SlimLabsBimViewer.HelperService.cloneObject(FloorPlanService);

	/**
	 * Initialize the floorplan
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Object}                   options 						Options object
	 * @param    {String}                   [options.viewParentId="svg"] 	The id of the parent object
	 * @param    {String}                   [options.containerRatio=0.75] 	The scale factor for lookat function (also applies to autocentering). Value between 0 and 1. 1 Fills the parent, near 0 is smallest. Can also be set using {@link FloorPlanService.setContainerRatio}
	 * @param    {String}                   [options.margin=0] 				The margin of the scale factor for lookat function (also applies to autocentering). value will be interpreted as pixels. Can also be set using {@link FloorPlanService.setMargin}
	 * @param    {Function}                 callback 						Callback function
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.init({
	 * 	options.viewParentId: 'svg',
	 * });
	 *
	 */
	FloorPlanService.init = function(options, callback) {

		return new Promise(function(resolve, reject) {

			if (!FloorPlanService.initialized) {

				FloorPlanService.viewParentId = options.viewParentId || "svg";
				FloorPlanService.containerRatio = options.containerRatio || FloorPlanService.containerRatio;
				FloorPlanService.margin = options.margin || FloorPlanService.margin;

				FloorPlanService.viewParentId = options.viewParentId || "svg";
				FloorPlanService.containerRatio = options.containerRatio || FloorPlanService.containerRatio;
				FloorPlanService.margin = options.margin || FloorPlanService.margin;

				FloorPlanService.styleSheet["#" + FloorPlanService.svgId + ", #planDWG, #planSVG, #objectSVG, #markerSVG"] = {
					overflow: "visible"
				};

				FloorPlanService.styleSheet["#" + FloorPlanService.svgId + " path"] = {
					"stroke-linecap": "square",
				};

				if (!document.getElementById(FloorPlanService.viewParentId)) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(reject, callback, "[FloorPlanService.init] There is no element with id: ", FloorPlanService.viewParentId);
					return;
				}

				FloorPlanService.styleSheet["#" + FloorPlanService.svgId + " path"] = {
					"stroke-linecap": "square",
				};

				if (!document.getElementById(FloorPlanService.viewParentId)) {
					SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[FloorPlanService.init] There is no element with id: ", FloorPlanService.viewParentId);
					return;
				}

				FloorPlanService.initialized = true;

				addResizeListener(document.getElementById(FloorPlanService.viewParentId), function() {
					zoomCompleteDrawing();
				});

				// Set required HTML elements
				var svgNamespace = "http://www.w3.org/2000/svg";

				document.getElementById(FloorPlanService.viewParentId).style.overflow = "hidden";

				var svgElement = document.createElementNS(svgNamespace, "svg");
				svgElement.setAttributeNS(null, "height", "100%");
				svgElement.setAttributeNS(null, "width", "100%");
				svgElement.setAttributeNS(null, "id", FloorPlanService.svgId);
				document.getElementById(FloorPlanService.viewParentId).appendChild(svgElement);

				var styleSheetElement = document.createElementNS(svgNamespace, "defs");
				styleSheetElement.setAttributeNS(null, "id", "slimlabs-floorplan-styles");
				svgElement.appendChild(styleSheetElement);

				var defsElement = document.createElementNS(svgNamespace, "defs");
				svgElement.appendChild(defsElement);

				var patternElement = document.createElementNS(svgNamespace, "pattern");
				patternElement.setAttributeNS(null, "id", "hatch00");
				patternElement.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
				patternElement.setAttributeNS(null, "x", "0");
				patternElement.setAttributeNS(null, "y", "0");
				patternElement.setAttributeNS(null, "width", "0.1");
				patternElement.setAttributeNS(null, "height", "0.1");
				defsElement.appendChild(patternElement);

				var patternGElement = document.createElementNS(svgNamespace, "g");
				patternGElement.style.stroke = "black";
				patternGElement.style["stroke-width"] = "0.01";
				patternElement.appendChild(patternGElement);

				var patternRectElement = document.createElementNS(svgNamespace, "rect");
				patternRectElement.setAttributeNS(null, "x", "0");
				patternRectElement.setAttributeNS(null, "y", "0");
				patternRectElement.setAttributeNS(null, "width", "0.1");
				patternRectElement.setAttributeNS(null, "height", "0.1");
				patternRectElement.setAttributeNS(null, "fill", "rgba(236, 240, 241,1.0)");
				// patternRectElement.setAttributeNS(null, "fill", "#FFEB3B");
				patternRectElement.setAttributeNS(null, "stroke", "none");
				patternGElement.appendChild(patternRectElement);

				var patternPathElement1 = document.createElementNS(svgNamespace, "path");
				patternPathElement1.setAttributeNS(null, "d", "M0,0 L0.1,0.1");
				patternGElement.appendChild(patternPathElement1);

				var patternPathElement2 = document.createElementNS(svgNamespace, "path");
				patternPathElement2.setAttributeNS(null, "d", "M0,0.1 L0.1,0");
				patternGElement.appendChild(patternPathElement2);

				var panzoomElement = document.createElementNS(svgNamespace, "g");
				panzoomElement.setAttributeNS(null, "id", "panzoomEl");
				svgElement.appendChild(panzoomElement);

				var viewportElement = document.createElementNS(svgNamespace, "g");
				viewportElement.setAttributeNS(null, "id", "viewport");
				panzoomElement.appendChild(viewportElement);

				var svgContainerElement = document.createElementNS(svgNamespace, "g");
				svgContainerElement.setAttributeNS(null, "id", "svgContainer");
				svgContainerElement.setAttributeNS(null, "class", "svgContainer");
				svgContainerElement.setAttributeNS(null, "width", "100%");
				svgContainerElement.setAttributeNS(null, "height", "100%");
				svgContainerElement.setAttributeNS(null, "transform", "scale(1 -1)");
				viewportElement.appendChild(svgContainerElement);

				var backdropRectElementG = document.createElementNS(svgNamespace, "g");
				var backdropRectElement = document.createElementNS(svgNamespace, "rect");
				backdropRectElement.setAttributeNS(null, "id", "floorplan-backdrop-rect");
				backdropRectElement.setAttributeNS(null, "x", "-5000");
				backdropRectElement.setAttributeNS(null, "y", "-5000");
				backdropRectElement.setAttributeNS(null, "width", "10000");
				backdropRectElement.setAttributeNS(null, "height", "10000");
				FloorPlanService.backgroundColor = options.backgroundColor || FloorPlanService.backgroundColor || "rgba(0,0,0,0)";
				backdropRectElement.setAttributeNS(null, "fill", FloorPlanService.backgroundColor);
				backdropRectElement.setAttributeNS(null, "stroke", "black");
				backdropRectElementG.appendChild(backdropRectElement);
				svgContainerElement.appendChild(backdropRectElementG);

				var planContainerElementG = document.createElementNS(svgNamespace, "g");
				planContainerElementG.setAttributeNS(null, "id", "floor-plan-object-path-drawing-holder");
				svgContainerElement.appendChild(planContainerElementG);

				var planDwgElement = document.createElementNS(svgNamespace, "svg");
				FloorPlanService.planDwgG = document.createElementNS(svgNamespace, "g");
				FloorPlanService.planDwgG.setAttributeNS(null, "id", "planDWG");
				planDwgElement.appendChild(FloorPlanService.planDwgG);
				planContainerElementG.appendChild(planDwgElement);

				FloorPlanService.planSpaceSvgElement = document.createElementNS(svgNamespace, "svg");
				FloorPlanService.planSpaceSvgElement.setAttributeNS(null, "id", "planSVG");
				planContainerElementG.appendChild(FloorPlanService.planSpaceSvgElement);

				FloorPlanService.planObjectSvgElement = document.createElementNS(svgNamespace, "svg");
				FloorPlanService.planObjectSvgElement.setAttributeNS(null, "id", "objectSVG");
				planContainerElementG.appendChild(FloorPlanService.planObjectSvgElement);

				FloorPlanService.planMarkerSvgElement = document.createElementNS(svgNamespace, "svg");
				FloorPlanService.planMarkerSvgElement.setAttributeNS(null, "id", "markerSVG");
				planContainerElementG.appendChild(FloorPlanService.planMarkerSvgElement);



				/////////////////////
				// Init styleSheet //
				/////////////////////

				regenerateCss();

				/////////////////////////////////
				// Use PanZoom to pan and zoom //
				/////////////////////////////////

				FloorPlanService.$panzoom = $(FloorPlanService.panzoomSelector).panzoom({
					rangeStep: 5,
					increment: FloorPlanService.zoomIncrement,
					transition: false,
					minScale: FloorPlanService.minScale,
					maxScale: FloorPlanService.maxScale
				});

				/////////////////////////
				// Add event listeners //
				/////////////////////////
				FloorPlanService.$panzoom.on('mousewheel.focus', function(e) {
					e.preventDefault();
					zoomSvg(e, FloorPlanService.$panzoom);
				});

				FloorPlanService.$panzoom.on('DOMMouseScroll', function(e) {
					e.preventDefault();
					zoomSvg(e, FloorPlanService.$panzoom);
				});

				if (isEventSupported("ontouchstart")) {

					document.getElementById("floorplan-backdrop-rect").addEventListener('touchstart', function(ev) {
						clickBackgroundRectDown(ev);
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('touchend', function(ev) {
						clickBackgroundRectUp(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener('touchstart', function(ev) {
						setStartLine(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener('touchend', function(ev) {
						deselectEditingElement(ev);
						removeStartLine();
						removeTouchAmountTransition();
						setCurrentScale(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener("touchmove", function(ev) {
						touchHandler(ev);
						moveEditingElement(ev);
					}, false);

				} else if (isEventSupported("onpointerdown")) {

					document.getElementById("floorplan-backdrop-rect").addEventListener('pointerenter', function(ev) {
						dispatchHoverEvents(null, null);
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('pointerdown', function(ev) {
						clickBackgroundRectDown(ev);
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('pointerup', function(ev) {
						clickBackgroundRectUp(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener('pointerup', function(ev) {
						deselectEditingElement(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener('pointermove', function(ev) {
						moveEditingElement(ev);
					}, false);

					document.getElementById("svgContainer").addEventListener('pointermove', function(ev) {
						drawSelectangle(ev);
					}, false);

				} else if (isEventSupported("onmousedown")) {

					document.getElementById("svgContainer").addEventListener('mousemove', function(ev) {
						drawSelectangle(ev);
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('mouseenter', function(ev) {
						if (FloorPlanService.interactionEnabled) {
							dispatchHoverEvents(null, null);
						}
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('mousedown', function(ev) {
						clickBackgroundRectDown(ev);
					}, false);

					document.getElementById("floorplan-backdrop-rect").addEventListener('mouseup', function(ev) {
						clickBackgroundRectUp(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener('mouseup', function(ev) {
						deselectEditingElement(ev);
					}, false);

					document.getElementById(FloorPlanService.svgId).addEventListener("mousemove", function(ev) {
						moveEditingElement(ev);
					}, false);

				}

				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[FloorPlanService] Already initialized");
			}

		});

	};

	/**
	 * Register a new hover event callback
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on hover
	 * @return   {Object}                   		 FloorPlanService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.registerHoverCallback(function(type, guid) {
	 *	console.log(type, guid);
	 * });
	 */
	FloorPlanService.registerHoverCallback = function(callback) {
		FloorPlanService.hoverEventDispatchers.push(callback);
		return FloorPlanService;
	};

	/**
	 * Register a new click event callback
	 *
	 * @deprecated Use FloorPlanService.registerClickedElementCallback instead
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on click
	 * @return   {Object}                   		 FloorPlanService object
	 *
	 */
	FloorPlanService.registerClickCallback = function(callback) {
		SlimLabsBimViewer.LoggerService.warn("[FloorPlanService.registerClickCallback] registerClickCallback is deprecated, use registerClickedElementCallback instead.");
		FloorPlanService.registerClickedElementCallback(callback);
		return FloorPlanService;
	};

	/**
	 * Register a new clicked event callback
	 *
	 * @deprecated Use FloorPlanService.registerClickedElementCallback instead
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-29
	 * @param    {Function}                 callback Callback to run on click
	 * @return   {Object}                   		 FloorPlanService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.registerClickedElementCallback(function(type, guid) {
	 *	console.log(type, guid);
	 * });
	 */
	FloorPlanService.registerClickedElementCallback = function(callback) {
		FloorPlanService.clickEventDispatchers.push(callback);
		return FloorPlanService;
	};

	/**
	 * Register a new renderstate event callback
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-16
	 * @param    {Function}                 callback Callback to run on renderstate change
	 * @return   {Object}                   		 FloorPlanService object
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.registerRenderstateCallback(function(state) {
	 *	console.log(state);
	 * });
	 */
	FloorPlanService.registerRenderstateCallback = function(callback) {
		FloorPlanService.renderStateEventDispatchers.push(callback);
		return FloorPlanService;
	};

	/**
	 * Register a new clicked point callback
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-27
	 * @param    {Function}                callback 		Callback to run on event
	 * @param    {Object}                  callback.event 	initial event
	 * @param    {Object}                  callback.point 	clicked point
	 * @return   {Object}                            		FloorPlanService
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.registerClickedPointCallback(function(event, point){
	 *  console.log(event, point);
	 * });
	 */
	FloorPlanService.registerClickedPointCallback = function(callback) {
		FloorPlanService.clickedPointEventDispatchers.push(callback);
		return FloorPlanService;
	};

	/**
	 * Destroy the current FloorPlanService. Also removes all event listeners
	 * associated with the FloorPlanService. The service needs to be reinitialized 
	 * after destroy is called.
	 *
	 * This function will also call the {@link FloorPlanService.clear} function.
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.destroy();
	 * 
	 */
	FloorPlanService.destroy = function() {

		FloorPlanService.initialized = false;
		FloorPlanService.clear();
		$(FloorPlanService.panzoomSelector).panzoom("reset");
		$(FloorPlanService.panzoomSelector).panzoom("destroy");

		delete FloorPlanService.planDwgG;
		delete FloorPlanService.planSpaceSvgElement;
		delete FloorPlanService.planObjectSvgElement;
		delete FloorPlanService.planAssetSvgElement;

		SlimLabsBimViewer.HelperService.cloneObjectProperties(FloorPlanService, FloorPlanServiceDefaults);

		var parentNode = document.getElementById(FloorPlanService.viewParentId);

		if (parentNode) {
			while (parentNode.firstChild) {
				parentNode.removeChild(parentNode.firstChild);
			}
		}

	};

	/**
	 * Clear the current floorplan view. Removes all current objects from view.
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-29
	 */
	FloorPlanService.clear = function() {
		FloorPlanService.setSpaces(null);
		FloorPlanService.setObjects(null);
		FloorPlanService.setMarkers(null);
		FloorPlanService.setDwg(null);
	};

	/**
	 * Set the container ratio. Can also be passed in {@link FloorPlanService.init}
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 * @param    {Float}                   containerRatio Value between 0 and 1. See {@link FloorPlanService.init} more for information.
	 */
	FloorPlanService.setContainerRatio = function(containerRatio) {
		FloorPlanService.containerRatio = containerRatio;
	};

	/**
	 * Set the current margin. Can also be passed in {@link FloorPlanService.init}
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-03-01
	 * @param    {Float}                   margin Margin of the FloorPlan. See {@link FloorPlanService.init} more for information.
	 */
	FloorPlanService.setMargin = function(margin) {
		FloorPlanService.margin = margin;
	};


	/**
	 * Download the current state of the floorplan
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-28
	 * @param    {String}                   paperSize A# paper size
	 */
	FloorPlanService.downloadPlan = function(paperSize) {

		// Get the required svg element
		var svg = document.getElementById(FloorPlanService.svgId);

		// Create a clone to which we can apply inline styles
		var svgClone = svg.cloneNode(svg.parentNode.firstChild);

		// Add the inline styles to the clone
		addInlineStyles(svgClone, FloorPlanService.styleSheet);

		// Instantiate the PDF
		var pdf = new jsPDF('p', 'mm', paperSize || 'a4');

		// Determine the scale
		var scaleX = pdf.internal.pageSize.width / document.getElementById(FloorPlanService.svgId).clientWidth;
		var scaleY = pdf.internal.pageSize.height / document.getElementById(FloorPlanService.svgId).clientHeight;
		var scale;
		if (scaleX < scaleY) {
			scale = scaleX;
		} else {
			scale = scaleY;
		}

		// render the svg element
		svgToPdf(svgClone, pdf, {
			xOffset: 18,
			yOffset: 18,
			scale: scale
		});

		// Save the PDF
		pdf.save('myPDF.pdf');

	};

	function addInlineStyles(child, jsonStyles) {

		var replacements = {
			"url(#hatch00)": "#BDBDBD",
		};

		// Save the current set styles
		var styleKeys = [];
		if (child.style.length) {
			for (var i = 0; i < child.style.length; i++) {
				styleKeys.push(child.style[i]);
			}
		}

		for (var selector in jsonStyles) {

			// Generate selectors
			var selectors = selector.split(",").map(function(slctr) {
				return slctr.trim();
			});

			var found = false;

			// Check if we have a match
			for (var i = 0; i < selectors.length; i++) {

				var sltr = selectors[i];

				if (sltr.startsWith("#")) {
					// Assume id
					if (child.getAttribute("id") === sltr.substring(1, sltr.length)) {
						found = true;
					}
				} else if (sltr.startsWith(".")) {
					// Assume class
					if (child.className && child.className.baseVal && child.className.baseVal.indexOf(sltr.substring(1, sltr.length)) !== -1) {
						found = true;
					}
				} else {
					// Assume element
					if (child.tagName === sltr) {
						found = true;
					}
				}

			}

			if (found) {
				for (var stylekey in jsonStyles[selector]) {

					// Check if the style not already has been set
					if (styleKeys.indexOf(stylekey) === -1) {
						if (stylekey === "stroke-width") {
							child.style[stylekey] = jsonStyles[selector][stylekey] * 15;
						} else if (stylekey === "stroke-dasharray") {
							child.style[stylekey] = jsonStyles[selector][stylekey].split(" ").map(function(dash) {
								return (parseFloat(dash) * 15).toString();
							}).join(" ");
						} else if (replacements[jsonStyles[selector][stylekey]]) {
							child.style[stylekey] = replacements[jsonStyles[selector][stylekey]];
						} else {
							child.style[stylekey] = jsonStyles[selector][stylekey];
						}
					}

				}
			}

		}

		if (child.children) {
			for (var i = 0; i < child.children.length; i++) {
				addInlineStyles(child.children[i], jsonStyles);
			}
		}
	}


	/**
	 * Set spaces to be shown in the floorplan
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {Object[]}                    spaces       Array of spaces
	 * @param    {Object}                   activeStorey Active storey object
	 * @param    {Function}                 callback     Callback function to run on complete, contains the 
	 *                                                   SVG string
	 *
	 * @example
	 *
	 * DatabaseService.getSpaces({
	 *	   model: modelObject,
	 *	   simple: true,
	 * }, function(err, spaces) {
	 *	   FloorPlanService.setSpaces(spaces);
	 * });
	 */
	FloorPlanService.setSpaces = function(spaces, activeStorey, callback) {

		return new Promise(function(resolve, reject) {

			if (FloorPlanService.initialized) {

				activeStorey = activeStorey || {
					ifcguid: "mock",
				};

				if (spaces && spaces.length > 0) {

					var guids = spaces.map(function(space) {
						return space.ifcguid || space.GlobalId;
					});

					// Make a checkable property to determine if the 
					// async process is still the last one
					var spacePlanTime = new Date().getTime();
					FloorPlanService.spacePlanTime = spacePlanTime;

					// Set space render state
					FloorPlanService.spaceRendering = true;
					resolveLoadingState();

					// Initialze the space worker
					var svgspaceworker = new FloorPlanService.SvgSpaceWorker();

					// Catch the response of the worker
					svgspaceworker.onmessage = function(e) {

						svgspaceworker.terminate();

						if (spacePlanTime === FloorPlanService.spacePlanTime) {

							// Set plan
							FloorPlanService.planSpaceSvgElement.innerHTML = e.data[0];

							var spaceElementGs = FloorPlanService.planSpaceSvgElement.children[0].children;

							for (var i = 0; i < spaceElementGs.length; i++) {
								initializeElementInteraction({
									element: spaceElementGs[i].children[0],
									type: "space"
								});
							}

							if (FloorPlanService.interactionEnabled) {
								FloorPlanService.enableToolTipForGuids(guids);
							}

							zoomCompleteDrawing();
							resolveSpaceObjectClass();

							// Set space render state
							FloorPlanService.spaceRendering = false;
							resolveLoadingState();

							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

						}

					};

					// Post message to the svg worker
					svgspaceworker.postMessage([spaces, activeStorey]);

				} else {
					FloorPlanService.planSpaceSvgElement.innerHTML = "";
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[FloorPlanService.setSpaces] FloorPlanService has not yet been initialized");
			}

		});

	};

	/**
	 * Set the objects for the object plan
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {Object[]}                   objects  Array of objects
	 * @param    {Function}                 callback Callback to run when complete, contains SVG string
	 *
	 * @example
	 *
	 * DatabaseService.getObjects({
	 *	   model: modelObject,
	 *	   simple: true,
	 * }, function(err, objects) {
	 *	   FloorPlanService.setObjects(objects);
	 * });
	 * 
	 */
	FloorPlanService.setObjects = function(objects, callback) {

		return new Promise(function(resolve, reject) {

			if (FloorPlanService.initialized) {

				FloorPlanService.objectGuids = null;

				if (objects && objects.length > 0) {

					var guids = objects.map(function(object) {
						return object.ifcguid || object.GlobalId;
					});

					// Make a checkable property to determine if the 
					// async process is still the last one
					var objectPlanTime = new Date().getTime();
					FloorPlanService.objectPlanTime = objectPlanTime;

					// Set space render state
					FloorPlanService.objectRendering = true;
					resolveLoadingState();

					// Initialize the object worker
					var svgobjectworker = new FloorPlanService.SvgObjectWorker();

					// catch the response of the worker
					svgobjectworker.onmessage = function(e) {

						svgobjectworker.terminate();

						if (objectPlanTime === FloorPlanService.objectPlanTime) {

							FloorPlanService.planObjectSvgElement.innerHTML = e.data[0];

							var objectElementGs = FloorPlanService.planObjectSvgElement.children[0].children;

							for (var i = 0; i < objectElementGs.length; i++) {
								initializeElementInteraction({
									element: objectElementGs[i].children[0],
									type: "object"
								});
							}

							zoomCompleteDrawing();
							resolveSpaceObjectClass();

							if (FloorPlanService.interactionEnabled) {
								FloorPlanService.enableToolTipForGuids(guids);
							}

							// Set space render state
							FloorPlanService.objectRendering = false;
							resolveLoadingState();

							SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

						}

					};

					// Post message to the worker
					svgobjectworker.postMessage([objects]);

				} else {
					removeSpaceObjectClass();
					FloorPlanService.planObjectSvgElement.innerHTML = "";
				}

			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject, "[FloorPlanService.setObjects] FloorPlanService has not yet been initialized");
			}

		});

	};

	FloorPlanService.setMarkers = function(markers, callback) {

		return new Promise(function(resolve, reject) {

			if (!markers || markers.length === 0) {
				FloorPlanService.planMarkerSvgElement.innerHTML = "";
			} else {

				var markersList = [];

				FloorPlanService.planMarkerSvgElement.innerHTML = "";

				for (var i = 0; i < markers.length; i++) {
					var markerList = [];
					markerList.push("<g class='floor-plan-object-container'>");
					markerList.push("<image");
					markerList.push("class='floor-plan-marker floor-plan-object-path'");
					markerList.push("id='floor-plan-object-path-" + markers[i]._id + "'");
					markerList.push("guid='" + markers[i]._id + "'");
					markerList.push("ifcguid='" + markers[i]._id + "'");
					markerList.push("transform='scale(1 -1) matrix(1, 0, 0, 1, -0.5, -0.5)'"); // Set position to center
					markerList.push("xlink:href='" + markers[i].image + "'");
					markerList.push("x='" + markers[i].position.x + "'");
					markerList.push("y='" + markers[i].position.z * -1 + "'"); // Flip the z position
					markerList.push("height='1px'");
					markerList.push("width='1px'");
					markerList.push("/>");
					markerList.push("</g>");
					var marker = markerList.join(" ");
					markersList.push(marker);
				}

				FloorPlanService.planMarkerSvgElement.innerHTML = markersList.join("");

				for (var j = 0; j < markers.length; j++) {
					initializeElementInteraction({
						element: document.getElementById("floor-plan-object-path-" + markers[j]._id),
						type: "marker",
						data: markers[j],
					});
				}

			}

			zoomCompleteDrawing();

			SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);

		});

	};

	/**
	 * Sets the renderstate
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {Boolean}                   boolean The state of rendering
	 */
	function setLoading(boolean) {
		FloorPlanService.renderstate = boolean;
		dispatchRenderstateEvents(boolean);
	}

	/**
	 * Gets whether the floorplanservice is currently in any loading process. Usefull for showing 
	 * UI loading indicators
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @return   {Boolean}                   The loading state
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.isLoading();
	 *
	 * // true
	 * 
	 */
	FloorPlanService.isLoading = function() {
		return FloorPlanService.renderstate;
	};

	/**
	 * Resets the SVG to its initial state
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {Boolean}			resetposition Whether to also set the plan back to its initial position
	 *
	 * @example
	 * 
	 * SlimLabsBimViewer.FloorPlanService.resetView(true);
	 * 
	 */
	FloorPlanService.resetView = function(resetposition) {

		$("g.space_text").remove();

		var spacePaths = $(".floor-plan-space");

		for (var i = 0; i < spacePaths.length; i++) {

			if ($(spacePaths[i]).attr("ruimtefunctie") && $(spacePaths[i]).attr("ruimtefunctie").toLowerCase().indexOf("verkeersruimte") !== -1) {
				$(spacePaths[i]).css({
					fill: 'rgb(236, 240, 241)',
				});
			} else if ($(spacePaths[i]).attr("name") && $(spacePaths[i]).attr("name").toLowerCase().indexOf("gross") !== -1) {
				$(spacePaths[i]).css({
					fill: 'none',
				});
			} else {
				$(spacePaths[i]).css({
					fill: 'rgb(255, 255, 255)',
				});
			}

		}

		var assetPaths = $(".plan-asset");

		for (var j = 0; j < assetPaths.length; j++) {
			$(assetPaths[i]).css({
				fill: 'rgb(255, 255, 255)',
			});
		}

		if (resetposition) {
			$(FloorPlanService.panzoomSelector).attr("transform", getInitPosition());
		}
	};

	/**
	 * Enable the controls (zoom and pan)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.enableControls();
	 * 
	 */
	FloorPlanService.enableControls = function() {
		var panzoomIsDisabled = $(FloorPlanService.panzoomSelector).panzoom("isDisabled");

		if (panzoomIsDisabled) {
			$(FloorPlanService.panzoomSelector).panzoom("enable");
		}
	};

	/**
	 * Disable the controls (zoom and pan)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.disableControls();
	 * 
	 */
	FloorPlanService.disableControls = function() {
		var panzoomIsDisabled = $(FloorPlanService.panzoomSelector).panzoom("isDisabled");

		if (!panzoomIsDisabled) {
			$(FloorPlanService.panzoomSelector).panzoom("disable");
		}
	};

	/**
	 * Toggle controls (zoom and pan)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.toggleControls();
	 * 
	 */
	FloorPlanService.toggleControls = function() {
		var panzoomIsDisabled = $(FloorPlanService.panzoomSelector).panzoom("isDisabled");

		if (panzoomIsDisabled) {
			$(FloorPlanService.panzoomSelector).panzoom("enable");
		} else {
			$(FloorPlanService.panzoomSelector).panzoom("disable");
		}
	};

	/**
	 * Enable the interaction (hover and click events)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.enableInteraction();
	 * 
	 */
	FloorPlanService.enableInteraction = function() {
		FloorPlanService.interactionEnabled = true;
	};

	/**
	 * Disable the interaction (hover and click events)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.disableInteraction();
	 * 
	 */
	FloorPlanService.disableInteraction = function() {
		FloorPlanService.interactionEnabled = false;
	};

	/**
	 * Toggle the interaction (hover and click events)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.toggleInteraction();
	 * 
	 */
	FloorPlanService.toggleInteraction = function() {
		FloorPlanService.interactionEnabled = !FloorPlanService.interactionEnabled;
	};

	/**
	 * Sets the active guids
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * @param    {string[]}                   activeSpaceGuids The guids that are active
	 */
	function setActiveGuids(type, guids, event) {
		FloorPlanService.activeGuids = guids;
		FloorPlanService.activeGuidsType = type;

		if (FloorPlanService.clickEventDispatchers && FloorPlanService.clickEventDispatchers.length > 0) {
			dispatchClickEvents(type, guids);
		}

		if (event && guids && Array.isArray(guids)) {
			dispatchPointEvent(event, guids[0]);
		}

	}


	/**
	 * Gets the active guids
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-01
	 * @return   {string[]}                   Array of guids that are active
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getActiveGuids();
	 *
	 * // [GlobalIds]
	 * 
	 */
	FloorPlanService.getActiveGuids = function() {
		return FloorPlanService.activeGuids;
	};

	/**
	 * Get the active guids type
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-07-31
	 * @return   {string}                   spaces || objects || assets
	 */
	FloorPlanService.getActiveGuidsType = function() {
		return FloorPlanService.activeGuidsType;
	};


	/**
	 * Show a floorplan object
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string[]}                   guids Array of guids
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.show([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.show([GlobalIds]).setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.show = function(guids) {

		if (guids) {

			if (Array.isArray(guids)) {

				for (var i = 0; i < guids.length; i++) {
					FloorPlanService.show(guids[i]);
				}

			} else {
				showObject(guids);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Show all floorplan objects
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.showAll();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.showAll().setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.showAll = function() {

		var elementGuids = getAllFloorPlanObjectGuids();
		for (var i = 0; i < elementGuids.length; i++) {
			showObject(elementGuids[i]);
		}

		return FloorPlanService;

	};

	/**
	 * Show object
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string}                   guid Guid to show
	 */
	function showObject(guid) {
		var element = getSvgElementByGuid(guid);
		removeClassFromSvgElement(element, "floor-plan-dimmed");
		removeClassFromSvgElement(element, "floorplan_invisible");
	}

	/**
	 * Hide a floorplan object by guid
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string[]}                   guids Array of guids
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.hide([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.hide([GlobalIds]).setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.hide = function(guids) {

		if (guids) {

			if (Array.isArray(guids)) {

				for (var i = 0; i < guids.length; i++) {
					FloorPlanService.hide(guids[i]);
				}

			} else {
				hideObject(guids);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Hide all floorplan objects
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.hideAll();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.hideAll().setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.hideAll = function() {

		var elementGuids = getAllFloorPlanObjectGuids();
		for (var i = 0; i < elementGuids.length; i++) {
			hideObject(elementGuids[i]);
		}

		return FloorPlanService;

	};

	/**
	 * Hide an object by guid
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string}                   guid Guid to hide
	 */
	function hideObject(guid) {
		var element = getSvgElementByGuid(guid);
		addClassToSvgElement(element, "floorplan_invisible");
	}

	/**
	 * Make floorplan objects transluscent
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string[]}                   guids Array of guids
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.transluscent([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.transluscent([GlobalIds]).setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.transluscent = function(guids) {

		if (guids) {

			if (Array.isArray(guids)) {
				for (var i = 0; i < guids.length; i++) {
					FloorPlanService.transluscent(guids[i]);
				}
			} else {
				transluscentObject(guid);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Make all floorplan objects transluscent
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.transluscentAll();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.transluscentAll().setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.transluscentAll = function() {

		var elementGuids = getAllFloorPlanObjectGuids();
		for (var i = 0; i < elementGuids.length; i++) {
			transluscentObject(elementGuids[i]);
		}

		return FloorPlanService;

	};

	/**
	 * Sets all paths in the floorplan transparent
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @deprecated This method is no longer officially supported, use transluscentAll instead
	 */
	FloorPlanService.setAllTransparent = function() {
		SlimLabsBimViewer.LoggerService.warn("[FloorPlanService.setAllTransparent] setAllTransparent is deprecated, use transluscentAll instead.");
		FloorPlanService.transluscentAll();
	};

	/**
	 * make object transluscent
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string}                   guid Guid to make transluscent
	 */
	function transluscentObject(guid) {
		var element = getSvgElementByGuid(guid);
		addClassToSvgElement(element, "floor-plan-dimmed");
	}

	function setPathTransparency(guid) {
		addClassToSvgElement(getSvgElementByGuid(guid), "floor-plan-dimmed");
	}

	/**
	 * Set the background color of the floorplan
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-20
	 * @param    {Object}                   options Options object
	 * @param 	 {String}					options.color Color to set the background to
	 */
	FloorPlanService.setBackgroundColor = function(options) {
		FloorPlanService.backgroundColor = options.color;
		if (document.getElementById("floorplan-backdrop-rect")) {
			document.getElementById("floorplan-backdrop-rect").style.fill = FloorPlanService.backgroundColor;
		}
		return FloorPlanService;
	};

	/**
	 * Sets the default fill color
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {Object}                   options Options object
	 * @param    {Object}                   options.color Color to set
	 */
	FloorPlanService.setDefaultFillColor = function(options) {
		FloorPlanService.styleSheet[".plan-wall, .plan-column"].fill = options.color;
	};

	/**
	 * Sets the default stroke color
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {Object}                   options Options object
	 * @param    {Object}                   options.color Color to set
	 */
	FloorPlanService.setDefaultStrokeColor = function(options) {
		FloorPlanService.styleSheet[".floor-plan-object-container"].stroke = options.color;
		FloorPlanService.styleSheet["#planDWG path, #planDWG circle"].stroke = options.color;
		regenerateCss();
	};

	/**
	 * Sets the fill for the passed GUID(s)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string|string[]}          guids the GUID(s) to set the fill for
	 * @param    {string}                   color HEX or RGB color
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setColor([GlobalIds], "#EEEEEE");
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setColor([GlobalIds], "#EEEEEE").hide([GlobalIds]);
	 * 
	 */
	FloorPlanService.setColor = function(guids, color) {

		if (guids) {

			if (Array.isArray(guids)) {
				for (var i = 0; i < guids.length; i++) {
					setPathFill(guids[i], color);
				}
			} else {
				setPathFill(guids, color);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Sets the fill of the passed GUID(s)
	 *
	 * @deprecated Use FloorPlanService.setColor instead
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {string|string[]}          guids GUID(s) to set the fill for
	 * @param    {string}                   color HEX or RGB color
	 */
	FloorPlanService.setFill = function(guids, color) {
		SlimLabsBimViewer.LoggerService.warn("[FloorPlanService.setFill] setFill is deprecated, use FloorPlanService.setColor instead.");
		FloorPlanService.setColor(guids, color);
	};

	/**
	 * Reset all colors
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.resetColors();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.resetColors().setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.resetColors = function() {

		$(".floor-plan-object-path").css("fill", "");

		return FloorPlanService;

	};

	/**
	 * Sets the fill color for the passed GUID
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string}                   guid  The GUID to set the fill for
	 * @param    {string}                   color Any valid HEX or RGB color
	 */
	function setPathFill(guid, color) {

		if (Array.isArray(guid)) {
			for (var i = 0; i < guid.length; i++) {
				setPathFill(guid[i], color);
			}
		} else {

			if (!color || color === "none") {
				color = null;
			}

			var selection = getSvgElementByGuid(guid, true);

			if (selection) {
				selection.style.fill = color;
			}

		}
	}

	/**
	 * Sets the stroke for the passed GUID(s)
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string|string[]}          guids the GUID(s) to set the stroke for
	 * @param    {string}                   color HEX or RGB color
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setStroke([GlobalIds], "#EEEEEE");
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setStroke([GlobalIds], "#EEEEEE").setColor([GlobalIds], "#EEEEEE");
	 * 
	 */
	FloorPlanService.setStrokeColor = function(guids, color) {

		if (guids) {

			if (Array.isArray(guids)) {
				for (var i = 0; i < guids.length; i++) {
					setPathStroke(guids[i], color);
				}
			} else if (guids) {
				setPathStroke(guids, color);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Reset all strokes to the default value
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.resetStrokes();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.resetStrokes().setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.resetStrokes = function() {

		$(".floor-plan-object-path").css("stroke", "");

		return FloorPlanService;

	};

	/**
	 * Set the stroke color for the passed guid
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string}                   guid  the GUID to set the stroke for
	 * @param    {string}                   color Valid HEX or RGB color
	 */
	function setPathStroke(guid, color) {

		if (Array.isArray(guid)) {
			for (var i = 0; i < guid.length; i++) {
				setPathStroke(guid[i], color);
			}
		} else {

			if (!color || color === "none") {
				color = null;
			}

			var selection = getSvgElementByGuid(guid, true);

			if (selection) {
				selection.style.stroke = color;
			}

		}

	}

	/**
	 * Sets the stroke width for the passed GUID(s). Note that the values are 
	 * relatively small. this has to do with the units of the SVG plan (meters)
	 * compared to the units of the SVG.
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string|string[]}          guids the GUID(s) to set the fill for
	 * @param    {Integer}                  width The width of the stroke
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setStrokeWidth([GlobalIds], 0.02); // Default values are really small!
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setStrokeWidth([GlobalIds], 0.02).setColor([GlobalIds]); // Default values are really small!
	 * 
	 */
	FloorPlanService.setStrokeWidth = function(guids, width) {

		if (guids) {

			if (Array.isArray(guids)) {
				for (var i = 0; i < guids.length; i++) {
					setPathStrokeWidth(guids[i], width);
				}
			} else {
				setPathStrokeWidth(guid, width);
			}

		}

		return FloorPlanService;

	};

	/**
	 * Reset all stroke widths to their default value
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.resetStrokeWidths([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.resetStrokeWidths([GlobalIds]).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.resetStrokeWidths = function() {

		$(".floor-plan-object-path").css("stroke-width", "");

		return FloorPlanService;

	};

	/**
	 * Sets the stroke for the passed GUID
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string}                   guid  The GUID to set the stroke for
	 * @param    {Integer}                  width Width in pixels
	 */
	function setPathStrokeWidth(guid, width) {

		if (Array.isArray(guid)) {
			for (var i = 0; i < guid.length; i++) {
				setPathStrokeWidth(guid[i], color);
			}
		} else {

			if (width === "none") {
				width = null;
			}

			var strokeWidth = width || null;

			var selection = getSvgElementByGuid(guid, true);

			if (selection) {
				selection.style['stroke-width'] = strokeWidth;
			}

		}
	}

	/**
	 * Sets text for the specified guid
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {string}                   guid   	The guid to set text for
	 * @param    {Object}                   options Options for the text
	 * @param    {string}                   options.content The content of the text
	 * @param    {string}                   [options.textColor="#000"] The color of the text
	 * @param    {float}                   [options.radius=0.5] The radius of the circle
	 * @param    {string}                   [options.fill="#F44336"] The fill of the circle
	 * @param    {float}                   [options.fillOpacity=0.6] The opacity of the circle
	 * @param    {string}                   [options.stroke="#000"] The stroke color of the circle
	 * @param    {float}                   [options.strokeWidth=0] The stroke width of the circle
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setSpaceText(GlobalId, {
	 * 	content: "14",
	 * 	textColor: "#222222",
	 * 	radius: 1,
	 * 	fill: "#CCC", 
	 * 	fillOpacity: 0.8,
	 * 	stroke: "#121212",
	 * 	strokeWidth: 1,
	 * });
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setSpaceText(GlobalId, {
	 * 	content: "14",
	 * 	textColor: "#222222",
	 * 	radius: 1,
	 * 	fill: "#CCC", 
	 * 	fillOpacity: 0.8,
	 * 	stroke: "#121212",
	 * 	strokeWidth: 1,
	 * }).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.setSpaceText = function setSpaceText(guid, options) {

		if (options.content) {
			var content = options.content;
			var textColor = options.textColor || "#000";
			var radius = options.radius || 0.5;
			var fill = options.fill || "#F44336";
			var fillOpacity = options.fillOpacity || 0.6;
			var stroke = options.stroke || "#000";
			var strokeWidth = options.strokeWidth || 0;

			var paths = getSvgElementByGuid(guid);

			for (var j = 0; j < paths.length; j++) {

				if (paths[j] !== null) {

					var lineData = [];

					for (var i = 0; i < paths[j].pathSegList.numberOfItems; i++) {
						lineData.push([paths[j].pathSegList.getItem(i).x, paths[j].pathSegList.getItem(i).y]);
					}

					var area = d3.geom.polygon(lineData);
					var centroid = area.centroid();

					var group = d3.select("#svgContainer").append("g")
						.attr("transform", "translate(0 " + (2 * centroid[1]) + ") scale(1 -1)")
						.attr("class", "space_text space_text " + guid);

					group.append("circle")
						.attr("cx", centroid[0])
						.attr("cy", centroid[1] - 0.15)
						.attr("r", radius)
						.attr("stroke", stroke)
						.attr("stroke-width", strokeWidth)
						.style({
							"fill": fill,
							"opacity": fillOpacity
						});

					var text = group.append("text")
						.attr("font-family", "sans-serif")
						.attr("font-size", "0.5px")
						.attr("text-anchor", "middle");

					text.append("tspan")
						.attr("x", centroid[0])
						.attr("y", centroid[1])
						.text(string(content))
						.attr("fill", textColor);
				}
			}

		} else {
			SlimLabsBimViewer.LoggerService.debug("[FloorPlanService.setSpaceText] options.content is required");
		}

		return FloorPlanService;

	};

	/**
	 * Reset all space texts
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Function}                 [callback] Callback function on complete
	 * @return   {Object}                            FloorPlanService
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.resetSpaceText([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.resetSpaceText([GlobalIds]).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.resetSpaceText = function resetSpaceText() {

		$("g.space_text").remove();

		return FloorPlanService;

	};

	/**
	 * Center and look at a specific object. 
	 * 
	 * @description
	 * The object will fill the FloorPlan container with a ratio of 0.75 of 
	 * the object compared to the cotnainer in eitherheight or width (determined 
	 * by which will fit the container first). 
	 * 
	 * This method 
	 * is used internally to make the container and FloorPlan responsive.
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {string}                  guid                  The GlobalId of the element to look at
	 * @param    {float}                   [elementContainerRatio=0.75]  The ratio of the element compared to the floorplan
	 *                                                            viewport
	 * @return   {Object}                                         FloorPlanService
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.lookAtObject(GlobalId, 0.7);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.lookAtObject(GlobalId, 0.7).setColor([GlobalIds]);
	 * 
	 * 
	 */
	FloorPlanService.lookAtObject = function(guid, elementContainerRatio) {

		elementContainerRatio = elementContainerRatio || FloorPlanService.containerRatio;

		var elementContainer = getSvgElementByGuid(guid, true);

		var success = false;

		FloorPlanService.centerObject(guid, function() {

			// Get the bounding client rects
			var outerRect = document.getElementById(FloorPlanService.viewParentId).getBoundingClientRect();
			var innerRect = elementContainer.getBoundingClientRect();

			// Calculate horizontal and vertical scale
			var horizontalScale = outerRect.width / innerRect.width;
			var verticalScale = outerRect.height / innerRect.height;

			// init finalScale variable
			var scale;

			// Get the current scale
			var matrix = $(FloorPlanService.panzoomSelector).panzoom("getMatrix");
			var currentScale = parseFloat(matrix[0]);

			// Determine which direction scale to use
			if (horizontalScale < verticalScale) {
				scale = horizontalScale;
			} else {
				scale = verticalScale;
			}

			// Add margin scale
			var marginScaleFactor = (outerRect.width - (FloorPlanService.margin) * 2) / outerRect.width;
			var scaleWithMargin = scale * marginScaleFactor;

			// Add ratio scale
			var scaleWithRatio = scaleWithMargin * elementContainerRatio;

			// Check if panzoom is disabled
			var panzoomWasDisabled = $(FloorPlanService.panzoomSelector).panzoom("isDisabled");

			// If it was disabled, temporary enable it
			if (panzoomWasDisabled) {
				$(FloorPlanService.panzoomSelector).panzoom("enable");
			}

			var focalObj = {
				clientX: (outerRect.right - (0.5 * outerRect.width)),
				clientY: (outerRect.bottom - (0.5 * outerRect.height))
			};

			if (focalObj.clientX !== 0 && focalObj.clientY !== 0) {
				$(FloorPlanService.panzoomSelector).panzoom("zoom", (currentScale * scaleWithRatio), {
					focal: focalObj,
					maxScale: FloorPlanService.maxScale,
					minScale: FloorPlanService.minScale,
				});
			}

			// If it was disabled, disable it again
			if (panzoomWasDisabled) {
				$(FloorPlanService.panzoomSelector).panzoom("disable");
			}

			success = true;

		});

		if (typeof callback === 'function') {
			callback(success);
		}

		return FloorPlanService;

	};

	/**
	 * Deprecated version of 'lookAtObject'
	 *
	 * @deprecated No longer supported, use 'lookAtObject instead'
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {string}                   guid                  The GlobalId to look at
	 * @param    {float}                   elementContainerRatio the ratio compared to the floorplan container
	 */
	FloorPlanService.lookAt = function(guid, elementContainerRatio) {
		SlimLabsBimViewer.LoggerService.warn("[FloorPlanService.lookAt] lookAt is deprecated, use FloorPlanService.lookAtObject instead.");
		FloorPlanService.lookAtObject(guid, elementContainerRatio);
	};

	FloorPlanService.setMoveElementObjects = function(objects) {
		FloorPlanService.moveElementsObjects = objects;
	};

	FloorPlanService.getMoveElementObjects = function() {
		return FloorPlanService.moveElementsObjects;
	};

	function isGuidInMoveElementsObjects(guid) {

		var found = false;

		if (FloorPlanService.moveElementsObjects && FloorPlanService.moveElementsObjects.constructor === Array) {
			for (var i = 0; i < FloorPlanService.moveElementsObjects.length; i++) {
				if (guid === FloorPlanService.moveElementsObjects[i].ifcguid) {
					found = true;
				}
			}
		}

		return found;
	}

	function getMoveElementForGuid(guid) {

		if (FloorPlanService.moveElementsObjects && FloorPlanService.moveElementsObjects.constructor === Array) {
			for (var i = 0; i < FloorPlanService.moveElementsObjects.length; i++) {
				if (guid === FloorPlanService.moveElementsObjects[i].ifcguid) {
					return FloorPlanService.moveElementsObjects[i];
				}
			}
		}

		return null;
	}

	/**
	 * Enable all tooltips
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.enableAllTooltips();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.enableAllTooltips().setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.enableAllToolTips = function() {
		$(".floor-plan-object-path").tooltip(FloorPlanService.tooltipOptions);
	};

	/**
	 * Disable all tooltips
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.disableAllToolTips();
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.disableAllToolTips().setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.disableAllToolTips = function() {
		$(".floor-plan-object-path").tooltip("destroy");
	};

	/**
	 * Enable tooltips for guids
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string[]}                   guids Array of guids
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.enableToolTipForGuids([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.enableToolTipForGuids([GlobalIds]).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.enableToolTipForGuids = function(guids) {
		if (guids) {
			for (var i = 0; i < guids.length; i++) {
				getSvgElementByGuid(guids[i], false, true).tooltip(FloorPlanService.tooltipOptions);
			}
		}
	};

	/**
	 * Disable tooltips for guids
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string[]}                   guids Array of guids
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.disableToolTipForGuids([GlobalIds]);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.disableToolTipForGuids([GlobalIds]).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.disableToolTipForGuids = function(guids) {
		if (guids) {
			for (var i = 0; i < guids.length; i++) {
				getSvgElementByGuid(guids[i]).tooltip("destroy");
			}
		}
	};

	/**
	 * Set the minimum zoom scale
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Integer}                   scale Zoom scale
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setMinScale(2);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setMinScale(2).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.setMinScale = function(scale) {
		FloorPlanService.minScale = scale;
	};

	/**
	 * Get the minimum zoom scale
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @return   {Integer}                   The current minimum zoom scale
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getMinScale();
	 * 
	 */
	FloorPlanService.getMinScale = function() {
		return FloorPlanService.minScale;
	};

	/**
	 * Set the maximum zoom scale
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Integer}                   scale Zoom scale
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setMaxScale(150);
	 *
	 */
	FloorPlanService.setMaxScale = function(scale) {
		FloorPlanService.maxScale = scale;
	};

	/**
	 * Get the maximum zoom scale
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @return   {Integer}                   The current maximum zoom scale
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getMaxScale([GlobalIds]);
	 * 
	 */
	FloorPlanService.getMaxScale = function() {
		return FloorPlanService.maxScale;
	};

	/**
	 * Set the zoom increment
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Integer}                   increment The zoom increment factor
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setZoomIncrement(2);
	 *
	 * // Using chaining
	 * SlimLabsBimViewer.FloorPlanService.setZoomIncrement(2).setColor([GlobalIds]);
	 * 
	 */
	FloorPlanService.setZoomIncrement = function(increment) {
		FloorPlanService.zoomIncrement = increment;
	};

	/**
	 * Get the current zoom increment factor
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @return   {Integer}                   The current zoom increment factor
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getZoomIncrement();
	 * 
	 */
	FloorPlanService.getZoomIncrement = function() {
		return FloorPlanService.zoomIncrement;
	};

	/**
	 * Get the current zoom
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @return   {Float}                   The current zoom factor
	 */
	FloorPlanService.getZoom = function() {
		return parseFloat($(FloorPlanService.panzoomSelector).attr("transform").split("(")[1].split(",")[0]);
	};


	/**
	 * Set the current DWG
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @param    {string}                   dwg SVG string
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setDwg("DwgString");
	 * 
	 */
	FloorPlanService.setDwg = function(dwg) {
		if (FloorPlanService.initialized) {
			FloorPlanService.dwg = dwg;
			FloorPlanService.planDwgG.innerHTML = FloorPlanService.dwg;
		}
	};

	/**
	 * Get the current dwg
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @return   {string}                   SVG string
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getDwg();
	 * 
	 */
	FloorPlanService.getDwg = function() {
		return FloorPlanService.dwg;
	};

	/**
	 * Sets the visibility for the planDWG
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {Boolean}			visible true for visible, false for invisible
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.setDwgVisibility(true);
	 * 
	 */
	FloorPlanService.setDwgVisibility = function(visible) {

		if (visible) {

			$("#planDWG").css({
				"visibility": "visible"
			});
			FloorPlanService.dwg = visible;

		} else {

			$("#planDWG").css({
				"visibility": "hidden"
			});
			FloorPlanService.dwg = visible;

		}

	};

	/**
	 * Get the current DWG visibility
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-09
	 * @return   {Boolean}                   Whether or not the DWG is visible
	 *
	 * @example
	 *
	 * SlimLabsBimViewer.FloorPlanService.getDwgVisibility();
	 * 
	 */
	FloorPlanService.getDwgVisibility = function() {
		return FloorPlanService.dwgVisibility;
	};

	/**
	 * Center an object
	 *
	 * @access   public
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {string}                   guid     The GlobalId of the object to center.
	 * @param    {Function}                 callback Callback function
	 */
	FloorPlanService.centerObject = function(guid, callback) {

		return new Promise(function(resolve, reject) {

			var paths = getSvgElementByGuid(guid);

			var success = false;

			if (paths.length === 1) {

				var innerRect = paths[0].getBoundingClientRect();
				var outerRect = document.getElementById(FloorPlanService.svgId).getBoundingClientRect();

				var svgCenter = {
					x: (outerRect.right - outerRect.left - (0.5 * outerRect.width)),
					y: (outerRect.bottom - (0.5 * outerRect.height))
				};

				var spaceCenter = {
					x: (innerRect.right - outerRect.left - (0.5 * innerRect.width)),
					y: (innerRect.bottom - (0.5 * innerRect.height)),
				};

				// Check if panzoom is disabled
				var panzoomWasDisabled = $(FloorPlanService.panzoomSelector).panzoom("isDisabled");

				// If it was disabled, temporary enable it
				if (panzoomWasDisabled) {
					enableControls();
				}

				$(FloorPlanService.panzoomSelector).panzoom("pan", (svgCenter.x - spaceCenter.x), (svgCenter.y - spaceCenter.y), {
					relative: true
				});

				// If it was disabled, disable it again
				if (panzoomWasDisabled) {
					disableControls();
				}

				success = true;

			}

			if (success) {
				SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve);
			} else {
				SlimLabsBimViewer.HelperService.handleCallbackReject(callback, reject);
			}

		});

	};

	/**
	 * Get the center of an object
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {string}                   guid GlobalId of the object to get the center for
	 */
	FloorPlanService.getCenterOfObject = function(guid) {

		var path = getSvgElementByGuid(guid);

		var centroid = null;

		if (path.length === 1) {

			path = path[0];

			var lineData = [];

			for (var i = 0; i < path.pathSegList.numberOfItems; i++) {
				lineData.push([path.pathSegList.getItem(i).x, path.pathSegList.getItem(i).y]);
			}

			var polygon = d3.geom.polygon(lineData);
			centroid = polygon.centroid();

		}

		return centroid;
	};

	/**
	 * Check if one path is contained in another
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-10-05
	 * @param    {Object}        path            The path to check the containment for
	 * @param    {Object}        containmentPath The path that should or should not contain the path
	 */
	FloorPlanService.pathIsContainedInPath = function(path, containmentPath) {

		var points = getPointArrayFromPath(path, false);
		var containmentPathstring = containmentPath.attr("d");

		var contained = false;

		if (points.length > 0 && containmentPathstring) {

			contained = true;

			for (var i = 0; i < points.length; i++) {
				if (contained) {
					contained = pointIsContainedInPolygon(containmentPathstring, points[i]);
				}
			}

		}

		return contained;
	};

	// Transformationobject = { type: [float,float] }
	// e.g.:    			  { translate: [-5.13123,7.12312] , matrix: [1,2,3,4,-5,6] , scale: [1,2] }
	FloorPlanService.setTransformElement = function(guid, transformationObject, originalTransform, callback) {

		return new Promise(function(resolve, reject) {

			var svgElement = getSvgElementByGuid(guid);

			if (svgElement.length === 1) {

				svgElement = svgElement[0];

				var transformMap = constructTransformMapFromstring(originalTransform);

				for (var key in transformationObject) {

					if (transformMap[key]) {
						switch (key) {
							case "translate":
							case "rotate":
								for (var i = 0; i < transformationObject[key].length; i++) {
									transformMap[key][i] += transformationObject[key][i];
								}
								break;
							case "scale":
								for (var i = 0; i < transformationObject[key].length; i++) {
									transformMap[key][i] *= transformationObject[key][i];
								}
								break;
						}

					} else {
						transformMap[key] = transformationObject[key];
					}
				}

				var temporaryNewTransform = consructTransformstringFromTransformMap(jQuery.extend(true, {}, transformMap));

				$(svgElement).attr("transform", temporaryNewTransform);

				if (callback) {
					SlimLabsBimViewer.HelperService.handleCallbackResolve(callback, resolve, temporaryNewTransform);
				}

			}

		});

	};



	/******************************
				HELPERS
	******************************/

	function regenerateCss() {

		// Remove current styles
		var currentCssElement = document.getElementById("slimlabs-floorplan-styles");
		if (currentCssElement) {
			currentCssElement.innerHTML = "";
		}

		// Generate css from JSON
		var css = jsonToCss(FloorPlanService.styleSheet);

		// Create style element and add it to DOM
		var cssStyle = document.createElement("style");
		cssStyle.setAttributeNS(null, "type", "text/css");
		cssStyle.innerHTML = css;


		currentCssElement.appendChild(cssStyle);

	}

	function jsonToCss(json) {
		var selectors = Object.keys(json);
		return selectors.map(function(selector) {
			var definition = json[selector];
			var rules = Object.keys(definition);
			var result = rules.map(function(rule) {
				return rule + ":" + definition[rule];
			}).join(';');
			return selector + "{" + result + "}";
		}).join('\n');
	}


	function resolveSpaceObjectClass() {

		if ($(".floor-plan-object").length > 0) {

			var spacePaths = $(".floor-plan-space");

			for (var i = 0; i < spacePaths.length; i++) {
				addClassToSvgElement(spacePaths[i], "floor-plan-space-with-objects");
			}

			var grossPaths = $("g.floor-plan-gross");

			for (var j = 0; j < grossPaths.length; j++) {
				addClassToSvgElement(grossPaths[j], "floor-plan-gross-with-objects");
			}
		}

	}

	function removeSpaceObjectClass() {

		var spacePaths = $(".floor-plan-space");

		for (var i = 0; i < spacePaths.length; i++) {
			removeClassFromSvgElement(spacePaths[i], "floor-plan-space-with-objects");
		}

		var grossPaths = $("g.floor-plan-gross");

		for (var j = 0; j < grossPaths.length; j++) {
			removeClassFromSvgElement(grossPaths[j], "floor-plan-gross-with-objects");
		}
	}

	function zoomCompleteDrawing() {

		var viewParent = document.getElementById(FloorPlanService.svgId);

		if (viewParent) {
			viewParent.style.height = getViewPortTransformHeight();
		}

		FloorPlanService.lookAtObject("drawing-holder");
	}

	function resolveLoadingState() {
		if (!FloorPlanService.spaceRendering && !FloorPlanService.objectRendering && !FloorPlanService.assetRendering) {
			setLoading(false);
		} else {
			setLoading(true);
		}
	}

	function isEventSupported(eventName) {

		FloorPlanService.eventCheckCache = FloorPlanService.eventCheckCache || {};

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
		if (FloorPlanService.eventCheckCache[shortEventName]) {
			return FloorPlanService.eventCheckCache[shortEventName];
		}
		var elt = TAGNAMES[shortEventName] == 'win' ? window : document.createElement(TAGNAMES[shortEventName] || 'div');
		eventName = 'on' + shortEventName;
		var eventIsSupported = (eventName in elt);
		if (!eventIsSupported) {
			elt.setAttribute(eventName, 'return;');
			eventIsSupported = typeof elt[eventName] == 'function';
		}
		elt = null;
		FloorPlanService.eventCheckCache[shortEventName] = eventIsSupported;
		return eventIsSupported;
	}

	function getViewPortTransformHeight() {
		return document.getElementById(FloorPlanService.svgId).parentElement.clientHeight;
	}

	function initializeElementInteraction(options) {

		if (isEventSupported("onpointerdown")) {

			/////////////////////////////////////
			// If pointer events are supported //
			/////////////////////////////////////

			options.element.onpointerenter = function(event) {
				dispatchHoverEvents(options.type, [options.data || event.target.getAttribute("ifcguid")]);
			};

			options.element.onpointerdown = function(event) {
				setActiveGuids(options.type, [options.data || event.target.getAttribute("ifcguid")], event);
				selectEditingElement(event, options.data || event.target.getAttribute("ifcguid"));
			};

		} else if (isEventSupported("ontouchstart")) {

			///////////////////////////////////
			// If touch events are supported //
			///////////////////////////////////

			options.element.ontouchstart = function(event) {
				selectEditingElement(event, options.data || event.target.getAttribute("ifcguid"));

				if (FloorPlanService.clickEventDispatchers && FloorPlanService.clickEventDispatchers.length > 0) {
					// Make sure that someone has time to put two fingers on the screen
					if (event.touches.length === 1) {
						FloorPlanService.clickEventDispatchTime = event.timeStamp;
						FloorPlanService.clickEventDispatchTimeout = setTimeout(function() {
							setActiveGuids(options.type, [options.data || event.target.getAttribute("ifcguid")], event);
							FloorPlanService.clickEventDispatchTimeout = null;
							FloorPlanService.clickEventDispatchTime = null;
						}, 200);
					} else {
						if (FloorPlanService.clickEventDispatchTimeout) {
							if (event.timeStamp - FloorPlanService.clickEventDispatchTime < 200) {
								clearTimeout(FloorPlanService.clickEventDispatchTimeout);
							}
						}
					}

				}

			};

		} else if (isEventSupported("onmousedown")) {

			///////////////////////////////////
			// If mouse events are supported //
			///////////////////////////////////

			options.element.onmouseenter = function(event) {
				dispatchHoverEvents(options.type, [options.data || event.target.getAttribute("ifcguid")]);
			};

			options.element.onmousedown = function(event) {
				setActiveGuids(options.type, [options.data || event.target.getAttribute("ifcguid")], event);
				selectEditingElement(event, event.target.getAttribute("ifcguid"));
			};

		}
	}

	/**
	 * Handles different click events
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Object}                   event Angular event object
	 */
	function clickBackgroundRectDown(event) {

		// Set the single touch location as base attributes of the event
		if (event.touches && event.touches.length === 1) {
			event.clientX = event.touches[0].clientX;
			event.clientY = event.touches[0].clientY;
		}

		if (FloorPlanService.interactionEnabled) {

			if (event.type === "mousedown" || event.type === "pointerdown" || event.type === "touchstart") {

				if (event.currentTarget.id === "floorplan-backdrop-rect" || event.target.id === "floorplan-backdrop-rect") {
					FloorPlanService.lastmousedown.x = event.clientX;
					FloorPlanService.lastmousedown.y = event.clientY;
				}

			}

		}
	}

	/**
	 * Handles different click events
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Object}                   $event Angular event object
	 */
	function clickBackgroundRectUp(event) {

		// Set the single touch location as base attributes of the event
		if (event.changedTouches && event.changedTouches.length === 1) {
			event.clientX = event.changedTouches[0].clientX;
			event.clientY = event.changedTouches[0].clientY;
		}

		if (FloorPlanService.interactionEnabled) {

			if (
				((event.clientX - FloorPlanService.lastmousedown.x < 5 && event.clientX - FloorPlanService.lastmousedown.x >= 0) ||
					(event.clientX - FloorPlanService.lastmousedown.x > -5 && event.clientX - FloorPlanService.lastmousedown.x <= 0)) &&
				((event.clientY - FloorPlanService.lastmousedown.y < 5 && event.clientY - FloorPlanService.lastmousedown.y >= 0) ||
					(event.clientY - FloorPlanService.lastmousedown.y > -5 && event.clientY - FloorPlanService.lastmousedown.y <= 0))
			) {
				setActiveGuids(null, null);
			}

		}
	}

	/**
	 * Sets the start line for touch interaction
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Object}                   e Javascript event object
	 */
	function setStartLine(e) {
		if (e.touches.length === 2) {
			FloorPlanService.initLength = (Math.sqrt(Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)));
		} else if (e.touches.length === 1) {
			if ((e.clientX) && (e.clientY)) {
				FloorPlanService.positionX = e.clientX;
				FloorPlanService.positionY = e.clientY;
			} else if (e.targetTouches) {
				FloorPlanService.positionX = e.targetTouches[0].clientX;
				FloorPlanService.positionY = e.targetTouches[0].clientY;
			}
		}
	}

	function removeStartLine() {
		delete FloorPlanService.initLength;
	}

	function removeTouchAmountTransition() {
		delete FloorPlanService.lastToucMoveWasTwoFinger;
		delete FloorPlanService.touchAmountTransition;
		delete FloorPlanService.touchAmountTransitionOffset;
	}

	function resetTouchOffset() {
		FloorPlanService.touchOffset = {
			x: 0,
			y: 0,
		};
	}

	/**
	 * Touch event interaction handler
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 * @param    {Object}                   e Javascript event object
	 */
	function touchHandler(e) {

		var oldX = FloorPlanService.positionX;
		var oldY = FloorPlanService.positionY;

		var matrix = $(FloorPlanService.panzoomSelector).panzoom("getMatrix");

		/////////////////////////////
		//Dragging with one finger //
		/////////////////////////////
		if (e.touches.length === 1) {

			// console.log("FloorPlanService.lastTouchMoveWasTwoFinger", FloorPlanService.lastTouchMoveWasTwoFinger);

			var twoFingerX;
			var twoFingerY;

			if (FloorPlanService.lastTouchMoveWasTwoFinger) {
				twoFingerX = FloorPlanService.positionX;
				twoFingerY = FloorPlanService.positionY;
			} else {
				resetTouchOffset();
			}

			if ((e.clientX) && (e.clientY)) {
				FloorPlanService.positionX = e.clientX;
				FloorPlanService.positionY = e.clientY;
			} else if (e.targetTouches) {
				FloorPlanService.positionX = e.targetTouches[0].clientX;
				FloorPlanService.positionY = e.targetTouches[0].clientY;
			}

			if (twoFingerX && twoFingerY) {
				FloorPlanService.touchOffset = {
					x: twoFingerX - FloorPlanService.positionX,
					y: twoFingerY - FloorPlanService.positionY,
				};
			}

			FloorPlanService.newPositionX = oldX - FloorPlanService.positionX - FloorPlanService.touchOffset.x;
			FloorPlanService.newPositionY = oldY - FloorPlanService.positionY - FloorPlanService.touchOffset.y;


			$(FloorPlanService.panzoomSelector).panzoom("pan", parseFloat(matrix[4]) - parseFloat(FloorPlanService.newPositionX), parseFloat(matrix[5]) - parseFloat(FloorPlanService.newPositionY));

			FloorPlanService.lastTouchMoveWasTwoFinger = false;

			//////////////////////////
			// dragging and zooming //
			//////////////////////////
		} else if (e.touches.length === 2) {

			FloorPlanService.lastTouchMoveWasTwoFinger = true;

			if (!FloorPlanService.initLength) {
				setStartLine(e);
			}

			var currentLength;

			/////////
			//Drag //
			/////////
			if ((e.clientX) && (e.clientY)) {

				FloorPlanService.positionX = e.clientX;
				FloorPlanService.positionY = e.clientY;

			} else if (e.touches) {

				FloorPlanService.positionX = ((e.touches[0].clientX + e.touches[1].clientX) / 2);
				FloorPlanService.positionY = ((e.touches[0].clientY + e.touches[1].clientY) / 2);

				// Calculate length of the line
				currentLength = (Math.sqrt(Math.pow(e.touches[1].clientX - e.touches[0].clientX, 2) + Math.pow(e.touches[1].clientY - e.touches[0].clientY, 2)));

				e.preventDefault();
			}

			FloorPlanService.newPositionX = oldX - FloorPlanService.positionX;
			FloorPlanService.newPositionY = oldY - FloorPlanService.positionY;

			var focalObj = {
				clientX: parseFloat(FloorPlanService.positionX),
				clientY: parseFloat(FloorPlanService.positionY)
			};

			if (FloorPlanService.newPositionX > 75 || FloorPlanService.newPositionY > 75 || FloorPlanService.newPositionX < -75 || FloorPlanService.newPositionY < -75) {
				///////////////////////////////
				// Do Nothing, within marges //
				///////////////////////////////
			} else {
				$(FloorPlanService.panzoomSelector).panzoom("pan", parseFloat(matrix[4]) - parseFloat(FloorPlanService.newPositionX), parseFloat(matrix[5]) - parseFloat(FloorPlanService.newPositionY));
			}

			var scale = (currentLength / FloorPlanService.initLength) * SlimLabsBimViewer.FloorPlanService.currentScale;

		} else {
			//////////////////////////
			//more than two touches //
			//////////////////////////
		}

	}

	function dispatchPointEvent(event, guid) {

		var point = getClickedPoint(event);
		dispatchClickedPointEvents(event, point, guid);

	}

	/**
	 * Moves the currently selected object
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-12-01
	 * @param    {Object}                   $event jQuery event object
	 */
	function moveEditingElement(event) {

		if (FloorPlanService.moveElementsObjects) {
			if (event.target.getAttribute("ifcguid")) {
				if (isGuidInMoveElementsObjects(event.target.getAttribute("ifcguid"))) {

					if (FloorPlanService.editingElementObject) {

						var screenX;
						var screenY;

						// Set the single touch location as base attributes of the event
						if (event.touches && event.touches.length === 1) {
							screenX = event.touches[0].screenX;
							screenY = event.touches[0].screenY;
						} else {
							screenX = event.screenX;
							screenY = event.screenY;
						}

						// Check if the required variables are present
						if (FloorPlanService.selectAssetCoordinates && FloorPlanService.editingElementObject) {

							// Set the translation object. Screen coordinates substracted divided by the current zoom
							var elementTranslation = {
								translate: [
									((FloorPlanService.selectAssetCoordinates.x - screenX) / getZoom()) * -1, // SVG is inverted, which is weird, since the y is inverted...
									(FloorPlanService.selectAssetCoordinates.y - screenY) / getZoom(),
									]
							};

							// Passes the required information to the floorplan service
							setTransformElement(FloorPlanService.editingElementObject.ifcguid, elementTranslation, FloorPlanService.selectedElementCurrentTransform, function(newTransform) {
								FloorPlanService.temporaryNewTransform = newTransform;
							});

						}
					}

				}
			}
		}
	}

	/**
	 * Runs when an element is clicked while being tagged as editable
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-12-01
	 * @param    {Object}                   event      jQuery event
	 * @param    {string}                   elementguid The guid of the element that is clicked
	 */
	function selectEditingElement(event, elementguid) {

		if (isGuidInMoveElementsObjects(event.target.getAttribute("ifcguid"))) {

			// Set the single touch location as base attributes of the event
			if (event.touches && event.touches.length === 1) {
				event.screenX = event.touches[0].screenX;
				event.screenY = event.touches[0].screenY;
			}

			FloorPlanService.editingElementObject = getMoveElementForGuid(event.target.getAttribute("ifcguid"));

			// Store the current transform of the element
			FloorPlanService.selectedElementCurrentTransform = FloorPlanService.editingElementObject.svgtransform || "transform(0,0)";

			// Store the place where the editingElementObject is clicked (screen coordinates)
			FloorPlanService.selectAssetCoordinates = {
				x: event.screenX,
				y: event.screenY,
			};

		}
	}

	/**
	 * Runs when the mouse is released while dragging. Stores the latest drag location as 
	 * svgtransform attribute in the cached object
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-12-01
	 * @param    {Object}                   event jQuery event object
	 */
	function deselectEditingElement(event) {

		if (FloorPlanService.editingElementObject) {
			// Set the new transform in the cached element
			FloorPlanService.editingElementObject.svgtransform = FloorPlanService.temporaryNewTransform;

			$(".tooltip").remove();

			delete FloorPlanService.selectAssetCoordinates;
			delete FloorPlanService.selectedElementCurrentTransform;
			delete FloorPlanService.editingElementObject;
		}
	}

	/**
	 * Draws a selectangle and selects elements by using an event object
	 *
	 * @access   public
	 * @memberof FloorPlanInteractionService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {Object}                   event Javascript event object
	 */
	function drawSelectangle(event) {

		if (event.shiftKey) {

			var svgBBox = $("#planSVG")[0].getBBox();

			if (svgBBox !== undefined) {

				var s = d3.select("#svgContainer").select("rect.selection");

				var point = getClickedPoint(event);
				var xCo = point.x;
				var yCo = point.y;

				if (event.shiftKey && $('#selectangle').length === 0) {

					d3.select("#svgContainer").append("rect").attr({
						class: "selection",
						id: "selectangle",
						x: xCo,
						y: yCo,
						width: 0,
						height: 0,
					});

				} else if (event.shiftKey) {

					if (!s.empty()) {

						var d = {
								x: parseFloat(s.attr("x"), 10),
								y: parseFloat(s.attr("y"), 10),
								width: parseFloat(s.attr("width"), 10),
								height: parseFloat(s.attr("height"), 10)
							},
							move = {
								x: xCo - d.x,
								y: yCo - d.y
							};

						var dx = d.x;
						var dy = d.y;
						var dw = d.width;
						var dh = d.height;

						if (move.x * 2 < d.width) {
							d.x = xCo;
							d.width -= move.x;
						} else {
							d.width = move.x;
						}

						if (move.y * 2 < d.height) {
							d.y = yCo;
							d.height -= move.y;
						} else {
							d.height = move.y;
						}

						s.attr(d);

						$('g.state.selection.selected').removeClass("selected");

						d3.selectAll('g.floor-plan-object-container > path').each(function(state_data, i) {

							var bbox = FloorPlanService.getBBox();
							var guid = $(this).attr("ifcguid");

							if (dx < bbox.x && dy < bbox.y && dx + dw > bbox.x + bbox.width && dy + dh > bbox.y + bbox.height) {

								d3.select(FloorPlanService.parentNode).classed("selected", true);

								if (FloorPlanService.currentActive && FloorPlanService.currentActive.indexOf(guid) == -1) {
									FloorPlanService.currentActive.push(guid);
								}

							} else {
								if (FloorPlanService.currentActive && FloorPlanService.currentActive.indexOf(guid) >= 0) {
									FloorPlanService.currentActive.splice(FloorPlanService.currentActive.indexOf(guid), 1);
								}

							}

						});

					}

				}

			}

		}
	}

	function getCurrentScale() {
		return $(FloorPlanService.panzoomSelector).panzoom("getMatrix")[0];
	}

	/**
	 * Sets the currentscale by the panzoomelement matrix
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-06-08
	 */
	function setCurrentScale() {
		FloorPlanService.currentScale = $(FloorPlanService.panzoomSelector).panzoom("getMatrix")[0];
	}

	/**
	 * Zooms the floorplan using panzoom and an event.
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {Object}                   e        Javascript event object
	 * @param    {Object}                   $panzoom PanZoom object
	 */
	function zoomSvg(e, $panzoom) {

		e.preventDefault();

		var delta = e.delta || e.originalEvent.wheelDelta;
		if (!delta) {
			delta = -1 * e.originalEvent.detail;
		}

		var scale = 1.1;

		if (delta ? delta < 0 : e.originalEvent.deltaY > 0) {
			scale = 1 / scale;
		}

		$panzoom.panzoom('zoom', (scale * $(FloorPlanService.panzoomSelector).panzoom("getMatrix")[0]), {
			focal: e,
		});
	}

	/**
	 * Returns the prototype of the passed thing
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {*}                   thing The thing to evaluate
	 * @return   {string}                    The type of the thing as string
	 */
	function checkType(thing) {

		var type = Object.prototype.tostring.call(thing);
		type = type.split(" ")[1];
		type = type.substring(0, type.length - 1);

		return type;
	}

	function getSvgTransformMap(svgElement) {

		// Check if the element has a transform attr
		if ($(svgElement).attr("transform")) {
			return constructTransformMapFromstring($(svgElement).attr("transform"));
		} else {
			return null;
		}
	}

	function constructTransformMapFromstring(transformstring) {

		// Contstuct base map
		var map = {};

		// Get the individual transforms§
		var transforms = transformstring.split(" ");

		// Loop over the transforms
		for (var i = 0; i < transforms.length; i++) {

			// get the name of the transform
			var type = transforms[i].split("(")[0];

			// Get the content between brackets as array
			var content = transforms[i].split("(")[1].split(")")[0].split(",");

			// Convert the individual content values to floats
			for (var j = 0; j < content.length; j++) {
				content[j] = parseFloat(content[j]);
			}

			// Add the transform to the mapping object
			map[type] = content;

		}

		// Return the map
		return map;
	}

	function consructTransformstringFromTransformMap(map) {

		var transform = "";

		for (var key in map) {
			transform += key + "(" + map[key].join(",") + ") ";
		}

		return transform.trim();
	}

	/**
	 * Internal helper for removing classes from SVG elements which jQuery
	 * does not natively do
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {DOMelement}               element       The DOM element to remove the class from
	 * @param    {string}                   classToRemove The class to remove
	 */
	function removeClassFromSvgElement(element, classToRemove) {
		if ($(element).attr("class")) {
			$(element).attr("class", $(element).attr("class").replace(" " + classToRemove, ""));
		}
	}

	/**
	 * Internal helper for adding classes from SVG elements which jQuery
	 * does not natively do
	 *
	 * @access   private
	 * @memberof FloorPlanService
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2016-06-03
	 * @param    {DOMelement}               element       The DOM element to add the class from
	 * @param    {string}                   classToRemove The class to add
	 */
	function addClassToSvgElement(element, classToAdd) {
		if ($(element).attr("class") && $(element).attr("class").indexOf(classToAdd) === -1) {
			$(element).attr("class", $(element).attr("class") + " " + classToAdd);
		}
	}

	function getSvgElementByGuid(guid, native, multiple) {
		if (multiple) {
			if (native) {
				return document.querySelectorAll('[guid="' + convertGuid(guid) + '"]');
			} else {
				return $("[guid='" + convertGuid(guid) + "']");
			}
		} else {
			if (native) {
				return document.getElementById("floor-plan-object-path-" + convertGuid(guid));
			} else {
				return $("#floor-plan-object-path-" + convertGuid(guid));
			}
		}
	}

	function getAllFloorPlanObjects() {
		var elements = $(".floor-plan-object-container");
		return elements;
	}

	function getAllFloorPlanObjectGuids() {
		var elements = getAllFloorPlanElements();
		var guids = [];
		for (var i = 0; i < elements.length; i++) {
			if (elements[i].children[0].getAttribute("ifcguid")) {
				guids.push(elements[i].children[0].getAttribute("ifcguid"));
			}
		}

		return guids;
	}

	function getAllFloorPlanElements() {
		return document.getElementsByClassName("floor-plan-object-container");
	}

	function pointIsContainedInPolygon(pathstring, point) {
		return pointInSvgPolygon.isInside(point, pathstring);
	}

	function getPointArrayFromPath(path, all) {

		var points = [];
		var unwantedPathCommandLetters = ["M", "m", "Z", "z"];

		if (path.pathSegList) {
			for (var i = 0; i < path.pathSegList.numberOfItems; i++) {
				if (all || unwantedPathCommandLetters.indexOf(path.pathSegList.getItem(i).pathSegTypeAsLetter) === -1) {
					points.push([path.pathSegList.getItem(i).x, path.pathSegList.getItem(i).y]);
				}
			}
		}

		return points;
	}

	function getClickedPoint(event) {

		// Get the transformation matrix
		var matrix = $("#panzoomEl").panzoom("getMatrix");

		// Get the client rect of the svg element
		var svgClientRect = document.getElementById(FloorPlanService.svgId).getBoundingClientRect();

		// Find the pageX and pageY
		var pageX = event.clientX;
		var pageY = event.clientY;

		// find the svg click coordinates
		var svgX = pageX - svgClientRect.left;
		var svgY = pageY - svgClientRect.top;

		// calculate the clicked point location in floorplan coordinates
		var xCo = (svgX - parseFloat(matrix[4])) / getCurrentScale();
		var yCo = -1 * (svgY - parseFloat(matrix[5])) / getCurrentScale();

		return {
			x: xCo,
			y: yCo
		};

	}

	function uuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.tostring(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	function convertGuid(guid) {
		if (guid !== null && guid !== undefined && !Array.isArray(guid)) {
			return guid.replace(/\$/g, 'ç');
		} else if (Array.isArray(guid)) {
			guid = guid.map(function(g) {
				return g.replace(/\$/g, 'ç');
			});
			return guid;
		}
		return null;
	}

	function dispatchHoverEvents(type, guid) {
		if (FloorPlanService.interactionEnabled) {
			for (var i = 0; i < FloorPlanService.hoverEventDispatchers.length; i++) {
				FloorPlanService.hoverEventDispatchers[i](type, guid);
			}
		}
	}

	function dispatchClickEvents(type, guid) {
		if (FloorPlanService.interactionEnabled) {
			for (var i = 0; i < FloorPlanService.clickEventDispatchers.length; i++) {
				FloorPlanService.clickEventDispatchers[i](type, guid);
			}
		}
	}

	function dispatchRenderstateEvents(renderstate) {
		for (var i = 0; i < FloorPlanService.renderStateEventDispatchers.length; i++) {
			FloorPlanService.renderStateEventDispatchers[i](renderstate);
		}
	}

	function dispatchClickedPointEvents(event, point, guid) {
		if (FloorPlanService.interactionEnabled) {
			for (var i = 0; i < FloorPlanService.clickedPointEventDispatchers.length; i++) {
				FloorPlanService.clickedPointEventDispatchers[i](event, point, guid);
			}
		}
	}

	return FloorPlanService;

};

export default FloorPlanService;