(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{268:function(t,e,r){var n=r(2),o=r(269),c=r(93);n({target:"Array",proto:!0},{fill:o}),c("fill")},269:function(t,e,r){"use strict";var n=r(24),o=r(94),c=r(16);t.exports=function(t){for(var e=n(this),r=c(e.length),l=arguments.length,h=o(l>1?arguments[1]:void 0,r),f=l>2?arguments[2]:void 0,d=void 0===f?r:o(f,r);d>h;)e[h++]=t;return e}},270:function(t,e,r){var content=r(273);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(96).default)("1b7833da",content,!0,{sourceMap:!1})},272:function(t,e,r){"use strict";r(270)},273:function(t,e,r){var n=r(95)(!1);n.push([t.i,"body{position:relative}canvas{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-o-object-position:50% 50%;object-position:50% 50%}",""]),t.exports=n},285:function(t,e,r){"use strict";r.r(e);var n=r(88),o=(r(8),r(17),r(44),r(131),r(58),r(194),r(268),r(42),r(34),{data:function(){var t="MOZART",e=this.factorialize(t.length);return{word:t,backgroundColor:"#160804",factorial:e,fontFamily:"monospace",shuffle:this.shuffleArray(Object(n.a)(Array(e).keys())),textSize:20,theCanvas:{}}},mounted:function(){this.init()},methods:{init:function(){var t=this;document.getElementById("portrait-image").addEventListener("load",(function(e){t.createOrRedrawCanvas(this)}))},onClick:function(t){this.shuffle=this.shuffleArray(Object(n.a)(Array(this.factorial).keys())),this.createOrRedrawCanvas()},createOrRedrawCanvas:function(img){var t={resolution:this.calcResolution,word:this.word,fontFamily:this.fontFamily,wordAsArray:this.word.split(""),shape:this.drawLetter};this.textSize=void 0,img?this.theCanvas=img.closePixelate(t):this.theCanvas.render(t)},pickPermutation:function(t,e,r){if(e<r)return console.log("n (".concat(r,") cannot be larger than factorial (").concat(e,") !!!")),[];for(var o,q,c,l=r,h=Object(n.a)(t),f=[],d=e;h.length>0;)q=(l-(o=l%(d/=h.length)))/d,c=h.splice(q,1)[0],f.push(c),l=o;return f},drawLetter:function(t,e,r,i,n,o,c,l,h){var f=h;if(void 0===f||0===f.length){var d=this.shuffle[i/e.length];f=this.pickPermutation(e,r,d),0===d&&(f=new Array(this.word.length).fill("·"))}var v=f.shift();return this.textSize||(this.textSize=function(text,e){t.save(),t.font="bold 1px ".concat(e," ");var r=t.measureText(text),n=r.width,o=r.fontBoundingBoxAscent+r.fontBoundingBoxDescent;return t.restore(),Math.min(c/n,l/o)}(v,this.fontFamily)),t.font="bold ".concat(this.textSize,"px ").concat(this.fontFamily),t.fillText(v,n,o+l,c),f},calcResolution:function(t,e,r,n,o){var c=this.factorialize(t.length),l=this.getDivisorsList(c).map((function(t){return{x:t,y:c/t,ratio:t/(c/t)}})),h=n/o/(e/r),f=this.binarySearch(l.map((function(t){return t.ratio})),h),d=l[f],v=d.x*t.length,y=d.y;return{x:v,y:y,cx:n/v,cy:o/y,factorial:c}},factorialize:function(t){if(void 0!==t)return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,r=[];return e=t,Object(n.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&r.push(t),s+t}),0),r},binarySearch:function(t,e){if(1===t.length)return 0;var r=Math.floor(t.length/2);return t[r]===e?r:t[r]>e?this.binarySearch(t.slice(0,r),e):t[r]<e?r+this.binarySearch(t.slice(r),e):r},shuffleArray:function(t){for(var e,i,r=t.length;r;)i=Math.floor(Math.random()*r--),e=t[r],t[r]=t[i],t[i]=e;return t}}}),c=(r(272),r(53)),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("main",{staticClass:"vh-100",style:"background-color: "+t.backgroundColor,on:{click:t.onClick}},[r("img",{attrs:{id:"portrait-image",src:"/jpegs/Mozart-Lange-darker.jpg"}})])}),[],!1,null,null,null);e.default=component.exports}}]);