sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "../mixins/StoreDetails/VizFrame",
    "sap/base/util/merge",
    "sap/ui/core/ValueState",
  ],
  function (
    BaseController,
    Sorter,
    JSONModel,
    Filter,
    FilterOperator,
    Fragment,
    VizFrame,
    merge,
    ValueState
  ) {
    "use strict";

    return BaseController.extend(
      "koliada.hanna.controller.StoreDetails",
      merge({}, VizFrame, {
        /**
         * The lifecycle method onInit
         */
        onInit: function () {
          this._getRouter() 
            .getRoute("StoreDetails")
            .attachPatternMatched(this._onPatternMatched, this);
          var oHelpModel = new JSONModel({
            sortType: {
              sortTypeName: this.constants.sortType.NONE,
              sortTypePrice: this.constants.sortType.NONE,
              sortTypeSpecs: this.constants.sortType.NONE,
              sortTypeSupplierInfo: this.constants.sortType.NONE,
              sortTypeMadeIn: this.constants.sortType.NONE,
              sortTypeProductionCompanyName: this.constants.sortType.NONE,
              sortTypeRating: this.constants.sortType.NONE,
            },

            isSelected: false,
          });
          this.getView().setModel(oHelpModel, "oHelpModel");
          this._addMessageMenager();
          this.loadVizFrame();
        },

        /**
         * Attaches event handle
         *  @param {sap.ui.base.Event} oEvent event object
         */
        _onPatternMatched: function (oEvent) {
          var mRouteArguments = oEvent.getParameter("arguments");
          var sStoreId = mRouteArguments.id;
          var allStores = this._getModel().getProperty("/Stores");
          var activeStoreIndex = allStores.findIndex(
            (oStore) => oStore.id === +sStoreId
          );
          this.getView().bindObject({ path: `/Stores/${activeStoreIndex}` });
        },
        /**
         * Return a path of the context
         * @return {String} the binding path
         *
         */
        _getPath: function () {
          return this.getView().getBindingContext().getPath();
        },
        /**
         * Copy active store in help model
         *
         */
        _copyEditStore: function () {
          var sPath = this._getPath();
          var oCopyObject = JSON.parse(
            JSON.stringify(this._getModel().getProperty(sPath))
          );
          this._getHelpModel().setProperty("/editStore", oCopyObject);
        },

        /**
         * Sort table by column
         * @param {string} sNameColumn name sort column
         */
        onSortButtonPress: function (sNameColumn) {
          var sSortType = this._getHelpModel().getProperty(
            "/sortType/sortType" + `${sNameColumn}`
          );
          sSortType = this._getNextSortType(sSortType);
          this._getHelpModel().setProperty(
            "/sortType/sortType" + `${sNameColumn}`,
            sSortType
          );
          var oItemsBinding = this._getTableProduct().getBinding("items");
          var bSortDesc = sSortType === this.constants.sortType.DESC;
          oItemsBinding.sort(new Sorter(sNameColumn, bSortDesc));
          this._setDefaultSortIcons(sNameColumn);
        },
        /**
         * Get next sort type according present sort type.
         * @param {string} sSortType present sort-icon
         *@return {string} next sort type
         */
        _getNextSortType: function (sSortType) {
          return this.constants.nextSortType[sSortType];
        },
        /**
         * Set default icon for not active sort-icons
         * @param {string} sNameColumn name of sort active column
         */
        _setDefaultSortIcons(sNameColumn) {
          var sSortTypeArray = this._getHelpModel().getProperty("/sortType");
          for (var key in sSortTypeArray) {
            if ("sortType" + `${sNameColumn}` !== key) {
              this._getHelpModel().setProperty(
                "/sortType/" + key,
                this.constants.sortType.NONE
              );
            }
          }
        },
        /**
         * Search products in table
         *  @param {sap.ui.base.Event} oEvent event object
         */
        onProductsSearch: function (oEvent) {
          var oItemsBinding = this._getTableProduct().getBinding("items");
          var sQuery = oEvent.getParameter("query");
          var oFilterNumber = [];
          var oFilterString = this.constants.nameFilterFieldString.map(
            (sName) => new Filter(sName, FilterOperator.Contains, sQuery)
          );
          if (!isNaN(sQuery)) {
            oFilterNumber = this.constants.nameFilterFieldNumber.map(
              (sName) => new Filter(sName, FilterOperator.EQ, sQuery)
            );
          }
          var filterInput = [
            new Filter({
              filters: [...oFilterString, ...oFilterNumber],
              and: false,
            }),
          ];
          oItemsBinding.filter(filterInput);
        },
        /**
         * On edit button press
         */
        onEditProduct: function () {
          this._copyEditStore();
          this._getModel().setProperty("/isEdit", true);
        },

        /**
         * On cancel button press
         */
        onCancelProduct: function () {
          var sPath = this._getPath();
          var aErrorInputs = this._getInputs("storeDetails").filter(
            (oInput) => oInput.getValueState() === ValueState.Error
          );

          var aPathAndNames = aErrorInputs.map((oInput) => [
            oInput.getBindingContext().getPath(),
            oInput.getName(),
          ]);
          var aValues = aPathAndNames.map(
            (aPathAndName) =>
              this._getModel().getProperty(aPathAndName[0])[aPathAndName[1]]
          );
          aErrorInputs.map((oInput, index) => oInput.setValue(aValues[index]));
          var notEditStore = this._getHelpModel().getProperty("/editStore");
          this._getModel().setProperty(`${sPath}`, notEditStore);
          this._getModel().setProperty("/isEdit", false);
        },

        /**
         * On save button press
         */
        onSaveProduct: function () {
          var aInputs = this._getInputs("storeDetails");
          if (!this._getMessageManager().getMessageModel().getData().length) {
            var bValidationError = this._validateFieldBeforeSubmit(aInputs);
            if (!bValidationError) {
              this._getModel().setProperty("/isEdit", false);
            }
          }
        },
        /**
         * On delete button press
         */
        onDeleteProduct: function () {
          var sMsg = this._i18n("beforeDeleteProduct");
          var sMsgSuccess = this._i18n("afterSuccessDeleteProduct");
          this._getConfirm.call(
            this,
            this._deleteProduct.bind(this),
            sMsg,
            sMsgSuccess
          );
        },
        /**
         * Return the table product
         * @return {sap.m.Table} Table
         */
        _getTableProduct: function () {
          var fragmentId = this.getView().createId("fragmentProduct");
          return Fragment.byId(fragmentId, "idTableProduct");
        },
        /**
         * To delete product
         */
        _deleteProduct: function () {
          var sPath = this._getPath() + "/Products";
          var aId = this._getTableProduct()
            .getSelectedContexts()
            .map((aContext) => aContext.getObject().id);
          var aProducts = this._getModel().getProperty(sPath);
          var aFilterStore = aProducts.filter(
            (oProduct) => !aId.includes(oProduct.id)
          );
          this._getModel().setProperty(sPath, aFilterStore);
          this._getTableProduct().removeSelections();
        },
        /**
         * On create button press
         */
        onCreateProduct: function () {
          var sPath = this._getPath();
          var oEditProducts = this._getModel().getProperty(`${sPath}/Products`);
          var sId = this._getNewId(oEditProducts);
          var oStore = this._getModel().getProperty(this._getPath());
          var storeId = oStore.id;
          var aProductsAdd = [
            ...oEditProducts,
            { ...this.constants.newProduct, id: sId, storeId },
          ];
          this._getModel().setProperty(`${sPath}/Products`, aProductsAdd);
        },
        /**
         * On message popover press
         * @param {sap.ui.base.Event} oEvent event object
         */
        onMessagePopoverPress: function (oEvent) {
          var oSourceControl = oEvent.getSource();
          this._getMessagePopover().then(function (oMessagePopover) {
            oMessagePopover.openBy(oSourceControl);
          });
        },
        /**
         * On message popover press
         * @return {sap.m.MessagePopover} return message popover
         */
        _getMessagePopover: function () {
          var oView = this.getView();

          if (!this._pMessagePopover) {
            this._pMessagePopover = Fragment.load({
              controller: this,
              name: "kaliada.hanna.view.Fragments.MessagePopover",
            }).then(function (oMessagePopover) {
              oView.addDependent(oMessagePopover);
              return oMessagePopover;
            });
          }
          return this._pMessagePopover;
        },
        /**
         * On table product item press
         * @param {sap.ui.base.Event} oEvent event object
         */
        onTableProductItemPress: function (oEvent) {
          var oSource = oEvent.getSource();
          var oContext = oSource.getBindingContext();
          this._navigateTo("ProductDetails", {
            storeId: oContext.getObject("storeId"),
            id: oContext.getObject("id"),
          });
        },
      })
    );
  }
);
