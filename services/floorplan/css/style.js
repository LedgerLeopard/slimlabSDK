(function() {

	'use strict';


	// NOTE: ORDER MATTERS FOR THE GENERATION OF PDF'S.

	module.exports = {

		"#planDWG path, #planDWG circle": {
			"stroke-width": 1,
		},

		".floor-plan-object-path": {
			"fill": "rgba(255, 255, 255, 0)",
			"cursor": "pointer",
			"stroke": "#000",
			"stroke-width": 0.02,
		},

		".floor-plan-marker": {
			"cursor": "pointer",
		},

		".floor-plan-space-with-objects": {
			"stroke": "#BDBDBD",
			"stroke-dasharray": "0.1 0.1",
		},

		".floor-plan-wall, .floor-plan-column": {
			"fill": "#000",
			"stroke-width": 0,
		},

		".floor-plan-iso": {
			"fill": "url(#hatch00)",
			"stroke-width": 0,
		},

		"#selectangle": {
			"fill": "none",
			"stroke-width": 0.08,
		},

		".floor-plan-gross": {
			"fill": "none",
			"stroke-width": "0.05px",
		},

		".floor-plan-gross-with-objects": {
			"display": "none",
		},

		".floor-plan-dimmed": {
			"opacity": 0.2,
		},
	};

})();
