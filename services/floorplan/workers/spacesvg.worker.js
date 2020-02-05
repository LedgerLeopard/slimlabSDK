onmessage = function(e) {

	var spaces = e.data[0];
	var storey = e.data[1];

	var svgstring = "";
	svgstring += "<g rendered id='floor-plan-object-path-" + storey.ifcguid.replace(/\$/g, 'ç') + "' guid='" + storey.ifcguid.replace(/\$/g, 'ç') + "' ifcguid='" + storey.ifcguid + "'>";

	if (spaces && spaces.length > 0) {

		// Replace all space guid $ to ç
		var spacetest = [];
		spaces.forEach(function(space) {

			if (space.ifcguid) {
				space.guid = space.ifcguid.replace(/\$/g, 'ç');
			} else if (space.GlobalId) {
				space.guid = space.GlobalId.replace(/\$/g, 'ç');
			}

			// Detect workplaces?
			if (space.werkplek) {
				spacetest.push(space);
			} else {
				spacetest.unshift(space);
			}
		});

		spaces = spacetest;

		spaces.forEach(function(space) {

			space.type = space.type || space.IfcType;

			if ((space.name && space.name.toLowerCase().indexOf("gross") !== -1) || (space.LongName && space.LongName.toLowerCase().indexOf("gross") !== -1)) {

				//Gross
				svgstring += "<g class='floor-plan-object-container floor-plan-gross'>";

				svgstring += "<path style='fill: none;' ";

				// Set geometry
				if (space.d && space.d !== undefined) {
					if (space.d.indexOf("d=") !== -1) {
						svgstring += space.d + ' ';
					} else {
						svgstring += 'd="' + space.d + '" ';
					}
				}

				svgstring += "guid='" + space.guid + "' ";
				svgstring += "ifcguid='" + (space.ifcguid || space.GlobalId) + "' ";
				svgstring += ">";

				svgstring += "</path>";
				svgstring += "</g>";

			} else if (!space.name || (space.name !== 'BO' && space.name !== 'BVO' && space.name !== 'GO')) {

				//Non gross
				svgstring += "<g class='floor-plan-object-container'>";

				if (space.ruimtefunctie && (space.ruimtefunctie === "verkeersruimte" || space.ruimtefunctie === "Verkeersruimte")) {
					svgstring += "<path style='fill: rgb(236, 240, 241)' ";
				} else {
					svgstring += "<path style='fill: rgb(255, 255, 255)' ";
				}

				// Set geometry
				if (space.d && space.d !== undefined) {
					if (space.d.indexOf("d=") !== -1) {
						svgstring += space.d + ' ';
					} else {
						svgstring += 'd="' + space.d + '" ';
					}
				}

				svgstring += "class='floor-plan-object-path floor-plan-space' ";
				svgstring += "guid='" + space.guid + "' ";
				svgstring += "ifcguid='" + (space.ifcguid || space.GlobalId) + "' ";
				svgstring += "id='floor-plan-object-path-" + space.guid + "' ";
				svgstring += "type='" + (space.type || space.IfcType) + "' ";

				var spaceName;

				if (space.name) {
					spaceName = space.name;
				} else if (space.LongName) {
					spaceName = space.LongName;
				}

				if (spaceName && spaceName.length > 20) {
					svgstring += "title='" + ((spaceName.substring(0, 19) + "...") || "Geen naam") + "'></path>";
				} else {
					svgstring += "title='" + (spaceName || "Geen naam") + "'></path>";
				}
				svgstring += "</g>";
			}

		});

	}

	svgstring += "</g>";

	postMessage([svgstring]);

};