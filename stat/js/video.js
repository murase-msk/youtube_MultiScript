var player = null; // YouTube Player
var playerState = -1; // 未開始
var playerWasMuted = true;

var YTwidth = $(".video-area").innerWidth();
var YTheight = YTwidth * 0.5625; // 16:9の割合

// 字幕情報
var subtitleIndex = 0;
var startOfParagraph = 0;
var startTime = 0;
var duration = 0;

// YouTubeプレイヤー情報
var youTubeId = $("#YouTubeID").text();

// 字幕スクロール情報
var autoScrollSpeed = 200;
var openingDuration = parseInt($("#Duration").text());
var fineTuning = parseInt($("#FineTuning").text());
var subtitlePosition = parseInt($("#SubtitlePosition").text());

// タイマーID
var intervalId = null;
var intervalId2 = null;

function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: YTheight,
        width: YTwidth,
        videoId: youTubeId,
        playerVars: {
            html5: 1,
            autohide: 1,
            iv_load_policy: 3,
            modestbranding : 1,
            controls: 2,
            showinfo: 0,
            rel: 0,
            wmode: 'transparent',
            playsinline: 1
        },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
        'onPlaybackRateChange': onPlayerPlaybackRateChange,
        'onError': onPlayerError,
        'onApiChange': onPlayerApiChange
        }
    });
}

function onPlayerStateChange(event) {
                                        playerState = event.data;
                                        if( playerState == YT.PlayerState.PLAYING ) {
                                            clearInterval(intervalId);
                                            intervalId =　setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
                                        }else if( playerState == YT.PlayerState.ENDED ) {
                                            clearInterval(intervalId);
                                            $(".subtitle").css("background-color", "#ffffff");
                                        }
                                    }
function onPlayerReady(event) {}
function onPlayerPlaybackQualityChange(event) {}
function onPlayerPlaybackRateChange(event) {}
function onPlayerError(event) {}
function onPlayerApiChange(event) {}

$(window).on( 'load resize', function(){

    // 親ウインドウでなければ、ビデオエリアや字幕エリアのサイズと位置を設定しないのでリターン
    if( window != window.parent ){ return; }

    if( $(window).innerWidth() <= 767 ){
        // プレイヤーのXY位置を指定。navbarのheightが57なのでtopを58に設定
        $("#player").offset({ left:0, top:parseInt($('body').css('padding-top'), 10) });

        // ビデオエリアとプレイヤーのサイズをウインドウサイズに合わせて変更
        var newPlayerWidth = $(".video-area").innerWidth();
        var newPlayerHeight = newPlayerWidth * 0.5625;
        $(".video-area").height(newPlayerHeight);
        player.setSize( newPlayerWidth, newPlayerHeight );

        // 字幕エリアの高さを設定する
        // 56はChromeで2重スクロールバーが出ない数値
        $(".subtitle-area").css( "height", $(window).innerHeight() - newPlayerHeight - 56 );

        // 2重にスクロールバーが出てしまう対策
        // 56はChromeで2重スクロールバーが出ない数値
        $(".subtitle-cover").css( "height", $(window).innerHeight() - newPlayerHeight - 56 );

        // 字幕領域の高さをウインドウサイズに合わせて変更
        // 62はChromeで2重スクロールバーが出ない数値
        $(".subtitle-iframe").height( $(window).innerHeight() - newPlayerHeight - 56 );

    } else {
        // プレイヤーのサイズをウインドウサイズに合わせて変更
        var containerPaddingLeft = parseInt($('.container-fluid').css('padding-left'));
        var newPlayerWidth = $(".video-area").innerWidth() - (containerPaddingLeft * 2);
        var newPlayerHeight = newPlayerWidth * 0.5625;
        player.setSize( newPlayerWidth, newPlayerHeight );

        // 2列表示なら、プレイヤーを左中央に表示
        // AdSenseとプレイヤーとコントロールの高さを取得
        var adHeight =  $(".google_ad1").outerHeight(true);
        var playerHeight = $("#player").outerHeight(true);
        var controlHeight = $(".subtitle-checkbox").outerHeight(true);

        // bodyのpadding-topを取得
        var bodyPaddinTop = parseInt($('body').css('padding-top'), 10);

        // プレイヤーの最小Yオフセットを計算
        var minOffsetY = adHeight + bodyPaddinTop;

        // ウインドウの高さが十分にある時のプレイヤーのYポジション
        var newPlayerPositionY = minOffsetY
                                + (($(window).innerHeight() - minOffsetY ) / 2)
                                - newPlayerHeight * 0.5 - 25; // 25 is fine tuning

        // ウインドウの高さが無い時は、navbarとAdSenseのすぐ下にプレイヤーを配置
        if( newPlayerPositionY < minOffsetY )
            newPlayerPositionY = minOffsetY;

        // ウインドウの高さが無い時は、ビデオエリアの高さをAdSense+プレイヤー+コントロールの高さに合わせる
        if((adHeight+playerHeight+controlHeight) > $(window).innerHeight() - bodyPaddinTop ){
            $(".video-area").height( adHeight+playerHeight+controlHeight );
        }else{
            $(".video-area").height( $(window).innerHeight() - bodyPaddinTop );
        }

        // アドセンスのXY位置を指定
        $(".google_ad1").offset({
                                    left:containerPaddingLeft,
                                    top:newPlayerPositionY - $(".google_ad1").outerHeight(true)
                                });
        // プレイヤーのXY位置を指定
        $("#player").offset({
                                left:containerPaddingLeft,
                                top:newPlayerPositionY
                            });

        // コントロールのXY位置を指定
        $(".control-area").offset({
                                    left:containerPaddingLeft,
                                    top:newPlayerPositionY + $("#player").outerHeight()
                                });

        // コントロールの高さを指定
        $(".control-area").css( "height", $(".subtitle-checkbox").outerHeight(true)
                                            + $(".opening-input").outerHeight(true));

        // 字幕エリアをビデオエリアの高さと同じにする
        $(".subtitle-area").css( "height", $(".video-area").height() );

        // 2重にスクロールバーが出てしまう対策
        $(".subtitle-cover").css( "height", $(".video-area").height() );

        // 字幕領域のサイズをウインドウサイズに合わせて変更
        $(".subtitle-iframe").css( "height", $(".video-area").height());
    }
});

