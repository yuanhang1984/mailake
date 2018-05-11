"use strict";

class JTable {
  /**
   * 合并表格的行
   * @param id table的id
   * @param type
   *          text 合并“内容相同”的行
   *          html 合并“html代码”的行
   *          (其他后续再作增加)
   */
  static rowspan(id, type) {
    let firstTd = "";
    let currentTd = "";
    let count = 0;
    // 这里的遍历找寻不必太过详细，要考虑到不同编码习惯下的容错情况。
    let obj = $("#" + id).find("tr").find("td:first-child");
    obj.each(function(i) {
      if (i == 0) {
        firstTd = $(this);
        count = 1;
      } else {
        currentTd = $(this);
        let sign = false;
        if ("text" == type.toLowerCase()) {
          if (firstTd.text() == currentTd.text()) {
            sign = true;
          } else {
            sign = false;
          }
        } else {
          if (firstTd.html() == currentTd.html()) {
            sign = true;
          } else {
            sign = false;
          }
        }
        if (sign) {
          count++;
          currentTd.remove();
          firstTd.attr("rowSpan", count);
        } else {
          firstTd = $(this);
          count = 1;
        }
      }
    });
  }
}
