"use strict";

class JSComboBox {
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectComboBoxWidth = 0;
    this.objectListWidth = 0;
    this.objectListAdjustTop = 0; // List的Top调整
    this.objectListAdjustLeft = 0; // List的Left调整
    this.objectButtonType = "text";
    this.objectClass = "";
    this.objectSelectedIndex = 0;
    this.objectItemList = new Array();
    this.objectCode = "";
  }

  getId() {
    return this.objectId;
  }

  getObject() {
    return $("#" + this.getId());
  }

  setClass(clazz) {
    this.objectClass = clazz;
  }

  setComboBoxWidth(comboBoxWidth) {
    this.objectComboBoxWidth = comboBoxWidth;
  }

  setListAdjustTop(listAdjustTop) {
    this.objectListAdjustTop = listAdjustTop;
  }

  setListAdjustLeft(listAdjustLeft) {
    this.objectListAdjustLeft = listAdjustLeft;
  }

  /* 
   * buttonType两种类型
   * text: 文本类型（点击下拉列表改变按钮文本）
   * image: 图像类型（点击下拉列表不改变按钮文本）
   */
  setButtonType(buttonType) {
    this.objectButtonType = buttonType;
  }

  setListWidth(listWidth) {
    this.objectListWidth = listWidth;
  }

  setSelectedIndex(selectedIndex) {
    this.objectSelectedIndex = selectedIndex;
  }

  /* 
   * item 为json对象，格式如下：
   * {
   *   "type": "option",
   *   "text": "-- select --",
   *   "value": "0",
   *   "enable": false
   * }
   * type 显示的类型
   *      option 常规下拉选项
   *      separator 分割线（当type为separator时，后面参数忽略）
   * text 显示的文本
   * value 对应的值
   * enable 是否可用
   *        true 可用
   *        false 禁用
   */
  addItem(item) {
    this.objectItemList.push(item);
  }

  insertItemAt(item, index) {
    this.objectItemList.splice(index, 0, item);
  }

  removeItemAt(index) {
    this.objectItemList.splice(index, 1);
  }

  removeItemAll() {
    this.objectItemList.splice(0, this.objectItemList.length);
  }

  getItemAt(index) {
    if (index <= this.objectItemList.length) {
      return this.objectItemList[index];
    }
  }

  getItemCount() {
    return this.objectItemList.length;
  }

  getCode() {
    return this.objectCode;
  }

  eventBind() {
    let _this = this;
    // 点击显示菜单事件
    $(this.getObject()).find(".button").off("click").on("click", function() {
      $(_this.getObject()).find(".list").css("display", "block");
      let cbTop = $(_this.getObject()).offset().top;
      let cbLeft = $(_this.getObject()).offset().left;
      let cbWidth = $(_this.getObject()).width();
      let cbHeight = $(_this.getObject()).height();
      let cbBorderWidth = parseInt($(_this.getObject()).css("border-width"));
      $(_this.getObject()).find(".list").css("top", (cbTop + cbHeight + (cbBorderWidth * 2) + _this.objectListAdjustTop) + "px");
      $(_this.getObject()).find(".list").css("left", (cbLeft + cbBorderWidth * (-1) + cbBorderWidth + _this.objectListAdjustLeft) + "px");
    });
    // 控件失去焦点隐藏菜单事件
    $(this.getObject()).off("blur").on("blur", function() {
      $(_this.getObject()).find(".list").css("display", "none");
    });
    // 菜单鼠标点击事件
    $(this.getObject()).find(".list").find("ul").find("li").off("click").on("click", function() {
      if (!$(this).hasClass("disabled")) {
        let currentText = $(this).attr("data-text");
        let currentValue = $(this).attr("data-value");
        let currentIndex = $(this).attr("data-index");
        _this.objectSelectedIndex = currentIndex;
        // 需要判断buttonType类型，判断是否需要更改button的text。
        if ("text" == _this.objectButtonType) {
          $(_this.getObject()).find(".button").text(currentText);
        }
        // 重置已选列表
        $(_this.getObject()).find(".list").find("ul").find("li").find(".select").html("");
        // 勾选当前选择列表
        $(this).find(".select").html("&radic;");
        // 设置选择值至控件
        $(_this.getObject()).attr("data-text", currentText);
        $(_this.getObject()).attr("data-value", currentValue);
        $(_this.getObject()).attr("data-index", currentIndex);
        // 隐藏菜单
        $(_this.getObject()).find(".list").css("display", "none");
      }
    });
    // 根据objectSelectedIndex设置List选中样式
    $(this.getObject()).find(".list").find("ul").find("li").each(function() {
      let currentValue = $(this).attr("data-value");
      if (currentValue == _this.objectItemList[_this.objectSelectedIndex].value) {
        // 更新内容
        $(_this.getObject()).attr("data-value", currentValue);
        // 标记选项
        $(this).find(".select").html("&radic;");
        return;
      }
    });
  }

  generateCode() {
    // 遍历list组合代码
    let listCode = "<ul>";
    for (let i = 0; i < this.objectItemList.length; i++) {
      let obj = this.objectItemList[i];
      if ("separator" == obj.type) {
        // 分割线
        listCode += `<li class = "divider disabled"></li>`;
      } else {
        let disableClass = "";
        if (!obj.enable) {
          disableClass = "disabled";
        }
        // 常规下拉选项
        listCode += `<li class = "${disableClass}" data-index = "${i}" data-text = "${obj.text}" data-value = "${obj.value}"><div class = "select"></div>${obj.text}</li>`;
      }
    }
    listCode += `</ul>`;
    this.objectCode = `
      <div class = "${this.objectClass}" id = "${this.getId()}" style = "width: ${this.objectComboBoxWidth}px" tabindex = "0">
        <div class = "button">${this.objectItemList[this.objectSelectedIndex].text}</div>
        <div class = "list" style = "width: ${this.objectListWidth}px">${listCode}</div>
      </div>
    `;
  }
}
