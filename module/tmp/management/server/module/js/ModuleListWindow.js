////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ModuleListWindow
////////////////////////////////////////////////////////////////////////////////
class ModuleListWindow {
  constructor(mcw, mrw, mmw) {
    this.mcw = mcw;
    this.mrw = mrw;
    this.mmw = mmw;
    ////////////////////////////////////////////////////////////////////////////
    // 获取已加载模块的名称列表
    ////////////////////////////////////////////////////////////////////////////
    this.modLoadNameList = new Array();
    let result = Ajax.submit(Configure.getServerUrl() + "antcolony/getLoadNameList/", null, false, true, false);
    if (Common.analyseResult(result)) {
      for (let i = 0; i < result.detail.length; i++) {
        this.modLoadNameList.push(result.detail[i]);
      }
    }
    ////////////////////////////////////////////////////////////////////////////
    // Module列表
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
          "text": "Load",
          "colspan": -1
        },
        {
          "text": "Operation",
          "colspan": -1
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
    this.mainWindow.setTitle("Module List");
    this.mainWindow.setClass("ModuleListWindow");
    this.mainWindow.setContent(`
      <div>${this.listTable.getCode()}</div>
      <div>${this.createBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
    this.reLoadModuleList();
  }

  //////////////////////////////////////////////////////////////////////////////
  // 检查模块名称是否已被加载
  //////////////////////////////////////////////////////////////////////////////
  isModuleLoad(name) {
    for (let i = 0; i < this.modLoadNameList.length; i++) {
      if (this.modLoadNameList[i].name == name) {
        return true;
      }
    }
    return false;
  }

  //////////////////////////////////////////////////////////////////////////////
  // 重新加载模块列表
  //////////////////////////////////////////////////////////////////////////////
  reLoadModuleList() {
    let result = Ajax.submit(Configure.getServerUrl() + "antcolony/getDiskNameList/", null, false, true, false);
    if (Common.analyseResult(result)) {
      if ("none" == result.error.toLowerCase()) {
        this.listTable.removeTbodyAll();
        let modList = result.detail;
        for (let i = 0; i < modList.length; i++) {
          let isLoad = "False";
          if (this.isModuleLoad(modList[i].name)) {
            isLoad = "True";
          }
          this.listTable.addTbody(
            [
              {
                "text": `${modList[i].name}`,
                "value": `${modList[i].name}`,
                "colspan": -1,
                "rowspan": -1
              },
              {
                "text": `${isLoad}`,
                "value": `${isLoad}`,
                "colspan": -1,
                "rowspan": -1
              },
              {
                "text": `<i class = "icon-edit" data-name = "${modList[i].name}"></i><i class = "icon-remove" data-name = "${modList[i].name}"></i>`,
                "value": "",
                "colspan": -1,
                "rowspan": -1
              }
            ]
          );
        }
      }
    }
    this.listTable.generateCode();
    this.mainWindow.setContent(`
      <div>${this.listTable.getCode()}</div>
      <div>${this.createBtn.getCode()}</div>
    `);
    this.mainWindow.generateCode();
    $("#moduleListWindowArea").html(this.mainWindow.getCode());
    this.update();
  }

  update() {
    let _this = this;
    ////////////////////////////////////////////////////////////////////////////
    // 关联Create按钮打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(this.createBtn.getObject()).attr("data-toggle", "modal");
    $(this.createBtn.getObject()).attr("data-target", "#" + this.mcw.mainWindow.getId());
    ////////////////////////////////////////////////////////////////////////////
    // 关联编辑图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-edit").attr("data-toggle", "modal");
    $(".icon-edit").attr("data-target", "#" + _this.mmw.mainWindow.getId());
    $(".icon-edit").click(function() {
      // 设置修改数据的name
      _this.mmw.loadModule($(this).attr("data-name"));
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联删除图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-remove").attr("data-toggle", "modal");
    $(".icon-remove").attr("data-target", "#" + _this.mrw.mainWindow.getId());
    $(".icon-remove").click(function() {
      $(_this.mrw.mainWindow.getObject()).attr("data-name", $(this).attr("data-name"));
    });   
  }
}
