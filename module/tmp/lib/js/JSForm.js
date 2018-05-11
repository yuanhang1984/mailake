"use strict";

class JSForm {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectName = "";
    this.objectClass = "";
    this.objectContent = "";
    this.objectAction = "";
    this.objectMethod = "get";
    this.objectEnctype = "application/x-www-form-urlencoded";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setName(name) {
    this.objectName = name;
  }

  setContent(content) {
    this.objectContent = content;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  setAction(action) {
    this.objectAction = action;
  }

  setMethod(method) {
    this.objectMethod = method;
  }

  setEnctype(enctype) {
    this.objectEnctype = enctype;
  }

  getCode() {
    return this.objectCode;
  }

  update() {
  }

  generateCode() {
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <form class = "${this.objectClass}" name = "${this.objectName}" id = "${this.getId()}" action = "${this.objectAction}" method = "${this.objectMethod}" enctype = "${this.objectEnctype}">${this.objectContent}</form>
    `;
  }
}
