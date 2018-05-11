////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// LibraryRemoveWindow
////////////////////////////////////////////////////////////////////////////////
class LibraryRemoveWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Content标签
    ////////////////////////////////////////////////////////////////////////////
    this.cntLB = new JSLabel();
    this.cntLB.setText("Do you want to remove this library?");
    this.cntLB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Submit按钮
    ////////////////////////////////////////////////////////////////////////////
    this.submitBtn = new JSButton();
    this.submitBtn.setText("Submit");
    this.submitBtn.setClass("btn-primary");
    this.submitBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 取消按钮
    ////////////////////////////////////////////////////////////////////////////
    this.cancelBtn= new JSButton();
    this.cancelBtn.setText("Cancel");
    this.cancelBtn.setClass("btn-default");
    this.cancelBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setTitle("Remove");
    this.mainWindow.setWindowDecorationStyle("DIALOG");
    this.mainWindow.setContent(`
      <div>${this.cntLB.getCode()}</div>
      <div>${this.submitBtn.getCode() + this.cancelBtn.getCode()}</div>
    `);
    this.mainWindow.setClass("LibraryRemoveWindow");
    this.mainWindow.generateCode();
  }

  update(llw) {
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.submitBtn.getObject()).click(function() {
      let moduleName = $(_this.mainWindow.getObject()).attr("data-module");
      let fileName = $(_this.mainWindow.getObject()).attr("data-file");
      let name = $(_this.mainWindow.getObject()).attr("data-name");
      let data = {
        "moduleName": moduleName,
        "fileName": fileName
      };
      let result = Ajax.submit(Configure.getServerUrl() + "antcolony/removeServerSourceLibrary/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 关闭窗口
        $(_this.cancelBtn.getObject()).trigger("click");
        // 重新加载数据
        llw.reLoadLibraryList();
      } else {
        // 移除失败
        alert("Remove Failed");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联Cancel按钮关闭模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(this.cancelBtn.getObject()).attr("data-dismiss", "modal"); 
  }
}
