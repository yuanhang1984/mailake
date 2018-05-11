////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ModulePermissionWindow
////////////////////////////////////////////////////////////////////////////////
class ModulePermissionWindow {
  constructor(moduleName, permissionList) {
    this.cbList = new Array();
    this.cbCode = "";
    for (let i = 0; i < permissionList.length; i++) {
      let cb = new JSCheckBox();
      cb.setName(permissionList[i].name);
      cb.setLabel(permissionList[i].label);
      cb.setValue(permissionList[i].value);
      cb.setChecked(permissionList[i].checked);
      cb.generateCode();
      this.cbList.push(cb);
      this.cbCode += `<span>${cb.getCode()}</span>`;
    }
    ////////////////////////////////////////////////////////////////////////////
    // 全选
    ////////////////////////////////////////////////////////////////////////////
    this.selectAllCB = new JSCheckBox();
    this.selectAllCB.setName(JString.getUuid(true));
    this.selectAllCB.setLabel(moduleName);
    this.selectAllCB.setValue("all");
    this.selectAllCB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle(this.selectAllCB.getCode());
    this.mainWindow.setClass("ModulePermissionWindow");
    this.mainWindow.setContent(`
      <div>${this.cbCode}</div>
    `);
    this.mainWindow.generateCode();
  }

  update() {
    let _this = this;
    // change
    $(this.selectAllCB.getObject()).change(function() { 
      for (let i = 0; i < _this.cbList.length; i++) {
        $(_this.cbList[i].getObject()).prop("checked", _this.selectAllCB.getObject().is(":checked"));
      }
    });
  }
}
