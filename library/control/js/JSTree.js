"use strict";

class JSTree {
  constructor() {
    this.objectId = JString.getUuid(true);
    this.objectNode = new Array();
    this.objectClass = "";
    this.objectCode = "";
    this.objectLastSelected = null;
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

  getCode() {
    return this.objectCode;
  }

  /* 
   * node 为json对象数组，格式如下：
   * [
   *   {
   *     "text": "山东",
   *     "image": "1.png",
   *     "list": [
   *       {
   *         "text": "济南",
   *         "image": "1_1.png",
   *         "value": "http://www.baidu.com"
   *       },
   *       {
   *         "text": "聊城",
   *         "value": "http://www.baidu.com"
   *       },
   *       {
   *         "text": "菏泽",
   *         "image": "1_2.png",
   *         "value": "http://www.baidu.com"
   *       },
   *       {
   *         "text": "临沂",
   *         "value": "http://www.baidu.com"
   *       }
   *     ]
   *   },
   *   {
   *     "text": "陕西"
   *   },
   *   {
   *     "text": "河北"
   *   },
   *   {
   *     "text": "辽宁"
   *   }
   * ]
   * text 导航显示的文本
   * image 显示图片
   * value 值
   * list 其下的数组
   */
  setNode(node) {
    this.objectNode = node;
  }

  update() {
    // 绑定事件
    let _this = this;
    $(this.getObject()).find(".libg").click(function() {
      if (null != _this.objectLastSelected) {
        _this.objectLastSelected.removeClass("libg_active");
      }
      $(this).addClass("libg_active");
      _this.objectLastSelected = $(this);
    });
  }

  /* 
   * 遍历节点
   */
  _eachNode(node) {
    let ulCode = "";
    if (this._firstUl) {
      // 注意：本类样式一定要加在默认class之后，objectClass之前。
      ulCode = `<ul class = "${this.objectClass}" id = "${this.getId()}">`;
      this._firstUl = false;
    } else {
      ulCode = "<ul>";
    }
    for (let i = 0; i < node.length; i++) {
      let obj = node[i];
      let imgCode = "";
      if (undefined != obj.image) {
        imgCode = `<img src = "${obj.image}" alt = "${obj.image}" />`;
      }
      if ((undefined == obj.list) || (0 >= obj.list.length)) {
        // 子菜单
        // ulCode += `<div class = "libg" data-value = "${obj.value}"></div><li class = "child"><a href = "${obj.value}">${imgCode}${obj.text}</a></li>`;
        ulCode += `<div class = "libg" data-value = "${obj.value}"></div><li class = "child">${imgCode}${obj.text}</li>`;
      } else {
        // 父菜单
        ulCode += `<div class = "libg"></div><li class = "parent">${imgCode}<div>${obj.text}</div></li>`;
      }
      let subNode = "";
      if ((undefined != obj.list) && (0 < obj.list.length)) {
        subNode += "<ul>";
        subNode = this._eachNode(obj.list);
      }
      ulCode += subNode;
    }
    ulCode += "</ul>";
    return ulCode;
  }

  generateCode() {
    this._firstUl = true;
    this.objectCode = this._eachNode(this.objectNode);
  }
}
