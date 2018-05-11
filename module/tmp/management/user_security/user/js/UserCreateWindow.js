////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// UserCreateWindow
////////////////////////////////////////////////////////////////////////////////
class UserCreateWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Name输入框
    ////////////////////////////////////////////////////////////////////////////
    this.nameTF = new JSTextField();
    this.nameTF.setPlaceHolder("Name");
    this.nameTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Password输入框
    ////////////////////////////////////////////////////////////////////////////
    this.pwdTF = new JSTextField();
    this.pwdTF.setPlaceHolder("Password");
    this.pwdTF.setType("password");
    this.pwdTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // SelectRole下拉菜单
    ////////////////////////////////////////////////////////////////////////////
    this.roleCB = new JSComboBox();
    this.roleCB.setType("dropdown");
    this.roleCB.addItem({
      "type": "option",
      "text": "Select Role",
      "value": "0",
      "enable": false
    });
    let result = Ajax.submit(Configure.getServerUrl() + "user_security/getRole/", null, false, true, false);
    if (!Common.analyseResult(result)) {
      return;
    }
    for (let i = 0; i < result.detail.length; i++) {
      let role = result.detail[i];
      this.roleCB.addItem({
        "type": "option",
        "text": `${role.name}`,
        "value": `${role.uuid}`,
        "enable": true 
      });
    }
    this.roleCB.setSelectedIndex(0);
    this.roleCB.generateCode();
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
    this.mainWindow.setTitle("Create User");
    this.mainWindow.setWindowDecorationStyle("DIALOG");
    this.mainWindow.setContent(`
      <div>${this.nameTF.getCode()}</div>
      <div>${this.pwdTF.getCode()}</div>
      <div>${this.roleCB.getCode()}</div>
      <div>${this.submitBtn.getCode() + this.cancelBtn.getCode()}</div>
    `);
    this.mainWindow.setClass("UserCreateWindow");
    this.mainWindow.generateCode();
  }

  update() {
    this.roleCB.update();
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.submitBtn.getObject()).click(function() {
      let name = _this.nameTF.getObject().val();
      let pwd = _this.pwdTF.getObject().val();
      let role = $(_this.roleCB.getObject()).find("button").attr("data-name");
      if (null == name.match(/^[0-9a-zA-Z_-]{4,16}$/)) {
        $(_this.nameTF.getObject()).val("");
        $(_this.nameTF.getObject()).attr("placeholder", "Name Incorrect");
        $(_this.nameTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (null == pwd.match(/^\S{1,16}$/)) {
        $(_this.pwdTF.getObject()).val("");
        $(_this.pwdTF.getObject()).attr("placeholder", "Password Incorrect");
        $(_this.pwdTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (null == role.match(/^[0-9a-zA-Z_]{4,16}$/)) {
        $(_this.roleCB.getObject()).find("button").css("background-color", "#ffb1b1");
        return;
      }
      let data = {
        "name": name,
        "password": pwd,
        "role": role
      };
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/addUserByManager/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 清空数据
        $(_this.nameTF.getObject()).replaceWith(_this.nameTF.getCode());
        $(_this.pwdTF.getObject()).replaceWith(_this.pwdTF.getCode());
        $(_this.roleCB.getObject()).replaceWith(_this.roleCB.getCode());
        _this.roleCB.update();
        // 关闭窗口
        $(_this.cancelBtn.getObject()).trigger("click");
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
