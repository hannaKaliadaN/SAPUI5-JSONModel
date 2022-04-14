sap.ui.define(
  [
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
  ],
  function (FlattenedDataset, FeedItem) {
    "use strict";

    return {
      /**
       * Load viz Frame
       *
       */
      loadVizFrame: function () {
        var sTitle = this._i18n("titleVizFrame");
        var oVizFrame = this.getView().byId("idStackedChart");
        oVizFrame.setVizProperties({
          plotArea: {
            colorPalette: d3.scale.category20().range(),
            dataLabel: {
              showTotal: true,
            },
          },
          tooltip: {
            visible: true,
          },
          title: {
            text: sTitle,
          },
        });
        var oDataset = new FlattenedDataset({
          dimensions: [
            {
              name: "Year",
              value: "{data>Year}",
            },
          ],

          measures: [
            {
              name: "Intelligent Granite Fish",
              value: "{datas>Product1}",
            },
            {
              name: "Handmade Metal Salad",
              value: "{data>Product2}",
            },
            {
              name: "Fantastic Granite Shoes",
              value: "{data>Product3}",
            },
          ],

          data: {
            path: "data>/items",
          },
        });
        oVizFrame.setDataset(oDataset);

        var oFeedValueAxis = new FeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Intelligent Granite Fish"],
          }),
          oFeedValueAxis1 = new FeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Handmade Metal Salad"],
          }),
          oFeedValueAxis2 = new FeedItem({
            uid: "valueAxis",
            type: "Measure",
            values: ["Fantastic Granite Shoes"],
          }),
          oFeedCategoryAxis = new FeedItem({
            uid: "categoryAxis",
            type: "Dimension",
            values: ["Year"],
          });

        oVizFrame.addFeed(oFeedValueAxis);
        oVizFrame.addFeed(oFeedValueAxis1);
        oVizFrame.addFeed(oFeedValueAxis2);
        oVizFrame.addFeed(oFeedCategoryAxis);
      },
    };
  }
);
