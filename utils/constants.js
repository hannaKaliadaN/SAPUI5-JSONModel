sap.ui.define([], function () {
  "use strict";

  return {
    sortType: {
      /**
       * Type of sort
       *
       * @type {string}
       */
      NONE: "",
      /**
       * Type of sort
       *
       * @type {string}
       */
      ASC: "ASC",
      /**
       * Type of sort
       *
       * @type {string}
       */
      DESC: "DESC",
    },

    /**
     * Select next sort type
     */
    nextSortType: {
      [""]: "ASC",
      ["ASC"]: "DESC",
      ["DESC"]: "",
    },
    /**
     * Array  fields name for search field
     *
     */
    aKeysAll: ["Name", "Email", "PhoneNumber", "Address", "Established"],
    /**
     * New store
     *
     */
    newStore: {
      Name: "",
      Email: "",
      PhoneNumber: "",
      Address: "",
      Established: "",
      FloorArea: "",
      id: "",
      Status: "",
      Products: [],
    },
    /**
     * New product
     *
     */
    newProduct: {
      Name: "",
      Price: "",
      Specs: "",
      Rating: 0,
      SupplierInfo: "",
      MadeIn: "",
      ProductionCompanyName: "",
      Currency: "USD",
      Status: "Out of stock",
      id: "",
    },
    /**
     * Array of filter number fields
     *
     */
    nameFilterFieldNumber: ["Price", "Rating"],
    /**
     * Array of filter string fields
     *
     */
    nameFilterFieldString: [
      "Name",
      "Specs",
      "SupplierInfo",
      "MadeIn",
      "ProductionCompanyName",
    ],
  };
});
