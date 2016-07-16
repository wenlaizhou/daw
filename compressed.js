"use strict";function walContext(){this.ctx=new window.AudioContext,this.destination=this.ctx.destination,this.filters=this.createFilters(),this.buffers=[],this.compositions=[],this.nbPlaying=0,this.filters.connect(this.destination),this.nodeIn=this.filters.nodeIn,delete this.filters.connect}function extractData(e){function i(e){var t=new Promise(function(t){e.isFile?e.file(function(e){e.type&&"text/plain"!==e.type?o.push(e):n||(n=e,gs.reset()),t()}):e.isDirectory&&(s=e.createReader(),s.readEntries(function(e){var s=[];$.each(e,function(){s.push(i(this))}),Promise.all(s).then(function(){t()})}))});return t}var t,s,n,o=[],a=[];$.each(e,function(){(t=this.webkitGetAsEntry())&&a.push(i(t))}),Promise.all(a).then(function(){gs.load(n).then(function(){loadFile(o)})})}function loadFile(e){e.forEach(function(e){gs.files.some(function(i){var t=i.file?i.file.size:i.size;return i.fullname===e.name&&t===e.size?(i.file||i.joinFile(e),!0):void 0})||gs.fileCreate(e)})}window.AudioContext=window.AudioContext||window.webkitAudioContext,walContext.prototype={gain:function(e){return arguments.length?(this.filter.gain(e),this):this.filter.gain()},createBuffer:function(e){var i=this;return new Promise(function(t,s){new walContext.Buffer(i,e,t,s)}).then(function(e){return i.buffers.push(e),e})},createFilters:function(){return new walContext.Filters(this)},createComposition:function(){var e=new walContext.Composition(this);return this.compositions.push(e),e}},function(){function e(e){var i,t=null,s=0;e.wSamples.forEach(function(e){i=e.getEndTime(),i>s&&(s=i,t=e)}),e.lastSample=t,e.duration=t?t.getEndTime():0}function i(i){clearTimeout(i.playTimeoutId),e(i);var t=i.duration&&i.duration-i.currentTime();0>=t?i.onended():i.playTimeoutId=setTimeout(i.onended.bind(i),1e3*t)}function t(e,i){var t=e.when-i;e.start(t,t>0?e.offset:e.offset-t,t>0?e.duration:e.duration+t)}function s(e,s,n,o){var a=e.currentTime();s.getEndTime()>a&&"rm"!==n&&(s.load(),t(s,a)),e.lastSample===o&&"mv"!==n||i(e)}function n(e){clearTimeout(e.playTimeoutId),e.wSamples.forEach(function(e){e.stop()})}function o(e){var i=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>i&&e.load()})}function a(e){var s=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>s&&t(e,s)}),i(e)}walContext.Composition=function(e){this.wCtx=e,this.wSamples=[],this.lastSample=null,this.isPlaying=this.isPaused=!1,this.duration=this.startedTime=this._currentTime=0,this.fnOnended=this.fnOnpaused=function(){}},walContext.Composition.prototype={addSamples:function(e){var i=this;return e.forEach(function(e){i.wSamples.indexOf(e)<0&&(i.wSamples.push(e),e.composition=this,i.update(e))}),this},removeSamples:function(e){var i,t=this;return e.forEach(function(e){i=t.wSamples.indexOf(e),i>-1&&(t.wSamples.splice(i,1),e.composition=null,t.update(e,"rm"))}),this},update:function(i,t){var n,o=this,a=this.lastSample;return e(this),this.isPlaying&&(i.started?(n=i.fnOnended,i.onended(function(){s(o,i,t,a),n(),i.onended(n)}),i.stop()):s(this,i,t,a)),this},currentTime:function(e){return arguments.length?(this.isPlaying&&n(this),this._currentTime=Math.max(0,Math.min(e,this.duration)),this.isPlaying&&(this.startedTime=this.wCtx.ctx.currentTime,o(this),a(this)),this):this._currentTime+(this.isPlaying&&wa.wctx.ctx.currentTime-this.startedTime)},play:function(){return this.isPlaying||(this.isPlaying=!0,this.isPaused=!1,this.startedTime=wa.wctx.ctx.currentTime,o(this),a(this)),this},stop:function(){return(this.isPlaying||this.isPaused)&&(n(this),this.onended()),this},pause:function(){this.isPlaying&&(this.isPlaying=!1,this.isPaused=!0,this._currentTime+=wa.wctx.ctx.currentTime-this.startedTime,this.startedTime=0,n(this),this.fnOnpaused())},onended:function(e){return"function"==typeof e?this.fnOnended=e:(this.isPlaying=this.isPaused=!1,this.startedTime=this._currentTime=0,this.fnOnended()),this}}}(),function(){walContext.Buffer=function(e,i,t,s){function n(e){o.wCtx.ctx.decodeAudioData(e,function(e){o.buffer=e,o.isReady=!0,t(o)},s)}var o=this,a=new FileReader;this.wCtx=e,this.isReady=!1,i.name?(a.addEventListener("loadend",function(){n(a.result)}),a.readAsArrayBuffer(i)):n(i)},walContext.Buffer.prototype={createSample:function(){var e=new walContext.Sample(this.wCtx,this);return e},getPeaks:function(e,i,t,s){t=t||0,s=s||this.buffer.duration;for(var n,o,a,u=0,r=new Array(i),l=this.buffer.getChannelData(e),c=(s-t)*this.buffer.sampleRate,d=t*this.buffer.sampleRate,m=c/i,f=m/10;i>u;++u){for(n=d+u*m,o=n+m,a=0;o>n;n+=f)a=Math.max(a,Math.abs(l[~~n]));r[u]=a}return r}}}(),function(){function e(e,i,t){e[i]=t[0],e[i+1]=t[1],e[i+2]=t[2],e[i+3]=t[3]}function i(i,t,s,n){var o,a,u,r,l=t.data,c=t.width,d=t.height,m=d/2,f=i.getPeaks(0,c),p=i.buffer.numberOfChannels>1?i.getPeaks(1,c):f;if(n){for(o=0;o<l.length;o+=4)e(l,o,s);s=[0,0,0,0]}for(o=0;c>o;++o){for(u=~~(m*(1-f[o])),r=~~(m*(1+p[o])),a=u;r>=a;++a)e(l,4*(a*c+o),s);e(l,4*(m*c+o),s)}return t}walContext.Buffer.prototype.waveformSVG=function(e,i,t){var s,n=t/2-.5,o=t/2+.5,a="M0 "+n,u=e?e.firstChild:document.createElement("path"),r=this.getPeaks(0,i),l=this.buffer.numberOfChannels>1?this.getPeaks(1,i):r;for(e||(e=document.createElement("svg"),e.appendChild(u)),s=0;i>s;++s)a+=" L"+s+" "+(n-r[s]*n);for(s=i-1;s>=0;--s)a+=" L"+s+" "+(o+l[s]*n);return u.setAttribute("d",a),e.setAttribute("viewBox","0 0 "+i+" "+t),e},walContext.Buffer.prototype.drawWaveform=function(e,t){return i(this,e,t)},walContext.Buffer.prototype.drawInvertedWaveform=function(e,t){return i(this,e,t,!0)}}(),walContext.Filters=function(e){this.wCtx=e,this.nodes=[],this.nodeIn=e.ctx.createGain(),this.nodeOut=e.ctx.createGain(),this.nodeIn.connect(this.nodeOut),this.connect(e)},walContext.Filters.prototype={connect:function(e){e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.nodeOut.connect(e))},disconnect:function(){this.nodeOut.disconnect(),this.connectedTo=null},empty:function(){this.nodes.length&&(this.nodes[this.nodes.length-1].disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut),this.nodes=[])},gain:function(e){return arguments.length?void(this.nodeOut.gain.value=e):this.nodeOut.gain.value},pushBack:function(e){if(this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(e)}else this.nodeIn.disconnect(),this.nodeIn.connect(e);e.connect(this.nodeOut),this.nodes.push(e)},pushFront:function(e){this.nodes.length?(this.nodeIn.disconnect(),this.nodeIn.connect(e),e.connect(this.nodes[0]),this.nodes.unshift(e)):this.pushBack(e)},popBack:function(){var e=this.nodes.pop();if(e)if(e.disconnect(),this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(this.nodeOut)}else this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut);return e},popFront:function(){var e=this.nodes.shift();return e&&(e.disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodes[0]||this.nodeOut)),e}},walContext.Sample=function(e,i,t){this.wCtx=e,this.wBuffer=i,this.connectedTo=t?t.nodeIn:e.nodeIn,this.when=this.offset=0,this.duration=this.bufferDuration=i.buffer.duration,this.fnOnended=function(){},this.loaded=this.started=this.playing=!1},walContext.Sample.prototype={connect:function(e){return e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.source&&this.source.connect(e)),this},disconnect:function(){return this.source&&(this.source.disconnect(),this.connectedTo=null),this},load:function(){return this.loaded||(this.loaded=!0,this.source=this.wCtx.ctx.createBufferSource(),this.source.buffer=this.wBuffer.buffer,this.source.onended=this.onended.bind(this),this.connectedTo&&this.source.connect(this.connectedTo)),this},start:function(e,i,t){function s(){++n.wCtx.nbPlaying,n.playing=!0}if(this.loaded)if(this.started)console.warn("WebAudio Library: can not start a sample twice.");else{var n=this;this.started=!0,e=void 0!==e?e:this.when,this.source.start(this.wCtx.ctx.currentTime+e,void 0!==i?i:this.offset,void 0!==t?t:this.duration),e?this.playTimeoutId=setTimeout(s,1e3*e):s()}else console.warn("WebAudio Library: can not start an unloaded sample.");return this},stop:function(){return this.started&&(this.source.onended=null,this.source.stop(0),this.onended()),this},getEndTime:function(){return this.when+this.duration},onended:function(e){return"function"==typeof e?this.fnOnended=e:this.loaded&&(this.playing&&(this.playing=!1,--this.wCtx.nbPlaying),this.started&&(this.started=!1,clearTimeout(this.playTimeoutId)),this.loaded=!1,this.source=null,this.fnOnended()),this}},function(){function e(i){for(var t,s=i.firstChild;null!==s;)e(t=s),s=s.nextSibling,1!==t.nodeType&&/^\s*$/.test(t.textContent)&&i.removeChild(t)}var i=$("#app"),t=Handlebars.templates;for(var s in t)"_app"!==s&&Handlebars.registerPartial(s,t[s]);i.append(Handlebars.templates._app({})),e(document.body),window.ui={jqWindow:$(window),jqBody:$("body"),jqApp:i,jqAbout:$("#about"),jqVisual:$("#visual"),jqVisualCanvas:$("#visual canvas"),jqVisualClockUnits:$("#visual .clock .units"),jqClockMin:$("#visual .clock > .min"),jqClockSec:$("#visual .clock > .sec"),jqClockMs:$("#visual .clock > .ms"),jqMenu:$("#menu"),jqPlay:$("#menu .btn.play"),jqStop:$("#menu .btn.stop"),jqBpmA:$("#menu .bpm .a-bpm"),jqBpmInt:$("#menu .bpm .int"),jqBpmDec:$("#menu .bpm .dec"),jqBpmList:$("#menu .bpm-list"),jqBtnTools:$("#menu .tools [data-tool]"),jqBtnMagnet:$("#menu .tools .magnet"),jqBtnSave:$("#menu .tools .save"),jqBtnAbout:$("#menu .about"),jqFiles:$("#files"),jqFileFilters:$("#files .filters"),jqFilelist:$("#files .filelist"),jqInputFile:$("#files .filelist input[type='file']"),jqGrid:$("#grid"),jqGridEm:$("#grid .emWrapper"),jqGridHeader:$("#grid .header"),jqTimeline:$("#grid .timeline"),jqTimeArrow:$("#grid .timeArrow"),jqTimeCursor:$("#grid .timeCursor"),jqTrackList:$("#grid .trackList"),jqGridCols:$("#grid .cols"),jqGridColB:$("#grid .colB"),jqTrackNames:$("#grid .trackNames"),jqTrackLines:$("#grid .trackLines"),jqTrackLinesBg:$("#grid .trackLinesBg"),jqTrackNamesExtend:$("#grid .trackNames .extend"),tool:{},tracks:[],nbTracksOn:0},ui.gridEm=parseFloat(ui.jqGrid.css("fontSize")),ui.gridColsY=ui.jqGridCols.offset().top,ui.jqVisualCanvas[0].width=256,ui.jqVisualCanvas[0].height=ui.jqVisualCanvas.height()}(),function(){function e(){var o=t;wa.wctx.nbPlaying&&(o=wa.analyserArray,wa.analyser.getByteTimeDomainData(o)),wa.oscilloscope(s,n,o),i=requestAnimationFrame(e)}var i,t=[],s=ui.jqVisualCanvas[0],n=s.getContext("2d");ui.analyserEnabled=!1,ui.analyserToggle=function(t){"boolean"!=typeof t&&(t=!ui.analyserEnabled),ui.analyserEnabled=t,t?i=requestAnimationFrame(e):(n.clearRect(0,0,s.width,s.height),cancelAnimationFrame(i))}}(),ui.BPMem=1,ui.bpm=function(e){var i=~~e,t=Math.min(Math.round(100*(e-i)),99);ui.BPMem=e/60,ui.jqBpmInt[0].textContent=100>i?"0"+i:i,ui.jqBpmDec[0].textContent=10>t?"0"+t:t},ui.css=function(e,i,t){if(e){var s=getComputedStyle(e);if(2===arguments.length)return s[i];e.style[i]=t}},ui.setClockUnit=function(e){ui.jqVisualClockUnits.attr("data-unit",e),ui.currentTime(gs.currentTime())},function(){function e(e){var i,t=ui.jqTimeCursor[0],s=ui.jqTimeArrow[0];e>0&&(i=e*ui.BPMem+"em",ui.css(t,"left",i),ui.css(s,"left",i)),t.classList.toggle("visible",e>0),s.classList.toggle("visible",e>0)}function i(e){var i,t,s;"s"===gs.clockUnit?(i=~~(e/60),t=~~(e%60)):(e*=ui.BPMem,i=1+~~e,e*=4,t=1+~~e%4),t=10>t?"0"+t:t,s=Math.floor(1e3*(e-~~e)),10>s?s="00"+s:100>s&&(s="0"+s),ui.jqClockMin[0].textContent=i,ui.jqClockSec[0].textContent=t,ui.jqClockMs[0].textContent=s}ui.currentTime=function(t){e(t),i(t)}}(),function(){function e(e,i){e.attr("data-cursor",i)}var i=null;ui.cursor=function(t,s){"app"===t?(e(ui.jqApp,s),e(ui.jqTrackLines,s?null:i)):e(ui.jqTrackLines,i=s)}}(),function(){function e(e,i){return Math.abs(e-i)<1e-4}function i(e){var i=e%t;return e-=i,i>s&&(e+=t),e}var t=.25,s=t/2;ui.xemFloor=function(s){var n=i(s);return s>n||e(n,s)?n:n-t},ui.xemCeil=function(s){var n=i(s);return n>s||e(n,s)?n:n+t},ui.getGridXem=function(e){var t=(e-ui.filesWidth-ui.trackNamesWidth-ui.trackLinesLeft)/ui.gridEm;return ui.isMagnetized?i(t):t}}(),ui.getTrackFromPageY=function(e){return ui.tracks[Math.floor((e-ui.gridColsY+ui.gridScrollTop)/ui.gridEm)]},ui.CSS_fileUnloaded=function(e){e.jqIcon.addClass("fa-download").removeClass("fa-question"),e.jqFile.addClass("unloaded")},ui.CSS_fileWithoutData=function(e){e.jqIcon.addClass("fa-question").removeClass("fa-download"),e.jqFile.addClass("unloaded")},ui.CSS_fileLoading=function(e){e.jqIcon.addClass("fa-refresh fa-spin").removeClass("fa-download")},ui.CSS_fileLoaded=function(e){e.jqFile.addClass("loaded").removeClass("unloaded"),e.jqIcon.remove()},ui.CSS_fileError=function(e){e.jqIcon.addClass("fa-times").removeClass("fa-refresh fa-spin")},ui.CSS_fileUsed=function(e){e.jqFile.addClass("used")},ui.CSS_fileUnused=function(e){e.jqFile.removeClass("used")},ui.newTrack=function(){ui.tracks.push(new ui.Track(this))},function(){function e(){ui.currentTime(wa.composition.currentTime()),i=requestAnimationFrame(e)}var i;ui.play=function(){ui.jqPlay[0].classList.remove("fa-play"),ui.jqPlay[0].classList.add("fa-pause"),e()},ui.pause=function(){cancelAnimationFrame(i),ui.jqPlay[0].classList.remove("fa-pause"),ui.jqPlay[0].classList.add("fa-play")},ui.stop=function(){ui.pause(),ui.currentTime(0)}}(),ui.resize=function(){ui.screenWidth=ui.jqWindow.width(),ui.screenHeight=ui.jqWindow.height(),ui.gridColsWidth=ui.jqGridCols.width(),ui.gridColsHeight=ui.jqTrackList.height(),ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.updateTimeline(),ui.updateTrackLinesBg()},ui.CSS_sampleTrack=function(e){e.track.jqColLinesTrack.append(e.jqSample)},ui.CSS_sampleWhen=function(e){ui.css(e.jqSample[0],"left",e.wsample.when*ui.BPMem+"em")},ui.CSS_sampleSelect=function(e){e.jqSample.toggleClass("selected",e.selected)},ui.CSS_sampleDelete=function(e){e.jqSample.remove()},ui.CSS_sampleOffset=function(e){ui.css(e.elSVG,"marginLeft",-e.wsample.offset*ui.BPMem+"em")},ui.CSS_sampleDuration=function(e){ui.css(e.jqSample[0],"width",e.wsample.duration*ui.BPMem+"em"),ui.css(e.elSVG,"width",e.wsample.bufferDuration*ui.BPMem+"em")},ui.CSS_sampleWaveform=function(e){e.wsample.wBuffer.waveformSVG(e.elSVG,~~(200*e.wsample.bufferDuration),50)},ui.selectTool=function(){var e;return function(i){var t,s=ui.jqBtnTools.tool[i];s!==e&&(e&&(e.classList.remove("active"),t=ui.tool[ui.currentTool],t.mouseup&&t.mouseup({}),t.end&&t.end()),e=s,s.classList.add("active"),ui.jqGrid[0].dataset.tool=ui.currentTool=i,t=ui.tool[i],t.start&&t.start())}}(),ui.setFilesWidth=function(e){ui.css(ui.jqFiles[0],"width",e+"px"),ui.filesWidth=e=ui.jqFiles.outerWidth(),ui.gridColsWidth=ui.screenWidth-e,ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.css(ui.jqGrid[0],"left",e+"px"),ui.css(ui.jqVisual[0],"width",e+ui.trackNamesWidth+"px"),ui.css(ui.jqMenu[0],"left",e+ui.trackNamesWidth+"px"),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.gridScrollTop=0,ui.setGridScrollTop=function(e){ui.jqGridCols[0].scrollTop=ui.gridScrollTop=0>=e?0:Math.min(e,ui.tracks.length*ui.gridEm-ui.gridColsHeight),ui.updateGridTopShadow()},ui.gridZoom=1,ui.setGridZoom=function(e,i,t){e=Math.min(Math.max(1,e),8);var s=e/ui.gridZoom;ui.gridZoom=e,ui.gridEm*=s,ui.css(ui.jqGridEm[0],"fontSize",e+"em"),ui.jqGrid.attr("data-sample-size",ui.gridEm<40?"small":ui.gridEm<80?"medium":"big"),ui.setGridScrollTop(-(t-(ui.gridScrollTop+t)*s)),ui.setTrackLinesLeft(i-(-ui.trackLinesLeft+i)*s),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.setTrackLinesLeft=function(e){ui.trackLinesLeft=e=Math.min(~~e,0),ui.css(ui.jqTrackLines[0],"marginLeft",e/ui.gridEm+"em"),ui.updateGridLeftShadow()},ui.trackNamesWidth=0,ui.setTrackNamesWidth=function(e){var i,t=ui.trackNamesWidth;ui.css(ui.jqTrackNames[0],"width",e+"px"),ui.trackNamesWidth=e=ui.jqTrackNames.outerWidth(),ui.trackLinesWidth=ui.gridColsWidth-e,i=ui.filesWidth+e,ui.css(ui.jqGridColB[0],"left",e+"px"),ui.css(ui.jqTimeline[0],"left",e+"px"),ui.css(ui.jqVisual[0],"width",i+"px"),ui.css(ui.jqMenu[0],"left",i+"px"),ui.trackLinesLeft<0&&ui.setTrackLinesLeft(ui.trackLinesLeft-(e-t)),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.toggleAbout=function(e){ui.jqAbout.toggleClass("show",e)},ui.isMagnetized=!1,ui.toggleMagnetism=function(e){"boolean"!=typeof e&&(e=!ui.isMagnetized),ui.isMagnetized=e,ui.jqBtnMagnet.toggleClass("active",e)},ui.toggleTracks=function(e){for(var i,t=0,s=e.isOn&&1===ui.nbTracksOn;i=ui.tracks[t++];)i.toggle(s);e.toggle(!0)},function(){var e=2,i="rgba(0,0,0,.3)",t="px "+e+"px "+i;ui.updateGridLeftShadow=function(){var e=-ui.trackLinesLeft;ui.css(ui.jqTrackNames[0],"boxShadow",e?Math.min(2+e/8,5)+"px 0"+t:"none")},ui.updateGridTopShadow=function(){var e=ui.gridScrollTop;ui.css(ui.jqGridHeader[0],"boxShadow",e?"0px "+Math.min(2+e/8,5)+t:"none")}}(),function(){function e(e){if(e>t){var s,n="",o=t;for(t=e;o++<e;)n+="<div><span></span></div>";s=$(n),ui.jqTimeline.append(s),i||(i=s[0])}}var i,t=0;ui.updateTimeline=function(){var t=ui.trackLinesLeft/ui.gridEm,s=ui.trackLinesWidth/ui.gridEm;e(Math.ceil(-t+s)),ui.css(i,"marginLeft",t+"em"),ui.css(ui.jqTimeArrow[0],"marginLeft",t+"em")}}(),function(){function e(e){var s,n,o,a=e-t,u="";for(t=Math.max(e,t),s=0;a>s;++s){for(u+="<div>",n=0;4>n;++n){for(u+="<div>",o=0;4>o;++o)u+="<div></div>";u+="</div>"}u+="</div>"}ui.jqTrackLinesBg.append(u),i=i||ui.jqTrackLinesBg.children().eq(0)}var i,t=0;ui.updateTrackLinesBg=function(){e(Math.ceil(ui.trackLinesWidth/ui.gridEm/4)+2),ui.css(i[0],"marginLeft",ui.trackLinesLeft/ui.gridEm%8+"em")}}(),ui.Track=function(e,i){i=i||{},this.grid=e,this.id=ui.tracks.length,this.jqColNamesTrack=$("<div class='track'>").appendTo(ui.jqTrackNames),this.jqColLinesTrack=$("<div class='track'>").appendTo(ui.jqTrackLines),this.jqColNamesTrack[0].uitrack,this.jqColLinesTrack[0].uitrack=this,this.wfilters=wa.wctx.createFilters(),this.samples=[],this.initToggle().initEditName().toggle(i.toggle!==!1).editName(i.name||"")},ui.Track.prototype={removeSample:function(e){var i=this.samples.indexOf(e);i>=0&&this.samples.splice(i,1)}},ui.Track.prototype.initEditName=function(){var e=this;return this.jqName=$("<span class='name text-overflow'>").appendTo(this.jqColNamesTrack).dblclick(this.editName.bind(this,!0)),this.jqNameInput=$("<input type='text'/>").appendTo(this.jqColNamesTrack).blur(function(){e.editName(this.value).editName(!1)}).keydown(function(i){13!==i.keyCode&&27!==i.keyCode||e.editName(13===i.keyCode?this.value:e.name).editName(!1),i.stopPropagation()}),this},ui.Track.prototype.editName=function(e){var i=this.jqNameInput[0],t="Track "+(this.id+1);return"string"==typeof e?(e=e.replace(/^\s+|\s+$/,"").replace(/\s+/g," "),e=e===t?"":e,this.jqName.toggleClass("empty",""===e),this.jqName[0].textContent=e||t,this.name=e):e?(this.jqColNamesTrack.addClass("editing"),i.value=this.name||t,i.focus(),i.select()):(i.blur(),this.jqColNamesTrack.removeClass("editing")),this},ui.Track.prototype.initToggle=function(){var e=this;return this.jqToggle=$("<a class='toggle'>").appendTo(this.jqColNamesTrack).on("contextmenu",!1).mousedown(function(i){0===i.button?e.toggle():2===i.button&&ui.toggleTracks(e)}),this},ui.Track.prototype.toggle=function(e){return"boolean"!=typeof e&&(e=!this.isOn),this.isOn!==e&&(this.wfilters.gain(+e),this.isOn=e,this.grid.nbTracksOn+=e?1:-1,this.jqToggle.toggleClass("on",e),this.jqColNamesTrack.add(this.jqColLinesTrack).toggleClass("off",!e)),this},function(){var e=new walContext,i=e.ctx.createAnalyser();i.fftSize=256,e.filters.pushBack(i),window.wa={wctx:e,ctx:e.ctx,analyser:i,analyserArray:new Uint8Array(i.frequencyBinCount),composition:e.createComposition()}}(),wa.oscilloscope=function(){var e=0,i=Math.PI/2;return function(t,s,n){var o,a=0,u=t.width,r=t.height,l=n.length,c=l/2,d=u/(l-1);for(s.globalCompositeOperation="source-in",s.fillStyle="rgba("+Math.round(255-255*e)+","+Math.round(64*e)+","+Math.round(255*e)+","+(.95-.25*(1-Math.cos(e*i)))+")",s.fillRect(0,0,u,r),e=0,s.globalCompositeOperation="source-over",s.save(),s.translate(0,r/2),s.beginPath(),s.moveTo(0,0);l>a;++a)o=(n[a]-128)/128,e=Math.max(Math.abs(o),e),o*=.5-Math.cos((c>a?a:l-a)/c*Math.PI)/2,s.lineTo(a*d,o*r);s.lineJoin="round",s.lineWidth=1+Math.round(2*e),s.strokeStyle="rgba(255,255,255,"+Math.min(.3+4*e,1)+")",s.stroke(),s.restore()}}(),window.gs={files:[],samples:[],selectedSamples:[]},gs.bpm=function(e){if(!arguments.length)return gs._bpm;var i=gs.currentTime()*ui.BPMem;gs._bpm=Math.max(20,Math.min(e,999)),ui.bpm(gs._bpm),gs.samples.forEach(function(e){e.wsample?(e.wsample.when=e.xem/ui.BPMem,ui.CSS_sampleDuration(e),ui.CSS_sampleOffset(e)):(e.savedWhen=e.xem/ui.BPMem,ui.css(e.jqSample[0],"width",e.savedDuration*ui.BPMem+"em"))}),gs.currentTime(i/ui.BPMem)},gs.currentTime=function(e){return arguments.length?(wa.composition.currentTime(e),void ui.currentTime(wa.composition.currentTime())):wa.composition.currentTime()},gs.playToggle=function(e){"boolean"!=typeof e&&(e=!wa.composition.isPlaying),e?gs.play():gs.pause()},gs.play=function(){!wa.composition.isPlaying&&wa.composition.wSamples.length&&gs.samples.length&&(wa.composition.play(),wa.composition.isPlaying&&(gs.isPaused=!(gs.isPlaying=!0),ui.play()))},gs.pause=function(){wa.composition.isPlaying&&(wa.composition.pause(),gs.isPaused=!(gs.isPlaying=!1),ui.pause())},gs.stop=function(){wa.composition.stop(),gs.currentTime(0),gs.isPaused=gs.isPlaying=!1,ui.stop()},function(){function e(e,i){var t=JSON.parse(i.target.result);gs.bpm(t.bpm),t.files.forEach(function(e){var i=gs.fileCreate(e);i.samplesToSet=[]}),t.tracks.forEach(function(e){for(var i=e[0];i>=ui.tracks.length;)ui.newTrack();ui.tracks[i].toggle(e[1]).editName(e[2])}),t.samples.forEach(function(e){var i=gs.sampleCreate(gs.files[e[2]]);i.gsfile.samplesToSet.push(i),i.xem=e[0],i.savedWhen=e[3],i.savedOffset=e[4],i.savedDuration=e[5],i.track=ui.tracks[e[1]],i.track.samples.push(i),ui.CSS_sampleTrack(i),ui.css(i.jqSample[0],"left",e[3]*ui.BPMem+"em"),ui.css(i.jqSample[0],"width",e[5]*ui.BPMem+"em")}),e()}gs.load=function(i){return new Promise(function(t,s){if(i){var n=new FileReader;n.onload=e.bind(null,t),n.readAsText(i)}else t()})}}(),gs.save=function(){var e={bpm:this._bpm,files:[],samples:[],tracks:[]};return gs.files.forEach(function(i){e.files.push([i.id,i.fullname,i.file?i.file.size:i.size])}),gs.samples.forEach(function(i){e.samples.push([i.xem,i.track.id,i.gsfile.id,i.wsample?i.wsample.when:i.savedWhen,i.wsample?i.wsample.offset:i.savedOffset,i.wsample?i.wsample.duration:i.savedDuration])}),ui.tracks.forEach(function(i){(i.isOn||i.samples.length||i.name||i.wfilters&&i.wfilters.length)&&e.tracks.push([i.id,i.isOn,i.name])}),{href:"data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify(e)),download:"s.txt"}},gs.reset=function(){return ui.tracks.forEach(function(e){e.editName(""),e.toggle(!0)}),gs.samples.forEach(function(e){gs.sampleSelect(e,!0)}),gs.samplesDelete(),gs.files.forEach(function(e){e.jqFile.remove()}),gs.files=[],this},gs.fileCreate=function(e){var i=new gs.File(e);return i.id=gs.files.length,gs.files.push(i),ui.jqFilelist.append(i.jqFile),i},function(){var e,i=$("<div class='cursor'>");gs.filePlay=function(t){e&&e.stop(),t.isLoaded&&(ui.css(i[0],"transitionDuration",0),ui.css(i[0],"left",0),t.elWaveformWrap.appendChild(i[0]),e=t.wbuff.createSample().onended(gs.fileStop).load().start(),setTimeout(function(){ui.css(i[0],"transitionDuration",t.wbuff.buffer.duration+"s"),ui.css(i[0],"left","100%")},20))},gs.fileStop=function(){e&&(e.stop(),i.detach())}}(),function(){var e;ui.jqInputFile.change(function(){e&&(e.joinFile(this.files[0]),e=null)}),gs.File=function(i){var t=this;this.isLoaded=this.isLoading=!1,this.file=i.length?null:i,this.fullname=i.name||i[1],this.name=this.fullname.replace(/\.[^.]+$/,""),this.nbSamples=0,this.jqFile=$(Handlebars.templates.file(this)),this.jqIcon=this.jqFile.find(".icon"),this.jqName=this.jqFile.find(".name"),this.file?ui.CSS_fileUnloaded(this):(this.size=i[2],ui.CSS_fileWithoutData(this)),this.jqFile.on({contextmenu:!1,dragstart:this.dragstart.bind(this),mousedown:function(e){0!==e.button&&gs.fileStop()},click:function(){t.isLoaded?gs.filePlay(t):t.file?t.isLoading||t.load(gs.filePlay):(alert("Choose the file to associate or drag and drop "+t.name),e=t,ui.jqInputFile.click())}})}}(),function(){var e,i;ui.jqBody.mousemove(function(t){e&&(ui.css(i,"left",t.pageX+"px"),ui.css(i,"top",t.pageY+"px"))}).mouseup(function(t){if(e){var s=ui.getTrackFromPageY(t.pageY),n=ui.getGridXem(t.pageX);i.remove(),s&&n>=0&&gs.sampleCreate(e,s.id,n),e=null,ui.cursor("app",null)}}),gs.File.prototype.dragstart=function(t){return this.isLoaded&&!e&&(e=this,i=this.elSVG.cloneNode(!0),ui.css(i,"left",t.pageX+"px"),ui.css(i,"top",t.pageY+"px"),i.classList.add("dragging"),ui.jqBody.append(i),ui.cursor("app","grabbing")),!1}}(),gs.File.prototype.joinFile=function(e){this.file=e,ui.CSS_fileUnloaded(this),this.fullname!==e.name&&(this.fullname=e.name,this.name=this.fullname.replace(/\.[^.]+$/,""),this.jqName[0].textContent=this.name),this.samplesToSet.length&&this.load(function(e){e.samplesToSet.forEach(function(i){i.wsample=e.wbuff.createSample(),i.when(i.savedWhen),i.slip(i.savedOffset),i.duration(i.savedDuration),i.wsample.connect(i.track.wfilters),wa.composition.addSamples([i.wsample]),i.jqName[0].textContent=e.name,ui.CSS_sampleDuration(i),ui.CSS_sampleWaveform(i)})})},gs.File.prototype.load=function(e){var i=this;this.isLoading=!0,ui.CSS_fileLoading(this),wa.wctx.createBuffer(this.file).then(function(t){i.wbuff=t,i.isLoaded=!0,i.isLoading=!1,i.elSVG=i.jqFile.find("svg")[0],i.elWaveformWrap=i.elSVG.parentNode,t.waveformSVG(i.elSVG,400,50),ui.CSS_fileLoaded(i),e(i)},function(){i.isLoading=!1,ui.CSS_fileError(i),alert('At this day, the file: "'+i.fullname+'" can not be decoded by your browser.\n')})},gs.sampleCreate=function(e,i,t){var s=new gs.Sample(e,i,t);return gs.samples.push(s),ui.CSS_fileUsed(e),++e.nbSamples,s},gs.sampleSelect=function(e,i){e&&e.wsample&&e.selected!==i&&(e.select(i),i?gs.selectedSamples.push(e):gs.selectedSamples.splice(gs.selectedSamples.indexOf(e),1))},gs.sampleDelete=function(e){e&&e.wsample&&(gs.sampleSelect(e,!1),gs.samples.splice(gs.samples.indexOf(e),1),--e.gsfile.nbSamples||ui.CSS_fileUnused(e.gsfile),e["delete"]())},gs.samplesForEach=function(e,i){e&&e.wsample&&(e.selected?gs.selectedSamples.forEach(function(e){e.wsample&&i(e)}):i(e))},function(){var e,i=[];gs.samplesCopy=function(){var t=1/0,s=-(1/0);i=gs.selectedSamples.map(function(e){return t=Math.min(t,e.xem),s=Math.max(s,e.xem+e.wsample.duration*ui.BPMem),e}),ui.isMagnetized&&(t=ui.xemFloor(t),s=ui.xemCeil(s)),e=s-t},gs.samplesPaste=function(){gs.samplesUnselect(),i.forEach(function(i){var t=gs.sampleCreate(i.gsfile,i.track.id,i.xem+e);t.slip(i.wsample.offset),t.duration(i.wsample.duration),gs.sampleSelect(t,!0)}),gs.samplesCopy()}}(),gs.samplesCut=function(e,i){if(e.wsample){var t=i-e.wsample.when;gs.samplesForEach(e,function(e){e.cut(t)})}},gs.samplesDelete=function(){gs.selectedSamples.slice(0).forEach(gs.sampleDelete),gs.selectedSamples=[]},gs.samplesDuration=function(e,i){function t(e){s=Math.min(s,e.wsample.duration),i=Math.min(i,e.wsample.bufferDuration-e.wsample.duration)}var s=1/0;return e.wsample&&(i/=ui.BPMem,e.selected?gs.selectedSamples.forEach(t):t(e),0>i&&(i=-Math.min(s,-i)),gs.samplesForEach(e,function(e){e.duration(e.wsample.duration+i)})),i*ui.BPMem},gs.samplesMoveX=function(e,i){if(e.selected&&e.wsample&&0>i){var t=1/0;gs.selectedSamples.forEach(function(e){t=Math.min(t,e.xem)}),i=-Math.min(t,-i)}gs.samplesForEach(e,function(e){e.moveX(Math.max(0,e.xem+i))})},gs.samplesSlip=function(e,i){i/=ui.BPMem,gs.samplesForEach(e,function(e){e.slip(e.wsample.offset-i)})},gs.samplesUnselect=function(){gs.selectedSamples.forEach(function(e){e.select(!1)}),gs.selectedSamples=[]},gs.Sample=function(e,i,t){this.gsfile=e,this.jqSample=$(Handlebars.templates.sample(e)),this.jqWaveformWrapper=this.jqSample.find(".waveformWrapper"),this.elSVG=this.jqSample.find("svg")[0],this.jqName=this.jqSample.find(".name"),this.jqCropStart=this.jqSample.find(".crop.start"),this.jqCropEnd=this.jqSample.find(".crop.end");var s=this;this.jqSample.find("*").each(function(){this.gsSample=s}),e.file&&(this.wsample=e.wbuff.createSample(),this.inTrack(i),this.moveX(t),ui.CSS_sampleDuration(this),ui.CSS_sampleWaveform(this),wa.composition.addSamples([this.wsample])),this.select(!1)},gs.Sample.prototype.cut=function(e){if(this.wsample&&this.wsample.duration>e){var i=gs.sampleCreate(this.gsfile,this.track.id,(this.wsample.when+e)*ui.BPMem);i.slip(this.wsample.offset+e),i.duration(this.wsample.duration-e),this.duration(e)}},gs.Sample.prototype["delete"]=function(){this.wsample&&(this.wsample.stop(),this.track.removeSample(this),wa.composition.removeSamples([this.wsample],"rm"),ui.CSS_sampleDelete(this))},gs.Sample.prototype.duration=function(e){this.wsample&&(this.wsample.duration=Math.max(0,Math.min(e,this.wsample.bufferDuration)),ui.CSS_sampleDuration(this))},gs.Sample.prototype.inTrack=function(e){var i=ui.tracks[e];i!==this.track&&this.wsample&&(this.wsample.disconnect(),this.wsample.connect(i.wfilters),this.track&&this.track.removeSample(this),this.track=i,this.track.samples.push(this),ui.CSS_sampleTrack(this))},gs.Sample.prototype.moveX=function(e){this.wsample&&(this.xem=e,this.when(e/ui.BPMem))},gs.Sample.prototype.mute=function(){lg("sample muted (in development)")},gs.Sample.prototype.select=function(e){this.wsample&&(this.selected=e,ui.CSS_sampleSelect(this))},gs.Sample.prototype.slip=function(e){this.wsample&&(this.wsample.offset=Math.min(this.wsample.bufferDuration,Math.max(e,0)),ui.CSS_sampleOffset(this))},gs.Sample.prototype.when=function(e){this.wsample&&(this.wsample.when=e,ui.CSS_sampleWhen(this))},window.onhashchange=function(){ui.toggleAbout("#about"===location.hash)},function(){function e(e,i){i=i.originalEvent.deltaY,gs.bpm(gs._bpm+(i>0?-e:i?e:0))}ui.jqBpmA.mousedown(function(){return ui.jqBpmA.toggleClass("clicked"),!1}),ui.jqBpmList.children().mousedown(function(){gs.bpm(+this.textContent)}),ui.jqBody.mousedown(function(){ui.jqBpmA.removeClass("clicked")}),ui.jqBpmInt.on("wheel",e.bind(null,1)),ui.jqBpmDec.on("wheel",e.bind(null,.01))}(),ui.jqTimeline.mouseup(function(e){gs.currentTime(ui.getGridXem(e.pageX)/ui.BPMem)}),ui.jqVisualClockUnits.click(function(e){var i=e.target.className;return"s"!==i&&"b"!==i||ui.setClockUnit(gs.clockUnit=i),!1}),function(){var e,i={files:function(e){var i=e.pageX;ui.setFilesWidth(35>i?0:i)},trackNames:function(e){var i=e.pageX-ui.jqGrid.offset().left;ui.setTrackNamesWidth(35>i?0:i)}},t=!1;$(".extend").mousedown(function(s){0===s.button&&(t=!0,ui.cursor("app","col-resize"),e=i[this.dataset.mousemoveFn])}),ui.jqBody.mouseup(function(e){0===e.button&&t&&(t=!1,ui.cursor("app",null))}).mousemove(function(i){t&&e(i)})}(),ui.jqBody.on({dragover:!1,drop:function(e){e=e.originalEvent;var i=e&&e.dataTransfer,t=!1,s=[];return i.items?extractData(i.items):i.files.length?($.each(i&&i.files,function(){this.type&&"text/plain"!==this.type?s.push(this):t||(t=this,gs.reset())}),gs.load(t).then(function(){loadFile(s)})):alerte("Your browser doesn't support folders."),!1}}),function(){function e(e){return s.every(function(t){return t===e||!i.contains(t)})}var i=ui.jqFileFilters[0].classList,t="used loaded unloaded",s=t.split(" ");ui.jqFileFilters.addClass(t).on({click:!1,contextmenu:!1,mouseup:function(s){var n=s.target;"A"===n.nodeName&&(0===s.button?i.toggle(n.className):2===s.button&&(i.contains(n.className)&&e(n.className)?ui.jqFileFilters.addClass(t):(ui.jqFileFilters.removeClass(t),i.add(n.className))))}})}(),function(){function e(){t&&(ui.selectTool(t),t=null),i=!1}var i,t,s,n=0,o=0;ui.jqWindow.blur(e),ui.jqGridCols.on({wheel:function(e){return"zoom"===ui.currentTool?(ui.tool.zoom.wheel(e.originalEvent),!1):void 0},scroll:function(){ui.gridScrollTop=ui.jqGridCols[0].scrollTop,ui.updateGridTopShadow()}}),ui.jqTrackLines.on({contextmenu:!1,mousedown:function(e){if(!i){i=!0,s=ui.getGridXem(e.pageX),n=e.pageX,
o=e.pageY,2===e.button&&(t=ui.currentTool,ui.selectTool("delete"));var a=ui.tool[ui.currentTool].mousedown;a&&a(e,e.target.gsSample)}}}),ui.jqBody.on({wheel:function(e){return e.ctrlKey?!1:void 0},mousemove:function(e){if(i){var t=ui.tool[ui.currentTool].mousemove,a=ui.getGridXem(e.pageX);t&&t(e,e.target.gsSample,"hand"!==ui.currentTool?(a-s)*ui.gridEm:e.pageX-n,e.pageY-o),s=a,n=e.pageX,o=e.pageY}},mouseup:function(t){if(i){var s=ui.tool[ui.currentTool].mouseup;s&&s(t,t.target.gsSample),e()}}})}(),function(){function e(){a&&ui.selectTool(a),o=a=null}function i(i){var t=i.keyCode,s=ui.tool[ui.currentTool];y[t]=!1,s.keyup&&s.keyup(i),t===o&&(o=null,e())}function t(e){var i,t=e.keyCode;return y[t]||(y[t]=!0,u[t]&&(u[t](e),i=ui.tool[ui.currentTool].keydown,i&&i(e))),j.indexOf(t)>-1?!1:void 0}function s(e){a=ui.currentTool,ui.selectTool(e)}function n(e,i){o||(o=e,s(i))}ui.jqWindow.blur(e),ui.jqBody.keydown(t).keyup(i);var o,a,u={},r=8,l=16,c=17,d=18,m=32,f=46,p=27,h=66,g=67,w=68,v=71,S=72,T=77,C=83,q=86,k=90,j=[m,r,d],y=[];u[f]=gs.samplesDelete,u[v]=ui.toggleMagnetism,u[d]=n.bind(null,d,"hand"),u[c]=n.bind(null,c,"zoom"),u[l]=n.bind(null,l,"select"),u[h]=s.bind(null,"paint"),u[w]=s.bind(null,"delete"),u[T]=$.noop,u[C]=s.bind(null,"slip"),u[S]=s.bind(null,"hand"),u[k]=s.bind(null,"zoom"),u[g]=function(e){e.ctrlKey?gs.samplesCopy():s("cut")},u[q]=function(e){e.ctrlKey?gs.samplesPaste():s("select")},u[m]=function(e){gs.fileStop(),e.ctrlKey?gs.playToggle():gs.isPlaying?gs.stop():gs.play()},u[p]=function(){ui.jqAbout.hasClass("show")&&(ui.toggleAbout(!1),location.hash="")}}(),ui.jqPlay.click(function(){gs.fileStop(),gs.playToggle()}),ui.jqStop.click(function(){gs.fileStop(),gs.stop()}),wa.composition.onended(gs.stop),ui.jqWindow.on("resize",ui.resize),ui.jqBtnSave.click(function(){ui.jqBtnSave.attr(gs.save())}),ui.jqBtnMagnet.click(ui.toggleMagnetism),ui.jqBtnTools.tool={},ui.jqBtnTools.each(function(){ui.jqBtnTools.tool[this.dataset.tool]=this}).click(function(){ui.selectTool(this.dataset.tool)}),function(){var e;ui.tool.cut={mousedown:function(i,t){e=t},mouseup:function(i){e&&gs.samplesCut(e,ui.getGridXem(i.pageX)/ui.BPMem),e=null}}}(),ui.tool["delete"]={mousedown:function(e,i){gs.sampleDelete(i)},mousemove:function(e,i){gs.sampleDelete(i)}},ui.tool.hand={start:function(){ui.cursor("grid","grab")},end:function(){ui.cursor("grid",null)},mousedown:function(){ui.cursor("app","grabbing")},mouseup:function(){ui.cursor("app",null)},mousemove:function(e,i,t,s){ui.setTrackLinesLeft(ui.trackLinesLeft+t),ui.setGridScrollTop(ui.gridScrollTop-s),ui.updateTimeline(),ui.updateTrackLinesBg()}},ui.tool.mute={mousedown:function(e,i){i&&i.mute()},mousemove:function(e,i){i&&i.mute()}},function(){var e,i,t,s;ui.tool.paint={mousedown:function(n,o){o?(t=n.target.classList.contains("start"),s=n.target.classList.contains("end"),i=t||s,i&&o[t?"jqCropStart":"jqCropEnd"].addClass("hover"),e=o,ui.cursor("app",i?t?"w-resize":"e-resize":"grabbing")):gs.samplesUnselect()},mouseup:function(){e&&(gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),i&&(e[t?"jqCropStart":"jqCropEnd"].removeClass("hover"),i=t=s=!1),e=null,ui.cursor("app",null))},mousemove:function(t,n,o,a){if(e)if(o/=ui.gridEm,i)s?gs.samplesDuration(e,o):(o=-gs.samplesDuration(e,-o))&&(gs.samplesMoveX(e,o),gs.samplesSlip(e,-o));else{gs.samplesMoveX(e,o),t=t.target;var u,r=1/0,l=t.uitrack||t.gsSample&&t.gsSample.track;l&&(e.selected?(u=l.id-e.track.id,0>u&&(gs.selectedSamples.forEach(function(e){r=Math.min(e.track.id,r)}),u=-Math.min(r,-u)),gs.selectedSamples.forEach(function(e){e.inTrack(e.track.id+u)})):e.inTrack(l.id))}}}}(),function(){var e,i,t,s,n,o,a=0,u=$("<div id='squareSelection'>");ui.tool.select={mousedown:function(t,s){n=!0,e=t.pageX,i=t.pageY,t.shiftKey||gs.samplesUnselect(),s&&gs.sampleSelect(s,!s.selected)},mouseup:function(){n=o=!1,ui.css(u[0],"width","0px"),ui.css(u[0],"height","0px"),u.detach()},mousemove:function(r){if(n){var l,c,d=r.pageX,m=r.pageY;if(!o&&Math.max(Math.abs(d-e),Math.abs(m-i))>5&&(++a,o=!0,t=ui.getTrackFromPageY(i).id,s=ui.getGridXem(e),u.appendTo(ui.jqTrackLines)),o){l=ui.getTrackFromPageY(m),l=l?l.id:0,c=Math.max(0,ui.getGridXem(d));var f=Math.min(t,l),p=Math.max(t,l),h=Math.min(s,c),g=Math.max(s,c);gs.samples.forEach(function(e){var i,t,s=e.track.id;if(e.wsample){if(s>=f&&p>=s&&(i=e.xem,t=i+e.wsample.duration*ui.BPMem,i>=h&&g>i||t>h&&g>=t||h>=i&&t>=g))return void(e.selected||(e.squareSelected=a,gs.sampleSelect(e,!0)));e.squareSelected===a&&gs.sampleSelect(e,!1)}}),ui.css(u[0],"top",f+"em"),ui.css(u[0],"left",h+"em"),ui.css(u[0],"width",g-h+"em"),ui.css(u[0],"height",p-f+1+"em")}}}}}(),function(){var e;ui.tool.slip={mousedown:function(i,t){e=t},mouseup:function(){e&&gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),e=null},mousemove:function(i,t,s){e&&gs.samplesSlip(e,s/ui.gridEm)}}}(),function(){function e(e,i){ui.setGridZoom(ui.gridZoom*i,e.pageX-ui.filesWidth-ui.trackNamesWidth,e.pageY-ui.gridColsY)}ui.tool.zoom={start:function(){ui.cursor("grid","zoom-in")},end:function(){ui.cursor("grid",null)},keydown:function(e){18===e.keyCode&&ui.cursor("grid","zoom-out")},keyup:function(e){18===e.keyCode&&ui.cursor("grid","zoom-in")},wheel:function(i){e(i,i.deltaY<0?1.1:.9)},mousedown:function(i){0===i.button&&e(i,i.altKey?.7:1.3)}}}(),ui.resize(),ui.setFilesWidth(200),ui.setTrackLinesLeft(0),ui.setTrackNamesWidth(125),ui.setGridZoom(1.5,0,0),ui.analyserToggle(!0),ui.toggleMagnetism(!0),ui.updateTrackLinesBg(),gs.bpm(120),gs.currentTime(0),ui.jqBtnTools.filter("[data-tool='paint']").click(),ui.jqVisualClockUnits.find(".s").click();for(var i=0;42>i;++i)ui.newTrack();window.onhashchange();