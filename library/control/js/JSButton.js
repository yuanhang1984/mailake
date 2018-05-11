"use strict";

class JSButton {
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
    this.objectCode = `
      <div class = "${this.objectClass}" id = "${this.getId()}">${this.objectText}</div>
    `;
  }
}
