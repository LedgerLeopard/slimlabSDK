import DatabaseService from './services/database/databaseservice.js';
import FileService from './services/files/fileservice.js';
import HelperService from './services/helper/helperservice.js';
import LoggerService from './services/logger/loggerservice.js';
import BuildingViewService from './services/model/buildingviewservice.js';
import FloorPlanService from './services/floorplan/floorplanservice.js';
import DataController from './controllers/data/datacontroller.js';
import InteractionController from './controllers/interaction/interactioncontroller.js';
import SessionController from './controllers/session/sessioncontroller.js';
import ThemeController from './controllers/theme/themecontroller.js';
import MarkerPlugin from './plugins/marker/markerplugin.js';


export var SlimLabsBimViewer = (function() {

	'use strict';

	console.log("SlimLabsBimViewer " + process.env.VERSION);

	var SlimLabsBimViewer = {};

	SlimLabsBimViewer.DatabaseService = DatabaseService(SlimLabsBimViewer);
	SlimLabsBimViewer.FileService = FileService(SlimLabsBimViewer);
	SlimLabsBimViewer.HelperService = HelperService(SlimLabsBimViewer);
	SlimLabsBimViewer.LoggerService = LoggerService(SlimLabsBimViewer);
	SlimLabsBimViewer.BuildingViewService = BuildingViewService(SlimLabsBimViewer);
	SlimLabsBimViewer.FloorPlanService = FloorPlanService(SlimLabsBimViewer);
	SlimLabsBimViewer.DataController = DataController(SlimLabsBimViewer);
	SlimLabsBimViewer.InteractionController = InteractionController(SlimLabsBimViewer);
	SlimLabsBimViewer.SessionController = SessionController(SlimLabsBimViewer);
	SlimLabsBimViewer.ThemeController = ThemeController(SlimLabsBimViewer);
	SlimLabsBimViewer.MarkerPlugin = MarkerPlugin(SlimLabsBimViewer);

	return SlimLabsBimViewer;

})();

if (window) {
	var loadInterval = setInterval(function() {
		if (window.SlimLabsBimViewer) {
			clearInterval(loadInterval);
			window.dispatchEvent(new Event("SlimLabsBimViewer.Loaded"));
		}
	}, 10);
}