(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{342:function(t,e,n){var content=n(495);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(76).default)("1b7833da",content,!0,{sourceMap:!1})},493:function(t){t.exports=JSON.parse('{"backgroundColor":"#160804","cornerFill":"#ffd70040","cornerStroke":"#ffd700ff","fontFamily":"\'IM Fell English SC\'","fontFamilyFallback":"serif","imageFilter":"brightness(120%)","imageSrc":"/jpegs/Mozart-Lange-darker.jpg","matchBoundaryFill":"#160804","matchFill":"#ff000080","mode":0,"modes":["coloredLettersTransparentBackground","adaptiveLettersColoredBackground"],"shadowColor":"#572010ff","shadowOffsetX":0.5,"textSizeDefault":20,"word":"MOZART","ersatzAsArray":null,"wordAsArray":null,"factorial":null,"tweaks":{"x":-1,"y":-2,"cx":2,"cy":0,"textSizeAdjustment":4},"style":{"canvas":{"objectPositionX":"50%","objectPositionY":"50%","scaleTransform":"97%"}}}')},494:function(t,e,n){"use strict";n(342)},495:function(t,e,n){var o=n(75)(!1);o.push([t.i,"body{position:relative}div#swiper{z-index:123}canvas,div#swiper{display:block;position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover}",""]),t.exports=o},508:function(t,e,n){"use strict";n.r(e);n(38),n(28),n(37),n(50),n(29),n(51);var o=n(22),r=n(95),c=n(7),h=(n(36),n(9),n(345),n(15),n(349),n(351),n(353),n(354),n(355),n(356),n(357),n(358),n(359),n(360),n(361),n(362),n(363),n(364),n(365),n(366),n(20),n(109),n(62),n(47),n(139),n(298),n(74),n(78),n(205),n(105),n(367),n(368),n(60),n(44),n(34),n(369)),l=n(0),f=n(492),d=n.n(f);function v(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function w(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}l.a.use(d.a,{disableClick:!1});var m={data:function(){return{box:{cols:void 0,rows:void 0},canvas:undefined,cheat:"",hiddenPermutations:new Set,ignoreTap:!1,matches:{horz:[],vert:[]},palette:undefined,shuffle:undefined,slideshowAverageTimeBetweenSlides:{slides:1,total:1500},slideshowID:undefined,toastOptions:{duration:1200,position:"top-center",theme:"outline"}}},computed:{config:function(){var t=n(493);return t},slideshow:{get:function(){return this.slideshowID},set:function(t){this.slideshowID=t}},timeBetweenSlides:{get:function(){return Math.round(this.slideshowAverageTimeBetweenSlides.total/this.slideshowAverageTimeBetweenSlides.slides)},set:function(t){this.slideshowAverageTimeBetweenSlides.slides++,this.slideshowAverageTimeBetweenSlides.total+=t}},cheating:{get:function(){return"cheat"===this.cheat},set:function(t){var e="cheat"===this.cheat,n=e;if("boolean"==typeof t)n=t;else if("string"==typeof t&&t.length&&!e){var o=this.cheat+t;"cheat"===o?n=!0:"cheat".startsWith(o)?this.cheat=o:n=!1}n&&!e&&(this.cheat="cheat",this.$toast.show("Now cheating",this.toastOptions),this.createOrRedrawCanvas()),!n&&e&&(this.cheat="",this.$toast.show("Cheating stopped",this.toastOptions),this.createOrRedrawCanvas())}},style:function(){return"div#swiper {\n  background: ".concat(this.config.backgroundColor,";\n}\n.animate {\n  background: ").concat(this.config.backgroundColor,";\n  animation: fadeOut 1s forwards;\n}\n@keyframes fadeOut {\n    0% {\n      backdrop-filter: blur(1rem);\n      background: ").concat(this.config.backgroundColor,";\n    }\n    100% {\n      backdrop-filter: blur(0);\n      background: transparent;\n    }\n}\ncanvas {\n  object-position: ").concat(this.config.style.canvas.objectPositionX," ").concat(this.config.style.canvas.objectPositionY,";\n  transform: scale(").concat(this.config.style.canvas.scaleTransform,");\n  background-color: ").concat(this.config.backgroundColor,";\n}")}},destroyed:function(){this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener)},mounted:function(){var t=this;this.config.wordAsArray=this.config.wordAsArray||this.config.word.split(""),this.config.ersatzAsArray=this.config.ersatzAsArray||Array(this.config.word.length).fill("∅"),this.config.factorial=this.factorialize(this.config.wordAsArray.length),1===this.config.mode&&h.from(document.getElementById("portrait-image")).maxColorCount(200).getPalette().then((function(e){t.palette=e})),this.init(),this.contextmenuEventListener&&window.removeEventListener("contextmenu",this.contextmenuEventListener),this.contextmenuEventListener=window.addEventListener("contextmenu",(function(t){t.preventDefault()})),this.keyupEventListener&&window.removeEventListener("keyup",this.keyupEventListener),this.keyupEventListener=window.addEventListener("keyup",(function(e){if("Enter"===e.code)return t.startOrStopOrToggleSlideshow(!0),void e.preventDefault();if("Space"===e.code){var n=void 0!==t.slideshow;return t.startOrStopOrToggleSlideshow(!1),n||t.animateShuffleAndRedraw(),void e.preventDefault()}if("Escape"===e.code)return t.cheating=!1,void e.preventDefault();"cheat".includes(e.key)&&(t.cheating=e.key,e.preventDefault())}))},methods:{init:function(){this.shuffle=this.doShuffle(this.config.factorial);for(var i=0;i<this.config.factorial;i++){var t=this.pickPermutation(this.config.wordAsArray,this.config.factorial,i);(function(t,e){return t.length===e.length&&t.every((function(t,i){return t===e[i]}))})(t,this.config.wordAsArray)&&(this.hiddenPermutations.add(i),console.log("REMEMBER nth permutation",i,t,this.hiddenPermutations))}var e=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10;return new Promise((function(o,r){var h=setInterval(Object(c.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,document.fonts.load(t);case 3:e.next=8;break;case 5:e.prev=5,e.t0=e.catch(0),r(e.t0);case 8:document.fonts.check(t)&&(clearInterval(h),console.log("font loaded"),o(!0));case 9:case"end":return e.stop()}}),e,null,[[0,5]])}))),n);setTimeout((function(){return clearInterval(h)}),e)}))}(this.fontFamily(),2e3,100),n=new Promise((function(t,e){document.getElementById("portrait-image").addEventListener("load",(function(e){console.log("image loaded"),t(this)}),{once:!0})})),o=this;Promise.all([e,n]).then((function(data){document.getElementById("swiper").classList.add("animate"),o.createOrRedrawCanvas(data[1])}))},fontFamily:function(t){return t||(t=20),"".concat(t,"px ").concat(this.config.fontFamily,", ").concat(this.config.fontFamilyFallback)},animateShuffleAndRedrawIfNoSlideshow:function(){this.ignoreTap?this.ignoreTap=!1:void 0===this.slideshow&&this.animateShuffleAndRedraw()},toggleCheating:function(){this.ignoreTap=!0,this.cheating=!this.cheating},doShuffle:function(t){return function(t){for(var e,i,n=t.length;n;)i=Math.floor(Math.random()*n--),e=t[n],t[n]=t[i],t[i]=e;return t}(Object(r.a)(Array(t).keys()))},animateShuffleAndRedraw:function(t){var e=document.getElementById("swiper");e.classList.remove("animate"),e.offsetWidth,e.classList.add("animate"),this.shuffleAndRedraw(t)},shuffleAndRedraw:function(t){t=t||1;var e,n=0;do{e=this.doShuffle(this.config.factorial),n=this.storeMatches(e)}while(void 0!==t&&n<t);this.shuffle=e,this.cheating||this.$toast.show("".concat(this.matches.horz.length," horizontal, ").concat(this.matches.vert.length," vertical"),w(w({},this.toastOptions),{duration:this.timeBetweenSlides-500})),this.createOrRedrawCanvas()},startOrStopOrToggleSlideshow:function(t){if(void 0===t&&(t=void 0===this.slideshow),t&&void 0===this.slideshow){this.$toast.show("Starting slideshow",this.toastOptions),this.shuffleAndRedraw();var e=new Date;this.slideshow=setInterval(function(){if(void 0!==this.slideshow){this.shuffleAndRedraw();var t=e;e=new Date,this.timeBetweenSlides=Math.abs(e.getTime()-t.getTime())}}.bind(this),2e3)}else t||void 0===this.slideshow||(clearInterval(this.slideshow),this.slideshow=void 0,this.$toast.show("Slideshow stopped",this.toastOptions))},createOrRedrawCanvas:function(img){var t={cornerFillStyle:this.cornerFill,cornerStrokeStyle:this.cornerStroke,filter:this.config.imageFilter,resolution:this.calcResolution,shape:this.drawLetter,wordAsArray:this.config.wordAsArray};img?this.canvas=img.closePixelate(t):this.canvas.render(t)},pickShuffledPermutation:function(t,e,n,o){var c=n[o=Math.floor(o)];return this.hiddenPermutations.has(c)?Object(r.a)(this.config.ersatzAsArray):this.pickPermutation(t,e,c)},pickPermutation:function(t,e,n){if(e<n)return console.log("n (".concat(n,") cannot be larger than factorial (").concat(e,") !!!")),[];for(var o,q,c,h=n,l=Object(r.a)(t),f=[],d=e;l.length>0;)q=(h-(o=h%(d/=l.length)))/d,c=l.splice(q,1)[0],f.push(c),h=o;return f},horizontal:function(t){for(var e=[],n={boundary:void 0,accumulator:[]},o=0;o<this.box.rows;o++)for(var col=0;col<this.box.cols;col++){var i=col+o*this.box.cols,r=i/this.config.wordAsArray.length,c=i%this.config.wordAsArray.length;0===e.length&&(e=this.pickShuffledPermutation(this.config.wordAsArray,this.config.factorial,t,r));var h=e.shift();0===c&&(n.boundary=i-n.accumulator.length);var l=this.testIfMatch(this.config.wordAsArray,n,h);l&&this.matches.horz.push(l)}},vertical:function(t){for(var e={boundary:void 0,accumulator:[]},col=0;col<this.box.cols;col++)for(var n=0;n<this.box.rows;n++){var i=col+n*this.box.cols,o=i/this.config.wordAsArray.length,r=i%this.config.wordAsArray.length,c=this.pickShuffledPermutation(this.config.wordAsArray,this.config.factorial,t,o)[r];e.boundary?e.boundary.push(i):e.boundary=[i];var h=this.testIfMatch(this.config.wordAsArray,e,c);h&&this.matches.vert.push(h)}},storeMatches:function(t){return this.matches.horz.splice(0,this.matches.horz.length),this.matches.vert.splice(0,this.matches.vert.length),this.vertical(t),this.horizontal(t),this.matches.vert.length+this.matches.horz.length},printCandidate:function(t,e){for(var n=[],i=0;i<t.length;i++)i===e%t.length&&n.push("|"),n.push(t[i]);return n.join("")},resetCandidate:function(t){t.accumulator.splice(0,t.accumulator.length),t.boundary=void 0},testIfMatch:function(t,e,n){var o;e.accumulator.push(n);for(var i=0;i<e.accumulator.length;i++)if(e.accumulator[i]!==t[i]){this.resetCandidate(e);break}return i===t.length&&(o=e.boundary,this.resetCandidate(e)),o},getTextRatio:function(t){t.save(),t.font=this.fontFamily();var e=t.measureText(this.config.word),n=e.width/(e.actualBoundingBoxAscent+e.actualBoundingBoxDescent);return t.restore(),n},getFontSizeToFit:function(t,e,n){t.save();t.font=this.fontFamily(20);var o=t.measureText(this.config.word),r=o.width/this.config.word.length,c=o.actualBoundingBoxAscent+o.actualBoundingBoxDescent;t.restore();var h=Math.min(e+this.config.tweaks.textSizeAdjustment/r*20-1,n+this.config.tweaks.textSizeAdjustment/c*20-1);return t.font=this.fontFamily(h),h},tweakAndFillRect:function(t,e,n,o,r){t.fillRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},tweakAndStrokeRect:function(t,e,n,o,r){t.strokeRect(e+this.config.tweaks.x,n+this.config.tweaks.y,o+this.config.tweaks.cx,r+this.config.tweaks.cy)},drawLetter:function(t,e,i,n,o,r,c,l){if(!(i>this.box.cols*this.box.rows)){var f=l;void 0!==f&&0!==f.length||(f=this.pickShuffledPermutation(this.config.wordAsArray,this.config.factorial,this.shuffle,i/e.length));var d=f.shift();this.textSize||(t.textAlign="center",t.textBaseline="middle",t.shadowColor=this.config.shadowColor,t.shadowOffsetX=this.config.shadowOffsetX);var v=t.fillStyle;if(1===this.config.mode){var w=Number.MAX_SAFE_INTEGER;for(var m in v=t.fillStyle,this.palette){var y=h.Util.hexDiff(this.palette[m].getHex(),t.fillStyle);y<w&&(w=y,v=this.palette[m].getBodyTextColor())}t.fillRect(n,o,r,c)}if(this.cheating){if(this.matches.horz.length)for(var b=0;b<this.matches.horz.length;b++){var A=this.matches.horz[b];A<=i&&i<A+this.config.wordAsArray.length&&(t.save(),t.fillStyle=this.config.matchFill,this.tweakAndFillRect(t,n,o,r,c),t.restore(),i%e.length==0&&this.config.matchBoundaryFill&&(t.save(),t.fillStyle=this.config.matchBoundaryFill,this.tweakAndFillRect(t,n,o,1,c),t.restore()))}if(this.matches.vert.length)for(var k=0;k<this.matches.vert.length;k++){this.matches.vert[k].includes(i)&&(t.save(),t.fillStyle=this.config.matchFill,this.tweakAndFillRect(t,n,o,r,c),t.restore())}}return v&&(t.fillStyle=v),t.fillText(d,n+r/2,o+c/2),f}},calcResolution:function(t,e,n){var o=this.config.factorial,r=this.getDivisorsList(o).map((function(t){return{x:t,y:o/t,ratio:t/(o/t)}})),c=e/n/this.getTextRatio(t),h=this.binarySearch(r.map((function(t){return t.ratio})),c),l=r[h].x*this.config.word.length,f=r[h].y,d=e/l,v=n/f;return this.box={cols:l,rows:f,cxCol:d,cyRow:v,factorial:o},this.textSizeDefault=this.getFontSizeToFit(t,d,v),this.box},factorialize:function(t){if(void 0!==t)return t<0?-1:0===t?1:t*this.factorialize(t-1)},getDivisorsList:function(t){var e,n=[];return e=t,Object(r.a)(Array(e+1).keys()).slice(1).reduce((function(s,a){var t=!(e%a)&&a;return t&&n.push(t),s+t}),0),n},binarySearch:function(t,e){if(1===t.length)return 0;var n=Math.floor(t.length/2);return t[n]===e?n:t[n]>e?this.binarySearch(t.slice(0,n),e):t[n]<e?n+this.binarySearch(t.slice(n),e):n}}},y=m,A=(n(494),n(54)),component=Object(A.a)(y,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor},[n("style",{tag:"component"},[t._v("\n    "+t._s(t.style)+"\n  ")]),t._v(" "),n("div",{style:"font-family: "+t.fontFamily()+"; visibility: hidden;"},[t._v("force browser to load font")]),t._v(" "),n("img",{attrs:{id:"portrait-image",src:t.config.imageSrc}}),t._v(" "),n("client-only",[n("div",{directives:[{name:"touch",rawName:"v-touch:tap",value:t.animateShuffleAndRedrawIfNoSlideshow,expression:"animateShuffleAndRedrawIfNoSlideshow",arg:"tap"},{name:"touch",rawName:"v-touch:touchhold",value:t.toggleCheating,expression:"toggleCheating",arg:"touchhold"}],staticClass:"vh-100",style:"background-color: "+t.config.backgroundColor,attrs:{id:"swiper"}})])],1)}),[],!1,null,null,null);e.default=component.exports}}]);