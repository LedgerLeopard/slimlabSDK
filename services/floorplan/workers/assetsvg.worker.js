onmessage = function(e) {

	var assets = e.data[0];

	if (assets && assets.length > 0) {

		var svgstring = "";

		svgstring += "<g>";

		assets.forEach(function(asset) {

			asset.guid = asset.ifcguid.replace(/\$/g, 'ç');

			svgstring += '<g class="floor-plan-object">';

			svgstring += '<path class="plan-asset floor-plan-object-path"';

			if (asset.svgtransform) {
				svgstring += 'transform="' + asset.svgtransform + '" ';
			}

			if (asset.d && asset.d !== undefined) {
				svgstring += 'd="' + asset.d + '" ';
			}

			svgstring += "guid='" + asset.guid + "' ";
			svgstring += "ifcguid='" + asset.ifcguid + "' ";
			svgstring += "id='floor-plan-object-path-" + asset.guid + "' ";

			// svgstring += "ng-mousedown='selectEditingElement($event, \"" + asset.ifcguid + "\")' ";
			// svgstring += "ng-mouseenter='highlightAsset($event, \"" + asset.ifcguid + "\")' ";
			// svgstring += "ng-mouseleave='unhighlightAsset($event, \"" + asset.ifcguid + "\")' ";
			// svgstring += "ng-click='clickAsset( $event, \"" + asset.ifcguid + "\" )'";

			svgstring += 'title="' + asset.name + '" ';
			svgstring += "style='fill: rgb(255, 255, 255)' ";
			svgstring += "ng-class=\"{ 'unlinked-asset' : unlinkedAssets.indexOf('" + asset.ifcguid + "') !== -1 , 'selected-guid' : currentActiveAssets.indexOf('" + asset.ifcguid + "') !== -1 , 'planpath-hover' : hoveredAssets.indexOf('" + asset.ifcguid + "') !== -1 }\" ";

			if (asset.name && asset.name.length > 20) {
				svgstring += "data-toggle='tooltip' data-placement='top' title='" + ((asset.name.substring(0, 19) + "...") || "Geen naam") + "'></path>";
			} else {
				svgstring += "data-toggle='tooltip' data-placement='top' title='" + (asset.name || "Geen naam") + "'></path>";
			}

			svgstring += '</g>';
		});
		svgstring += '</g>';
		postMessage([svgstring]);
	} else {
		postMessage("");
	}
};

function convertBoolean(bool) {
	if (bool === "TRUE") {
		return "Ja";
	} else {
		return "Nee";
	}
}