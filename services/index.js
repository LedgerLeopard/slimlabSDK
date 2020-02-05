(function() {

	'use strict';

	require("expose-loader?SlimLabsBimViewer.HelperService!./helper/helperervice");
	require("expose-loader?SlimLabsBimViewer.FileService!./files/fileservice");
	require("expose-loader?SlimLabsBimViewer.FloorPlanService!./floorplan/floorplanservice");
	require("expose-loader?SlimLabsBimViewer.DatabaseService!./database/databaseservice");
	require("expose-loader?SlimLabsBimViewer.BuildingViewService!./model/buildingviewservice");

})();