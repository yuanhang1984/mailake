////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// SourceListWindow
////////////////////////////////////////////////////////////////////////////////
class SourceListWindow {
  constructor(srw) {
    this.srw = srw;
    ////////////////////////////////////////////////////////////////////////////
    // 模块下拉菜单
    ////////////////////////////////////////////////////////////////////////////
    this.modCB = new JSComboBox();
    this.modCB.setType("dropdown");
    this.modCB.addItem({
      "type": "option",
      "text": "Select Module",
      "value": "0",
      "enable": false
    });
    let result = Ajax.submit(Configure.getServerUrl() + "antcolony/getDiskNameList/", null, false, true, false);
    if (!Common.analyseResult(result)) {
      return false;
    }
    let list = result.detail;
    for (let i = 0; i < list.length; i++) {
      this.modCB.addItem({
        "type": "option",
        "text": `${list[i].name}`,
        "value": `${list[i].name}`,
        "enable": true
      });
    }
    this.modCB.setSelectedIndex(0);
    this.modCB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Necessary选择文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.nbBtn = new JSButton();
    this.nbBtn.setText("necessary");
    this.nbBtn.setClass("btn-primary");
    this.nbBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Necessary上传文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.nuBtn = new JSButton();
    this.nuBtn.setText(`<i class = "icon-upload"></i>`);
    this.nuBtn.setClass("btn-primary");
    this.nuBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Necessary上传表单
    ////////////////////////////////////////////////////////////////////////////
    this.nuFM = new JSForm();
    this.nuFM.setName("necessaryUploadForm");
    this.nuFM.setMethod("post");
    this.nuFM.setEnctype("multipart/form-data");
    this.nuFM.setContent(`
        <input style = "display: none;" type = "file" name = "attachment" />
        <div class = "btn-group" role = "group">${this.nbBtn.getCode() + this.nuBtn.getCode()}</div>
    `);
    this.nuFM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Optional选择文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.obBtn = new JSButton();
    this.obBtn.setText("optional");
    this.obBtn.setClass("btn-primary");
    this.obBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Optional上传文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.ouBtn = new JSButton();
    this.ouBtn.setText(`<i class = "icon-upload"></i>`);
    this.ouBtn.setClass("btn-primary");
    this.ouBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Optional上传表单
    ////////////////////////////////////////////////////////////////////////////
    this.ouFM = new JSForm();
    this.ouFM.setName("optionalUploadForm");
    this.ouFM.setMethod("post");
    this.ouFM.setEnctype("multipart/form-data");
    this.ouFM.setContent(`
        <input style = "display: none;" type = "file" name = "attachment" />
        <div class = "btn-group" role = "group">${this.obBtn.getCode() + this.ouBtn.getCode()}</div>
    `);
    this.ouFM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Source列表
    ////////////////////////////////////////////////////////////////////////////
    this.listTable = new JSTable();
    this.listTable.setClass("table-striped table-bordered");
    this.listTable.setThead(
      [
        {
          "text": "Type",
          "colspan": -1
        },
        {
          "text": "File Name",
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
          "text": `Search Result`,
          "value": "",
          "colspan": 3,
          "rowspan": -1
        }
      ]
    );
    this.listTable.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setTitle("Source List");
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setContent(`
      <div>${this.modCB.getCode()}</div>
      <div>${this.listTable.getCode()}</div>
    `);
    this.mainWindow.setClass("SourceListWindow");
    this.mainWindow.generateCode();
  }

