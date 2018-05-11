////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// RoleListWindow
////////////////////////////////////////////////////////////////////////////////
class RoleListWindow {
  constructor(rcw, rrw, rmw) {
    // 创建Role的模态框对象
    this.rcw = rcw;
    // 删除Role的模态框对象
    this.rrw = rrw;
    // 修改Role的模态框对象
    this.rmw = rmw;
    ////////////////////////////////////////////////////////////////////////////
    // Role列表
    ////////////////////////////////////////////////////////////////////////////
    this.listTable = new JSTable();
    this.listTable.setClass("table-striped table-bordered");
    this.listTable.setThead(
      [
        {
          "text": "Name",
          "colspan": -1
        },
        {
          "text": "Description",
          "colspan": -1
        },
        {
          "text": "Operation",
          "colspan": -1
        }
      ]
    );
    this.listTable.addTbody(
      [
        {
          "text": "superadmin(Demo)",
          "value": "superadmin",
          "colspan": -1,
          "rowspan": -1
        },
        {
          "text": "super admin(Demo)",
          "value": "super admin",
          "colspan": -1,
          "rowspan": -1
        },
        {
          "text": `<i class = "icon-edit" data-uuid = "-1"></i><i class = "icon-remove" data-uuid = "-1"></i>`,
          "value": "",
          "colspan": -1,
          "rowspan": -1
        }
      ]
    );
    this.listTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Create按钮
    ////////////////////////////////////////////////////////////////////////////
    this.createBtn = new JSButton();
    this.createBtn.setText("Create");
    this.createBtn.setClass("btn-primary");
    this.createBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Role List");
    this.mainWindow.setClass("RoleListWindow");
    this.mainWindow.setContent(`
      <div>${this.listTable.getCode()}</div>
      <div>${this.createBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
  }

  //////////////////////////////////////////////////////////////////////////////
  // 设置角色列表数据
  //////////////////////////////////////////////////////////////////////////////
  setRoleList(roleList) {
    this.listTable.removeTbodyAll();
    for (let i = 0; i < roleList.length; i++) {
      this.listTable.addTbody(
        [
          {
            "text": `${roleList[i].name}`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          },
          {
            "text": `${roleList[i].description}`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          },
          {
            "text": `<i class = "icon-edit" data-uuid = "${roleList[i].uuid}"></i><i class = "icon-remove" data-uuid = "${roleList[i].uuid}"></i>`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          }
        ]
      );
    }
    this.listTable.generateCode();
    this.mainWindow.setContent(`
      <div>${this.listTable.getCode()}</div>
      <div>${this.createBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
  }

  update() {
    let _this = this;
    ////////////////////////////////////////////////////////////////////////////
    // 关联Create按钮打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(this.createBtn.getObject()).attr("data-toggle", "modal");
    $(this.createBtn.getObject()).attr("data-target", "#" + this.rcw.mainWindow.getId());
    ////////////////////////////////////////////////////////////////////////////
    // 关联编辑图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-edit").attr("data-toggle", "modal");
    $(".icon-edit").attr("data-target", "#" + _this.rmw.mainWindow.getId());
    $(".icon-edit").click(function() {
      // 设置修改数据的uuid
      _this.rmw.loadRole($(this).attr("data-uuid"));
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联删除图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-remove").attr("data-toggle", "modal");
    $(".icon-remove").attr("data-target", "#" + _this.rrw.mainWindow.getId());
    $(".icon-remove").click(function() {
      $(_this.rrw.mainWindow.getObject()).attr("data-uuid", $(this).attr("data-uuid"));
    });   
  }
}
