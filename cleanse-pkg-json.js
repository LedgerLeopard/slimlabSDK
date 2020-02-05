const fs = require("fs");

fs.readFile("package.json", (err, data) => {

	var pkg = JSON.parse(data);

	delete pkg.scripts;
	delete pkg.jshintConfig;
	delete pkg.devDependencies;

	fs.writeFile("package.json", JSON.stringify(pkg, null, "\t"), (err) => {
		console.log("Wrote file");
	});

});