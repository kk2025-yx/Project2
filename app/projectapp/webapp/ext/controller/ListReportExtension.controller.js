sap.ui.define([], function () {
    'use strict';
    return {
        // 这里的名称必须与你 annotations.cds 中定义的 Action 触发方式对应
        onUploadPress: function (oEvent) {
            // 1. 这一步至关重要：阻止 Fiori Elements 默认弹出那个丑陋的参数对话框
            oEvent.preventDefault(); 
            
            console.log("=== 自定义上传逻辑已拦截！ ===");
            
            // 2. 创建一个原生的文件选择器
            var oFileUploader = document.createElement('input');
            oFileUploader.type = 'file';
            
            oFileUploader.onchange = function (e) {
                var file = e.target.files[0];
                var reader = new FileReader();
                reader.onload = function (readerEvent) {
                    var base64Content = readerEvent.target.result.split(',')[1];
                    // 在这里调用你的 oModel.bindContext 或 callFunction 逻辑
                    console.log("准备发送文件:", file.name);
                };
                reader.readAsDataURL(file);
            };
            oFileUploader.click();
        }
    };
});