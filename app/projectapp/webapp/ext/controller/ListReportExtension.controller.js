sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {
        
        processFile: function (oEvent) {
            MessageToast.show("正在触发逻辑...");
            console.log("按钮点击事件已触发！");
        }
    };
});