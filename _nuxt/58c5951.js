(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{342:function(t,e,n){var content=n(494);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(76).default)("1b7833da",content,!0,{sourceMap:!1})},493:function(t,e,n){"use strict";n(342)},494:function(t,e,n){var o=n(75)(!1);o.push([t.i,"body{position:relative}div#swiper{z-index:123}canvas,div#swiper{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover}",""]),t.exports=o},507:function(t,e,n){"use strict";n.r(e);n(38),n(28),n(37),n(50),n(51);var o=n(22),r=n(95),c=n(7),h=(n(36),n(9),n(345),n(15),n(349),n(351),n(353),n(354),n(355),n(356),n(357),n(358),n(359),n(360),n(361),n(362),n(363),n(364),n(365),n(366),n(20),n(62),n(47),n(139),n(298),n(74),n(109),n(78),n(205),n(105),n(29),n(367),n(368),n(60),n(44),n(34),n(369)),l=n(0),f=n(492),d=n.n(f);function v(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function w(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}l.a.use(d.a,{disableClick:!1,touchClass:"",tapTolerance:10,touchHoldTolerance:400,swipeTolerance:30,longTapTimeInterval:400,namespace:"touch"});var m={data:function(){return{config:{backgroundColor:"#160804",fontFamily:"'Roboto Mono'",fontFamilyFallback:"monospace",imageFilter:"brightness(120%)",imageURL:"/jpegs/Mozart-Lange-darker.jpg",matchBoundaryFillStyle:"black",matchFillStyle:"rgba(255, 0, 0, 0.5)",cornerStrokeStyle:"#FFD700",cornerFillStyle:"#FFD70040",shadowColor:"#572010",shadowOffsetX:.5,textSizeDefault:20,word:"MOZART",ersatzAsArray:void 0,wordAsArray:void 0,factorial:void 0,tweaks:{x:-1,y:-2,cx:2,cy:0,textSizeFix:0},style:{canvas:{objectPositionX:"50%",objectPositionY:"50%",scaleTransform:"97%",backgroundColor:"#160804"}}},box:{cols:void 0,rows:void 0},canvas:undefined,hiddenPermutations:new Set,matches:{horz:[],vert:[]},palette:undefined,shuffle:undefined,slideshowID:undefined,toastOptions:{duration:1e3,position:"top-center",theme:"outline"},cheat:""}},computed:{cheating:function(){return"cheat"===this.cheat},styleCanvas:function(){return"div#swiper {\n  background: ".concat(this.config.style.canvas.backgroundColor,";\n}\n.animate {\n  background: ").concat(this.config.style.canvas.backgroundColor,";\n  animation: fadeOut 3s forwards;\n}\n@keyframes fadeOut {\n    0% {\n      backdrop-filter: blur(1rem);\n      background: ").concat(this.config.style.canvas.backgroundColor,";\n    }\n    100% {\n      backdrop-filter: blur(0);\n      background: transparent;\n    }\n}\ncanvas {\n  object-position: ").concat(this.config.style.canvas.objectPositionX," ").concat(this.config.style.canvas.objectPositionY,";\n  transform: scale(").concat(this.config.style.canvas.scaleTransform,");\n  background-color: ").concat(this.config.style.canvas.backgroundColor,";\n}")}},destroyed:function(){this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener)},mounted:function(){var t=this;this.config.wordAsArray=this.config.wordAsArray||this.config.word.split(""),this.config.ersatzAsArray=this.config.ersatzAsArray||Array(this.config.word.length).fill("∅"),this.config.factorial=this.factorialize(this.config.wordAsArray.length),h.from(document.getElementById("portrait-image")).maxColorCount(200).getPalette().then((function(e){t.palette=e})),this.init();var e=this;this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.contextmenuEventListener=window.addEventListener("contextmenu",(function(t){t.preventDefault()})),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener),this.keyupEventListener=window.addEventListener("keyup",(function(t){if("Enter"===t.code)return e.startOrStopOrToggleSlideshow(!0),void t.preventDefault();if("Space"===t.code){var n=void 0!==this.slideshowID;return e.startOrStopOrToggleSlideshow(!1),n||e.animateShuffleAndRedraw(),void t.preventDefault()}if("Escape"===t.code)return e.cheat="",e.createOrRedrawCanvas(),void t.preventDefault();if("cheat".includes(t.key)){if("cheat"===e.cheat)return;e.cheat+=t.key,"cheat".startsWith(e.cheat)?"cheat"===e.cheat&&(e.$toast.show("Now cheating",e.toastOptions),e.createOrRedrawCanvas(),t.preventDefault()):(e.cheat="",t.preventDefault())}}))},methods:{fontFamily:function(t){return"".concat(t,"px ").concat(this.config.fontFamily,", ").concat(this.config.fontFamilyFallback)},onPress:function(){this.cheating?(this.cheat="",this.$toast.show("Cheating stopped",this.toastOptions)):(this.cheat="cheat",this.$toast.show("Now cheating",this.toastOptions)),this.createOrRedrawCanvas()},onSwipe:function(){this.startOrStopOrToggleSlideshow()},onTap:function(){this.animateShuffleAndRedraw()},init:function(){this.shuffle=this.doShuffle(this.config.factorial);for(var i=0;i<this.config.factorial;i++){var t=this.pickPermutation(this.config.wordAsArray,this.config.factorial,i);(function(t,e){return t.length===e.length&&t.every((function(t,i){return t===e[i]}))})(t,this.config.wordAsArray)&&(this.hiddenPermutations.add(i),console.log("REMEMBER nth permutation",i,t,this.hiddenPermutations))}var e=this;(function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10;return new Promise((function(o,r){var h=setInterval(Object(c.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,document.fonts.load(t);case 3:e.next=8;break;case 5:e.prev=5,e.t0=e.catch(0),r(e.t0);case 8:document.fonts.check(t)&&(clearInterval(h),o(!0));case 9:case"end":return e.stop()}}),e,null,[[0,5]])}))),n);setTimeout((function(){return clearInterval(h)}),e)}))})(this.fontFamily(40)).then(document.getElementById("portrait-image").addEventListener("load",(function(t){document.getElementById("swiper").classList.add("animate"),e.createOrRedrawCanvas(this)})))},doShuffle:function(t){return function(t){for(var e,i,n=t.length;n;)i=Math.floor(Math.random()*n--),e=t[n],t[n]=t[i],t[i]=e;return t}(Object(r.a)(Array(t).keys()))},toggleCheat:function(){"cheat"===this.cheat?this.cheat="":this.cheat="cheat"},animateShuffleAndRedraw:function(){var t=document.getElementById("swiper");console.log(t),t.classList.remove("animate"),t.offsetWidth,t.classList.add("animate"),this.shuffleAndRedraw()},shuffleAndRedraw:function(){this.shuffle=this.doShuffle(this.config.factorial),this.createOrRedrawCanvas()},startOrStopOrToggleSlideshow:function(t){void 0===t&&(t=!this.slideshowID),t&&!this.slideshowID?(this.$toast.show("Starting slideshow",this.toastOptions),this.shuffleAndRedraw(),this.slideshowID=setInterval(function(){this.shuffleAndRedraw()}.bind(this),2e3)):!t&&this.slideshowID&&(clearInterval(this.slideshowID),this.slideshowID=void 0,this.$toast.show("Slideshow stopped",this.toastOptions))},createOrRedrawCanvas:function(img){var t={filter:this.config.imageFilter,fontFamily:this.config.fontFamily,resolution:this.calcResolution,shape:this.drawLetter,word:this.config.word,wordAsArray:this.config.wordAsArray,cornerStrokeStyle:this.cornerStrokeStyle,cornerFillStyle:this.cornerFillStyle};this.textSizeDefault=void 0,img?this.canvas=img.closePixelate(t):this.canvas.render(t)},pickShuffledPermutation:function(t){t=Math.floor(t);var e=this.shuffle[t];return this.hiddenPermutations.has(e)?Object(r.a)(this.config.ersatzAsArray):this.pickPermutation(this.config.wordAsArray,this.config.factorial,e)},pickPermutation:function(t,e,n){if(e<n)return console.log("n (".concat(n,") cannot be larger than factorial (").concat(e,") !!!")),[];for(var o,q,c,h=n,l=Object(r.a)(t),f=[],d=e;l.length>0;)q=(h-(o=h%(d/=l.length)))/d,c=l.splice(q,1)[0],f.push(c),h=o;return f},horizontal:function(t){for(var e=[],n={boundary:void 0,accumulator:[]},o=0;o<this.box.rows;o++)for(var col=0;col<this.box.cols;col++){var i=col+o*this.box.cols;0===e.length&&(e=this.pickShuffledPermutation(i/this.config.wordAsArray.length));var r=e.shift();i%this.config.wordAsArray.length==0&&(n.boundary=i-n.accumulator.length);var c=this.testIfMatch(this.config.wordAsArray,n,r);c&&this.matches.horz.push(c)}},vertical:function(t){for(var e={boundary:void 0,accumulator:[]},col=0;col<this.box.cols;col++)for(var n=0;n<this.box.rows;n++){var i=col+n*this.box.cols,o=i/this.config.wordAsArray.length,r=i%this.config.wordAsArray.length,c=this.pickShuffledPermutation(o)[r];e.boundary?e.boundary.push(i):e.boundary=[i];var h=this.testIfMatch(this.config.wordAsArray,e,c);h&&this.matches.vert.push(h)}},storeMatches:function(){this.matches.horz.splice(0,this.matches.horz.length),this.matches.vert.splice(0,this.matches.vert.length),this.vertical(),this.horizontal(),this.slideshowID&&this.cheating||this.$toast.show("".concat(this.matches.horz.length," horizontal, ").concat(this.matches.vert.length," vertical"),w(w({},this.toastOptions),{duration:2e3}))},printCandidate:function(t,e){for(var n=[],i=0;i<t.length;i++)i===e%t.length&&n.push("|"),n.push(t[i]);return n.join("")},resetCandidate:function(t){t.accumulator.splice(0,t.accumulator.length),t.boundary=void 0},testIfMatch:function(t,e,n){var o;e.accumulator.push(n);for(var i=0;i<e.accumulator.length;i++)if(e.accumulator[i]!==t[i]){this.resetCandidate(e);break}return i===t.length&&(o=e.boundary,this.resetCandidate(e)),o},getFontSizeToFit:function(t,text,e,n,o,r){t.save(),t.font=e;var c=0,h=0;return text.forEach((function(e){var n=t.measureText(text);c=Math.max(c=n.width),n.fontBoundingBoxAscent+n.fontBoundingBoxDescent,h=Math.max(h,n.actualBoundingBoxAscent+n.actualBoundingBoxDescent)})),t.restore(),Math.min(n+r/c,o+r/h)},tweakAndFillRect:function(t,e,n,o,r){t.fillRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},tweakAndStrokeRect:function(t,e,n,o,r){t.strokeRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},drawLetter:function(t,e,i,n,o,r,c,l){if(!(i>this.box.cols*this.box.rows)){var f=l;void 0!==f&&0!==f.length||(f=this.pickShuffledPermutation(i/e.length));var d=f.shift();if(!this.textSize){t.textAlign="center",t.textBaseline="middle",t.shadowColor=this.config.shadowColor,t.shadowOffsetX=this.config.shadowOffsetX;var v=this.fontFamily(1);this.textSizeDefault=this.getFontSizeToFit(t,this.config.wordAsArray,v,r,c,this.config.tweaks.textSize),t.font=this.fontFamily(this.textSizeDefault)}var w=Number.MAX_SAFE_INTEGER;t.fillStyle;for(var m in this.palette){var y=h.Util.hexDiff(this.palette[m].getHex(),t.fillStyle);y<w&&(w=y,this.palette[m].getBodyTextColor())}if(this.cheating){if(this.matches.horz.length)for(var b=0;b<this.matches.horz.length;b++){var k=this.matches.horz[b];k<=i&&i<k+this.config.wordAsArray.length&&(t.save(),t.fillStyle=this.config.matchFillStyle,this.tweakAndFillRect(t,n,o,r,c),t.restore(),i%e.length==0&&this.config.matchBoundaryFillStyle&&(t.save(),t.fillStyle=this.config.matchBoundaryFillStyle,this.tweakAndFillRect(t,n,o,1,c),t.restore()))}if(this.matches.vert.length)for(var x=0;x<this.matches.vert.length;x++){this.matches.vert[x].includes(i)&&(t.save(),t.fillStyle=this.config.matchFillStyle,this.tweakAndFillRect(t,n,o,r,c),t.restore())}}return t.fillText(d,n+r/2,o+c/2),f}},calcResolution:function(t,e,n,o,r){var c=this.factorialize(t.length),h=this.getDivisorsList(c).map((function(t){return{x:t,y:c/t,ratio:t/(c/t)}})),l=o/r/(e/n),f=this.binarySearch(h.map((function(t){return t.ratio})),l),d=h[f].x*t.length,v=h[f].y,w=o/d,m=r/v;return this.box={cols:d,rows:v,cxCol:w,cyRow:m,factorial:c},this.storeMatches(),this.box},factorialize:function(t){if(void 0!==t)return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,n=[];return e=t,Object(r.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&n.push(t),s+t}),0),n},binarySearch:function(t,e){if(1===t.length)return 0;var n=Math.floor(t.length/2);return t[n]===e?n:t[n]>e?this.binarySearch(t.slice(0,n),e):t[n]<e?n+this.binarySearch(t.slice(n),e):n}}},y=m,k=(n(493),n(54)),component=Object(k.a)(y,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor},[n("style",{tag:"component"},[t._v("\n    "+t._s(t.styleCanvas)+"\n  ")]),t._v(" "),n("h1",{staticClass:"text-center",style:"font-family: "+t.fontFamily(t.config.textSizeDefault)+"; z-index: -1; color: ghostwhite; visibility: hidden;"},[t._v("\n    made by christophe thiebaud\n  ")]),t._v(" "),n("img",{attrs:{id:"portrait-image",src:t.config.imageURL}}),t._v(" "),n("client-only",[n("div",{directives:[{name:"touch",rawName:"v-touch:swipe.left",value:t.onSwipe,expression:"onSwipe",arg:"swipe",modifiers:{left:!0}},{name:"touch",rawName:"v-touch:swipe.right",value:t.onSwipe,expression:"onSwipe",arg:"swipe",modifiers:{right:!0}},{name:"touch",rawName:"v-touch:tap",value:t.onTap,expression:"onTap",arg:"tap"},{name:"touch",rawName:"v-touch:touchhold",value:t.onPress,expression:"onPress",arg:"touchhold"}],staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor,attrs:{id:"swiper"}})])],1)}),[],!1,null,null,null);e.default=component.exports}}]);