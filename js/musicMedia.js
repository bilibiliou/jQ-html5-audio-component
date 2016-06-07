(function (jQuery) {
    // polyfill
    /** Object.assign **/
    if (!Object.assign) {
      Object.defineProperty(Object, "assign", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function(target, firstSource) {
          "use strict";
          if (target === undefined || target === null)
            throw new TypeError("Cannot convert first argument to object");
          var to = Object(target);
          for (var i = 1; i < arguments.length; i++) {
            var nextSource = arguments[i];
            if (nextSource === undefined || nextSource === null) continue;
            var keysArray = Object.keys(Object(nextSource));
            for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
              var nextKey = keysArray[nextIndex];
              var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
              if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
            }
          }
          return to;
        }
      });
    }

    // init
    var musicMedia = $(".musicMedia-wrap")
    
    // 界面初始化
    musicMedia.html('<div class="musicMedia-player">' +
            '<div class="musicMedia-player-header-options clear-select">' +
                '<i class="musicMedia-player-header-option musicMedia-player-header-logo"></i>' +            
                '<span class="musicMedia-player-header-title text-ellipsis">' +
                '</span>' +

                '<span class="musicMedia-player-header-singer text-ellipsis"></span>' +
                '<button class="musicMedia-player-header-option musicMedia-player-min" title="最小化"></button>' +
                '<button class="musicMedia-player-header-option musicMedia-player-close" title="关闭"></button>' +
            '</div>' +
            '<audio></audio>' +
            '<figure class="musicMedia-player-album-bg">' +
                '<div class="musicMedia-player-controls">' +
                    '<div class="musicMedia-player-process-wrap">' +
                        '<div class="process-part process-left">' +
                            '<div class="c-process c-process-left"></div>' +
                        '</div>' +
                        '<div class="process-part process-right">' +
                            '<div class="c-process c-process-right"></div>' +
                        '</div>' +
                    '</div>' +
                    '<button class="major-btn">' +
                        '<i class="pause none"></i>' +
                        '<i class="play"></i>' +
                    '</button>' +
                '</div>' +

                '<img alt="alumn">' +
                '<div class="musicMedia-player-album-span"></div>' +
                '<div class="musicMedia-player-album-disc stop">' +
                    '<img alt="alumn">' +
                '</div>' +
            '</figure>' +
            
            '<div class="musicMedia-player-info">' +
                '<button class="music-control prev-muisc" title="上一首"></button>' +
                '<button class="music-control next-muisc" title="下一首"></button>' +
               
                '<div class="music-album-name">' +
                    '<span class="text-ellipsis"></span>' +
                '</div>' +
                
                '<div class="music-favorite-name">' +
                    '<span class="text-ellipsis"></span>' +
                '</div>' +

                '<div class="music-time">' +
                    '<span class="now-time">00:00</span>/' +
                    '<span class="all-time">00:00</span>' +
                '</div>' +
            '</div>' +
            
            '<div class="musicMedia-player-footer-options">' +
                '<div class="musicMedia-player-vol">' +
                    '<div class="musicMedia-player-vol-process" title="声音">' +
                        '<div class="musicMedia-player-vol-process-anchor" title="声音"></div>' +
                    '</div>' +
                '</div>' +

                '<button class="musicMedia-player-muisc-menu" title="歌曲列表"></button>' +
                '<button class="play-mode-list random-play" title="随机播放"></button>' +    
            '</div>' +
        '</div>' +
        
        '<figure class="music-media-bg">' +
            '<img alt="bg">' +
        '</figure>' +

        '<div class="musicMedia-player-list-wrap clear-select n-h">' +
            '<section class="musicMedia-player-list-box">' +
                '<ul class="musicMedia-player-list clearfix">' +
                    '<li class="favorite-list"></li>' +
                    '<li class="music-list"></li>' +
                '</ul>' +    
            '</section>' +

            '<div class="musicMedia-player-list-bg"></div>' +
        '</div>' +

        '<div class="musicMedia-player-minimize clear-select minimize-hidden">' +
            '<i></i>' +
            '<span>音乐歌单</span>' +
        '</div>');

    // music-player
    var playCotBtn = $(".major-btn"),
        playcotBtnPause = $(".major-btn .pause"),
        playcotBtnPlay = $(".major-btn .play"),
        Disc = $(".musicMedia-player-album-disc"),
        playModeList = $(".play-mode-list"),
        playPattern = 2,
        switchPrevMuisc = $(".prev-muisc"),
        switchNextMuisc = $(".next-muisc"),
        btnClose = $(".musicMedia-player-close"),
        playAudio     = $(".musicMedia-wrap audio")[0]

    // music-process
    var playProcessL = $(".c-process-left"),
        playProcessR = $(".c-process-right"),
        pTimer = null,
        pecent = 0
    
    // music-info
    var singerName = $(".musicMedia-player-header-singer"),
        AlbumName = $(".music-album-name span"),
        oTitle = $(".musicMedia-player-header-title"),
        favoriteName = $(".music-favorite-name span"),
        nowTime = $(".now-time"),
        allTime = $(".all-time")

    // music-vol
    var volAnchor = $(".musicMedia-player-vol-process-anchor"),
        volProcess = $(".musicMedia-player-vol-process");
    
    // music-menu
    var btnMenu = $(".musicMedia-player-muisc-menu"),
        oMenu = $(".musicMedia-player-list-wrap"),
        oMenuBox = $(".musicMedia-player-list-box"),
        listBg = $(".musicMedia-player-list-bg"),
        oList = $(".musicMedia-player-list"), 
        domainName = $(".domain-title"),
        favoriteList = $(".favorite-list"),
        musicList = $(".music-list"),
        dropBoff = false

    // music-bg
    var oAlbumBg = $(".musicMedia-player-album-bg img"),
        oDiscPic = $(".musicMedia-player-album-disc img"),
        oPlayBg = $(".music-media-bg img")

    // box-scroll
    var oHeader = $(".musicMedia-player-header-options"),
        playBody = $(".musicMedia-wrap"),
        oW = playBody.outerWidth(),
        oH = playBody.outerHeight(),
        oMenuHeight = oMenuBox.height()

    // minimize or show
    var oMinimize = $(".musicMedia-player-min"),
        oShowPlayBox = $(".musicMedia-player-minimize")

    $.fn.musicMedia = function (options,sources) {

        var param = {
            domainName : "未知站点的",
            defaultBg: "./img/dft-muisc-alumn-bg.jpg"
        }

        var dftFavorite = {
            favoriteName : "音乐收藏夹",
            musicList : []
        }

        Object.assign(param,options);

        var dftMusic = {
            url : "",
            title : "",
            AlbumName : "",
            singer : "",
            AlbumBg : param.defaultBg
        }

        var M = Math,
            random = M.random,
            nowFavorite = 0,     // 现在播放的专辑索引
            nowMusic = 0,        // 现在正在播放的歌曲索引
            showFavorite = 0     // 现在正在展示的专辑索引
            MusicListoLis = null; // 用来存储正在展示的专辑曲目对象 li

        
        var Favorite = sources.map(function (value , idx ,array) {
            var a = {};
            Object.assign(a,dftFavorite,value);
            a.musicList = a.musicList.map(function (value , idx , array) {
                var b = {};
                Object.assign(b,dftMusic,value);
                return b;
            });
            return a;
        });

        // 切换专辑后将对应Music 指向切换！
        var Music = Favorite[nowFavorite].musicList; 
        loadMuisc(nowMusic);

        // 生成专辑列表
        createFavoriteList();
        var favoriteListoLis = $(".favorite-list ol li"),
            favoriteListTitle = $(".musicMedia-player-list-title")  

        createMusicList();
        MusicListoLis = $(".music-list ol li");

        if(param.autoHidden) {
            playBody.css("left" , -oW);
            oShowPlayBox.removeClass("minimize-hidden");
        } 

        if(param.autoplay) {
            play();
        }

        // 下拉列表
        btnMenu.on("click" , function(){
            if (!dropBoff) {
                var h = playBody.offset().top,
                    sct = $(document).scrollTop()
                    
                if(h >= innerHeight+sct-(oH+oMenuHeight)) {
                    playBody.addClass("musicMedia-wrap-t-5");
                    setTimeout(function () {
                        playBody.removeClass("musicMedia-wrap-t-5");
                    },500);
                    playBody.css("top",innerHeight+sct-(oH+oMenuHeight));
                }

                oMenu.removeClass("n-h");

                $(favoriteListTitle).addClass("move-left");
                setTimeout(function () {
                    favoriteListoLis.each(function (idx , value) {
                        $(value).addClass("move-left");
                    })    
                },500);
                    
                dropBoff = true;
            } else {
                favoriteListoLis.each(function (idx , value) {
                    $(value).removeClass("move-left");
                });

                setTimeout(function () {
                    $(favoriteListTitle).removeClass("move-left");
                    setTimeout(function () {
                        oMenu.addClass("n-h"); 
                        dropBoff = false;
                    },200)
                },100);
            }
        });

        // 控制播放
        playCotBtn.on("click" , function () {
            if (playAudio.paused) {
                play();
            } else {
                pause();
            }
        });

        // 切换播放模式
        playModeList.on("click" , function () {
            switch (true) {
                case playModeList.hasClass("single-cycle"):
                    playModeList[0].className = "play-mode-list";
                    playModeList.addClass("random-play");
                    playModeList[0].title = "随机播放";
                    playPattern = 2; 
                    break;
                case playModeList.hasClass("random-play"):
                    playModeList[0].className = "play-mode-list";
                    playModeList.addClass("sequential-play");
                    playModeList[0].title = "顺序播放";
                    playPattern = 3; 
                    break;
                case playModeList.hasClass("sequential-play"):
                    playModeList[0].className = "play-mode-list";
                    playModeList.addClass("single-cycle");
                    playModeList[0].title = "单曲循环";
                    playPattern = 1; 
                    break;
            }
        });

        // 上一首歌
        switchPrevMuisc.on("click" , function () {
            pause();
            restoreProcess();
            prevMuisc();
            play();
        });

        // 下一首歌
        switchNextMuisc.on("click" , function () {
            pause();
            restoreProcess();
            nextMuisc();
            play();
        });

        // 声音拖放
        volAnchor.Drag(function (o) {
            var currWidth = volProcess.css("width"),
                r = o.left;

                if (r > 118) {
                    r = 118
                } else if (r <= 4) {
                    r = 4;
                }
                playAudio.volume = ((r-4)/114).toFixed(2);
                volProcess.css("width" , r);
        });

        // 显示窗口
        oShowPlayBox.on("click",function() {
            playBody.addClass("musicMedia-wrap-t-5");
            playBody.css("left" , 0);
            oShowPlayBox.addClass("minimize-hidden");
            setTimeout(function () {
                playBody.removeClass("musicMedia-wrap-t-5");
            },500);
        });

        // 最小化窗口
        oMinimize.on("click" , function () {
            playBody.addClass("musicMedia-wrap-t-5");
            playBody.css("left" , -oW);
            oShowPlayBox.removeClass("minimize-hidden");
            setTimeout(function () {
                playBody.removeClass("musicMedia-wrap-t-5");
            },500);
        })

        // 关闭窗口
        btnClose.on("click" , function () {
            playBody.remove()
        })

        // 禁止图片拖拽
        playBody.delegate("img" , "dragstart" , function () {
            return false;
        })

        // 下拉滚动
        favoriteList.Scroll();

        // 播放器拖拽
        oHeader.Drag(function (o) {
            var edgeW = innerWidth,
                edgeH = innerHeight,
                scl = $(document).scrollLeft(),
                sct = $(document).scrollTop(),
                l = o.kLeft,
                t = o.kTop,
                z = edgeH+sct-oH,
                v = edgeW+scl-oW

                if (dropBoff) {
                    z = edgeH+sct-(oH+oMenuHeight);
                }

                if (l >= v) {
                    l = v;
                }

                if (l <= scl) {
                    l = scl;
                }

                if (t >= z) {
                    t = z;
                }

                if (t <= sct) {
                    t = sct;
                } 

                playBody.css("left" , l);
                playBody.css("top" , t);
                return false;
        });

        // 专辑列表切换到音乐列表
        favoriteList.delegate("button","click",function(ev) {
            var oTarget = (ev.target.tagName.toLowerCase() === "span") ? ev.target.parentNode : ev.target, 
                index = ~~oTarget.dataset.favoriteIndex

            showFavorite = index;

            createMusicList();
            musicList.Scroll();
            oList.addClass("move-right");
            MusicListoLis = $(".music-list ol li");
        });

        // 音乐列表播放歌曲
        musicList.delegate("button","click",function (ev) {
            var oTarget = (ev.target.tagName.toLowerCase() === "span") ? ev.target.parentNode : ev.target,
                index = ~~oTarget.dataset.musicIndex,
                indexf = ~~oTarget.dataset.favoriteIndex

            // 标记当前正在播放的曲目
            MusicListoLis.eq(nowMusic).removeClass("active");
            nowMusic = index;
            MusicListoLis.eq(nowMusic).addClass("active");

            // 标记当前正在播放的专辑
            favoriteListoLis.eq(nowFavorite).removeClass("active");
            favoriteListoLis.eq(indexf).addClass("active");

            changeNowFavorite(indexf);
            
            clearTimeout(pTimer);
            pause();
            loadMuisc(nowMusic);
            play();
        });

        // 音乐列表回到专辑列表
        musicList.delegate("h2" , "click" , function (ev) {
            var oTarget = (ev.target.tagName.toLowerCase() === "span") ? ev.target.parentNode : ev.target
                oList.removeClass("move-right");
        });

        function loadMuisc (index) {
            playAudio.src = Music[index].url;

            // 加载完Mp3后,就可以修改播放器内的各个值
            playAudio.onloadedmetadata = function () {
                AlbumName.html(Music[nowMusic].AlbumName);
                oTitle.html(Music[nowMusic].title);
                singerName.html(Music[nowMusic].singer);
                allTime.html(getTime(playAudio.duration));
                favoriteName.html(Favorite[nowFavorite].favoriteName);
                oAlbumBg[0].src = Music[nowMusic].AlbumBg;
                oDiscPic[0].src = Music[nowMusic].AlbumBg;
                oPlayBg[0].src = Music[nowMusic].AlbumBg;
            }
        }

        function play () {
            playcotBtnPause.removeClass("none");
            playcotBtnPlay.addClass("none");
            Disc.removeClass("stop");
            Disc.addClass("move");
            setTimeout(function () {
                playAudio.play();
                runProcess();
            },800);
        }

        function pause () {
                playcotBtnPause.addClass("none");
                playcotBtnPlay.removeClass("none");
                Disc.removeClass("move");
                Disc.addClass("stop");
                playAudio.pause();
        }

        function runProcess() {
            pecent = (playAudio.currentTime / playAudio.duration).toFixed(3);
            nowTime.html(getTime(playAudio.currentTime));

            switch (true) {
                case (pecent <= 0.5):
                    playProcessR.css("transform" , "rotate("+(-135+(360*pecent))+"deg)");
                    pTimer = setTimeout(runProcess,1000);
                    break;
                case (pecent > 0.5 && pecent < 1):
                    playProcessR.css("transform" , "rotate(45deg)");
                    playProcessL.css("transform" , "rotate("+(-135+(360*pecent)-180)+"deg)");
                    pTimer = setTimeout(runProcess,1000);
                    break;
                case (pecent >= 1):
                    playProcessL.css("transform" , "rotate(45deg)");
                    stopProcess();
                    break;
            }
        }

        function stopProcess() {
            clearTimeout(pTimer);
            pause();
            changeMusic();
        }

        function restoreProcess () {
            playProcessR.css("transform" , "rotate(-135deg)");
            playProcessL.css("transform" , "rotate(-135deg)");
        }

        function changeMusic() {
            restoreProcess();
            MusicListoLis.eq(nowMusic).removeClass("active");
            switch (playPattern) {
                case 1:
                    break;
                case 2:
                    if (Music.length === 1) {
                        break;
                    } else {
                        var c = ~~(random()*Music.length - 1);
                        if (c>nowMusic-1) {
                            ++c;
                        }
                        nowMusic = c;
                        loadMuisc(nowMusic);
                    }
                    break;
                case 3: 
                    nextMuisc();
                    break;
            }
            MusicListoLis.eq(nowMusic).addClass("active");
            play();
        }

        function prevMuisc() {
            MusicListoLis.eq(nowMusic).removeClass("active");
            if (nowMusic === 0) {
                nowMusic = Music.length - 1;
                loadMuisc(nowMusic);
            } else {
                loadMuisc(--nowMusic);
            }
            MusicListoLis.eq(nowMusic).addClass("active");
        }

        function nextMuisc () {
            MusicListoLis.eq(nowMusic).removeClass("active");
            if (nowMusic === Music.length - 1) {
                nowMusic = 0;
                loadMuisc(nowMusic);
            } else {   
                loadMuisc(++nowMusic);
            }
            MusicListoLis.eq(nowMusic).addClass("active");
        }

        function changeNowFavorite(index) {
            nowFavorite = index;
            Music = Favorite[nowFavorite].musicList;
        }

        function createFavoriteList() {
            var html = '';

            html += '<h2 class="musicMedia-player-list-title">' +
                '<span class="domain-title text-ellipsis">'+ param.domainName +'</span>' +
                '<span class="lists-name"> - 专辑列表 ('+(Favorite.length)+')</span>' +
                '</h2>' +
                '<div class="scroll-box">' +
                '<ol class="clearfix">';

            Favorite.forEach(function (value , idx , array) {
                if ( idx === 0 ) {
                   html += '<li class="active">'; 
                } else {
                    html += '<li>';
                }
                html += '<button data-favorite-index='+idx+' >' +
                            '<span class="favorite-name">'+value.favoriteName+'</span>' +
                        '</button>' +
                    '</li>';
            });
            
            html += '</ol>' +
                    '</div>' +
                    '<div class="scroll-bar-box">' +
                        '<div class="scroll-bar"></div>' +
                    '</div>';    
            favoriteList.html(html);
        }

        function createMusicList () {
            var html = '';

            html += '<h2 class="musicMedia-player-list-title">'+
                        '<i class="back-arrow"></i>' +
                        '<span class="favorite-title text-ellipsis">'+Favorite[showFavorite].favoriteName+'</span>'+
                    '</h2>'+
                    '<div class="scroll-box">' +
                    '<ol class="clearfix">';

            Favorite[showFavorite].musicList.forEach(function (value , idx , array) {
                if ( nowFavorite === showFavorite && nowMusic === idx ) {
                    html += '<li class="active">';
                } else {
                    html += '<li>';
                }

                html += '<button data-favorite-index='+showFavorite+' data-music-index='+idx+'>' +
                            '<span class="muisc-name">'+value.title+'</span>'+
                            '<span class="album-name">'+value.AlbumName+'</span>'+
                            '</button>'+
                        '</li>';
                        
            });
            
            html += '</ol>'+
                '</div>' +
                '<div class="scroll-bar-box">'+
                '<div class="scroll-bar"></div>'+
            '</div>';
            musicList.html(html);
        }

        function Must () {
            throw new Error("这个参数不能少哦");
        }

        function getTime( iNum ) {
            // 因为duration 获取的时间是以秒为单位,并且
            // 先将duration转换为整数
            iNum = ~~( iNum );

            // 获得的秒除3600 , 算算有多少个小时
            var iM = addZero(M.floor(iNum%3600/60));
            var iS = addZero(iNum%60);

            return iM + ':' + iS;
            function addZero( iNum ) {
                if( iNum<=9 ) {
                    return '0' + iNum;
                }
                else {
                    return '' + iNum;
                }
            }
        }
    }

    $.fn.Drag = function (callback) {
        var $self = this;
        $self.on("mousedown" , function (ev) {
            var $left  = ev.clientX - $self.position().left,
                $top   = ev.clientY - $self.position().top,
                $$left = ev.clientX - $self.offset().left,
                $$top  = ev.clientY - $self.offset().top,
                cLeft = $self.offset().left,
                cTop  = $self.offset().top

            $(document).on("mousemove.drag" , function (ev) {
                var top = ev.clientY - $top,
                    left = ev.clientX - $left,
                    kTop = ev.clientY - $$top,
                    kLeft = ev.clientX - $$left,
                    dLeft = cLeft - left,
                    dTop = cTop - top;

                callback && callback({
                    top: top,
                    left: left,
                    kTop: kTop,
                    kLeft: kLeft,
                    cLeft: cLeft,
                    cTop: cTop,
                    pLeft : (left / cLeft) * 100,
                    pTop  : (top / cTop) * 100,
                    dLeft: dLeft,
                    dTop: dTop
                });
            });

            $(document).on("mouseup.drag", function () {
                $(document).off("mousemove.drag");
                $self.off("mouseup.drag");
            });
        });
    }

    $.fn.Scroll = function (callback) {
        var ol = this.find("ol"),
            scrollBox = this.find(".scroll-bar-box"),
            scrollBar = scrollBox.find(".scroll-bar"),
            BoxHeight = scrollBox.outerHeight(),
            mH = ol.outerHeight(),
            minH = 301,
            dH   = mH - minH,
            pBoxHeight = (dH * BoxHeight) / mH,
            barRH = BoxHeight - pBoxHeight
           

        if(dH <= 0) {
            scrollBox.css("display","none");
            return; 
        } else {
            scrollBar.css("height" , barRH); 
        }

        scrollBar.Drag(function (o) {
            var r = o.top;

                if (r > pBoxHeight) {
                    r = pBoxHeight;
                } else if (r<= 0) {
                    r = 0;
                }
            scrollBar.css("top",r);
            ol.css("marginTop" , -((r * dH)/pBoxHeight));
        });

        this.on("mousewheel" , function(ev , delta) {
            // 下滚是 -1 上滚是 1

            var k = scrollBar.position().top,
                scrollRadio = 10,
                r = k + (-delta * scrollRadio);
            
            if (r > pBoxHeight) {
                r = pBoxHeight;
            } else if (r<=0){
                r = 0;
            }

            scrollBar.css("top", r);
            ol.css("marginTop" , -((r * dH)/pBoxHeight));
            return false;
        });
    }
})(jQuery);

(function(a){function d(b){var c=b||window.event,d=[].slice.call(arguments,1),e=0,f=!0,g=0,h=0;return b=a.event.fix(c),b.type="mousewheel",c.wheelDelta&&(e=c.wheelDelta/120),c.detail&&(e=-c.detail/3),h=e,c.axis!==undefined&&c.axis===c.HORIZONTAL_AXIS&&(h=0,g=-1*e),c.wheelDeltaY!==undefined&&(h=c.wheelDeltaY/120),c.wheelDeltaX!==undefined&&(g=-1*c.wheelDeltaX/120),d.unshift(b,e,g,h),(a.event.dispatch||a.event.handle).apply(this,d)}var b=["DOMMouseScroll","mousewheel"];if(a.event.fixHooks)for(var c=b.length;c;)a.event.fixHooks[b[--c]]=a.event.mouseHooks;a.event.special.mousewheel={setup:function(){if(this.addEventListener)for(var a=b.length;a;)this.addEventListener(b[--a],d,!1);else this.onmousewheel=d},teardown:function(){if(this.removeEventListener)for(var a=b.length;a;)this.removeEventListener(b[--a],d,!1);else this.onmousewheel=null}},a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})})(jQuery);