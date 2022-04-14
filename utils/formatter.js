sap.ui.define(
  ["sap/ui/core/ValueState", "./constants"],
  function (ValueState, constants) {
    "use strict";

    return {
      /**
       * Load variable
       */
       sortType: constants.sortType,
      /**
       * Return a state error
       * @param {String} sStatus status
       * @return {sap.ui.core.ValueState}
       *
       */
      getStatusColor: function (sStatus) {
        switch (sStatus) {
          case "Close":
            return ValueState.Error;
          case "Open":
            return ValueState.Success;
          default:
            return ValueState.None;
        }
      },
      /**
       * Return a name of icon
       * @param {String} sStatus status
       * @return {String} name of icon
       *
       */
      sortTypeFormatter: function (sSortType) {
        switch (sSortType) {
          case this.sortType.NONE: {
            return "sort";
          }
          case this.sortType.ASC: {
            return "sort-ascending";
          }
          case this.sortType.DESC: {
            return "sort-descending";
          }
          default: {
            return "sort";
          }
        }
      },
      getStatusProductColor: function (sStatus) {
        switch (sStatus) {
          case "Out of stock": {
            return ValueState.Error;
          }
          case "Storage": {
            return ValueState.Warning;
          }
          case "Ok": {
            return ValueState.Warning;
          }
          default: {
            return ValueState.None;
          }
        }
      },
    };
  }
);
