sap.ui.define(
  ["sap/ui/model/Filter", "sap/ui/model/FilterOperator", "../../utils/constants"],
  function (Filter, FilterOperator, constants) {
    "use strict";

    return {
      /**
       * Load constant sort type
       */
      constants: constants,
      /**
       * Combine all filters
       * @param {sap.ui.model.json.JSONModel} oModel
       * @return {Array} array with filters
       */
      getFilters: function (oModel) {
        var searchFieldValue = oModel.getProperty("/searchFieldValue");
        var searchNameValue = oModel.getProperty("/searchNameValue");
        var searchStatusValue = oModel.getProperty("/searchStatusValue");
        var filterSelect = new Filter(
          "Status",
          FilterOperator.Contains,
          searchStatusValue
        );
        var filterName = new Filter("Name", FilterOperator.Contains, "");
        if (searchNameValue.length) {
          filterName = new Filter({
            filters: searchNameValue.map((sValue) => {
              return new Filter("Name", FilterOperator.Contains, sValue);
            }),
            and: false,
          });
        }
        var filterAll = new Filter({
          filters: constants.aKeysAll.map((aFilter) => {
            return new Filter(
              aFilter,
              FilterOperator.Contains,
              searchFieldValue
            );
          }),
          and: false,
        });

        return [filterSelect, filterName, filterAll];
      },
    };
  }
);
