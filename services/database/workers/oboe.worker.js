var oboe = require("../js/oboe-node");

onmessage = function(e) {

	var options = e.data[0];

	var nodeCallbackConfig = {};

	for (var i = 0; i < options.nodeSelectors.length; i++) {
		addFieldToNodeCallbackConfig(nodeCallbackConfig, options.nodeSelectors[i].selector, options.nodeSelectors[i].type);
	}

	oboe(options.oboeConfig).done(function(things) {
			postMessage({
				status: "done",
				data: things
			});
		}).fail(function(err) {
			postMessage({
				status: "error",
				data: err
			});
		})
		.node(nodeCallbackConfig);

};

function addFieldToNodeCallbackConfig(config, selector, nodeType) {
	config[selector] = function(node) {
		postMessage({
			status: "in_progress",
			data: {
				node: node,
				nodeType: nodeType
			}
		});
		return oboe.drop;
	};
}