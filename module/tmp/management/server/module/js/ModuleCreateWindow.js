////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ModuleCreateWindow
////////////////////////////////////////////////////////////////////////////////
class ModuleCreateWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Name输入框
    ////////////////////////////////////////////////////////////////////////////
    this.nameTF = new JSTextField();
    this.nameTF.setPlaceHolder("Name");
    this.nameTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 提交按钮
    ////////////////////////////////////////////////////////////////////////////
    this.submitBtn = new JSButton();
    this.submitBtn.setText("Submit");
    this.submitBtn.setClass("btn-primary");
    this.submitBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 取消按钮
    ////////////////////////////////////////////////////////////////////////////
    this.cancelBtn = new JSButton();
    this.cancelBtn.setText("Cancel");
    this.cancelBtn.setClass("btn-default");
    this.cancelBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setTitle("Create Module");
    this.mainWindow.setWindowDecorationStyle("DIALOG");
    this.mainWindow.setContent(`
      <div>${this.nameTF.getCode()}</div>
      <div>${this.submitBtn.getCode() + this.cancelBtn.getCode()}</div>
    `);
    this.mainWindow.setClass("ModuleCreateWindow");
    this.mainWindow.generateCode();
  }

  update(mlw, rfw) {
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.submitBtn.getObject()).click(function() {
      let name = _this.nameTF.getObject().val();
      if (null == name.match(/^[0-9a-zA-Z_-]{4,16}$/)) {
        $(_this.nameTF.getObject()).val("");
        $(_this.nameTF.getObject()).attr("placeholder", "Name Incorrect");
        $(_this.nameTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      let data = {
        "moduleName": name
      };
      let result = Ajax.submit(Configure.getServerUrl() + "antcolony/addModule/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 清空数据
        $(_this.nameTF.getObject()).replaceWith(_this.nameTF.getCode());
        // 关闭窗口
        $(_this.cancelBtn.getObject()).trigger("click");
        // 重新加载数据
        mlw.reLoadModuleList();
        rfw.reLoadModuleList();
      } else {
        // 添加失败
        alert("Create Failed");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联Cancel按钮关闭模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(this.cancelBtn.getObject()).attr("data-dismiss", "modal"); 
  }
}
