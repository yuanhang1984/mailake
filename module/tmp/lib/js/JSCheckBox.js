"use strict";

class JSCheckBox {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectEnabled = true;
    this.objectName = "";
    this.objectLabel = "";
    this.objectValue = "";
    this.objectChecked = false;
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setEnabled(enabled) {
    this.objectEnabled = enabled;
  }

  setName(name) {
    this.objectName = name;
  }

  setLabel(label) {
    this.objectLabel = label;
  }

  setValue(value) {
    this.objectValue = value;
  }

  setChecked(checked) {
    this.objectChecked = checked;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  generateCode() {
    let checkedCode = "";
    if (this.objectChecked) {
      checkedCode = "checked";
    }
    let enabledCode = "";
    if (!this.objectEnabled) {
      enabledCode = "disabled";
    }
    let labelCode = "";
    if ("" != this.objectLabel) {
      labelCode = `<label class = "JSCheckBox ${this.objectClass}" for = "${this.getId()}">${this.objectLabel}</label>`;
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <input ${checkedCode} ${enabledCode} type = "checkbox" class = "JSCheckBox ${this.objectClass}" id = "${this.getId()}" name = "${this.objectName}" value = "${this.objectValue}" />${labelCode}
    `;
  }
}
