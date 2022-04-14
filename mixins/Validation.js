sap.ui.define(["sap/ui/core/ValueState"], function (ValueState) {
  "use strict";

  return {
    /**
     * Validate input by type and set 'valueState' property
     * @param {sap.m.Input} oInput input for validate
     *@return {boolean} is input validation has an error or has not
     */
    _validateInput: function (oInput) {
      var sValueState = ValueState.None;
      var bValidationError = false;
      var oBinding = oInput.getBinding("value");
      // console.log(this._getMessageManager().getMessageModel())
      try {
        oBinding.getType().validateValue(oInput.getValue());
      } catch (oException) {
        sValueState = ValueState.Error;
        bValidationError = true;
        // this._getMessageManager().addMessage()
      }
      oInput.setValueState(sValueState);
      return bValidationError;
    },
    /**
     * Validate array of inputs
     * @param {Array} aInputs array of inputs for validate
     *@return {boolean} is all inputs are valid or no
     */
    _validateFieldBeforeSubmit: function (aInputs) {
      var bValidationError = false;
      aInputs.forEach(function (oInput) {
        bValidationError = this._validateInput(oInput) || bValidationError;
      }, this);

      return bValidationError;
    },
  };
});
