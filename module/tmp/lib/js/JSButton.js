"use strict";

class JSButton {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectText = "";
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setText(text) {
    this.objectText = text;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  generateCode() {
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <button type = "button" class = "btn JSButton ${this.objectClass}" id = "${this.getId()}">${this.objectText}</button>
    `;
  }
}
