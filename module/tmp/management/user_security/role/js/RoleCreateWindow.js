////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// RoleCreateWindow
////////////////////////////////////////////////////////////////////////////////
class RoleCreateWindow {
  constructor() {
    ////////////////////////////////////////////////////////////////////////////
    // Name输入框
    ////////////////////////////////////////////////////////////////////////////
    this.nameTF = new JSTextField();
    this.nameTF.setPlaceHolder("Name");
    this.nameTF.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Description输入框
    ////////////////////////////////////////////////////////////////////////////
    this.descTF = new JSTextField();
    this.descTF.setPlaceHolder("Description");
    this.descTF.generateCode();
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
    this.mainWindow.setTitle("Create Role");
    this.mainWindow.setWindowDecorationStyle("DIALOG");
    this.mainWindow.setContent(`
      <div>${this.nameTF.getCode()}</div>
      <div>${this.descTF.getCode()}</div>
      <div>${this.submitBtn.getCode() + this.cancelBtn.getCode()}</div>
    `);
    this.mainWindow.setClass("RoleCreateWindow");
    this.mainWindow.generateCode();
  }

  update(loadRoleList, rlw, pmw) {
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    let _this = this;
    $(this.submitBtn.getObject()).click(function() {
      let name = _this.nameTF.getObject().val();
      let desc = _this.descTF.getObject().val();
      if (null == name.match(/^[0-9a-zA-Z_-]{4,16}$/)) {
        $(_this.nameTF.getObject()).val("");
        $(_this.nameTF.getObject()).attr("placeholder", "Name Incorrect");
        $(_this.nameTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      if (null == desc.match(/^[\u4e00-\u9fffa0-9a-zA-Z_-]{2,64}$/)) {
        $(_this.descTF.getObject()).val("");
        $(_this.descTF.getObject()).attr("placeholder", "Description Incorrect");
        $(_this.descTF.getObject()).css("background-color", "#ffb1b1");
        return;
      }
      let data = {
        "name": name,
        "description": desc,
        "permission_list": "none;"
      };
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/addRole/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 清空数据
        $(_this.nameTF.getObject()).replaceWith(_this.nameTF.getCode());
        $(_this.descTF.getObject()).replaceWith(_this.descTF.getCode());
        // 关闭窗口
        $(_this.cancelBtn.getObject()).trigger("click");
        // 重新加载数据
        loadRoleList(rlw, pmw);
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
