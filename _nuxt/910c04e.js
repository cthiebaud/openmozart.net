(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{268:function(t,e,r){var content=r(271);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(95).default)("1b7833da",content,!0,{sourceMap:!1})},270:function(t,e,r){"use strict";r(268)},271:function(t,e,r){var n=r(94)(!1);n.push([t.i,"body{position:relative}canvas{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover}",""]),t.exports=n},285:function(t,e,r){"use strict";r.r(e);var n=r(88),o=(r(42),r(34),r(8),r(16),{mounted:function(){this.init()},methods:{init:function(){var t=this;document.getElementById("portrait-image").addEventListener("load",(function(e){var r=t.getRowsCols(this.width,this.height);document.getElementById("portrait-image").closePixelate([{resolution:r}])}))},getRowsCols:function(t,e){var r="MOZART",n=this.factorialize(r.length),o=this.getDivisorsList(n).map((function(t){return{x:t,y:n/t,ratio:t/(n/t)}})),c=t/(534.25/151)/e,i=this.binarySearch(o.map((function(t){return t.ratio})),c);if(i<o.length-1){var l=Math.abs(c-o[i].ratio);Math.abs(c-o[i+1].ratio)<l&&i++}var h=o[i];function f(t){return 2*Math.round(t/2)}var d=h.x*r.length,v=h.y,m=t/d,y=e/v;return{x:d,y:v,cx:f(m),cy:f(y),cx_:m,cy_:y}},factorialize:function(t){return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,r=[];return e=t,Object(n.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&r.push(t),s+t}),0),r},binarySearch:function(t,e){if(1===t.length)return 0;var r=Math.floor(t.length/2);return t[r]===e?r:t[r]>e?this.binarySearch(t.slice(0,r),e):t[r]<e?r+this.binarySearch(t.slice(r),e):r}}}),c=(r(270),r(53)),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("main",{staticClass:"vh-100",staticStyle:{"background-color":"#1B0B03"}},[e("img",{attrs:{id:"portrait-image",src:"/jpegs/Mozart-Lange-darker.jpg"}})])}],!1,null,null,null);e.default=component.exports}}]);