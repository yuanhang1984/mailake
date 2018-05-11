////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ModifyPasswordWindow
////////////////////////////////////////////////////////////////////////////////
class ModifyPasswordWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Password输入框
    ////////////////////////////////////////////////////////////////////////////
    this.pwdTF = new JSTextField();
    this.pwdTF.setPlaceHolder("Password");
    this.pwdTF.setType("password");
    this.pwdTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Password Confirm输入框
    ////////////////////////////////////////////////////////////////////////////
    this.rePwdTF = new JSTextField();
    this.rePwdTF.setPlaceHolder("Password Confirm");
    this.rePwdTF.setType("password");
    this.rePwdTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 创建下载按钮
    ////////////////////////////////////////////////////////////////////////////
    this.submitBtn = new JSButton();
    this.submitBtn.setText("Submit");
    this.submitBtn.setClass("btn-primary");
    this.submitBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Modify Password");
    this.mainWindow.setClass("ModifyPasswordWindow");
    let mainWindowCode = `
      <div>${this.pwdTF.getCode()}</div>
      <div>${this.rePwdTF.getCode()}</div>
      <div>${this.submitBtn.getCode()}</div>
    `;
    this.mainWindow.setContent(mainWindowCode);
    this.mainWindow.generateCode();
  }

  update() {
    let _this = this;
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.submitBtn.getObject()).click(function() {
      let password = _this.pwdTF.getObject().val();
      let rePassword = _this.rePwdTF.getObject().val();
      if (null == password.match(/^\S{1,16}$/)) {
        $(_this.pwdTF.getObject()).val("");
        $(_this.pwdTF.getObject()).attr("placeholder", "Password Format Incorrect");
        $(_this.pwdTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (null == rePassword.match(/^\S{1,16}$/)) {
        $(_this.rePwdTF.getObject()).val("");
        $(_this.rePwdTF.getObject()).attr("placeholder", "Password Format Incorrect");
        $(_this.rePwdTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (password != rePassword) {
        $(_this.rePwdTF.getObject()).val("");
        $(_this.rePwdTF.getObject()).attr("placeholder", "The Password Must Be Same");
        $(_this.rePwdTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      let data = {
        "password": password
      };
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/modifyUserForPassword/", data, false, true, false);
      if ("success" == result.status.toLowerCase()) {
        alert("Success");
        $(_this.pwdTF.getObject()).replaceWith(_this.pwdTF.getCode());
        $(_this.rePwdTF.getObject()).replaceWith(_this.rePwdTF.getCode());
      } else {
        alert("Error");
      }
    });
  }
}
