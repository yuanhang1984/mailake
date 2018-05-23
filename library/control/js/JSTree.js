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
   *     "open": false,
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

  eventBind() {
    // 绑定点击显示事件
    let _this = this;
    $(this.getObject()).find(".libg").off("click").on("click", function() {
      if (null != _this.objectLastSelected) {
        _this.objectLastSelected.removeClass("libg_active");
      }
      $(this).addClass("libg_active");
      _this.objectLastSelected = $(this);
    });
    // 绑定折叠菜单事件
    $(this.getObject()).find(".libg_parent").off("click").on("click", function() {
      let open = $(this).attr("data-open");
      if ("true" == open) {
        $(this).parent().children("ul").css("display", "none");
        $(this).attr("data-open", "false");
        let obj = $(this).parent().children(".parent_open");
        obj.removeClass("parent_open");
        obj.addClass("parent_close");
      } else {
        $(this).parent().children("ul").css("display", "block");
        $(this).attr("data-open", "true");
        let obj = $(this).parent().children(".parent_close");
        obj.removeClass("parent_close");
        obj.addClass("parent_open");
      }
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
        ulCode += `<div class = "libg" data-value = "${obj.value}"></div><li class = "child">${imgCode}${obj.text}</li>`;
      } else {
        // 父菜单
        let imgClsCode = "";
        if (obj.open) {
          imgClsCode = "parent_open";
        } else {
          imgClsCode = "parent_close";
        }
        ulCode += `<div class = "libg libg_parent" data-open = "${obj.open}"></div><li class = "parent ${imgClsCode}">${imgCode}<div>${obj.text}</div></li>`;
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
