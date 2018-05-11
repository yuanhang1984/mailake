"use strict";

class JSPagination {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectClass = "";
    this.objectOffset = 0;
    this.objectRows = 0;
    this.objectCount = 0;
    this.objectSize = 0;
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setOffset(offset) {
    this.objectOffset = offset;
  }

  setRows(rows) {
    this.objectRows = rows;
  }

  setCount(count) {
    this.objectCount = count;
  }

  setSize(size) {
    this.objectSize = size;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  /* 
   * setOffset 设置offset（MySql数据库Select操作offset参数）
   * setRows 设置rows（MySql数据库Select操作rows参数）
   * setCount 设置count（数据库检索结果的总条目数）
   * setSize 设置size（分几页）
   */
  generateCode() {
    let currentPage = 0;
    if (0 >= this.objectOffset) {
      currentPage = 1;
    } else {
      currentPage = Math.ceil(this.objectOffset / this.objectRows) + 1;
    }
    let count = Math.ceil(this.objectCount / this.objectRows);
    let displaySceneCount = Math.ceil(count / this.objectSize);
    let currentPageSceneNum = Math.ceil(currentPage / this.objectSize);
    let leftBtnCode = "";
    if (currentPageSceneNum > 1) {
      leftBtnCode = `
        <li data-offset = "${((currentPageSceneNum - 1) * this.objectSize * this.objectRows) - this.objectRows}"><a><span>&laquo;</span></a></li>
      `;
    }
    let otherCode = "";
    for (let i = ((currentPageSceneNum * this.objectSize) - this.objectSize + 1); i <= (currentPageSceneNum * this.objectSize); i++) {
      if (i > count) {
        break;
      }
      if (i == (currentPage)) {
        otherCode += `
          <li data-offset = "${(i * this.objectRows - this.objectRows)}" class = "active"><a>${i}</a></li>
        `;
      } else {
        otherCode += `
          <li data-offset = "${(i * this.objectRows - this.objectRows)}"><a>${i}</a></li>
        `;
      }
    }
    if ((displaySceneCount - currentPageSceneNum) >= 1) {
        otherCode += `
          <li data-offset = "${(currentPageSceneNum * this.objectSize * this.objectRows)}"><a><span>&raquo;</span></a></li>
        `;
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <nav class = "JSPagination ${this.objectClass}" id = "${this.getId()}">
        <ul class = "pagination">
          ${leftBtnCode}
          ${otherCode}
        </ul>
      </nav>
    `;
  }
}
