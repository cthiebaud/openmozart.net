(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{337:function(t,e,o){var content=o(465);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,o(102).default)("1b7833da",content,!0,{sourceMap:!1})},464:function(t,e,o){"use strict";o(337)},465:function(t,e,o){var r=o(101)(!1);r.push([t.i,"body{position:relative}canvas{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-o-object-position:50% 50%;object-position:50% 50%;transform:scale(.98);background-color:#160804}",""]),t.exports=r},477:function(t,e,o){"use strict";o.r(e);var r=o(93),n=(o(46),o(135),o(73),o(105),o(9),o(19),o(75),o(294),o(60),o(201),o(100),o(339),o(340),o(58),o(44),o(34),o(341)),h={data:function(){return{config:{backgroundColor:"#160804",fontFamily:"monospace",imageFilter:"brightness(120%)",imageURL:"/jpegs/Mozart-Lange-darker.jpg",matchBoundaryFillStyle:"black",matchFillStyle:"rgba(255, 0, 0, 0.5)",shadowColor:"#572010",shadowOffsetX:.5,textAlign:"center",textBaseline:"bottom",word:"MOZART",wordAsArray:void 0,factorial:void 0},box:{cols:720,rows:1},canvas:undefined,matches:{horz:[],vert:[]},palette:undefined,shuffle:undefined,slideshowID:undefined,textSize:undefined,cheat:""}},computed:{cheating:function(){return"cheat"===this.cheat}},mounted:function(){var t=this;this.config.wordAsArray=this.config.word.split(""),this.config.factorial=this.factorialize(this.config.wordAsArray.length),n.from(document.getElementById("portrait-image")).maxColorCount(200).getPalette().then((function(e){t.palette=e})),this.init();var e=this;window.addEventListener("keyup",(function(t){if("Enter"===t.key?e.startOrStopOrToggleSlideshow(!0):"Escape"===t.key&&(e.cheat="",e.createOrRedrawCanvas(),e.startOrStopOrToggleSlideshow(!1)),"cheat".includes(t.key)){if("cheat"===e.cheat)return;e.cheat+=t.key,"cheat".startsWith(e.cheat)?"cheat"===e.cheat&&e.createOrRedrawCanvas():e.cheat=""}}))},methods:{init:function(){var t=this;this.shuffle=this.doShuffle(this.config.factorial),document.getElementById("portrait-image").addEventListener("load",(function(e){t.createOrRedrawCanvas(this)}))},doShuffle:function(t){return function(t){for(var e,i,o=t.length;o;)i=Math.floor(Math.random()*o--),e=t[o],t[o]=t[i],t[i]=e;return t}(Object(r.a)(Array(t).keys()))},shuffleAndRedraw:function(){this.shuffle=this.doShuffle(this.config.factorial),this.createOrRedrawCanvas()},startOrStopOrToggleSlideshow:function(t){void 0===t&&(t=!this.slideshowID),t&&!this.slideshowID?(this.shuffleAndRedraw(),this.slideshowID=setInterval(function(){this.shuffleAndRedraw()}.bind(this),1e3)):!t&&this.slideshowID&&(clearInterval(this.slideshowID),this.slideshowID=void 0)},createOrRedrawCanvas:function(img){var t={filter:this.config.imageFilter,fontFamily:this.config.fontFamily,resolution:this.calcResolution,shape:this.drawLetter,word:this.config.word,wordAsArray:this.config.wordAsArray};this.textSize=void 0,img?this.canvas=img.closePixelate(t):this.canvas.render(t)},pickShuffledPermutation:function(t){var e=this.shuffle[Math.floor(t)];return 0===e?new Array(this.config.wordAsArray.length).fill("·"):this.pickPermutation(this.config.wordAsArray,this.config.factorial,e)},pickPermutation:function(t,e,o){if(e<o)return console.log("n (".concat(o,") cannot be larger than factorial (").concat(e,") !!!")),[];for(var n,q,h,c=o,l=Object(r.a)(t),f=[],d=e;l.length>0;)q=(c-(n=c%(d/=l.length)))/d,h=l.splice(q,1)[0],f.push(h),c=n;return f},horizontal:function(t){for(var e=[],o={boundary:void 0,accumulator:[]},r=0;r<this.box.rows;r++)for(var col=0;col<this.box.cols;col++){var i=col+r*this.box.cols;0===e.length&&(e=this.pickShuffledPermutation(i/this.config.wordAsArray.length));var n=e.shift();i%this.config.wordAsArray.length==0&&(o.boundary=i-o.accumulator.length);var h=this.testIfMatch(this.config.wordAsArray,o,n);h&&this.matches.horz.push(h)}},vertical:function(t){for(var e={boundary:void 0,accumulator:[]},col=0;col<this.box.cols;col++)for(var o=0;o<this.box.rows;o++){var i=col+o*this.box.cols,r=i/this.config.wordAsArray.length,n=i%this.config.wordAsArray.length,h=this.pickShuffledPermutation(r)[n];e.boundary?e.boundary.push(i):e.boundary=[i];var c=this.testIfMatch(this.config.wordAsArray,e,h);c&&this.matches.vert.push(c)}},storeMatches:function(){this.matches.horz.splice(0,this.matches.horz.length),this.matches.vert.splice(0,this.matches.vert.length),this.vertical(),this.horizontal()},printCandidate:function(t,e){for(var o=[],i=0;i<t.length;i++)i===e%t.length&&o.push("|"),o.push(t[i]);return o.join("")},resetCandidate:function(t){t.accumulator.splice(0,t.accumulator.length),t.boundary=void 0},testIfMatch:function(t,e,o){var r;e.accumulator.push(o);for(var i=0;i<e.accumulator.length;i++)if(e.accumulator[i]!==t[i]){this.resetCandidate(e);break}return i===t.length&&(r=e.boundary,this.resetCandidate(e)),r},getFontSizeToFit:function(t,text,e,o,r){t.save(),t.font="1px ".concat(e," ");var n=t.measureText(text),h=n.width,c=(n.fontBoundingBoxAscent,n.fontBoundingBoxDescent,n.actualBoundingBoxAscent+n.actualBoundingBoxDescent);return t.restore(),Math.min(o+2/h,r+2/c)},drawLetter:function(t,e,i,o,r,h,c,l){if(!(i>this.box.cols*this.box.rows)){var f=l;void 0!==f&&0!==f.length||(f=this.pickShuffledPermutation(i/e.length));var d=f.shift();this.textSize||(t.textAlign=this.config.textAlign,t.textBaseline=this.config.textBaseline,t.shadowColor=this.config.shadowColor,t.shadowOffsetX=this.config.shadowOffsetX,this.textSize=this.getFontSizeToFit(t,d,this.config.fontFamily,h,c),t.font="".concat(this.textSize,"px ").concat(this.config.fontFamily));var v=Number.MAX_SAFE_INTEGER;t.fillStyle;for(var m in this.palette){var y=n.Util.hexDiff(this.palette[m].getHex(),t.fillStyle);y<v&&(v=y,this.palette[m].getBodyTextColor())}if(this.cheating){if(this.matches.horz.length)for(var b=0;b<this.matches.horz.length;b++){var w=this.matches.horz[b];w<=i&&i<w+this.config.wordAsArray.length&&(t.save(),t.fillStyle=this.config.matchFillStyle,t.fillRect(o,r-2,h,c-1),t.restore(),i%e.length==0&&this.config.matchBoundaryFillStyle&&(t.save(),t.fillStyle=this.config.matchBoundaryFillStyle,t.fillRect(o,r-2,1,c-1),t.restore()))}if(this.matches.vert.length)for(var A=0;A<this.matches.vert.length;A++){this.matches.vert[A].includes(i)&&(t.save(),t.fillStyle=this.config.matchFillStyle,t.fillRect(o,r-3,h,c-1),t.restore())}}return t.fillText(d,o+h/2,r+c,h),f}},calcResolution:function(t,e,o,r,n){var h=this.factorialize(t.length),c=this.getDivisorsList(h).map((function(t){return{x:t,y:h/t,ratio:t/(h/t)}})),l=r/n/(e/o),f=this.binarySearch(c.map((function(t){return t.ratio})),l),d=c[f].x*t.length,v=c[f].y,m=r/d,y=n/v;return this.box={cols:d,rows:v,cxCol:m,cyRow:y,factorial:h},this.storeMatches(),this.box},factorialize:function(t){if(void 0!==t)return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,o=[];return e=t,Object(r.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&o.push(t),s+t}),0),o},binarySearch:function(t,e){if(1===t.length)return 0;var o=Math.floor(t.length/2);return t[o]===e?o:t[o]>e?this.binarySearch(t.slice(0,o),e):t[o]<e?o+this.binarySearch(t.slice(o),e):o}}},c=(o(464),o(55)),component=Object(c.a)(h,(function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("main",{staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor,on:{click:t.shuffleAndRedraw}},[o("img",{attrs:{id:"portrait-image",src:t.config.imageURL}})])}),[],!1,null,null,null);e.default=component.exports}}]);