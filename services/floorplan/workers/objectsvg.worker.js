onmessage = function(e) {

	var objects = e.data[0];

	if (objects && objects.length > 0) {

		var svgstring = "";
		svgstring += "<g>";
		objects.forEach(function(object) {

			object.type = object.type || object.IfcType;

			if (object.ifcguid) {
				object.guid = object.ifcguid.replace(/\$/g, 'ç');
			} else if (object.GlobalId) {
				object.guid = object.GlobalId.replace(/\$/g, 'ç');
			}

			// Filter assets out
			if (!object.slimtype || object.slimtype.indexOf("asset") === -1) {

				svgstring += '<g class="floor-plan-object-container">';
				svgstring += '<path ';

				// Set geometry
				if (object.d && object.d !== undefined) {

					if (object.d.indexOf("d=") !== -1) {
						svgstring += object.d + ' ';
					} else {
						svgstring += 'd="' + object.d + '" ';
					}
				}

				// Add guid
				svgstring += 'ifcguid="' + (object.ifcguid || object.GlobalId) + '" ';
				svgstring += 'guid="' + object.guid + '" ';

				if (object.type) {
					svgstring += 'type="' + object.type + '" ';
				}

				svgstring += "id='floor-plan-object-path-" + object.guid + "' ";
				svgstring += 'class="floor-plan-object floor-plan-object-path';


				// Add classes

				if (object.name) {
					if (object.name.indexOf("iso") !== -1) {
						svgstring += ' floor-plan-iso ';
					}
				} else if (object.Name) {
					if (object.Name.indexOf("iso") !== -1) {
						svgstring += ' floor-plan-iso ';
					}
				}

				if (object.type === "IfcWall" || object.type === "IfcWallStandardCase") {
					svgstring += ' floor-plan-wall" ';
				} else if (object.type === "IfcColumn") {
					svgstring += ' floor-plan-column" ';
				} else if (object.type === "IfcWindow") {
					svgstring += ' floor-plan-window" ';
				} else if (object.type === "IfcDoor") {
					svgstring += ' floor-plan-door" ';
				} else if (object.type === "IfcEnergyConversionDevice") {
					svgstring += ' floor-plan-ketel" ';
				} else if (object.type === "IfcFlowTerminal") {
					svgstring += ' floor-plan-toilet" ';
				} else {
					svgstring += '" ';
				}

				var objectName;

				if (object.name) {
					objectName = object.name;
				} else if (object.Name) {
					objectName = object.Name;
				}

				if (objectName && objectName.length > 20) {
					svgstring += "title='" + ((objectName.substring(0, 19) + "...") || "Geen naam") + "'></path>";
				} else {
					svgstring += "title='" + (objectName || "Geen naam") + "'></path>";
				}
				svgstring += '</g>';

			}

		});
		svgstring += '</g>';
		postMessage([svgstring]);
	} else {
		postMessage([""]);
	}
};