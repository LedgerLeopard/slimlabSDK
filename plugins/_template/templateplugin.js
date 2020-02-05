/**
 * TemplatePlugin
 * @namespace
 *
 * @description
 * 
 *
 * ### Introduction
 *
 * The TemplatePlugin can be used to manage markers on your models
 * 
 */
var TemplatePlugin = function(SlimLabsBimViewer) {



	'use strict';



	//////////
	// Init //
	//////////



	var TemplatePlugin = {
		enabled: false,
	};



	///////////////
	// Functions //
	///////////////



	TemplatePlugin.enable = function() {
		this.enabled = true;
	};

	TemplatePlugin.disable = function() {
		this.enabled = false;
	};



	/////////////
	// Helpers //
	/////////////



	////////////
	// Return //
	////////////



	return TemplatePlugin;



};

export default TemplatePlugin;