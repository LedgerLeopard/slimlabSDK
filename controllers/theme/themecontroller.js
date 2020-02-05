/**
 * ThemeController
 * @namespace
 *
 * @description
 * 
 *
 * ### Introduction
 *
 * The ThemeController can be used to configure a theme for the viewers.
 *
 * 
 */
var ThemeController = function(SlimLabsBimViewer) {

	'use strict';

	var ThemeController = {
		defaults: {
			floorplan: {
				background: "#FFFFFF",
				strokeColor: "#000000",
				fillColor: "#000000",
				selected: {
					color: "#F44336",
				},
				unselected: {
					transparant: true,
				}
			},
			model: {
				background: "#FFFFFF",
				selected: {
					color: "#F44336",
				},
				unselected: {
					transparant: true,
				}
			}
		},
	};

	/**
	 * Sets the Theme defaults
	 *
	 * @access   public
	 * @memberof ThemeController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {Object}                   defaults Defaults options object
	 * @param    {Object}                   defaults.floorplan Defaults for floorplan
	 * @param    {Object}                   defaults.floorplan.background Background color
	 * @param    {Object}                   defaults.floorplan.strokeColor Stroke color
	 * @param    {Object}                   defaults.floorplan.fillColor Fill color
	 * @param    {Object}                   defaults.floorplan.selected Configuration object for selected items
	 * @param    {Object}                   defaults.floorplan.selected.color The color of the selected items
	 * @param    {Object}                   defaults.floorplan.unselected Configuration object for unselected items
	 * @param    {Object}                   defaults.floorplan.unselected.transparant Whether or not to make the unselected items transparant
	 * @param    {Object}                   defaults.model Defaults for floorplan
	 *
	 * @example
	 *
	 * ThemeController.setDefaults({
	 *	floorplan: {
	 *		background: "#FFFFFF",
	 *		strokeColor: "#000000",
	 *		fillColor: "#000000",
	 *		selected: {
	 *			color: "#F44336",
	 *		},
	 *		unselected: {
	 *			transparant: false,
	 *		}
	 *	},
	 *	model: {
	 *		background: "#FFFFFF",
	 *		selected: {
	 *			color: "#F44336",
	 *		},
	 *		unselected: {
	 *			transparant: true,
	 *		}
	 *	}
	 * }); 
	 */
	ThemeController.setDefaults = function(defaults) {

		$.extend(true, this.defaults, defaults);

		// Process Floorplanoptions
		if (this.defaults.floorplan) {

			// Background
			if (this.defaults.floorplan.background) {
				SlimLabsBimViewer.FloorPlanService.setBackgroundColor({
					color: this.defaults.floorplan.background
				});
			}

			// Stroke
			if (this.defaults.floorplan.strokeColor) {
				SlimLabsBimViewer.FloorPlanService.setDefaultStrokeColor({
					color: this.defaults.floorplan.strokeColor
				});
			}

			// Fill
			if (this.defaults.floorplan.fillColor) {
				SlimLabsBimViewer.FloorPlanService.setDefaultFillColor({
					color: this.defaults.floorplan.fillColor
				});
			}

		}

		// Process modeloptions
		if (this.defaults.model) {

			// Background
			if (this.defaults.model.background) {
				SlimLabsBimViewer.BuildingViewService.setBackgroundColor({
					color: this.defaults.model.background
				});
			}

		}

	};

	/**
	 * Get the current theme defaults
	 *
	 * @access   public
	 * @memberof ThemeController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @return   {Object}                   Defaults object
	 *
	 * @example
	 *
	 * var defaults = ThemeController.getDefaults();
	 *
	 * // defaults = {...}
	 */
	ThemeController.getDefaults = function() {
		return this.defaults;
	};

	/**
	 * Set the Theme background color
	 *
	 * @access   public
	 * @memberof ThemeController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {String}                   color A color
	 *
	 * @example
	 *
	 * ThemeController.setBackgroundColor("rgba(0,0,0,1)");
	 * ThemeController.setBackgroundColor("rgb(0,0,0)");
	 * ThemeController.setBackgroundColor("#000000");
	 */
	ThemeController.setBackgroundColor = function(color) {

		this.defaults.floorplan.background = color;
		SlimLabsBimViewer.FloorPlanService.setBackgroundColor({
			color: color
		});

		this.defaults.model.background = color;
		SlimLabsBimViewer.BuildingViewService.setBackgroundColor({
			color: color
		});

	};

	/**
	 * Set the selected color. If the user selects an item, that item will turn into
	 * the specified color.
	 *
	 * @access   public
	 * @memberof ThemeController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {String}                   color A color
	 *
	 * @example
	 *
	 * ThemeController.setBackgroundColor("rgba(255,0,0,1)");
	 * ThemeController.setBackgroundColor("rgb(255,0,0)");
	 * ThemeController.setBackgroundColor("#FF0000");
	 */
	ThemeController.setSelectedColor = function(color) {
		this.defaults.floorplan.selected.color = color;
		this.defaults.model.selected.color = color;
	};

	/**
	 * Set whether to make unselected (not-selected, the inverse of selected) transparant
	 * when an object is selectec
	 *
	 * @access   public
	 * @memberof ThemeController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2018-02-27
	 * @param    {Boolean}                   transparant Whether or not to make the other elements
	 *                                                   transparant
	 * @example
	 * 
	 * ThemeController.setUnselectedTransparant(true);
	 */
	ThemeController.setUnselectedTransparant = function(transparant) {
		this.defaults.floorplan.unselected.transparant = transparant;
		this.defaults.model.unselected.transparant = transparant;
	};

	return ThemeController;

};

export default ThemeController;