"use strict";

class JWeb {
  /**
   * 根据参数名从url获取参数值
   * @param name 参数名
   * @return 返回参数名对应的值值,没有找到返回null.
   */
  static getQueryFromUrl(name) {
       let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
       let result = window.location.search.substr(1).match(reg);
       if (null != result) {
         let value = result[2];
         if (0 >= value.length) {
           return null;
         }
         return unescape(value);
       } else {
         return null;
       }
  }
}
