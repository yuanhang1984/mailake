////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// LoginWindow
////////////////////////////////////////////////////////////////////////////////
class LoginWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Name输入框
    ////////////////////////////////////////////////////////////////////////////
    this.nameTF = new JSTextField();
    this.nameTF.setPlaceHolder("Name");
    this.nameTF.setValue("superadmin");
    this.nameTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Password输入框
    ////////////////////////////////////////////////////////////////////////////
    this.pwdTF = new JSTextField();
    this.pwdTF.setPlaceHolder("Password");
    this.pwdTF.setType("password");
    this.pwdTF.setValue("123");
    this.pwdTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Login按钮
    ////////////////////////////////////////////////////////////////////////////
    this.loginBtn = new JSButton();
    this.loginBtn.setText("Login");
    this.loginBtn.setClass("btn-primary");
    this.loginBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Login");
    this.mainWindow.setClass("LoginWindow");
    this.mainWindow.setContent(`
      <div>${this.nameTF.getCode()}</div>
      <div>${this.pwdTF.getCode()}</div>
      <div>${this.loginBtn.getCode()}</div>       
    `);
    this.mainWindow.generateCode();
  }

  update() {
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Login按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.loginBtn.getObject()).click(function() {
      let name = _this.nameTF.getObject().val();
      let password = _this.pwdTF.getObject().val();
      if (null == name.match(/^[0-9a-zA-Z_-]{4,16}$/)) {
        $(_this.nameTF.getObject()).val("");
        $(_this.nameTF.getObject()).attr("placeholder", "Name Incorrect");
        $(_this.nameTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (null == password.match(/^\S{1,16}$/)) {
        $(_this.pwdTF.getObject()).val("");
        $(_this.pwdTF.getObject()).attr("placeholder", "Password Incorrect");
        $(_this.pwdTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      let data = {
        "name": name,
        "password": password
      };
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/getUserForLogin/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 登录成功
        // 获取跳转页面的地址
        let redirectUrl = Assistant.getQueryFromUrl("redirectUrl");
        if (null != redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          window.location.href = Configure.getWebUrl() + "management/index/index.html";
        }
      } else {
        // 登录失败
        alert("Login Failed");
      }
    });
  }
}
