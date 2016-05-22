"use strict";function walContext(){this.ctx=new AudioContext,this.destination=this.ctx.destination,this.filters=this.createFilters(),this.buffers=[],this.compositions=[],this.nbPlaying=0,this.filters.connect(this.destination),this.nodeIn=this.filters.nodeIn,delete this.filters.connect}walContext.prototype={gain:function(i){return arguments.length?(this.filter.gain(i),this):this.filter.gain()},createBuffer:function(i,t){var e=new walContext.Buffer(this,i,t);return this.buffers.push(e),e},createFilters:function(){return new walContext.Filters(this)},createComposition:function(){var i=new walContext.Composition(this);return this.compositions.push(i),i}},function(){function i(i){var t,e=null,n=0;i.wSamples.forEach(function(i){t=i.getEndTime(),t>n&&(n=t,e=i)}),i.lastSample=e,i.duration=e?e.getEndTime():0}function t(t){clearTimeout(t.playTimeoutId),i(t);var e=t.duration&&t.duration-t.currentTime();0>=e?t.onended():t.playTimeoutId=setTimeout(t.onended.bind(t),1e3*e)}function e(i,t){var e=i.when-t,n=e>=0?i.offset:i.offset-e;i.start(e,Math.max(n,0))}function n(i,n,s,o){var a=i.currentTime();n.getEndTime()>a&&"rm"!==s&&(n.load(),e(n,a)),i.lastSample===o&&"mv"!==s||t(i)}function s(i){clearTimeout(i.playTimeoutId),i.wSamples.forEach(function(i){i.stop()})}function o(i){var t=i.currentTime();i.wSamples.forEach(function(i){i.getEndTime()>t&&i.load()})}function a(i){var n=i.currentTime();i.wSamples.forEach(function(i){i.getEndTime()>n&&e(i,n)}),t(i)}walContext.Composition=function(i){this.wCtx=i,this.wSamples=[],this.lastSample=null,this.isPlaying=this.isPaused=!1,this.duration=this.startedTime=this._currentTime=0,this.fnOnended=this.fnOnpaused=function(){}},walContext.Composition.prototype={addSamples:function(i){var t=this;return i.forEach(function(i){t.wSamples.indexOf(i)<0&&(t.wSamples.push(i),i.setComposition(i),t.update(i))}),this},removeSamples:function(i){var t,e=this;return i.forEach(function(i){t=e.wSamples.indexOf(i),t>-1&&(e.wSamples.splice(t,1),i.setComposition(null),e.update(i,"rm"))}),this},update:function(t,e){var s,o=this,a=this.lastSample;return i(this),this.isPlaying&&(t.started?(s=t.fnOnended,t.onended(function(){n(o,t,e,a),s(),t.onended(s)}),t.stop()):n(this,t,e,a)),this},currentTime:function(i){return arguments.length?(this.isPlaying&&s(this),this._currentTime=Math.max(0,Math.min(i,this.duration)),this.isPlaying&&(this.startedTime=this.wCtx.ctx.currentTime,o(this),a(this)),this):this._currentTime+(this.isPlaying&&wa.wctx.ctx.currentTime-this.startedTime)},play:function(){return this.isPlaying||(this.isPlaying=!0,this.isPaused=!1,this.startedTime=wa.wctx.ctx.currentTime,o(this),a(this)),this},stop:function(){return(this.isPlaying||this.isPaused)&&(s(this),this.onended()),this},pause:function(){this.isPlaying&&(this.isPlaying=!1,this.isPaused=!0,this._currentTime+=wa.wctx.ctx.currentTime-this.startedTime,this.startedTime=0,s(this),this.fnOnpaused())},onended:function(i){return"function"==typeof i?this.fnOnended=i:(this.isPlaying=this.isPaused=!1,this.startedTime=this._currentTime=0,this.fnOnended()),this}}}(),function(){walContext.Buffer=function(i,t,e){function n(i){s.wCtx.ctx.decodeAudioData(i,function(i){s.buffer=i,s.isReady=!0,e&&e(s)})}var s=this,o=new FileReader;this.wCtx=i,this.isReady=!1,t.name?(o.addEventListener("loadend",function(){n(o.result)}),o.readAsArrayBuffer(t)):n(t)},walContext.Buffer.prototype={createSample:function(){var i=new walContext.Sample(this.wCtx,this);return i},getPeaks:function(i,t,e,n){e=e||0,n=n||this.buffer.duration;for(var s,o,a,u=0,r=new Array(t),c=this.buffer.getChannelData(i),l=(n-e)*this.buffer.sampleRate,d=e*this.buffer.sampleRate,h=l/t,m=h/10;t>u;++u){for(s=d+u*h,o=s+h,a=0;o>s;s+=m)a=Math.max(a,Math.abs(c[~~s]));r[u]=a}return r}}}(),function(){function i(i,t,e){i[t]=e[0],i[t+1]=e[1],i[t+2]=e[2],i[t+3]=e[3]}function t(t,e,n,s){var o,a,u,r=e.data,c=0,l=e.width,d=e.height,h=d/2,m=t.getPeaks(0,l),f=t.buffer.numberOfChannels>1?t.getPeaks(1,l):m;if(s){for(;c<r.length;c+=4)i(r,c,n);n=[0,0,0,0]}for(c=0;l>c;++c){for(a=~~(h*(1-m[c])),u=~~(h*(1+f[c])),o=a;u>=o;++o)i(r,4*(o*l+c),n);i(r,4*(h*l+c),n)}return e}walContext.Buffer.prototype.drawWaveform=function(i,e){return t(this,i,e)},walContext.Buffer.prototype.drawInvertedWaveform=function(i,e){return t(this,i,e,!0)}}(),walContext.Filters=function(i){this.wCtx=i,this.nodes=[],this.nodeIn=i.ctx.createGain(),this.nodeOut=i.ctx.createGain(),this.nodeIn.connect(this.nodeOut),this.connect(i)},walContext.Filters.prototype={connect:function(i){i=i.nodeIn||i,i instanceof AudioNode&&(this.connectedTo=i,this.nodeOut.connect(i))},disconnect:function(){this.nodeOut.disconnect(),this.connectedTo=null},empty:function(){this.nodes.length&&(this.nodes[this.nodes.length-1].disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut),this.nodes=[])},gain:function(i){return arguments.length?void(this.nodeOut.gain.value=i):this.nodeOut.gain.value},pushBack:function(i){if(this.nodes.length){var t=this.nodes[this.nodes.length-1];t.disconnect(),t.connect(i)}else this.nodeIn.disconnect(),this.nodeIn.connect(i);i.connect(this.nodeOut),this.nodes.push(i)},pushFront:function(i){this.nodes.length?(this.nodeIn.disconnect(),this.nodeIn.connect(i),i.connect(this.nodes[0]),this.nodes.unshift(i)):this.pushBack(i)},popBack:function(){var i=this.nodes.pop();if(i)if(i.disconnect(),this.nodes.length){var t=this.nodes[this.nodes.length-1];t.disconnect(),t.connect(this.nodeOut)}else this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut);return i},popFront:function(){var i=this.nodes.shift();return i&&(i.disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodes[0]||this.nodeOut)),i}},walContext.Sample=function(i,t,e){this.wCtx=i,this.wBuffer=t,this.connectedTo=e?e.nodeIn:i.nodeIn,this.when=this.offset=0,this.duration=t.buffer.duration,this.bufferDuration=t.buffer.duration,this.composition=null,this.fnOnended=function(){},this.loaded=this.started=this.playing=!1},walContext.Sample.prototype={connect:function(i){return i=i.nodeIn||i,i instanceof AudioNode&&(this.connectedTo=i,this.source&&this.source.connect(i)),this},disconnect:function(){return this.source&&(this.source.disconnect(),this.connectedTo=null),this},setComposition:function(i){this.composition=i},load:function(){return this.loaded||(this.loaded=!0,this.source=this.wCtx.ctx.createBufferSource(),this.source.buffer=this.wBuffer.buffer,this.source.onended=this.onended.bind(this),this.connectedTo&&this.source.connect(this.connectedTo)),this},start:function(i,t,e){function n(){++s.wCtx.nbPlaying,s.playing=!0}if(this.loaded)if(this.started)console.warn("WebAudio Library: can not start a sample twice.");else{var s=this;this.started=!0,i=void 0!==i?i:this.when,this.source.start(this.wCtx.ctx.currentTime+i,void 0!==t?t:this.offset,void 0!==e?e:this.duration),i?this.playTimeoutId=setTimeout(n,1e3*i):n()}else console.warn("WebAudio Library: can not start an unloaded sample.");return this},stop:function(){return this.started&&(this.source.onended=null,this.source.stop(0),this.onended()),this},getEndTime:function(){return this.when+Math.min(this.duration,this.bufferDuration-this.offset)},onended:function(i){return"function"==typeof i?this.fnOnended=i:this.loaded&&(this.playing&&(this.playing=!1,--this.wCtx.nbPlaying),this.started&&(this.started=!1,clearTimeout(this.playTimeoutId)),this.loaded=!1,this.source=null,this.fnOnended()),this}},function(){function i(t){for(var e,n=t.firstChild;null!==n;)i(e=n),n=n.nextSibling,1!==e.nodeType&&/^\s*$/.test(e.textContent)&&t.removeChild(e)}i(document.body)}(),window.ui={jqWindow:$(window),jqBody:$("body"),jqVisual:$("#visual"),jqVisualCanvas:$("#visual canvas"),jqClockMin:$("#visual .clock .min"),jqClockSec:$("#visual .clock .sec"),jqClockMs:$("#visual .clock .ms"),jqMenu:$("#menu"),jqPlay:$("#menu .btn.play"),jqStop:$("#menu .btn.stop"),jqBpmA:$("#menu .bpm .a-bpm"),jqBpmInt:$("#menu .bpm .int"),jqBpmDec:$("#menu .bpm .dec"),jqBpmList:$("#menu .bpm-list"),jqBtnTools:$("#menu .tools [data-tool]"),jqBtnMagnet:$("#menu .tools .magnet"),jqFiles:$("#files"),jqFilelist:$("#files .filelist"),jqGrid:$("#grid"),jqGridEm:$("#grid .emWrapper"),jqGridHeader:$("#grid .header"),jqTimeline:$("#grid .timeline"),jqTimeArrow:$("#grid .timeArrow"),jqTimeCursor:$("#grid .timeCursor"),jqTrackList:$("#grid .trackList"),jqGridCols:$("#grid .cols"),jqGridColB:$("#grid .colB"),jqTrackNames:$("#grid .trackNames"),jqTrackLines:$("#grid .trackLines"),jqTrackLinesBg:$("#grid .trackLinesBg"),jqTrackNamesExtend:$("#grid .trackNames .extend")},ui.gridEm=parseFloat(ui.jqGrid.css("fontSize")),ui.tool={},ui.files=[],ui.tracks=[],ui.samples=[],ui.selectedSamples=[],ui.nbTracksOn=0,ui.gridColsY=ui.jqGridCols.offset().top,ui.jqVisualCanvas[0].height=ui.jqVisualCanvas.height(),ui.getGridXem=function(i){var t,e=.25,n=(i-ui.filesWidth-ui.trackNamesWidth-ui.trackLinesLeft)/ui.gridEm;return ui.isMagnetized&&(t=n%e,n-=t,t>e/2&&(n+=e)),n},function(){function i(){var o=e;wa.wctx.nbPlaying&&(o=wa.analyserArray,wa.analyser.getByteTimeDomainData(o)),wa.oscilloscope(n,s,o),t=requestAnimationFrame(i)}var t,e=[],n=ui.jqVisualCanvas[0],s=n.getContext("2d");ui.analyserEnabled=!1,ui.analyserToggle=function(e){"boolean"!=typeof e&&(e=!ui.analyserEnabled),ui.analyserEnabled=e,e?t=requestAnimationFrame(i):(s.clearRect(0,0,n.width,n.height),cancelAnimationFrame(t))}}(),function(){var i,t=$("<div class='cursor'>");ui.playFile=function(e){i&&i.stop(),e.isLoaded&&(e.jqCanvasWaveform.after(t.css("transitionDuration",0).css("left",0)),i=e.wbuff.createSample().onended(ui.stopFile).load().start(),setTimeout(function(){t.css("transitionDuration",e.wbuff.buffer.duration+"s").css("left","100%")},20))},ui.stopFile=function(){i&&(i.stop(),t.detach())}}(),function(){function i(){ui.currentTime(wa.composition.currentTime()),t=requestAnimationFrame(i)}var t;ui.play=function(){ui.jqPlay[0].classList.remove("fa-play"),ui.jqPlay[0].classList.add("fa-pause"),i()},ui.pause=function(){cancelAnimationFrame(t),ui.jqPlay[0].classList.remove("fa-pause"),ui.jqPlay[0].classList.add("fa-play")},ui.stop=function(){ui.pause(),ui.currentTime(0)}}(),ui.selectTool=function(){var i;return function(t){var e=ui.jqBtnTools.tool[t];e!==i&&(i&&i.classList.remove("active"),i=e,ui.jqGrid[0].dataset.tool=ui.currentTool=t,e.classList.add("active"))}}(),ui.BPMem=1,ui.bpm=function(i){var t=~~i,e=Math.min(Math.round(100*(i-t)),99);ui.BPMem=i/60,ui.jqBpmInt.text(100>t?"0"+t:t),ui.jqBpmDec.text(10>e?"0"+e:e)},function(){function i(i){i>0&&ui.jqTimeCursor.add(ui.jqTimeArrow).css("left",i*ui.BPMem+"em"),ui.jqTimeCursor[0].classList.toggle("visible",i>0),ui.jqTimeArrow[0].classList.toggle("visible",i>0)}function t(i){ui._clockTime=i,ui.jqClockMin.text(~~(i/60));var t=~~(i%60);ui.jqClockSec.text(10>t?"0"+t:t),i=Math.round(1e3*(i-~~i)),10>i?i="00"+i:100>i&&(i="0"+i),ui.jqClockMs.text(i)}ui.currentTime=function(e){t(e),i(e)}}(),ui.gridTop=0,ui.setGridTop=function(i){if(i>=0)i=0;else{var t=ui.tracks.length*ui.gridEm-ui.gridColsHeight;-t>i&&(i=-t)}ui.gridTop=i,ui.jqGridCols.css("top",i/ui.gridEm+"em")},ui.gridZoom=1,ui.setGridZoom=function(i,t,e){i=Math.min(Math.max(1,i),8);var n=i/ui.gridZoom;ui.gridZoom=i,ui.gridEm*=n,ui.jqGridEm.css("fontSize",i+"em"),ui.jqGrid.attr("data-sample-size",ui.gridEm<40?"small":ui.gridEm<80?"medium":"big"),ui.setGridTop(e-(-ui.gridTop+e)*n),ui.setTrackLinesLeft(t-(-ui.trackLinesLeft+t)*n),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.setFilesWidth=function(i){ui.jqFiles.css("width",i),ui.filesWidth=i=ui.jqFiles.outerWidth(),ui.gridColsWidth=ui.screenWidth-i,ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.jqGrid.css("left",i),ui.jqVisual.css("width",i+ui.trackNamesWidth),ui.jqMenu.css("left",i+ui.trackNamesWidth),ui.jqVisualCanvas[0].width=ui.jqVisualCanvas.width(),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.setTrackLinesLeft=function(i){ui.trackLinesLeft=i=Math.min(~~i,0),ui.jqTrackLines.css("left",i/ui.gridEm+"em")},ui.trackNamesWidth=0,ui.setTrackNamesWidth=function(i){var t,e=ui.trackNamesWidth;ui.jqTrackNames.css("width",i),ui.trackNamesWidth=i=ui.jqTrackNames.outerWidth(),ui.trackLinesWidth=ui.gridColsWidth-i,t=ui.filesWidth+i,ui.jqGridColB.css("left",i),ui.jqTimeline.css("left",i),ui.jqVisual.css("width",t),ui.jqMenu.css("left",t),ui.jqVisualCanvas[0].width=t,ui.trackLinesLeft<0&&ui.setTrackLinesLeft(ui.trackLinesLeft-(i-e)),ui.updateTimeline(),ui.updateTrackLinesBg(),ui.updateGridBoxShadow()},function(){function i(i){if(i>t){var n,s="",o=t;for(t=i;o++<i;)s+="<div><span></span></div>";n=$(s),ui.jqTimeline.append(n),e.length<2&&(e=e.add(n.eq(0)))}}var t=0,e=$(ui.jqTimeArrow);ui.updateTimeline=function(){var t=ui.trackLinesLeft/ui.gridEm,n=ui.trackLinesWidth/ui.gridEm;i(Math.ceil(-t+n)),e.css("marginLeft",t+"em")}}(),function(){function i(i){var n,s,o,a=i-e,u="";for(e=Math.max(i,e),n=0;a>n;++n){for(u+="<div>",s=0;4>s;++s){for(u+="<div>",o=0;4>o;++o)u+="<div></div>";u+="</div>"}u+="</div>"}ui.jqTrackLinesBg.append(u),t=t||ui.jqTrackLinesBg.children().eq(0)}var t,e=0;ui.updateTrackLinesBg=function(){i(Math.ceil(ui.trackLinesWidth/ui.gridEm/4)+2),t.css("marginLeft",ui.trackLinesLeft/ui.gridEm%8+"em")}}(),ui.updateGridBoxShadow=function(){function i(i,t){return(i=i||t)?(i=Math.min(2-i/8,5),(t?"0px "+i:i+"px 0")+"px 2px rgba(0,0,0,.3)"):"none"}ui.jqGridHeader.css("boxShadow",i(0,ui.gridTop)),ui.jqTrackNames.css("boxShadow",i(ui.trackLinesLeft,0))},ui.resize=function(){ui.screenWidth=ui.jqWindow.width(),ui.screenHeight=ui.jqWindow.height(),ui.gridColsWidth=ui.jqGridCols.width(),ui.gridColsHeight=ui.jqTrackList.height(),ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.updateTimeline(),ui.updateTrackLinesBg()},ui.toggleTracks=function(i){for(var t,e=0,n=i.isOn&&1===ui.nbTracksOn;t=ui.tracks[e++];)t.toggle(n);i.toggle(!0)},ui.isMagnetized=!1,ui.toggleMagnetism=function(i){"boolean"!=typeof i&&(i=!ui.isMagnetized),ui.isMagnetized=i,ui.jqBtnMagnet.toggleClass("active",i)},ui.newFile=function(i){var t=new ui.File(i);ui.files.push(t),ui.jqFilelist.append(t.jqFile)},ui.newTrack=function(){ui.tracks.push(new ui.Track(this))},ui.sampleCreate=function(i,t,e){var n=new ui.Sample(i).inTrack(t).moveX(e);return ui.samples.push(n),wa.composition.addSamples([n.wsample]),n},ui.sampleSelect=function(i,t){i&&i.selected!==t&&(i.select(t),t?ui.selectedSamples.push(i):ui.selectedSamples.splice(ui.selectedSamples.indexOf(i),1))},ui.sampleDelete=function(i){i&&(ui.sampleSelect(i,!1),ui.samples.splice(ui.samples.indexOf(i),1),i["delete"]())},ui.samplesForEach=function(i,t){i&&(i.selected?ui.selectedSamples.forEach(t):t(i))},ui.samplesMoveX=function(i,t){if(i.selected&&0>t){var e=1/0;ui.selectedSamples.forEach(function(i){e=Math.min(e,i.xem)}),t=-Math.min(e,-t)}ui.samplesForEach(i,function(i){i.moveX(Math.max(0,i.xem+t))})},ui.samplesSlip=function(i,t){t/=ui.BPMem,ui.samplesForEach(i,function(i){i.slip(i.wsample.offset-t)})},ui.samplesUnselect=function(){ui.selectedSamples.forEach(function(i){i.select(!1)}),ui.selectedSamples=[]},ui.File=function(i){var t=this;this.file=i,this.fullname=i.name,this.name=i.name.replace(/\.[^.]+$/,""),this.isLoaded=this.isLoading=!1,this.jqFile=$("<a class='sample to-load' draggable='true'>"),this.jqName=$("<span class='text-overflow'>").appendTo(this.jqFile).text(this.name),this.jqToLoad=$("<i class='to-load fa fa-fw fa-download'>").prependTo(this.jqName),this.jqFile.on({contextmenu:!1,dragstart:this.dragstart.bind(this),mousedown:function(i){0!==i.button&&ui.stopFile()},click:function(){t.isLoaded?ui.playFile(t):t.isLoading||t.loaded()}})},function(){var i,t;ui.jqBody.mousemove(function(e){i&&t.css({left:e.pageX,top:e.pageY})}).mouseup(function(e){if(i){var n=Math.floor((e.pageY-ui.gridColsY-ui.gridTop)/ui.gridEm),s=ui.getGridXem(e.pageX);t.remove(),n>=0&&s>=0&&ui.sampleCreate(i,n,s),i=null}}),ui.File.prototype.dragstart=function(e){if(this.isLoaded&&!i){i=this,t=this.jqCanvasWaveform.clone();var n=t[0];n.getContext("2d").drawImage(this.jqCanvasWaveform[0],0,0,n.width,n.height),t.addClass("dragging").css({left:e.pageX,top:e.pageY}).appendTo(ui.jqBody)}return!1}}(),ui.File.prototype.loaded=function(){var i=this;this.isLoading=!0,this.jqToLoad.removeClass("fa-downloads").addClass("fa-refresh fa-spin"),wa.wctx.createBuffer(this.file,function(t){var e,n,s;i.wbuff=t,i.isLoaded=!0,i.isLoading=!1,i.jqFile.removeClass("to-load"),i.jqToLoad.remove(),i.jqCanvasWaveform=$("<canvas class='waveform'>"),e=i.jqCanvasWaveform[0],n=e.getContext("2d"),e.width=400,e.height=50,s=n.createImageData(e.width,e.height),t.drawWaveform(s,[57,57,90,255]),n.putImageData(s,0,0),i.jqFile.prepend(e),ui.playFile(i)})},ui.Track=function(i,t){t=t||{},this.grid=i,this.id=ui.tracks.length,this.jqColNamesTrack=$("<div class='track'>").appendTo(ui.jqTrackNames),this.jqColLinesTrack=$("<div class='track'>").appendTo(ui.jqTrackLines),this.jqColNamesTrack[0].uitrack,this.jqColLinesTrack[0].uitrack=this,this.wfilters=wa.wctx.createFilters(),this.initToggle().initEditName().toggle(t.toggle!==!1).editName(t.name||"")},ui.Track.prototype.initEditName=function(){var i=this;return this.jqName=$("<span class='name text-overflow'>").appendTo(this.jqColNamesTrack).dblclick(this.editName.bind(this,!0)),this.jqNameInput=$("<input type='text'/>").appendTo(this.jqColNamesTrack).blur(function(){i.editName(this.value).editName(!1)}).keydown(function(t){13!==t.keyCode&&27!==t.keyCode||i.editName(13===t.keyCode?this.value:i.name).editName(!1),t.stopPropagation()}),this},ui.Track.prototype.editName=function(i){var t=this.jqNameInput[0],e="Track "+(this.id+1);return"string"==typeof i?(i=i.replace(/^\s+|\s+$/,"").replace(/\s+/g," "),i=i===e?"":i,this.jqName.toggleClass("empty",""===i).text(i||e),this.name=i):i?(this.jqColNamesTrack.addClass("editing"),t.value=this.name||e,t.focus(),t.select()):(t.blur(),this.jqColNamesTrack.removeClass("editing")),this},ui.Track.prototype.initToggle=function(){var i=this;return this.jqToggle=$("<a class='toggle'>").appendTo(this.jqColNamesTrack).on("contextmenu",!1).mousedown(function(t){0===t.button?i.toggle():2===t.button&&ui.toggleTracks(i)}),this},ui.Track.prototype.toggle=function(i){return"boolean"!=typeof i&&(i=!this.isOn),this.isOn!==i&&(this.wfilters.gain(+i),this.isOn=i,this.grid.nbTracksOn+=i?1:-1,this.jqToggle.toggleClass("on",i),this.jqColNamesTrack.add(this.jqColLinesTrack).toggleClass("off",!i)),this},ui.Sample=function(i){var t,e,n;this.uifile=i,this.wbuff=i.wbuff,this.wsample=this.wbuff.createSample(),this.jqSample=$("<div class='sample'>"),this.jqWaveformWrapper=$("<div class='waveformWrapper'>").appendTo(this.jqSample),this.jqWaveform=$("<canvas class='waveform'>").appendTo(this.jqWaveformWrapper),t=this.jqWaveform[0],e=t.getContext("2d"),t.width=~~(300*this.wbuff.buffer.duration),t.height=50,n=e.createImageData(t.width,t.height),this.wbuff.drawWaveform(n,[221,221,255,255]),e.putImageData(n,0,0),this.jqName=$("<span class='text-overflow'>").text(i.name).appendTo(this.jqSample),this.jqName[0].uisample=this.jqWaveformWrapper[0].uisample=this.jqWaveform[0].uisample=this,this.updateCSS_width(),this.select(!1)},ui.Sample.prototype.when=function(i){return this.wsample.when=i,this.updateCSS_when(),this},ui.Sample.prototype.slip=function(i){return this.wsample.offset=Math.min(this.wbuff.buffer.duration,Math.max(i,0)),this.updateCSS_offset(),this},ui.Sample.prototype.mute=function(){return lg("sample muted (in development)"),this},ui.Sample.prototype.select=function(i){return this.selected=i,this.jqSample.toggleClass("selected",i),this},ui.Sample.prototype["delete"]=function(){return this.jqSample.remove(),this.wsample.stop(),wa.composition.removeSamples([this.wsample],"rm"),this},ui.Sample.prototype.inTrack=function(i){var t=ui.tracks[i];return t!==this.track&&(this.wsample.disconnect(),this.wsample.connect(t.wfilters),this.track=t,this.track.jqColLinesTrack.append(this.jqSample)),this},ui.Sample.prototype.moveX=function(i){return this.xem=i,this.when(i/ui.BPMem),this},ui.Sample.prototype.updateCSS_when=function(){return this.jqSample.css("left",this.wsample.when*ui.BPMem+"em"),this},ui.Sample.prototype.updateCSS_offset=function(){return this.jqWaveform.css("marginLeft",-this.wsample.offset*ui.BPMem+"em"),this},ui.Sample.prototype.updateCSS_width=function(){return this.jqSample.css("width",this.wbuff.buffer.duration*ui.BPMem+"em"),this},window.wa={},wa.wctx=new walContext,wa.ctx=wa.wctx.ctx,wa.composition=wa.wctx.createComposition(),wa.analyser=wa.ctx.createAnalyser(),wa.analyser.fftSize=1024,wa.wctx.filters.pushBack(wa.analyser),wa.analyserArray=new Uint8Array(wa.analyser.frequencyBinCount),wa.oscilloscope=function(){var i=0,t=Math.PI/2;return function(e,n,s){var o,a=0,u=e.width,r=e.height,c=s.length,l=c/2,d=u/c;for(n.globalCompositeOperation="source-in",n.fillStyle="rgba("+Math.round(255-255*i)+","+Math.round(64*i)+","+Math.round(255*i)+","+(.95-.25*(1-Math.cos(i*t)))+")",n.fillRect(0,0,u,r),i=0,n.globalCompositeOperation="source-over",n.save(),n.translate(0,r/2),n.beginPath(),n.moveTo(0,0);c>a;++a)o=(s[a]-128)/128,i=Math.max(Math.abs(o),i),o*=.5-Math.cos((l>a?a:c-a)/l*Math.PI)/2,n.lineTo(a*d,o*r);n.lineJoin="round",n.lineWidth=1+Math.round(2*i),n.strokeStyle="rgba(200,200,255,"+Math.min(5*i,1)+")",n.stroke(),n.restore()}}(),window.gs={},gs.bpm=function(i){if(!arguments.length)return gs._bpm;var t=gs.currentTime()*ui.BPMem;gs._bpm=Math.max(20,Math.min(i,999)),ui.bpm(gs._bpm),ui.samples.forEach(function(i){i.wsample.when=i.xem/ui.BPMem,i.updateCSS_width(),i.updateCSS_offset()}),gs.currentTime(t/ui.BPMem)},gs.currentTime=function(i){return arguments.length?(wa.composition.currentTime(i),void ui.currentTime(wa.composition.currentTime())):wa.composition.currentTime()},gs.playToggle=function(i){"boolean"!=typeof i&&(i=!wa.composition.isPlaying),i?gs.play():gs.pause()},gs.play=function(){!wa.composition.isPlaying&&ui.samples.length&&(wa.composition.play(),wa.composition.isPlaying&&ui.play())},gs.pause=function(){wa.composition.isPlaying&&(wa.composition.pause(),ui.pause())},gs.stop=function(){wa.composition.stop(),gs.currentTime(0),ui.stop()},function(){function i(i,t){t=t.originalEvent.deltaY,gs.bpm(gs._bpm+(t>0?-i:t?i:0))}ui.jqBpmA.mousedown(function(){return ui.jqBpmA.toggleClass("clicked"),!1}),ui.jqBpmList.children().mousedown(function(){gs.bpm(+this.textContent)}),ui.jqBody.mousedown(function(){ui.jqBpmA.removeClass("clicked")}),ui.jqBpmInt.on("wheel",i.bind(null,1)),ui.jqBpmDec.on("wheel",i.bind(null,.01))}(),ui.jqTimeline.mouseup(function(i){gs.currentTime(ui.getGridXem(i.pageX)/ui.BPMem)}),function(){var i,t=!1,e={files:function(i){var t=i.pageX;ui.setFilesWidth(35>t?0:t)},trackNames:function(i){var t=i.pageX-ui.jqGrid.offset().left;ui.setTrackNamesWidth(35>t?0:t)}};$(".extend").mousedown(function(n){0===n.button&&(t=!0,ui.jqBody.addClass("cursor-ewResize"),i=e[this.dataset.mousemoveFn])}),ui.jqBody.mouseup(function(i){0===i.button&&t&&(t=!1,ui.jqBody.removeClass("cursor-ewResize"))}).mousemove(function(e){t&&i(e)})}(),ui.jqBody.on({dragover:!1,drop:function(i){i=i.originalEvent;var t=i&&i.dataTransfer;return $.each(t&&t.files,function(){ui.newFile(this)}),!1}}),function(){function i(){e&&(ui.selectTool(e),e=null),t=!1}var t,e,n,s=0,o=0;ui.jqWindow.blur(i),ui.jqTrackLines.on({contextmenu:!1,mousedown:function(i){if(!t){t=!0,n=ui.getGridXem(i.pageX),s=i.pageX,o=i.pageY,2===i.button&&(e=ui.currentTool,ui.selectTool("delete"));var a=ui.tool[ui.currentTool].mousedown;a&&a(i,i.target.uisample)}}}),ui.jqGrid.on("wheel",function(i){i=i.originalEvent,"zoom"===ui.currentTool?ui.tool.zoom.wheel(i):ui.setGridTop(ui.gridTop+(i.deltaY<0?.9:-.9)*ui.gridEm),ui.updateGridBoxShadow()}),ui.jqBody.on({mousemove:function(i){if(t){var e=ui.tool[ui.currentTool].mousemove,a=ui.getGridXem(i.pageX);e&&e(i,i.target.uisample,"hand"!==ui.currentTool?(a-n)*ui.gridEm:i.pageX-s,i.pageY-o),n=a,s=i.pageX,o=i.pageY}},mouseup:function(e){if(t){var n=ui.tool[ui.currentTool].mouseup;n&&n(e,e.target.uisample),i()}},wheel:function(i){return i.ctrlKey?!1:void 0}})}(),function(){function i(){t&&(ui.selectTool(t),t=null)}var t,e={16:"select",86:"select",66:"paint",68:"delete",77:"mute",83:"slip",67:"cut",32:"hand",72:"hand",17:"zoom",90:"zoom"};ui.jqWindow.blur(i),ui.jqBody.keydown(function(i){if(i=i.keyCode,8===i)return ui.toggleMagnetism(),!1;var n=e[i];n&&n!==ui.currentTool&&(16!==i&&17!==i&&32!==i||(t=ui.currentTool),ui.selectTool(n))}).keyup(function(t){t=t.keyCode,16!==t&&17!==t&&32!==t||i()})}(),ui.jqPlay.click(gs.playToggle),ui.jqStop.click(function(){ui.stopFile(),gs.stop()}),wa.composition.onended(ui.stop),ui.jqWindow.on("resize",ui.resize),ui.jqBtnMagnet.click(ui.toggleMagnetism),ui.jqBtnTools.tool={},ui.jqBtnTools.each(function(){ui.jqBtnTools.tool[this.dataset.tool]=this}).click(function(){ui.selectTool(this.dataset.tool)}),ui.tool["delete"]={mousedown:function(i,t){ui.sampleDelete(t)},mousemove:function(i,t){ui.sampleDelete(t)}},ui.tool.hand={mousedown:function(){ui.jqBody.addClass("cursor-move")},mouseup:function(){ui.jqBody.removeClass("cursor-move")},mousemove:function(i,t,e,n){ui.setTrackLinesLeft(ui.trackLinesLeft+e),ui.setGridTop(ui.gridTop+n),ui.updateTimeline(),ui.updateTrackLinesBg(),ui.updateGridBoxShadow()}},ui.tool.mute={mousedown:function(i,t){t&&t.mute()},mousemove:function(i,t){t&&t.mute()}},function(){var i;ui.tool.paint={mousedown:function(t,e){i=e},mouseup:function(){i&&(ui.samplesForEach(i,function(i){wa.composition.update(i.wsample,"mv")}),i=null)},mousemove:function(t,e,n,s){if(i){ui.samplesMoveX(i,n/ui.gridEm),t=t.target;var o,a=1/0,u=t.uitrack||t.uisample&&t.uisample.track;u&&(i.selected?(o=u.id-i.track.id,0>o&&(ui.selectedSamples.forEach(function(i){a=Math.min(i.track.id,a)}),o=-Math.min(a,-o)),ui.selectedSamples.forEach(function(i){i.inTrack(i.track.id+o)})):i.inTrack(u.id))}}}}(),ui.tool.select={mousedown:function(i,t){i.shiftKey||ui.samplesUnselect(),t&&ui.sampleSelect(t,!t.selected)}},function(){var i;ui.tool.slip={mousedown:function(t,e){i=e},mouseup:function(){i&&ui.samplesForEach(i,function(i){wa.composition.update(i.wsample,"mv")}),i=null},mousemove:function(t,e,n){i&&ui.samplesSlip(i,n/ui.gridEm)}}}(),function(){function i(i,t){ui.setGridZoom(ui.gridZoom*t,i.pageX-ui.filesWidth-ui.trackNamesWidth,i.pageY-ui.gridColsY)}ui.tool.zoom={wheel:function(t){i(t,t.deltaY<0?1.1:.9)},mousedown:function(t){0===t.button&&i(t,t.altKey?.8:1.2)}}}(),ui.resize(),ui.setFilesWidth(200),ui.setTrackLinesLeft(0),ui.setTrackNamesWidth(125),ui.setGridZoom(1.5,0,0),ui.analyserToggle(!0),ui.toggleMagnetism(!0),ui.updateTrackLinesBg(),gs.bpm(120),gs.currentTime(0),ui.jqBtnTools.filter("[data-tool='paint']").click();