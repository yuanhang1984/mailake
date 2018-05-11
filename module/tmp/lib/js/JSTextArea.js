"use strict";

class JSTextArea {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectText = "";
    this.objectPlaceHolder = "";
    this.objectReadOnly = false;
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

  setPlaceHolder(placeHolder) {
    this.objectPlaceHolder = placeHolder;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  setReadOnly(readOnly) {
    this.objectReadOnly = readOnly;
  }

  getCode() {
    return this.objectCode;
  }

  /* 
   * 生成源码
   *
   * setPlaceHolder 设置placeholder
   */
  generateCode() {
    let readOnly = "";
    if (this.objectReadOnly) {
      readOnly = "readonly";
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <textarea ${readOnly} class = "form-control JSTextArea ${this.objectClass}" id = "${this.getId()}" placeholder = "${this.objectPlaceHolder}">${this.objectText}</textarea>
    `;
  }
}