$(window).load(function(){
    // 字幕情報を取得
    subtitleIndex = $('.subtitleIndex');
    startOfParagraph = $('.startOfParagraph');
    startTime = $('.startTime');
    duration = $('.duration');

    // 字幕をシングルクリックしたら動画を一時停止
    $('.subtitle').bind('click', function( event ) {
        if( playerState == YT.PlayerState.PLAYING ){
            clearInterval(intervalId);
            player.pauseVideo();
        }
    });

    // 字幕をダブルクリックしたら動画を再生
    $('.subtitle').bind('dblclick', function( event ) {
        clearInterval(intervalId);

        var startTime = $('.startTime').eq($('.subtitle').index(this)).text();
        player.seekTo((startTime/1000)+openingDuration);
        player.playVideo();

        intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
    });

    $('.subtitle').bind('dblTap', function( event ) {
        clearInterval(intervalId);

        var startTime = $('.startTime').eq($('.subtitle').index(this)).text();
        player.seekTo((startTime/1000)+openingDuration);
        player.playVideo();

        intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
    });

    $(document).mousewheel(function(event){
        // AutoscrollのON/OFFを確認
        if($('#Checkbox5').prop('checked')){
            if( playerState != -1 ){
                // 動画が未開始以外の時に一時停止する
                clearInterval(intervalId);
                player.pauseVideo();
            }
        }
    });

    $(document).bind('touchmove',function(){
        // AutoscrollのON/OFFを確認
        if($('#Checkbox5').prop('checked')){
            if( playerState != -1 ){
                // 動画が未開始以外の時に一時停止する
                clearInterval(intervalId);
                player.pauseVideo();
            }
        }
    });

    $('#Checkbox1').change(function(){
        $(".subtitle").css("background-color", "#ffffff");
        $('.content_1').toggle();
        checkSubtitleCheckbox1();
        updateSubtitleScroll(0);

        var checkBoxeToggle = $("#Checkbox3");
        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
    });

    $('#Checkbox2').change(function(){
        $(".subtitle").css("background-color", "#ffffff");
        $('.content_2').toggle();
        checkSubtitleCheckbox1();
        updateSubtitleScroll(0);

        var checkBoxeToggle = $("#Checkbox4");
        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
    });

    $('#Checkbox3').change(function(){
        $(".subtitle").css("background-color", "#ffffff");
        $('.content_1').toggle();
        checkSubtitleCheckbox2();
        updateSubtitleScroll(0);

        var checkBoxeToggle = $("#Checkbox1");
        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
    });

    $('#Checkbox4').change(function(){
        $(".subtitle").css("background-color", "#ffffff");
        $('.content_2').toggle();
        checkSubtitleCheckbox2();
        updateSubtitleScroll(0);

        var checkBoxeToggle = $("#Checkbox2");
        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
    });

    $('#Checkbox5').change(function(){
        if($('#Checkbox5').prop('checked')){
            $("#Checkbox6").prop("checked", true);
        } else{
            $("#Checkbox6").prop("checked", false);
        }
    });

    $('#Checkbox6').change(function(){
        if($('#Checkbox6').prop('checked')){
            $("#Checkbox5").prop("checked", true);
        } else {
            $("#Checkbox5").prop("checked", false);
        }
    });

    $('#reset-button').click(function() {
        var urlJump = location.href;
        var paramSearch = location.search;

        var urlAfter = urlJump.replace( paramSearch, "" );
        location.href = urlAfter;
    });

    $(".subtitle").hover(function(){
        $('.permalink').eq($('.subtitle').index(this)).animate({opacity:1},100);
    },function(){
        $('.permalink').eq($('.subtitle').index(this)).animate({opacity:0},100);
    });

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    if( isFinite( subtitlePosition ) ){
        // 動画開始位置が指定されている
            clearInterval(intervalId);

            var numStartTimeLength = $('.startTime').length;
            if( subtitlePosition >= numStartTimeLength ){
                // 再生指定位置が字幕の長さを超えていればリターン
                return;
            }

            // 指定位置までシークして再生
            var startPosition = $('.startTime')[subtitlePosition].innerHTML;
            // startPositionのままだと字幕位置がひとつ前にずれてしまう事がある為に++する
            startPosition++;

            // 字幕指定位置再生時少し音が出てしまう為、一度muteする
            if( ! player.isMuted()){
                player.mute();
                playerWasMuted = false;
            }

            player.seekTo((startPosition/1000)+openingDuration);

            // seekTo()直後はまだ動画が再生されていないから、pauseYTPrayer()内でポーズする
            intervalId2 = setInterval(function(){pauseYTPlayer()},100);
            intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
    }
});

