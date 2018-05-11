////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// LogWindow
////////////////////////////////////////////////////////////////////////////////
class LogWindow {
  constructor() {
    this.seek = 0;
    ////////////////////////////////////////////////////////////////////////////
    // 文件内容输入框
    ////////////////////////////////////////////////////////////////////////////
    this.cntTA = new JSTextArea();
    this.cntTA.setClass("form-control");
    this.cntTA.setReadOnly(true);
    this.cntTA.generateCode();
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
    // Clear按钮
    ////////////////////////////////////////////////////////////////////////////
    this.clearBtn = new JSButton();
    this.clearBtn.setText("Clear");
    this.clearBtn.setClass("btn-primary");
    this.clearBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Log");
    this.mainWindow.setClass("LogWindow");
    this.mainWindow.setContent(`
      <div>${this.cntTA.getCode()}</div>
      <div>${this.startBtn.getCode() + this.stopBtn.getCode() + this.clearBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
  }

  update() {
    let _this = this;
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Start按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.startBtn.getObject()).click(function() {
      $(_this.startBtn.getObject()).prop("disabled", true);
      $(_this.stopBtn.getObject()).prop("disabled", false);
      _this.readLogFunc = setInterval(function() {
        let data = {
          "seek": _this.seek,
          "number": 20
        };
        let result = Ajax.submit(Configure.getServerUrl() + "antcolony/readServerLogFile/", data, false, true, false);
        if (!Common.analyseResult(result)) {
          alert("Read Log Failed");
          return;
        }
        if (_this.seek != result.detail.seek) {
          _this.seek = result.detail.seek;
          let cnt = result.detail.content;
          $(_this.cntTA.getObject()).html($(_this.cntTA.getObject()).html() + cnt);
          // 这里必须用prop，用attr返回undefined。
          $(_this.cntTA.getObject()).scrollTop($(_this.cntTA.getObject()).prop("scrollHeight"));
        }
      }, 1000);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Stop按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.stopBtn.getObject()).click(function() {
      $(_this.startBtn.getObject()).prop("disabled", false);
      $(_this.stopBtn.getObject()).prop("disabled", true);
      clearInterval(_this.readLogFunc);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Clear按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.clearBtn.getObject()).click(function() {
      $(_this.cntTA.getObject()).html("");
    });
  }
}
