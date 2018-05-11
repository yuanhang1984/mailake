////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// LibraryListWindow
////////////////////////////////////////////////////////////////////////////////
class LibraryListWindow {
  constructor(lrw) {
    this.lrw = lrw;
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
    // Browse选择文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.browseBtn = new JSButton();
    this.browseBtn.setText("Browse");
    this.browseBtn.setClass("btn-primary");
    this.browseBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // upload上传文件按钮
    ////////////////////////////////////////////////////////////////////////////
    this.uploadBtn = new JSButton();
    this.uploadBtn.setText(`<i class = "icon-upload"></i>`);
    this.uploadBtn.setClass("btn-primary");
    this.uploadBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Necessary上传表单
    ////////////////////////////////////////////////////////////////////////////
    this.libFM = new JSForm();
    this.libFM.setName("libraryUploadForm");
    this.libFM.setMethod("post");
    this.libFM.setEnctype("multipart/form-data");
    this.libFM.setContent(`
        <input style = "display: none;" type = "file" name = "attachment" />
        <div class = "btn-group" role = "group">${this.browseBtn.getCode() + this.uploadBtn.getCode()}</div>
    `);
    this.libFM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Library列表
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
    this.mainWindow.setTitle("Library List");
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setContent(`
      <div>${this.modCB.getCode()}</div>
      <div>${this.listTable.getCode()}</div>
    `);
    this.mainWindow.setClass("LibraryListWindow");
    this.mainWindow.generateCode();
  }

  reLoadLibraryList() {
    let _this = this;
    this.listTable.removeTbodyAll();
    let data = {
      "moduleName": this.selectedModule
    };
    let result = Ajax.submit(Configure.getServerUrl() + "antcolony/getServerLibraryFileList/", data, false, true, false);
    if (!Common.analyseResult(result)) {
      return false;
    }
    if (0 < result.detail.length) {
      for (let i = 0; i < result.detail.length; i++) {
        this.listTable.addTbody(
          [
            {
              "text": `${this.libFM.getCode()}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `${result.detail[i].name}`,
              "value": "",
              "colspan": -1,
              "rowspan": -1
            },
            {
              "text": `<i class = "icon-download" data-module = "${this.selectedModule}" data-file = "${result.detail[i].name}" data-type = "result.detail"></i><i class = "icon-remove" data-module = "${this.selectedModule}" data-file = "${result.detail[i].name}"></i>`,
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
            "text": `${this.libFM.getCode()}`,
            "value": "",
            "colspan": -1,
            "rowspan": -1
          },
          {
            "text": "No Library File",
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
      window.open(Configure.getServerUrl() + "antcolony/downloadServerSourceLibrary/?moduleName=" + moduleName + "&fileName=" + fileName);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 关联删除图标打开模态窗口
    ////////////////////////////////////////////////////////////////////////////
    $(".icon-remove").attr("data-toggle", "modal");
    $(".icon-remove").attr("data-target", "#" + this.lrw.mainWindow.getId());
    $(".icon-remove").click(function() {
      let moduleName = $(this).attr("data-module");
      let fileName = $(this).attr("data-file");
      $(_this.lrw.mainWindow.getObject()).attr("data-module", moduleName);
      $(_this.lrw.mainWindow.getObject()).attr("data-file", fileName);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Browse选择文件事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.browseBtn.getObject()).click(function() {
      $(this).parent().parent().find("input:first-child").trigger("click");
    });

    ////////////////////////////////////////////////////////////////////////////
    // 绑定Upload按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.uploadBtn.getObject()).click(function() {
      let uploadResult = Ajax.submit(Configure.getServerUrl() + "antcolony/uploadServerSourceLibrary/?moduleName=" + _this.selectedModule, new FormData(document.forms.namedItem("libraryUploadForm")), false, true, true);
      if (Common.analyseResult(uploadResult)) {
        _this.reLoadLibraryList();
      } else {
        // 上传失败
        alert("Upload Failed");
      }
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Input事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.libFM.getObject()).find("input").change(function() {
      $(_this.uploadBtn.getObject()).prop("disabled", false);
    });
    $(this.uploadBtn.getObject()).prop("disabled", true);
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
        _this.reLoadLibraryList();
      }
    });
  }
}
