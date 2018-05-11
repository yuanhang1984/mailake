"use strict";

class JSDateTimePicker {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectPlaceHolder = "";
    this.objectValue = "";
    this.objectReadOnly = false;
    this.objectFormat = "";
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setPlaceHolder(placeHolder) {
    this.objectPlaceHolder = placeHolder;
  }

  setValue(value) {
    this.objectValue = value;
  }

  setFormat(format) {
    this.objectFormat = format;
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

  update() {
    $(this.getObject()).datetimepicker();
  }

  generateCode() {
    let readOnly = "";
    if (this.objectReadOnly) {
      readOnly = "readonly";
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <input ${readOnly} type = "text" class = "JSDateTimePicker ${this.objectClass}" id = "${this.getId()}" placeholder = "${this.objectPlaceHolder}"  value = "${this.objectValue}" data-date-format = "${this.objectFormat}" />
    `;
  }
}