function pauseYTPlayer(){
    if( playerState == YT.PlayerState.PLAYING ){
        // 動画が再生されるようになったらポーズする
        player.pauseVideo();

        if( ! playerWasMuted ){
            // 動画シーク前にmuteされてなかったら、umMuteする
            player.unMute();
        }

        clearInterval(intervalId2);
    }
}

function checkSubtitleCheckbox1(){
    var arrayCheck = $('[class="subtitleChckbox1"]:checked').map(function(){return $(this).val();}).get();
    if(arrayCheck.length == 0){
        $(".subtitle").css("display", "none");
        $(".subtitle2").css("display", "none");
    }else{
        $(".subtitle").css("display", "block");
        $(".subtitle2").css("display", "block");
    }
}

function checkSubtitleCheckbox2(){
    var arrayCheck = $('[class="subtitleChckbox2"]:checked').map(function(){return $(this).val();}).get();
    if(arrayCheck.length == 0){
        $(".subtitle").css("display", "none");
        $(".subtitle2").css("display", "none");
    }else{
        $(".subtitle").css("display", "block");
        $(".subtitle2").css("display", "block");
    }
}

function updateSubtitleScroll(animateDuration){
    var low = 0;
    var high = subtitleIndex.length - 1;

    while( low <= high ) {
        var mid = Math.floor((low + high) / 2);

        var realStartTime = (parseInt(startTime[mid].innerHTML)/1000 ) + openingDuration - fineTuning;
        var realDuration = parseInt(duration[mid].innerHTML)/1000;

        var currentTime = player.getCurrentTime();

        if(( currentTime >= realStartTime )&&( currentTime <= ( realStartTime + realDuration ))){
            $(".subtitle").css("background-color", "#ffffff");
            $(".subtitle").eq(mid).css("background-color","#dddddd");

            var halfWindow = window.innerHeight/2;

            // 字幕のウインドウ内でのオフセットと高さを取得
            var subtitleOffset = $(".subtitle").eq(mid).offset();
            var subtitleHeight = $(".subtitle").eq(mid).outerHeight();

            // .subtitle-iframeの全高さ内のオフセットを取得
            var scrollPosition = $(".subtitle-iframe").scrollTop();
            var scrollOffset = subtitleOffset.top + scrollPosition;

            var videoHeight = $(".video-area").outerHeight()

            if( $(window).innerWidth() <= 767 ){
                // AutoscrollのON/OFFを確認
                if($('#Checkbox5').prop('checked')){
                    // 28はnavbarの高さ/2
                    $("#move-subtitle").animate({scrollTop:scrollOffset-halfWindow+subtitleHeight/2-28-videoHeight/2},animateDuration);
                }
            } else {
                // AutoscrollのON/OFFを確認
                if($('#Checkbox5').prop('checked')){
                    // 25はnavbarの高さ/2
                    $("#move-subtitle").animate({scrollTop:scrollOffset-halfWindow+subtitleHeight/2-25},animateDuration);
                }
            }
            break;
        } else if ( currentTime < realStartTime ){
            high = mid - 1;
        } else if ( currentTime > ( realStartTime + realDuration )){
            low = mid + 1;
        } else {
            console.error( 'error:SubtitleScroll' );
        }
    }
}
