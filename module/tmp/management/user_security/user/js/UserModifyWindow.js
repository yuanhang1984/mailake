////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// UserModifyWindow
////////////////////////////////////////////////////////////////////////////////
class UserModifyWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Name输入框
    ////////////////////////////////////////////////////////////////////////////
    this.nameTF = new JSTextField();
    this.nameTF.setPlaceHolder("Name");
    this.nameTF.setReadOnly(true);
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
    ////////////////////////////////////////////////////////////////////////////
    // UserStatus下拉菜单
    ////////////////////////////////////////////////////////////////////////////
    this.statusCB = new JSComboBox();
    this.statusCB.setType("dropdown");
    this.statusCB.addItem({
      "type": "option",
      "text": "User Status",
      "value": -1,
      "enable": false
    });
    this.statusCB.addItem({
      "type": "option",
      "text": "Normal",
      "value": 1,
      "enable": true 
    });
    this.statusCB.addItem({
      "type": "option",
      "text": "Frozen",
      "value": 2,
      "enable": true 
    });
    this.statusCB.addItem({
      "type": "option",
      "text": "Lock",
      "value": 3,
      "enable": true 
    });
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
    this.mainWindow.setTitle("Modify User");
    this.mainWindow.setWindowDecorationStyle("DIALOG");
    this.mainWindow.setClass("UserModifyWindow");
  }

  loadUser(uuid) {
    this.uuid = uuid;
    let data = {
      "uuid": uuid
    };
    ////////////////////////////////////////////////////////////////////////////
    // 获取用户数据
    ////////////////////////////////////////////////////////////////////////////
    let userResult = Ajax.submit(Configure.getServerUrl() + "user_security/getUserByManager/", data, false, true, false);
    if (!Common.analyseResult(userResult)) {
      return;
    }
    if (0 >= userResult.detail.length) {
      return;
    }
    ////////////////////////////////////////////////////////////////////////////
    // 获取角色数据
    ////////////////////////////////////////////////////////////////////////////
    let roleResult = Ajax.submit(Configure.getServerUrl() + "user_security/getRole/", null, false, true, false);
    if (!Common.analyseResult(roleResult)) {
      return;
    }
    if (0 >= roleResult.detail.length) {
      return;
    }
    this.nameTF.setValue(userResult.detail[0].name);
    this.nameTF.generateCode();
    this.oldPwd = userResult.detail[0].password;
    this.pwdTF.setValue(userResult.detail[0].password);
    this.pwdTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 遍历判断当前用户的角色是哪个
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 0; i < roleResult.detail.length; i++) {
      let role = roleResult.detail[i];
      this.roleCB.addItem({
        "type": "option",
        "text": `${role.name}`,
        "value": `${role.name}`,
        "enable": true 
      });
      if (role.name == userResult.detail[0].role) {
        // 这里需要+1，因为有一个SelectRole的头
        this.roleCB.setSelectedIndex(i + 1);
      }
    }
    this.roleCB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 遍历判断当前用户的状态是哪个
    ////////////////////////////////////////////////////////////////////////////
    for (let i = 1; i <= 3; i++) {
      if (i == userResult.detail[0].status) {
        this.statusCB.setSelectedIndex(i);
        break;
      }
    }
    this.statusCB.generateCode();
    this.mainWindow.setContent(`
      <div>${this.nameTF.getCode()}</div>
      <div>${this.pwdTF.getCode()}</div>
      <div>${this.roleCB.getCode()}</div>
      <div>${this.statusCB.getCode()}</div>
      <div>${this.submitBtn.getCode() + this.cancelBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
    $("#userModifyWindowArea").html(this.mainWindow.getCode());
    this.update();
  }

  setUserListWindow(ulw) {
    this.ulw = ulw;
  }

  update() {
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.submitBtn.getObject()).click(function() {
      let pwd = _this.pwdTF.getObject().val();
      let role = $(_this.roleCB.getObject()).find("button").attr("data-value");
      let status = $(_this.statusCB.getObject()).find("button").attr("data-value");
      if (_this.oldPwd != pwd) {
        if (null == pwd.match(/^\S{1,16}$/)) {
          $(_this.pwdTF.getObject()).val("");
          $(_this.pwdTF.getObject()).attr("placeholder", "Password Incorrect");
          $(_this.pwdTF.getObject()).css("background-color", "#ffb1b1");
          return;
        }
      }
      if (null == role.match(/^[0-9a-zA-Z_]{4,16}$/)) {
        $(_this.roleCB.getObject()).find("button").css("background-color", "#ffb1b1");
        return;
      }
      if (null == status.match(/^[123]$/)) {
        $(_this.statusCB.getObject()).find("button").css("background-color", "#ffb1b1");
        return;
      }
      let data = null;
      if (_this.oldPwd != pwd) {
        data = {
          "uuid": _this.uuid,
          "password": pwd,
          "role": role,
          "status": status
        };
      } else {
         data = {
          "uuid": _this.uuid,
          "role": role,
          "status": status
        };     
      }
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/modifyUserByManager/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 清空数据
        $(_this.pwdTF.getObject()).replaceWith(_this.pwdTF.getCode());
        $(_this.roleCB.getObject()).replaceWith(_this.roleCB.getCode());
        $(_this.statusCB.getObject()).replaceWith(_this.statusCB.getCode());
        // 关闭窗口
        $(_this.cancelBtn.getObject()).trigger("click");
        // 重新加载最新数据
        _this.ulw.loadUserList();
      } else {
        // 修改失败
        alert("Modify Failed");
      }
    });
    this.roleCB.update();
    this.statusCB.update();
    ////////////////////////////////////////////////////////////////////////////
    // 关联Cancel按钮关闭模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(this.cancelBtn.getObject()).attr("data-dismiss", "modal"); 
  }
}
