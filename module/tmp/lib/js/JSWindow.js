"use strict";

class JSWindow {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectTitle = "";
    this.objectContent = "";
    this.objectWindowDecorationStyle = "FRAME";
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setTitle(title) {
    this.objectTitle = title;
  }

  setContent(content) {
    this.objectContent = content;
  }

  setWindowDecorationStyle(windowDecorationStyle) {
    this.objectWindowDecorationStyle = windowDecorationStyle;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  /*
   * setWindowDecorationStyle 设置窗口装饰
   *                          NONE 无装饰（只有一个border）
   *                          FRAME 普通窗口风格（无关闭按钮）
   *                          DIALOG 模态窗口风格（含关闭按钮）
   */
  generateCode() {
    if("NONE" == this.objectWindowDecorationStyle.toUpperCase()) {
      // 注意：本类样式一定要加在默认class之后，objectClass之前。
      this.objectCode = `
        <div class = "panel panel-primary JSWindow ${this.objectClass}" id = "${this.getId()}">
          <div class = "panel-body">${this.objectContent}</div>
        </div>
      `;
    } else if ("DIALOG" == this.objectWindowDecorationStyle.toUpperCase()) {
      // 注意：本类样式一定要加在默认class之后，objectClass之前。
       this.objectCode = `
        <div class = "modal fade" id = "${this.getId()}">
          <div class = "panel panel-primary JSWindow ${this.objectClass}">
            <div class = "panel-heading">${this.objectTitle}<button type = "button" class = "close" data-dismiss = "modal">&times;</button></div>
            <div class = "panel-body">${this.objectContent}</div>
          </div>
        </div>
      `;   
    } else {
      // 注意：本类样式一定要加在默认class之后，objectClass之前。
      this.objectCode = `
        <div class = "panel panel-primary JSWindow ${this.objectClass}" id = "${this.getId()}">
          <div class = "panel-heading">${this.objectTitle}</div>
          <div class = "panel-body">${this.objectContent}</div>
        </div>
      `;
    }
  }
}
