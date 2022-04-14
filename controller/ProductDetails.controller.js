sap.ui.define(["./BaseController"], function (BaseController) {
  "use strict";

  return BaseController.extend("koliada.hanna.controller.StoreDetails", {
    /**
     * The lifecycle method onInit
     */
    onInit: function () {
      this._getRouter().getRoute("ProductDetails").attachPatternMatched(
        this._onPatternMatched,
        this
      );
      this._addMessageMenager();
    },
    /**
     * Attaches event handle
     *  @param {sap.ui.base.Event} oEvent event object
     */
    _onPatternMatched: function (oEvent) {
      var mRouteArguments = oEvent.getParameter("arguments");
      var sStoreId = mRouteArguments.storeId;
      var sProductId = mRouteArguments.id;
      var aAllStores = this._getModel().getProperty("/Stores");
      var sActiveStoreIndex = aAllStores.findIndex(
        (oStore) => oStore.id === +sStoreId
      );
      var aAllProducts = this._getModel().getProperty(
        `/Stores/${sActiveStoreIndex}/Products`
      );
      var sActiveProductIndex = aAllProducts.findIndex(
        (oProduct) => oProduct.id === +sProductId
      );
      this.getView().bindObject({
        path: `/Stores/${sActiveStoreIndex}/Products/${sActiveProductIndex}`,
      });
    },
  });
});
