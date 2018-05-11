"use strict";

class JSTable {
  /*
   * 构造函数（无参）
   * 自动初始化对象的id。
   */
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectCaption = "";
    this.objectThead = new Array();
    this.objectTbody = new Array();
    this.objectClass = "";
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setCaption(caption) {
    this.objectCaption = caption;
  }

  /* 
   * thead 为json对象，格式如下：
   * {
   *   "text": "Name",
   *   "colspan": "-1"
   * }
   * text 显示的文本
   * colspan 跨列的数量（若单独一列默认为-1）
   */
  setThead(thead) {
    this.objectThead = thead;
  }

  setTbody(tbody) {
    this.objectTbody = tbody;
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  getCode() {
    return this.objectCode;
  }

  /* 
   * body 为json对象数组，格式如下：
   * [
   *   {
   *     "text": "Name",
   *     "colspan": "-1",
   *     "rowspan": "-1"
   *   },
   *   {
   *     "text": "Age",
   *     "colspan": "-1",
   *     "rowspan": "-1"
   *   }
   * ]
   * text 显示的文本
   * colspan 跨列的数量（若单独一列默认为-1）
   * rowspan 跨行的数量（若单独一列默认为-1）
   */
  addTbody(tbody) {
    this.objectTbody.push(tbody);
  }

  insertTbodyAt(tbody, index) {
    this.objectTbody.splice(index, 0, tbody);
  }

  removeTbodyAt(index) {
    this.objectTbody.splice(index, 1);
  }

  removeTbodyAll() {
    this.objectTbody.splice(0, this.objectTbody.length);
  }

  getTbodyAt(index) {
    if (index <= this.objectTbody.length) {
      return this.objectTbody[index];
    }
  }

  getTbodyCount() {
    return this.objectTbody.length;
  }

  generateCode() {
    let captionCode = "";
    if ("" != this.objectCaption) {
      captionCode = `
        <caption>${this.objectCaption}</caption>
      `;
    }
    let theadCode = "";
    if (0 < this.objectThead.length) {
      theadCode = "<tr>";
      for (let i = 0; i < this.objectThead.length; i++) {
        let obj = this.objectThead[i];
        let colspanCode = "";
        if (-1 != obj.colspan) {
          colspanCode = "colspan = " + obj.colspan;
        }
        theadCode += `
          <th ${colspanCode}>${obj.text}</th>
        `;
      }
      theadCode += "</tr>";
    }
    let tbodyCode = "";
    if (0 < this.objectTbody.length) {
      for (let i = 0; i < this.objectTbody.length; i++) {
        let row = this.objectTbody[i];
        let trCode = "<tr>";
        for (let j = 0; j < row.length; j++) {
          let obj = row[j];
          let colspanCode = "";
          if (-1 != obj.colspan) {
            colspanCode = "colspan = " + obj.colspan;
          }
          let rowspanCode = "";
          if (-1 != obj.rowspan) {
            rowspanCode = "rowspan = " + obj.rowspan;
          }
          trCode += `
            <td ${colspanCode} ${rowspanCode} data-value = "${obj.value}">${obj.text}</td>
          `;
        }
        trCode += "</tr>";
        tbodyCode += trCode;
      }
    }
    // 注意：本类样式一定要加在默认class之后，objectClass之前。
    this.objectCode = `
      <table class = "table JSTable ${this.objectClass}" id = "${this.getId()}">
        ${captionCode}
        <thead>${theadCode}</thead>
        <tbody>${tbodyCode}</tbody>
      </table>
    `;
  }
}
