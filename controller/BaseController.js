sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "../utils/formatter",
    "../utils/constants",
    "../mixins/Validation",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/base/util/merge",
  ],
  function (
    Controller,
    formatter,
    constants,
    Validation,
    MessageBox,
    MessageToast,
    merge
  ) {
    return Controller.extend(
      "kaliada.hanna.controller.BaseController",
      merge({}, Validation, {
        /**
         * Load formatters
         */
        formatter: formatter,
         /**
         * Load constant
         */
        constants: constants,
        /**
         * Get main model
         * @return {sap.ui.model.json.JSONModel} return Json model
         *
         */
        _getModel: function () {
          return this.getView().getModel();
        },
        /**
         * Navigates to a specific route defining a set of parameters.
         *
         * @param {string} sRoute - The name of the route
         * @param {Object} oParam -  parameters for the route
         */
        _navigateTo: function (sRoute, oParam) {
          this._getRouter().navTo(sRoute, oParam);
        },
        /**
         * Returns the route with the given name
         *
         * @return {sap.ui.core.routing.Route} Route with the provided name
         */
        _getRouter: function () {
          return this.getOwnerComponent().getRouter();
        },
        /**
         * Get help model
         * @return {sap.ui.model.json.JSONModel} return Json model
         *
         */
        _getHelpModel: function () {
          return this.getView().getModel("oHelpModel");
        },
        /**
         * Get message manager model
         * @return {sap.ui.model.message.MessageModel} return Json model
         *
         */
        _getMessageModel: function () {
          return this.getView().getModel("message");
        },
        /**
         * Register message manager
         *
         */
        _addMessageMenager: function () {
          var oMessageManager = sap.ui.getCore().getMessageManager();
          oMessageManager.registerObject(this.getView(), true);
          this.getView().setModel(oMessageManager.getMessageModel(), "message");
        },
        /**
         * Get text from resourse model
         * @param {String} sKey key in rosource model file
         *
         */
        _i18n: function (sKey) {
          var oBundle = this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
          return oBundle.getText(sKey);
        },
        /**
         * Return the MessageManager
         * @return {sap.ui.core.message.MessageManager} MessageManager
         */
        _getMessageManager: function () {
          return sap.ui.getCore().getMessageManager();
        },
       

        /**
         * Get inputs
         *@param {String} sName name of View
         *@return {Array} array of input
         */
        _getInputs: function (sName) {
          var aInputs = this.getView()
            .getControlsByFieldGroupId(`${sName}Input`)
            .filter(
              (oControl) =>
                oControl.getMetadata().getElementName() === "sap.m.Input" ||
                oControl.getMetadata().getElementName() === "sap.m.MaskInput" ||
                oControl.getMetadata().getElementName() === "sap.m.DatePicker"
            )
            .filter(
              (oControl) =>
                oControl.getParent().getMetadata().getElementName() !==
                "sap.m.Toolbar"
            );

          return aInputs;
        },

        /**
         * Get new id
         * @param {aArray} array of elements for get new id (stores or products)
         * @return {Integer} new id for store or products
         */
        _getNewId(aArray) {
          return aArray.length
            ? aArray.map((oInstant) => oInstant.id).sort((a, b) => b - a)[0] + 1
            : 1;
        },
        /**
         * This function fire when change selection of the table
         * @param {sap.ui.base.Event} oEvent event object
         */
        selectedChange: function (oEvent) {
          var oTable = oEvent.getSource();
          var isSelected = !!oTable.getSelectedContexts().length;
          this._getHelpModel().setProperty("/isSelected", isSelected);
        },
        /**
         * After change input, validate it
         * @param {sap.ui.base.Event} oEvent event object
         */
        onChangeInput: function (oEvent) {
          var oInput = oEvent.getSource();
          this._validateInput(oInput);
        },
        /**
         * Show attention message and delete store or product
         * @param {Function} fFunction function to delete store or product
         * @param {String} sMsg confirm message
         * @param {String} sMsgSuccess confirm message after success operation
         *
         */
        _getConfirm: function (fFunction, sMsg, sMsgSuccess) {
          MessageBox.confirm(sMsg, {
            onClose: function (oAction) {
              if (oAction === "OK") {
                fFunction();
                MessageToast.show(sMsgSuccess);
              }
            },
          });
        },
      })
    );
  }
);
