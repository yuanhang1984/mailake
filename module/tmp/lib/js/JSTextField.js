"use strict";

class JSTextField {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectType = "";
    this.objectPlaceHolder = "";
    this.objectValue = "";
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

  setType(type) {
    this.objectType = type;
  }

  setPlaceHolder(placeHolder) {
    this.objectPlaceHolder = placeHolder;
  }

  setValue(value) {
    this.objectValue = value;
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
   * setType 设置类型
   *   text 文本框
   *   password 密码框
   * setPlaceHolder 设置placeholder
   */
  generateCode() {
    let readOnly = "";
    if (this.objectReadOnly) {
      readOnly = "readonly";
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <input ${readOnly} type = "${this.objectType}" class = "form-control JSTextField ${this.objectClass}" id = "${this.getId()}" placeholder = "${this.objectPlaceHolder}"  value = "${this.objectValue}" />
    `;
  }
}
