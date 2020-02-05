const fs = require("fs");

var ftpUser;
var ftpPass;

var length = process.argv.length;

while (length--) {
	if (process.argv[length].indexOf(":") !== -1) {
		var keyValue = process.argv[length].split(":");
		if (keyValue[0] === "FTP_USER") {
			ftpUser = keyValue[1];
			delete process.argv[length];
		} else if (keyValue[0] === "FTP_PASS") {
			ftpPass = keyValue[1];
			delete process.argv[length];
		}
	}
}

if (!ftpUser || !ftpPass) {
	console.log("No ftpUser and/or ftpPass specified");
	return;
} else {

	var config = {
		FTP_USER: ftpUser,
		FTP_PASS: ftpPass
	};

	fs.writeFile("ftp-config.json", JSON.stringify(config), function() {
		console.log("Config written");
	});

}