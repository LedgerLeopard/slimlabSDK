/**
 * 
 * @namespace InteractionController
 *
 * @description
 * Loading the InteractionController automatically handles the visual interaction for the views. It
 * depends on the {@link DataController} for initializiation. Specify the visuals you want in the {@link ThemeController}.
 *
 * Requires {@link DataController} and {@link ThemeController} to be loaded. Use the loader scripts to load all requirements
 * 
 */
var InteractionController = function(SlimLabsBimViewer) {

	'use strict';

	var InteractionController = {
		activeClickGuids: [],
		activeHoverGuids: [],
	};

	/////////////
	// Methods //
	/////////////

	/**
	 * Set the current active click guids
	 *
	 * @access   public
	 * @memberof InteractionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-30
	 * @param    {Object}                   		 options 			Options object
	 * @param 	 {Array}							 options.guids 		Array of guids
	 * @param 	 {String}							 options.type 		Type of the active guids
	 */
	InteractionController.setActiveGuids = function(options) {

		var guids;
		var type;

		if (options) {

			// Guids
			if (options.constructor === Array) {
				guids = options;
			} else if (options.guids) {
				guids = options.guids;
			}

			if (options.type) {
				type = options.type;
			}

		}

		InteractionController.activeClickGuids = guids;
		InteractionController.activeClickType = type;
		handleClick();
	};

	/**
	 * Set the current active hover guids
	 *
	 * @access   public
	 * @memberof InteractionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-30
	 * @param    {Array}                   guids Array of guids
	 */
	InteractionController.setActiveHoverGuids = function(guids) {
		InteractionController.activeHoverGuids = guids;
		handleHover();
	};



	/////////////////
	// Bind events //
	/////////////////



	SlimLabsBimViewer.DataController.registerInitializedCallback(function(bool) {

		SlimLabsBimViewer.DataController.registerActiveDataCallback(function(data) {

			var guids;

			if (data && data.data) {
				switch (data.type) {
					case "markers":
						guids = data.data.map(function(marker) {
							return marker._id;
						});
						break;
					default:
						guids = data.data;
				}

				InteractionController.setActiveGuids({
					guids: guids,
					type: data.type
				});

			} else {

				InteractionController.setActiveGuids({
					guids: [],
					type: null
				});

			}

		}).registerFloorPlanRenderedCallback(function() {
			handleClick();
		}).registerModelProgressCallback(function(progress) {
			if (progress === 1) {
				handleClick();
			}
		});

	});



	/////////////
	// Helpers //
	/////////////



	/**
	 * Handle hover
	 *
	 * @access   private
	 * @memberof InteractionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-30
	 */
	function handleHover() {}

	/**
	 * Handle click
	 *
	 * @access   private
	 * @memberof InteractionController
	 * @author Wouter Coebergh <wco@byroot.nl>
	 * @date     2017-11-30
	 */
	function handleClick() {



		var defaults = SlimLabsBimViewer.ThemeController.getDefaults();



		///////////////
		// Floorplan //
		///////////////



		SlimLabsBimViewer.FloorPlanService.resetColors().resetStrokes();

		if (InteractionController.activeClickGuids && InteractionController.activeClickGuids.length > 0) {
			if (defaults.floorplan.unselected.transparant) {
				SlimLabsBimViewer.FloorPlanService.transluscentAll();
			}
		} else {
			SlimLabsBimViewer.FloorPlanService.showAll();
		}

		SlimLabsBimViewer.FloorPlanService.show(InteractionController.activeClickGuids);
		SlimLabsBimViewer.FloorPlanService.setColor(InteractionController.activeClickGuids, defaults.floorplan.selected.color || "#F44336");
		SlimLabsBimViewer.FloorPlanService.setStrokeColor(InteractionController.activeClickGuids, defaults.floorplan.selected.color || "#F44336");



		///////////
		// Model //
		///////////



		SlimLabsBimViewer.BuildingViewService.resetColors();

		if (InteractionController.activeClickGuids && InteractionController.activeClickGuids.length > 0) {
			if (defaults.model.unselected.transparant) {
				SlimLabsBimViewer.BuildingViewService.transluscentAll();
			}
		} else {
			SlimLabsBimViewer.BuildingViewService.showAll(false, true);
		}

		SlimLabsBimViewer.BuildingViewService.show(InteractionController.activeClickGuids);

		if (!InteractionController.activeClickType || InteractionController.activeClickType !== "markers") {
			SlimLabsBimViewer.BuildingViewService.setColor({
				guids: InteractionController.activeClickGuids,
				color: defaults.model.selected.color || "#F44336",
			});
		}

		SlimLabsBimViewer.BuildingViewService.render();

	}

	return InteractionController;

};

export default InteractionController;