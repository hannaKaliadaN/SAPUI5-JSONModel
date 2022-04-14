sap.ui.define([
	"sap/ui/core/UIComponent",
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("kaliada.hanna.Component", {
		metadata: {
			manifest: "json"
		},
		init : function () {
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
		}
	});
});