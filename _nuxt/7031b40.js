(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{342:function(t,e,n){var content=n(494);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(76).default)("1b7833da",content,!0,{sourceMap:!1})},493:function(t,e,n){"use strict";n(342)},494:function(t,e,n){var o=n(75)(!1);o.push([t.i,"body{position:relative}div#swiper{z-index:123}canvas,div#swiper{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover}",""]),t.exports=o},507:function(t,e,n){"use strict";n.r(e);n(38),n(28),n(37),n(50),n(29),n(51);var o=n(22),r=n(95),c=n(7),h=(n(36),n(9),n(345),n(15),n(349),n(351),n(353),n(354),n(355),n(356),n(357),n(358),n(359),n(360),n(361),n(362),n(363),n(364),n(365),n(366),n(20),n(62),n(47),n(139),n(298),n(74),n(109),n(78),n(205),n(105),n(367),n(368),n(60),n(44),n(34),n(369)),l=n(0),f=n(492),d=n.n(f);function v(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function w(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}l.a.use(d.a);var m={data:function(){return{config:{backgroundColor:"#160804",fontFamily:"'IM Fell English SC'",fontFamilyFallback:"serif",imageFilter:"brightness(120%)",imageURL:"/jpegs/Mozart-Lange-darker.jpg",matchBoundaryFillStyle:"black",matchFillStyle:"#ff000080",cornerStrokeStyle:"#ffd700ff",cornerFillStyle:"#ffd70040",shadowcolor:"#572010ff",shadowOffsetX:.5,textSizeDefault:20,word:"MOZART",ersatzAsArray:void 0,wordAsArray:void 0,factorial:void 0,tweaks:{x:-1,y:-2,cx:2,cy:0,textSizeFix:0},style:{canvas:{objectPositionX:"50%",objectPositionY:"50%",scaleTransform:"97%",backgroundColor:"#160804"}}},toastOptions:{duration:1200,position:"top-center",theme:"outline"},box:{cols:void 0,rows:void 0},canvas:undefined,cheat:"",hiddenPermutations:new Set,matches:{horz:[],vert:[]},palette:undefined,shuffle:undefined,slideshowAverageTimeBetweenSlides:{slides:1,total:1500},slideshowID:undefined}},computed:{slideshow:{get:function(){return this.slideshowID},set:function(t){this.slideshowID=t}},timeBetweenSlides:{get:function(){return Math.round(this.slideshowAverageTimeBetweenSlides.total/this.slideshowAverageTimeBetweenSlides.slides)},set:function(t){this.slideshowAverageTimeBetweenSlides.slides++,this.slideshowAverageTimeBetweenSlides.total+=t}},cheating:function(){return"cheat"===this.cheat},style:function(){return"div#swiper {\n  background: ".concat(this.config.style.canvas.backgroundColor,";\n}\n.animate {\n  background: ").concat(this.config.style.canvas.backgroundColor,";\n  animation: fadeOut 3s forwards;\n}\n@keyframes fadeOut {\n    0% {\n      backdrop-filter: blur(1rem);\n      background: ").concat(this.config.style.canvas.backgroundColor,";\n    }\n    100% {\n      backdrop-filter: blur(0);\n      background: transparent;\n    }\n}\ncanvas {\n  object-position: ").concat(this.config.style.canvas.objectPositionX," ").concat(this.config.style.canvas.objectPositionY,";\n  transform: scale(").concat(this.config.style.canvas.scaleTransform,");\n  background-color: ").concat(this.config.style.canvas.backgroundColor,";\n}")}},destroyed:function(){this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener)},mounted:function(){var t=this;this.config.wordAsArray=this.config.wordAsArray||this.config.word.split(""),this.config.ersatzAsArray=this.config.ersatzAsArray||Array(this.config.word.length).fill("∅"),this.config.factorial=this.factorialize(this.config.wordAsArray.length),h.from(document.getElementById("portrait-image")).maxColorCount(200).getPalette().then((function(e){t.palette=e})),this.init(),this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.contextmenuEventListener=window.addEventListener("contextmenu",(function(t){t.preventDefault()})),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener),this.keyupEventListener=window.addEventListener("keyup",(function(e){if("Enter"===e.code)return t.startOrStopOrToggleSlideshow(!0),void e.preventDefault();if("Space"===e.code){var n=void 0!==t.slideshow;return t.startOrStopOrToggleSlideshow(!1),n||t.animateShuffleAndRedraw(),void e.preventDefault()}if("Escape"===e.code)return t.cheat="",t.createOrRedrawCanvas(),void e.preventDefault();if("cheat".includes(e.key)){if("cheat"===t.cheat)return;t.cheat+=e.key,"cheat".startsWith(t.cheat)?"cheat"===t.cheat&&(t.$toast.show("Now cheating",t.toastOptions),t.createOrRedrawCanvas(),e.preventDefault()):(t.cheat="",e.preventDefault())}}))},methods:{fontFamily:function(t){return"".concat(t,"px ").concat(this.config.fontFamily,", ").concat(this.config.fontFamilyFallback)},onPress:function(){this.cheating?(this.cheat="",this.$toast.show("Cheating stopped",this.toastOptions)):(this.cheat="cheat",this.$toast.show("Now cheating",this.toastOptions)),this.createOrRedrawCanvas()},onSwipe:function(){this.startOrStopOrToggleSlideshow()},onTap:function(){void 0===this.slideshow&&this.animateShuffleAndRedraw()},init:function(){this.shuffle=this.doShuffle(this.config.factorial);for(var i=0;i<this.config.factorial;i++){var t=this.pickPermutation(this.config.wordAsArray,this.config.factorial,i);(function(t,e){return t.length===e.length&&t.every((function(t,i){return t===e[i]}))})(t,this.config.wordAsArray)&&(this.hiddenPermutations.add(i),console.log("REMEMBER nth permutation",i,t,this.hiddenPermutations))}var e=this;(function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10;return new Promise((function(o,r){var h=setInterval(Object(c.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,document.fonts.load(t);case 3:e.next=8;break;case 5:e.prev=5,e.t0=e.catch(0),r(e.t0);case 8:document.fonts.check(t)&&(clearInterval(h),o(!0));case 9:case"end":return e.stop()}}),e,null,[[0,5]])}))),n);setTimeout((function(){return clearInterval(h)}),e)}))})(this.fontFamily(40)).then(document.getElementById("portrait-image").addEventListener("load",(function(t){document.getElementById("swiper").classList.add("animate"),e.createOrRedrawCanvas(this)})))},doShuffle:function(t){return function(t){for(var e,i,n=t.length;n;)i=Math.floor(Math.random()*n--),e=t[n],t[n]=t[i],t[i]=e;return t}(Object(r.a)(Array(t).keys()))},toggleCheat:function(){"cheat"===this.cheat?this.cheat="":this.cheat="cheat"},animateShuffleAndRedraw:function(t){var e=document.getElementById("swiper");e.classList.remove("animate"),e.offsetWidth,e.classList.add("animate"),this.shuffleAndRedraw(t)},shuffleAndRedraw:function(t){t=t||1;var e,n=0;do{e=this.doShuffle(this.config.factorial),n=this.storeMatches(e)}while(void 0!==t&&n<t);this.shuffle=e,this.slideshow&&this.cheating||this.$toast.show("".concat(this.matches.horz.length," horizontal, ").concat(this.matches.vert.length," vertical"),w(w({},this.toastOptions),{duration:this.timeBetweenSlides-500})),this.createOrRedrawCanvas()},startOrStopOrToggleSlideshow:function(t){if(void 0===t&&(t=void 0===this.slideshow),t&&void 0===this.slideshow){this.$toast.show("Starting slideshow",this.toastOptions),this.shuffleAndRedraw();var e=new Date;this.slideshow=setInterval(function(){if(void 0!==this.slideshow){this.shuffleAndRedraw();var t=e;e=new Date,this.timeBetweenSlides=Math.abs(e.getTime()-t.getTime())}}.bind(this),2e3)}else t||void 0===this.slideshow||(clearInterval(this.slideshow),this.slideshow=void 0,this.$toast.show("Slideshow stopped",this.toastOptions))},createOrRedrawCanvas:function(img){var t={filter:this.config.imageFilter,fontFamily:this.config.fontFamily,resolution:this.calcResolution,shape:this.drawLetter,word:this.config.word,wordAsArray:this.config.wordAsArray,cornerStrokeStyle:this.cornerStrokeStyle,cornerFillStyle:this.cornerFillStyle};this.textSizeDefault=void 0,img?this.canvas=img.closePixelate(t):this.canvas.render(t)},pickShuffledPermutation:function(t,e,n,o){var c=n[o=Math.floor(o)];return this.hiddenPermutations.has(c)?Object(r.a)(this.config.ersatzAsArray):this.pickPermutation(t,e,c)},pickPermutation:function(t,e,n){if(e<n)return console.log("n (".concat(n,") cannot be larger than factorial (").concat(e,") !!!")),[];for(var o,q,c,h=n,l=Object(r.a)(t),f=[],d=e;l.length>0;)q=(h-(o=h%(d/=l.length)))/d,c=l.splice(q,1)[0],f.push(c),h=o;return f},horizontal:function(t,e,n){for(var o=[],r={boundary:void 0,accumulator:[]},c=0;c<this.box.rows;c++)for(var col=0;col<this.box.cols;col++){var i=col+c*this.box.cols,h=i/this.config.wordAsArray.length,l=i%this.config.wordAsArray.length;0===o.length&&(o=this.pickShuffledPermutation(t,e,n,h));var f=o.shift();0===l&&(r.boundary=i-r.accumulator.length);var d=this.testIfMatch(t,r,f);d&&this.matches.horz.push(d)}},vertical:function(t,e,n){for(var o={boundary:void 0,accumulator:[]},col=0;col<this.box.cols;col++)for(var r=0;r<this.box.rows;r++){var i=col+r*this.box.cols,c=i/this.config.wordAsArray.length,h=i%this.config.wordAsArray.length,l=this.pickShuffledPermutation(t,e,n,c)[h];o.boundary?o.boundary.push(i):o.boundary=[i];var f=this.testIfMatch(t,o,l);f&&this.matches.vert.push(f)}},storeMatches:function(t){return this.matches.horz.splice(0,this.matches.horz.length),this.matches.vert.splice(0,this.matches.vert.length),this.vertical(this.config.wordAsArray,this.config.factorial,t),this.horizontal(this.config.wordAsArray,this.config.factorial,t),this.matches.vert.length+this.matches.horz.length},printCandidate:function(t,e){for(var n=[],i=0;i<t.length;i++)i===e%t.length&&n.push("|"),n.push(t[i]);return n.join("")},resetCandidate:function(t){t.accumulator.splice(0,t.accumulator.length),t.boundary=void 0},testIfMatch:function(t,e,n){var o;e.accumulator.push(n);for(var i=0;i<e.accumulator.length;i++)if(e.accumulator[i]!==t[i]){this.resetCandidate(e);break}return i===t.length&&(o=e.boundary,this.resetCandidate(e)),o},getTextRatio:function(t,e,n){t.save(),t.font=this.fontFamily(1);var o=t.measureText(this.config.word),r=o.width/(o.actualBoundingBoxAscent+o.actualBoundingBoxDescent);return t.restore(),r},getFontSizeToFit:function(t,e,n){t.save(),t.font=this.fontFamily(1);var o=t.measureText(this.config.word),r=o.width/this.config.word.length,c=o.actualBoundingBoxAscent+o.actualBoundingBoxDescent;t.restore(),console.log("col W",e,"text W",r,"=>",e/r),console.log("row H",n,"text H",c,"=>",n/c);var h=Math.min(e/r-1,n/c-1);return console.log(h),t.font=this.fontFamily(h),h},tweakAndFillRect:function(t,e,n,o,r){t.fillRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},tweakAndStrokeRect:function(t,e,n,o,r){t.strokeRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},drawLetter:function(t,e,i,n,o,r,c,l){if(!(i>this.box.cols*this.box.rows)){var f=l;void 0!==f&&0!==f.length||(f=this.pickShuffledPermutation(this.config.wordAsArray,this.config.factorial,this.shuffle,i/e.length));var d=f.shift();this.textSize||(t.textAlign="center",t.textBaseline="middle",t.shadowColor=this.config.shadowColor,t.shadowOffsetX=this.config.shadowOffsetX);var v=Number.MAX_SAFE_INTEGER;t.fillStyle;for(var w in this.palette){var m=h.Util.hexDiff(this.palette[w].getHex(),t.fillStyle);m<v&&(v=m,this.palette[w].getBodyTextColor())}if(this.cheating){if(this.matches.horz.length)for(var b=0;b<this.matches.horz.length;b++){var y=this.matches.horz[b];y<=i&&i<y+this.config.wordAsArray.length&&(t.save(),t.fillStyle=this.config.matchFillStyle,this.tweakAndFillRect(t,n,o,r,c),t.restore(),i%e.length==0&&this.config.matchBoundaryFillStyle&&(t.save(),t.fillStyle=this.config.matchBoundaryFillStyle,this.tweakAndFillRect(t,n,o,1,c),t.restore()))}if(this.matches.vert.length)for(var S=0;S<this.matches.vert.length;S++){this.matches.vert[S].includes(i)&&(t.save(),t.fillStyle=this.config.matchFillStyle,this.tweakAndFillRect(t,n,o,r,c),t.restore())}}return t.fillText(d,n+r/2,o+c/2),f}},calcResolution:function(t,e,n){var o=this.config.factorial,r=this.getDivisorsList(o).map((function(t){return{x:t,y:o/t,ratio:t/(o/t)}})),c=e/n/this.getTextRatio(t,e,n),h=this.binarySearch(r.map((function(t){return t.ratio})),c),l=r[h].x*this.config.word.length,f=r[h].y,d=e/l,v=n/f;return this.box={cols:l,rows:f,cxCol:d,cyRow:v,factorial:o},this.textSizeDefault=this.getFontSizeToFit(t,d,v),console.log(this.box),this.box},factorialize:function(t){if(void 0!==t)return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,n=[];return e=t,Object(r.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&n.push(t),s+t}),0),n},binarySearch:function(t,e){if(1===t.length)return 0;var n=Math.floor(t.length/2);return t[n]===e?n:t[n]>e?this.binarySearch(t.slice(0,n),e):t[n]<e?n+this.binarySearch(t.slice(n),e):n}}},y=m,S=(n(493),n(54)),component=Object(S.a)(y,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor},[n("style",{tag:"component"},[t._v("\n    "+t._s(t.style)+"\n  ")]),t._v(" "),n("h1",{staticClass:"text-center",style:"font-family: "+t.fontFamily(t.config.textSizeDefault)+"; z-index: -1; color: ghostwhite; visibility: hidden;"},[t._v("\n    made by christophe thiebaud\n  ")]),t._v(" "),n("img",{attrs:{id:"portrait-image",src:t.config.imageURL}}),t._v(" "),n("client-only",[n("div",{directives:[{name:"touch",rawName:"v-touch:swipe.left",value:t.onSwipe,expression:"onSwipe",arg:"swipe",modifiers:{left:!0}},{name:"touch",rawName:"v-touch:swipe.right",value:t.onSwipe,expression:"onSwipe",arg:"swipe",modifiers:{right:!0}},{name:"touch",rawName:"v-touch:tap",value:t.onTap,expression:"onTap",arg:"tap"},{name:"touch",rawName:"v-touch:touchhold",value:t.onPress,expression:"onPress",arg:"touchhold"}],staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor,attrs:{id:"swiper"}})])],1)}),[],!1,null,null,null);e.default=component.exports}}]);