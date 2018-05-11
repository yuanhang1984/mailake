////////////////////////////////////////////////////////////////////////////////
// ECMAScript规范
////////////////////////////////////////////////////////////////////////////////
"use strict";
////////////////////////////////////////////////////////////////////////////////
// ResourceFileWindow
////////////////////////////////////////////////////////////////////////////////
class ResourceFileWindow {
  constructor() {
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
    // 资源文件类型下拉菜单
    ////////////////////////////////////////////////////////////////////////////
    this.fileCB = new JSComboBox();
    this.fileCB.setType("dropdown");
    this.fileCB.addItem({
      "type": "option",
      "text": "Select Type",
      "value": "0",
      "enable": false
    });
    this.fileCB.addItem({
      "type": "option",
      "text": "Config",
      "value": "config.xml",
      "enable": true
    });
    this.fileCB.addItem({
      "type": "option",
      "text": "Sql",
      "value": "sql.xml",
      "enable": true
    });
    this.fileCB.addItem({
      "type": "option",
      "text": "Dispatch",
      "value": "dispatch.xml",
      "enable": true
    });
    this.fileCB.setSelectedIndex(0);
    this.fileCB.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 文件内容输入框
    ////////////////////////////////////////////////////////////////////////////
    this.cntTA = new JSTextArea();
    this.cntTA.setClass("form-control");
    this.cntTA.setReadOnly(true);
    this.cntTA.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // Browse按钮
    ////////////////////////////////////////////////////////////////////////////
    this.browseBtn = new JSButton();
    this.browseBtn.setText("Browse");
    this.browseBtn.setClass("btn-primary");
    this.browseBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 上传按钮
    ////////////////////////////////////////////////////////////////////////////
    this.uploadBtn = new JSButton();
    this.uploadBtn.setText("Upload");
    this.uploadBtn.setClass("btn-primary");
    this.uploadBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 上传表单
    ////////////////////////////////////////////////////////////////////////////
    this.uploadFM = new JSForm();
    this.uploadFM.setName("uploadForm");
    this.uploadFM.setMethod("post");
    this.uploadFM.setEnctype("multipart/form-data");
    this.uploadFM.setContent(`
        <input style = "display: none;" type = "file" name = "attachment" />
        ${this.browseBtn.getCode() + this.uploadBtn.getCode()}
    `);
    this.uploadFM.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 创建下载按钮
    ////////////////////////////////////////////////////////////////////////////
    this.downloadBtn = new JSButton();
    this.downloadBtn.setText("Download");
    this.downloadBtn.setClass("btn-primary");
    this.downloadBtn.generateCode();
    ////////////////////////////////////////////////////////////////////////////
    // 主窗体对象
    ////////////////////////////////////////////////////////////////////////////
    this.mainWindow = new JSWindow();
    this.mainWindow.setWindowDecorationStyle("FRAME");
    this.mainWindow.setTitle("Resource File");
    this.mainWindow.setClass("ResourceFileWindow");
    this.mainWindow.setContent(`
      <div>${this.modCB.getCode()}</div>
      <div>${this.fileCB.getCode()}</div>
      <div>${this.cntTA.getCode()}</div>
      <div>${this.uploadFM.getCode() + this.downloadBtn.getCode()}</div>       
    `);
    this.mainWindow.generateCode();
  }

  reLoadModuleList() {
    this.modCB.removeItemAll();
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
    this.fileCB.setSelectedIndex(0);
    this.fileCB.generateCode();
    this.mainWindow.setContent(`
      <div>${this.modCB.getCode()}</div>
      <div>${this.fileCB.getCode()}</div>
      <div>${this.cntTA.getCode()}</div>
      <div>${this.uploadFM.getCode() + this.downloadBtn.getCode()}</div>       
    `);
    this.mainWindow.generateCode();
    $("#resourceFileWindowArea").html(this.mainWindow.getCode());
    this.update();
    $(this.browseBtn.getObject()).prop("disabled", true);
    $(this.uploadBtn.getObject()).prop("disabled", true);
    $(this.downloadBtn.getObject()).prop("disabled", true);
  }

  loadModuleResource(moduleName, fileName) {
    let _this = this;
    if ((undefined != moduleName) && (null != moduleName) && (0 < moduleName.length) && (undefined != fileName) && (null != fileName) && (0 < fileName.length)) {
      // 获取sql资源文件的内容
      let data = {
        "moduleName": moduleName,
        "fileName": fileName
      };
      let result = Ajax.submit(Configure.getServerUrl() + "antcolony/readServerResourceFile/", data, false, true, false);
      if (!Common.analyseResult(result)) {
        alert("Read Failed");
        return;
      }
      $(this.cntTA.getObject()).html(result.detail);
      // 绑定Upload按钮事件
      $(this.uploadBtn.getObject()).click(function() {
        let uploadResult = Ajax.submit(Configure.getServerUrl() + "antcolony/uploadServerResourceFile/?moduleName=" + moduleName + "&fileName=" + fileName, new FormData(document.forms.namedItem("uploadForm")), false, true, true);
        if (Common.analyseResult(uploadResult)) {
          let result = Ajax.submit(Configure.getServerUrl() + "antcolony/readServerResourceFile/", data, false, true, false);
          if (!Common.analyseResult(result)) {
            alert("Read Failed");
            return;
          }
          $(_this.cntTA.getObject()).html(result.detail);
        } else {
          // 上传失败
          alert("Upload Failed");
        }
      });
      $(this.browseBtn.getObject()).prop("disabled", false);
      $(this.downloadBtn.getObject()).prop("disabled", false);
    }
  }

  update() {
    let _this = this;
    this.modCB.update();
    this.fileCB.update();
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Browse按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.browseBtn.getObject()).click(function() {
      $(this).parent().find("input:first-child").trigger("click");
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Input事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.uploadFM.getObject()).find("input").change(function() {
      $(_this.uploadBtn.getObject()).prop("disabled", false);
    });

    ////////////////////////////////////////////////////////////////////////////
    // 绑定change事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.fileCB.getObject()).find("ul").find("li").find("a").click(function() {
      let moduleName = $(_this.modCB.getObject()).find("button").attr("data-value");
      let fileName = $(_this.fileCB.getObject()).find("button").attr("data-value");
      _this.loadModuleResource(moduleName, fileName);
    });

    $(this.modCB.getObject()).find("ul").find("li").find("a").click(function() {
      let moduleName = $(_this.modCB.getObject()).find("button").attr("data-value");
      let fileName = $(_this.fileCB.getObject()).find("button").attr("data-value");
      _this.loadModuleResource(moduleName, fileName);
    });
    ////////////////////////////////////////////////////////////////////////////
    // 绑定Download按钮事件
    ////////////////////////////////////////////////////////////////////////////
    $(this.downloadBtn.getObject()).click(function() {
      let moduleName = $(_this.modCB.getObject()).find("button").attr("data-value");
      let fileName = $(_this.fileCB.getObject()).find("button").attr("data-value");
      window.open(Configure.getServerUrl() + "antcolony/downloadServerResourceFile/?moduleName=" + moduleName + "&fileName=" + fileName);
    });
  }
}
