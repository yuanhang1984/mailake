"use strict";

class JSTitleBar {
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectContent = "";
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setContent(cnt) {
    this.objectContent = cnt;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  generateCode() {
    this.objectCode = `
      <div class = "${this.objectClass}" id = "${this.getId()}">${this.objectContent}</div>
    `;
  }
}
