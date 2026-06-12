sap.ui.define([
  "sap/m/Dialog",
  "sap/m/Button",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/VBox",
  "sap/ui/unified/FileUploader",
  "sap/m/MessageToast"
], function (Dialog, Button, Label, Input, VBox, FileUploader, MessageToast) {
  "use strict";

  return {
    openDialog: function (oEvent) {
      var oFileUploader = new FileUploader("fileUploaderCtrl", {
        name: "uploadFile",
        fileType: ["csv", "json"],
        placeholder: "Choose a CSV or JSON file..."
      });

      var oScenarioInput = new Input("scenarioInput", {
        placeholder: "e.g. BusinessPartner",
        value: "BusinessPartner"
      });
      var oSourceInput = new Input("sourceInput", { placeholder: "e.g. crm", value: "crm" });

      var oDialog = new Dialog({
        title: "Upload File",
        contentWidth: "400px",
        content: [
          new VBox({
            items: [
              new Label({ text: "File:" }),
              oFileUploader,
              new Label({ text: "Scenario Type:" }),
              oScenarioInput,
              new Label({ text: "Source System:" }),
              oSourceInput
            ]
          })
        ],
        beginButton: new Button({
          text: "Upload",
          type: "Emphasized",
          press: function () {
            var oFile = oFileUploader.oFileUpload && oFileUploader.oFileUpload.files[0];
            if (!oFile) {
              MessageToast.show("Please choose a file first.");
              return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
              var sContent = e.target.result;
              fetch("/odata/v4/project2/triggerUpload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fileName: oFile.name,
                  scenarioType: oScenarioInput.getValue(),
                  sourceSystem: oSourceInput.getValue(),
                  fileContent: sContent
                })
              })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                  MessageToast.show("Mapped result received");
                  console.log("SAP JSON:", data.value);
                  oDialog.close();
                  oDialog.destroy();
                  window.location.reload();
                })
                .catch(function (err) {
                  MessageToast.show("Upload failed: " + err.message);
                });
            };
            reader.readAsText(oFile);
          }
        }),
        endButton: new Button({
          text: "Cancel",
          press: function () {
            oDialog.close();
            oDialog.destroy();
          }
        })
      });

      oDialog.open();
    }
  };
});
