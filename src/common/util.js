import Vue from 'vue'
Vue.prototype.$utils = {
  addCookie: function(objName, objValue, objHours){
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {   
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
  },
  getCookie: function(objName){
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
      var temp = arrStr[i].split("=");
      if (temp[0] == objName) return unescape(temp[1]);
    }
  },
  delCookie: function(name){
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = name + "=a; expires=" + date.toGMTString();
  }, 
  addUrlQuery: function(originUrl, queryObj){
    function toQueryString(qObj) {
      let str = '';
      for (let [key, value] of Object.entries(qObj)) {
        str += `${key}=${value}&`;
      };
      str = str.substring(0, str.length - 1);
      return str;
    };
    function toStringQuery(qString) {
      if (qString.substring(qString.length - 1) == '&') {
        qString = qString.substring(0, qString.length - 1);
      };
      let qArr = qString.split('&');
      let resObj = {};
      for (let i = 0; i < qArr.length; i++) {
        let _o = qArr[i].split('=');
        resObj[_o[0]] = _o[1];
      };
      return resObj;
    };
    let urlArr = originUrl.split('?');
    if (urlArr[0] == originUrl) {
      return `${originUrl.trim()}?${toQueryString(queryObj)}`;
    } else {
      if (urlArr[1].trim() == "") {
        return `${originUrl.trim()}${toQueryString(queryObj)}`;
      } else {
        let _oldQueryObj = toStringQuery(urlArr[1]);
        let resObj = { ..._oldQueryObj, ...queryObj };
        return `${urlArr[0].trim()}?${toQueryString(resObj)}`;
      };
    };
  },
  deepClone: function(data) {
    let t = type(data), o, i, ni;
    if(t === 'array') {
      o = [];
    }else if( t === 'object') {
      o = {};
    }else {
      return data;
    }
    if(t === 'array') {
      for (i = 0, ni = data.length; i < ni; i++) {
        o.push(this.deepClone(data[i]));
      }
      return o;
    }else if( t === 'object') {
      for( i in data) {
        o[i] = this.deepClone(data[i]);
      }
      return o;
    }
    function type(obj) {
      let toString = Object.prototype.toString;
      let map = {
        '[object Boolean]'  : 'boolean', 
        '[object Number]'   : 'number', 
        '[object String]'   : 'string', 
        '[object Function]' : 'function', 
        '[object Array]'    : 'array', 
        '[object Date]'     : 'date', 
        '[object RegExp]'   : 'regExp', 
        '[object Undefined]': 'undefined',
        '[object Null]'     : 'null', 
        '[object Object]'   : 'object'
      };
      return map[toString.call(obj)];
    }
  },
  jsonClone: function(obj){
    return JSON.parse(JSON.stringify(obj))
  },
  /*
  *  data = [
  *   {id: 1, parentid: 0, ...},
  *   {id: 2, parentid: 0, ...},
  *   {id: 3, parentid: 1, ...},
  *   {id: 4, parentid: 3, ...}
  *  ]
  */
  cleanData: function(data, {id = 'id', parentid = 'parentid'} = {}){
    let vm = this;
    function cleanData(data) {
      let data2 = vm.jsonClone(data);
      let levelLength = 0;
      let clean = [];
      if (data2.length == 0) return [];
      
      function convert(data){
        for(let i=0; i<data.length; i++){
          for(let j=0; j<data.length; j++){
            if(data[i][id] == data[j][parentid]){
              data[i]._isleaf = 0;
              break;
            }
          }
          if(data[i]._isleaf == undefined){
            data[i]._isleaf = 1;
          }
        };
        for(let i=0; i<data.length; i++){
          if(data[i][parentid] != 0){
            getLv(data[i], 1, data[i][parentid]);
          }else{
            data[i]._level = 0;
          }
        };
        function getLv(item, lv, pid){
          for(let j=0; j<data.length; j++){
            if(data[j][id] == pid){
              if(data[j][parentid] == 0){
                item._level = lv;
                return ;
              }else{
                lv++;
                getLv(item, lv, data[j][parentid]);
              }
              return ;
            }
          };
        };
        return data;
      };
      data2 = convert(data2);
      data2.forEach(item => {
        if (item._level > levelLength) {
          levelLength = item._level;
        }
      });
      data2 = data2.map(item => {
        item._child = [];
        return item;
      });
      for (let i = 0; i <= levelLength; i++) {
        clean[i] = [];
        data2.forEach(item => {
          if (item._level == i) {
            clean[i].push(item);
          }
        });
      }
      for (let i = clean.length - 1; i >= 0; i--) {
        for (let j = 0; j < clean[i].length; j++) {
          addToChildren(clean[i][j], i);
        }
      }
      return clean[0];
      function addToChildren(obj, index) {
        if (index != 0) {
          let _i = index - 1;
          for (let i = 0; i < clean[_i].length; i++) {
            if (clean[_i][i][id] == obj[parentid]) {
              clean[_i][i]._child.push(obj);
            }
          }
        }
      }
    };
    let d = cleanData(data);
    return d;
  },
  flattenedCleanData(menu, name = 'title'){
    let arr = [],
      temp = [], 
      endIndex = 0;
    cleanTree(menu, 0);
    return arr;
    function cleanTree(data, level){
      for(let i=0; i<data.length; i++){
        temp[level] = data[i][name];
        endIndex = level;
        if(data[i]._child.length != 0){
          cleanTree(data[i]._child, level + 1);
        }else{
          arr.push({ ...data[i], _fullPathName: temp.slice(0, +endIndex + 1).join('#_#') });
        }
      }
    };
  },

}

// yyyy-MM-dd hh:mm:ss
Date.prototype.format = function (fmt) {
  if(this.toString() == 'Invalid Date'){
    return ''
  };
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

