'use strict'

import Vue from 'vue'
Vue.config.productionTip = false

import App from './App.vue'

import $ from "jquery";

new Vue({
  render: h => h(App),
}).$mount('#app')




























// 禁止右键菜单
document.oncontextmenu = function () { return false; };
// 禁止文字选择
// document.onselectstart = function(){ return false; };
// 禁止复制
// document.oncopy = function(){ return false; };
// 禁止剪切
// document.oncut = function(){ return false; };
// 禁止粘贴
// document.onpaste = function(){ return false; };



function process(s, evaluator) {
  var h = Object.create(null), k;
  s.split('').forEach(function (c) {
    h[c] && h[c]++ || (h[c] = 1);
  });
  if (evaluator) for (k in h) evaluator(k, h[k]);
  return h;
}

function continuity(s) {
  var sc = 0, arr = s.split(''), len = s.length;

  for (var i = 0; i < len; i++) {
    for (var j = 1; j < len - i; j++) {
      if (arr[i] == arr[i + j]) {
        sc = sc + j;
      } else { break; }
    }
  }
  return sc / len
}

function entropy(s) {
  var sum = 0, len = s.length;
  process(s, function (k, f) {
    var p = f / len;
    sum -= p * Math.log(p) / Math.log(2);
  });
  return sum;
}


function newEntropy(s) {
  var sum_1 = 0, len = s.length;
  process(s, function (k, f) {
    var p = f / len;
    sum_1 -= p * Math.log(p) / Math.log(2);
  });

  var sum_2 = continuity(s);

  var sum = sum_1 - sum_2 * 2;

  return sum;
}


async function bingDic(word) {

  try {
    var resp = await axios({
      method: 'GET',
      url: "http://xtk.azurewebsites.net/BingDictService.aspx",
      params: { Word: word, Samples: false },
    });
    if (resp.defs != null) {
      var arr;
      resp.defs.forEach(e => {
        arr.push(e.def)
      })
      console.log(arr.join(''));
      return arr.join('')
    }
  } catch (e) {
    console.log(e);
  }


}




$(".dplayer-menu-item:contains('关于作者')").remove();//移除关于作者的右键按钮
$(".dplayer-menu-item:contains('DPlayer v1.25.0')").remove();//移除DPlayer版本号的右键按钮


