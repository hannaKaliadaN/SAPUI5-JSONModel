sap.ui.define(
  ["sap/ui/core/ValueState", "./constants"],
  function (ValueState, constants) {
    "use strict";

    return {
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
       * @param {String} sSortType status
       * @return {String} name of icon
       *
       */
      sortTypeFormatter: function (sSortType) {
        switch (sSortType) {
          case constants.sortType.NONE: {
            return "sort";
          }
          case constants.sortType.ASC: {
            return "sort-ascending";
          }
          case constants.sortType.DESC: {
            return "sort-descending";
          }
          default: {
            return "sort";
          }
        }
      },
        /**
       * Return value state for status
       * @param {String} sStatus status
       * @return {String} name of icon
       *
       */
      getStatusProductColor: function (sStatus) {
        switch (sStatus) {
          case "Out of stock": {
            return ValueState.Error;
          }
          case "Storage": {
            return ValueState.Warning;
          }
          case "Ok": {
            return ValueState.Success;
          }
          default: {
            return ValueState.None;
          }
        }
      },
    };
  }
);
