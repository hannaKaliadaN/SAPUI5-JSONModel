sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/core/Fragment",
    "sap/m/SearchField",
    "../mixins/StoreList/Filters",
    "sap/base/util/merge",
  ],
  function (
    BaseController,
    JSONModel,
    ColumnListItem,
    Label,
    Fragment,
    SearchField,
    Filters,
    merge
  ) {
    "use strict";

    return BaseController.extend(
      "kaliada.hanna.controller.StoreList",
      merge({}, Filters, {
        /**
         * The lifecycle method onInit
         */
        onInit: function () {
          var oHelpModel = new JSONModel({
            length: "",
            searchFieldValue: "",
            searchNameValue: [],
            searchStatusValue: "",
            isSelected: false,
          });
          this.getView().setModel(oHelpModel, "oHelpModel");
          this._loadSearchField();
          this._addMessageMenager();
        },

        /**
         * Add search field to the View
         */
        _loadSearchField: function () {
          var oFilterBar = this.getView().byId("filterBar");
          var oBasicSearch;
          oBasicSearch = new SearchField("searchField", {
            value: "{oHelpModel>/searchFieldValue}",
          });
          oFilterBar.setBasicSearch(oBasicSearch);
        },

        /**
         * Update dates after change datas in table
         */
        onUpdateFinishedTable: function (oEvent) {
          var sLength = this._getTable().getBinding("items").iLength;
          var aStores = this._getModel().getData().Stores;
          var aUnicNames = aStores.map((oStores) => ({ Name: oStores.Name }));
          this._getHelpModel().setProperty("/length", sLength);
          this._getModel().setProperty("/StoresName", aUnicNames);
          this._getModel().setProperty("/cols", [
            { label: "Name", template: "Name" },
          ]);
          this.selectedChange(oEvent);
        },
        /**
         * Filter table
         */
        onFilterTable: function () {
          this.setSearchNameValue();
          var currentFilters = this.getFilters(this._getHelpModel());
          var oContext = this._getTable().getBinding("items");
          oContext.filter(currentFilters);
        },

        /**
         * Clear all filters and clear all fields
         */
        onReset: function () {
          var oContext = this._getTable().getBinding("items");
          this._getHelpModel().setProperty("/searchFieldValue", "");
          this.getView().byId("multiInput").setTokens([]);
          this._getHelpModel().setProperty("/searchNameValue", []);
          this._getHelpModel().setProperty("/searchStatusValue", "");
          this._getMessageManager().removeAllMessages();
          this._setNewStore();
          oContext.filter([]);
        },
        /**
         * After item table press navigate to store details page
         * @param {sap.ui.base.Event} oEvent event object
         */
        onTableItemPress: function (oEvent) {
          var oSource = oEvent.getSource();
          var oContext = oSource.getBindingContext();
          this._navigateTo("StoreDetails", {
            id: oContext.getObject("id"),
          });
        },
        /**
         * Create new store
         */
        _setNewStore: function () {
          var oStores = this._getModel().getProperty("/Stores");
          var iNewStoreId = this._getNewId(oStores);
          this._getModel().setProperty("/NewStore", {
            ...this.constants.newStore,
            id: iNewStoreId,
          });
        },
        /**
         * Create new store
         */
        onCreateStorePress: function () {
          this._setNewStore();
          var oView = this.getView();
          if (!this.oDialog) {
            this.oDialog = sap.ui.xmlfragment(
              oView.getId(),
              "kaliada.hanna.view.Fragments.CreateStore",
              this
            );
            oView.addDependent(this.oDialog);
          }
          this.oDialog.open();
        },

        /**
         * Create new store
         */
        onCreatePressStore: function () {
          var aStores = this._getModel().getData().Stores;
          var aInputs = this._getInputs("createStore");
          if (!this._getMessageManager().getMessageModel().getData().length) {
            var bValidationError = this._validateFieldBeforeSubmit(aInputs);
            if (!bValidationError) {
              var StoresNew = this._getModel().getProperty("/NewStore");
              this._getModel().setProperty("/Stores", [...aStores, StoresNew]);
              this.onCancelPressStore();
            }
          }
        },
        /**
         * Close active popup, reset validation, reset changes
         * @param {String} sName name of popup
         *
         */
        onCancelPressStore: function () {
          this.oDialog.close();
          this._destroyValueState("createStore");
          this._getMessageManager().removeAllMessages();
        },

        /**
         * Delete store
         */
        _deleteStore: function () {
          var aPath = this._getTable()
            .getSelectedContexts()
            .map((oContext) => oContext.getPath());
          var aId = aPath.map(
            (sPath) => this._getModel().getProperty(sPath).id
          );
          var aStores = this._getModel().getProperty("/Stores");
          var aFilterStores = aStores.filter(
            (oStore) => !aId.includes(oStore.id)
          );
          this._getTable().removeSelections();
          this._getModel().setProperty("/Stores", aFilterStores);
        },

        /**
         * Show attention message and delete store
         *
         */
        onDeleteStorePress: function () {
          var sMsg = this._i18n("beforeDeleteStore");
          var sMsgSuccess = this._i18n("afterSuccessDeleteStore");
          this._getConfirm.call(
            this,
            this._deleteStore.bind(this),
            sMsg,
            sMsgSuccess
          );
        },

        /**
         * Request value help
         */
        onValueHelpRequested: function () {
          var aCols = this._getModel().getData().cols;
          var oMultiInput = this.getView().byId("multiInput");
          Fragment.load({
            name: "kaliada.hanna.view.Fragments.ValueHelpDialog",
            controller: this,
          }).then(
            function name(oFragment) {
              this._oValueHelpDialog = oFragment;
              this.getView().addDependent(this._oValueHelpDialog);

              this._oValueHelpDialog.getTableAsync().then(
                function (oTable) {
                  oTable.setModel(this._getModel());
                  oTable.setModel(this._getModel(), "columns");
                  if (oTable.bindRows) {
                    oTable.bindAggregation("rows", "/StoresName");
                  }
                  if (oTable.bindItems) {
                    oTable.bindAggregation("items", "/StoresName", function () {
                      return new ColumnListItem({
                        cells: aCols.map(function (column) {
                          return new Label({
                            text: "{" + column.template + "}",
                          });
                        }),
                      });
                    });
                  }
                  this._oValueHelpDialog.update();
                }.bind(this)
              );

              this._oValueHelpDialog.setTokens(oMultiInput.getTokens());
              this._oValueHelpDialog.open();
            }.bind(this)
          );
        },

        /**
         * On value helper press ok
         * @param {sap.ui.base.Event} oEvent event object
         */
        onValueHelpOkPress: function (oEvent) {
          var oMultiInput = this.getView().byId("multiInput");
          var aTokens = oEvent.getParameter("tokens");
          oMultiInput.setTokens(aTokens);
          this._oValueHelpDialog.close();
        },
        /**
         * Set search name values, according active tokens
         */
        setSearchNameValue: function () {
          var oMultiInput = this.getView().byId("multiInput");
          var aTokens = oMultiInput.getTokens();
          var aTokensItemsText = aTokens.map((oToken) => oToken.getText());
          this._getHelpModel().setProperty(
            "/searchNameValue",
            aTokensItemsText
          );
        },

        /**
         *
         * On value help cancel press
         */
        onValueHelpCancelPress: function () {
          this._oValueHelpDialog.close();
        },
        /**
         * After close value help
         */
        onValueHelpAfterClose: function () {
          this._oValueHelpDialog.destroy();
        },
      })
    );
  }
);
