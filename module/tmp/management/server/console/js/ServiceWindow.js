////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ServiceWindow
////////////////////////////////////////////////////////////////////////////////
class ServiceWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Start按钮
    ////////////////////////////////////////////////////////////////////////////
    this.startBtn = new JSButton();
    this.startBtn.setText("Start");
    this.startBtn.setClass("btn-primary");
    this.startBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Stop按钮
    ////////////////////////////////////////////////////////////////////////////
    this.stopBtn = new JSButton();
    this.stopBtn.setText("Stop");
    this.stopBtn.setClass("btn-primary");
    this.stopBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Service");
    this.mainWindow.setClass("ServiceWindow");
    this.mainWindow.setContent(`
      <div>${this.startBtn.getCode() + this.stopBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
  }

  update() {
    let _this = this;
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Start按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.startBtn.getObject()).click(function() {
      let result = Ajax.submit(Configure.getServerUrl() + "antcolony/startWebServer/", null, false, true, false);
      if (!Common.analyseResult(result)) {
        alert("Start Failed");
        return;
      }
      $(_this.startBtn.getObject()).prop("disabled", true);
      $(_this.stopBtn.getObject()).prop("disabled", false);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Stop按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.stopBtn.getObject()).click(function() {
      let result = Ajax.submit(Configure.getServerUrl() + "antcolony/stopWebServer/", null, false, true, false);
      if (!Common.analyseResult(result)) {
        alert("Stop Failed");
        return;
      }
      $(_this.startBtn.getObject()).prop("disabled", false);
      $(_this.stopBtn.getObject()).prop("disabled", true);
    });
  }
}
