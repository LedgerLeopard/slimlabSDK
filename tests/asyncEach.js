var async = require("async");

var object = {
	b: "someguid",
	a: [{
		buildingstorey: {
			ifcguid: "someguid"
		}
	}],
	c: "anothervalue",
	d: [{
		buildingstorey: {
			ifcguid: "anothersomeguid"
		}
	}],
};

async.detect(object, function(value, callback) {
	if (Array.isArray(value)) {
		callback(null, value);
	} else {
		callback();
	}
}, function(err, result) {
	console.log("result", err, result);
});