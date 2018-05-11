////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// PermissionModifyWindow
////////////////////////////////////////////////////////////////////////////////
class PermissionModifyWindow {
  constructor(modulePermissionCode) {
    this.modulePermissionCode = modulePermissionCode;
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
    this.roleCB.addItem({
      "type": "option",
      "text": "admin",
      "value": "00000000000000000000000000000000",
      "enable": true 
    });
    this.roleCB.addItem({
      "type": "option",
      "text": "user",
      "value": "00000000000000000000000000000000",
      "enable": true 
    });
    this.roleCB.setSelectedIndex(0);
    this.roleCB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Submit按钮
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
    this.mainWindow.setTitle("Permission Modify");
    this.mainWindow.setClass("PermissionModifyWindow");
    this.mainWindow.setContent(`
      <div class="input-group">${this.roleCB.getCode()}<span class="input-group-btn">${this.submitBtn.getCode()}</span></div>
      <div>${this.modulePermissionCode}</div>
    `);
    this.mainWindow.generateCode();
  }

  setRoleList(roleList) {
    this.roleCB.removeItemAll();
    this.roleCB.addItem({
      "type": "option",
      "text": "Select Role",
      "value": "-1",
      "enable": false
    });
    for (let i = 0; i < roleList.length; i++) {
      this.roleCB.addItem({
        "type": "option",
        "text": `${roleList[i].name}`,
        "value": `${roleList[i].uuid}`,
        "enable": true 
      });
    }
    this.roleCB.generateCode();
    this.mainWindow.setContent(`
      <div class="input-group">${this.roleCB.getCode()}<span class="input-group-btn">${this.submitBtn.getCode()}</span></div>
      <div>${this.modulePermissionCode}</div>
    `);
    this.mainWindow.generateCode();
  }

  checkOwnPermission(permissionList) {
    // 清空所有已选
    $(this.mainWindow.getObject()).find(".ModulePermissionWindow").find(".panel-body").find("input").each(function() {
      if ($(this).hasClass("JSCheckBox")) {
        $(this).removeAttr("checked");
      }
    });
    let list = permissionList.split(";");
    for (let i = 0; i < list.length; i++) {
      let permission = list[i];
      if (0 < permission.length) {
        if ("*" == permission) {
          // 超级管理员具有所有权限
          $(this.mainWindow.getObject()).find(".ModulePermissionWindow").find(".panel-body").find("input").each(function() {
            if ($(this).hasClass("JSCheckBox")) {
              $(this).prop("checked", "checked");
            }
          });
        } else {
          $(this.mainWindow.getObject()).find(".ModulePermissionWindow").find(".panel-body").find("input").each(function() {
            if ($(this).hasClass("JSCheckBox")) {
              console.log($(this).val());
              if ($(this).val() == permission) {
                $(this).prop("checked", "checked");
              }
            }
          });
        }
      }
    }
  }

  update() {
    let _this = this;
    this.roleCB.update();
    ////////////////////////////////////////////////////////////////////////////
    // 绑定change事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.roleCB.getObject()).find("ul").find("li").find("a").click(function() {
      if (!$(this).parent().hasClass("disabled")) {
        let uuid = $(_this.roleCB.getObject()).find("button").attr("data-value");
        let data = {
          "uuid": uuid
        };
        let result = Ajax.submit(Configure.getServerUrl() + "user_security/getRole/", data, false, true, false);
        if (!Common.analyseResult(result)) {
          return false;
        }
        for (let i = 0; i < result.detail.length; i++) {
          _this.checkOwnPermission(result.detail[i].permission_list);
        }
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Submit按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.submitBtn.getObject()).click(function() {
      let uuid = $(_this.roleCB.getObject()).find("button").attr("data-value");
      let name = $(_this.roleCB.getObject()).find("button").attr("data-name");
      let permissionList = "";
      if ((undefined != uuid) && (null != uuid) && (0 < uuid.length)) {
        let isAllPermission = true;
        $(_this.mainWindow.getObject()).find(".ModulePermissionWindow").find(".panel-body").find("input").each(function() {
          if ($(this).hasClass("JSCheckBox")) {
            if ($(this).is(":checked")) {
              permissionList += $(this).val();
              permissionList += ";";
            } else {
              isAllPermission = false;
            }
          }
        });
        if (isAllPermission) {
          permissionList = "*";
        }
        if (0 == permissionList.length) {
          permissionList = "none;";
        }
      }
      let data = {
        "uuid": uuid,
        "name": name,
        "permission_list": permissionList
      };
      let result = Ajax.submit(Configure.getServerUrl() + "user_security/modifyRole/", data, false, true, false);
      if (Common.analyseResult(result)) {
        // 修改成功
        alert("Modify Success");
      } else {
        // 修改失败
        alert("Modify Failed");
      }
    });
  }
}