  reLoadSourceList() {
    let _this = this;
    this.listTable.removeTbodyAll();
    let data = {
      "moduleName": this.selectedModule
    };
    let result = Ajax.submit(Configure.getServerUrl() + "antcolony/getServerSourceFileList/", data, false, true, false);
    if (!Common.analyseResult(result)) {
      return false;
    }
    let necessary = result.detail.necessary;
    if (0 < necessary.length) {
      for (let i = 0; i < necessary.length; i++) {
        this.listTable.addTbody(
          [
            {
              "text": `${this.nuFM.getCode()}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `${necessary[i].name}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `<i class = "icon-download" data-module = "${this.selectedModule}" data-file = "${necessary[i].name}" data-type = "necessary"></i><i class = "icon-remove" data-module = "${this.selectedModule}" data-file = "${necessary[i].name}" data-type = "necessary"></i>`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            }
          ]
        );
      }
    } else {
      this.listTable.addTbody(
        [
          {
            "text": `${this.nuFM.getCode()}`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          },
          {
            "text": "No Source File",
            "value": "",
            "colspan": 2,
            "rowspan": -1
          }
        ]
      );
    }
    let optional = result.detail.optional;
    if (0 < optional.length) {
      for (let i = 0; i < optional.length; i++) {
        this.listTable.addTbody(
          [
            {
              "text": `${this.ouFM.getCode()}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `${optional[i].name}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `<i class = "icon-download" data-module = "${this.selectedModule}" data-file = "${optional[i].name}" data-type = "optional"></i><i class = "icon-remove" data-module = "${this.selectedModule}" data-file = "${optional[i].name}" data-type = "optional"></i>`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            }
          ]
        );
      }
    } else {
      this.listTable.addTbody(
        [
          {
            "text": `${this.ouFM.getCode()}`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          },
          {
            "text": "No Source File",
            "value": "",
            "colspan": 2,
            "rowspan": -1
          }
        ]
      );
    }
    this.listTable.generateCode();
    $(this.mainWindow.getObject()).find("div:nth-child(2)").find("div:nth-child(2)").html(this.listTable.getCode());
    ////////////////////////////////////////////////////////////////////////////
    // 去掉重复行
    ////////////////////////////////////////////////////////////////////////////
    JTable.rowspan(this.listTable.getId(), "html");
    ////////////////////////////////////////////////////////////////////////////
    // 关联下载图标事件
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-download").click(function() {
      let moduleName = $(this).attr("data-module");
      let fileName = $(this).attr("data-file");
      let type = $(this).attr("data-type");
      window.open(Configure.getServerUrl() + "antcolony/downloadServerSourceFile/?moduleName=" + moduleName + "&fileName=" + fileName + "&type=" + type);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联删除图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-remove").attr("data-toggle", "modal");
    $(".icon-remove").attr("data-target", "#" + this.srw.mainWindow.getId());
    $(".icon-remove").click(function() {
      let moduleName = $(this).attr("data-module");
      let fileName = $(this).attr("data-file");
      let type = $(this).attr("data-type");
      $(_this.srw.mainWindow.getObject()).attr("data-module", moduleName);
      $(_this.srw.mainWindow.getObject()).attr("data-file", fileName);
      $(_this.srw.mainWindow.getObject()).attr("data-type", type);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Necessary选择文件事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.nbBtn.getObject()).click(function() {
      $(this).parent().parent().find("input:first-child").trigger("click");
    });

    ////////////////////////////////////////////////////////////////////////////
    // 绑定Optional选择文件事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.obBtn.getObject()).click(function() {
      $(this).parent().parent().find("input:first-child").trigger("click");
    });

    ////////////////////////////////////////////////////////////////////////////
    // 绑定NecessaryUpload按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.nuBtn.getObject()).click(function() {
      let uploadResult = Ajax.submit(Configure.getServerUrl() + "antcolony/uploadServerSourceCode/?moduleName=" + _this.selectedModule + "&type=necessary", new FormData(document.forms.namedItem("necessaryUploadForm")), false, true, true);
      if (Common.analyseResult(uploadResult)) {
        _this.reLoadSourceList();
      } else {
        // 上传失败
        alert("Upload Failed");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定OptionalUpload按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.ouBtn.getObject()).click(function() {
      let uploadResult = Ajax.submit(Configure.getServerUrl() + "antcolony/uploadServerSourceCode/?moduleName=" + _this.selectedModule + "&type=optional", new FormData(document.forms.namedItem("optionalUploadForm")), false, true, true);
      if (Common.analyseResult(uploadResult)) {
        _this.reLoadSourceList();
      } else {
        // 上传失败
        alert("Upload Failed");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Input事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.nuFM.getObject()).find("input").change(function() {
      $(_this.nuBtn.getObject()).prop("disabled", false);
    });
    $(this.ouFM.getObject()).find("input").change(function() {
      $(_this.ouBtn.getObject()).prop("disabled", false);
    });
    $(this.nuBtn.getObject()).prop("disabled", true);
    $(this.ouBtn.getObject()).prop("disabled", true);
  }

  update() {
    let _this = this;
    this.modCB.update();
    ////////////////////////////////////////////////////////////////////////////
    // 绑定事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.modCB.getObject()).find("ul").find("li").find("a").click(function() {
      if (!$(this).parent().hasClass("disabled")) {
        _this.selectedIndex = $(this).parent().attr("data-index");
        _this.selectedModule = $(this).parent().attr("data-value");
        _this.reLoadSourceList();
      }
    });
  }
}
