var player = null; // YouTube Player
var playerState = -1; // 未開始
var playerWasMuted = true;

// 動画の縦横幅 .
var YTwidth = $(".video-area").innerWidth();
var YTheight = YTwidth * 0.5625; // 16:9の割合

// 字幕情報
var subtitleIndex = 0;
var startOfParagraph = 0;
var startTime = 0;
var duration = 0;

var enScriptIndex = 0;
var jpScriptIndex = 0;

// YouTubeプレイヤー情報
var youTubeId = $("#YouTubeID").text();//'P8GCjrDWWUM';//$("#YouTubeID").text();

// 字幕スクロール情報
var autoScrollSpeed = 200;
var openingDuration = parseInt($("#Duration").text());
var fineTuning = parseInt($("#FineTuning").text());
var subtitlePosition = parseInt($("#SubtitlePosition").text());

// タイマーID
var intervalId = null;
var intervalId2 = null;

// Youtube APIの使用準備.
function onYouTubeIframeAPIReady() {
	
	console.log("onYouTubeIframeAPIReady");
	
    player = new YT.Player('player', {
        height: YTheight,		// 高さ
        width: YTwidth,			// 幅
        videoId: youTubeId,		// ビデオID
        playerVars: {			// プレイーヤパラメータ.
            html5: 1,			// 
            autohide: 1,		// 
            iv_load_policy: 3,	// 
            modestbranding : 1,	// 
            controls: 2,		// 
            showinfo: 0,		// 
            rel: 0,				// 
            wmode: 'transparent',//	
            playsinline: 1		// 
        },
        events: {	// 各種イベントの設定.
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onPlaybackQualityChange': onPlayerPlaybackQualityChange,
        'onPlaybackRateChange': onPlayerPlaybackRateChange,
        'onError': onPlayerError,
        'onApiChange': onPlayerApiChange
        }
    });
    console.info(player);
}


//このイベントは、プレーヤーの状態が変わると起動します。 API がイベント リスナー関数に渡すイベント オブジェクトの data プロパティにより、プレーヤーの新しい状態に対応する整数が指定されます。 有効な値は次のとおりです。
//-1（未開始）
//0（終了） YT.PlayerState.ENDED
//1（再生中	YT.PlayerState.PLAYING
//2（停止）	YT.PlayerState.PAUSED
//3（バッファリング中）YT.PlayerState.BUFFERING
//5（頭出し済み）YT.PlayerState.CUED
function onPlayerStateChange(event) {
	console.log(player.getCurrentTime());
	playerState = event.data;
	if( playerState == YT.PlayerState.PLAYING ) {
		clearInterval(intervalId);
		intervalId =setInterval(
			function(){updateSubtitleScroll(autoScrollSpeed)},
			250
		);
	}else if( playerState == YT.PlayerState.ENDED ) {
		clearInterval(intervalId);
		$(".subtitle").css("background-color", "#ffffff");
	}
}
function onPlayerReady(event) {
	console.log("onPlayerReady");
	}
function onPlayerPlaybackQualityChange(event) {}
function onPlayerPlaybackRateChange(event) {}
function onPlayerError(event) {}
function onPlayerApiChange(event) {}


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

/////////////////////////////////////////
//スクリプトのアップデート
/////////////////////////////////////////
function updateSubtitleScroll(animateDuration){
	console.log(player.getCurrentTime());
	// 現在の再生時間.
	var cTime = player.getCurrentTime()
	
	// 次のスクリプのと表示するテキスト.
	var jpText = $("#japanese-script>span[count="+jpScriptIndex+"]").text()
	var enText = $("#english-script>span[count="+enScriptIndex+"]").text()
	// 次のスクリプトの表示時間.
	var jpNsTime = $("#japanese-script>span[count="+jpScriptIndex+"]").attr("start");
	var enNsTime = $("#japanese-script>span[count="+enScriptIndex+"]").attr("start");
	
	if(cTime > jpNsTime){
		// 次のスクリプトに下線を引く.
		$("#japanese-script>span[count="+jpScriptIndex+"]").wrap("<u uCount="+jpScriptIndex+"></u>");
		// 前のスクリプトの下線を消す.
		if(jpScriptIndex > 0){
			$("#japanese-script span[count="+(jpScriptIndex-1)+"]").unwrap();
		}
		jpScriptIndex++;
	}
	if(cTime > enNsTime){
		// 次のスクリプトに下線を引く.
		$("#english-script>span[count="+enScriptIndex+"]").wrap("<u uCount="+enScriptIndex+"></u>");
		// 前のスクリプトの下線を消す.
		if(enScriptIndex > 0){
			$("#english-script span[count="+(enScriptIndex-1)+"]").unwrap();
		}
		enScriptIndex++;
	}
	
//    var low = 0;
//    var high = subtitleIndex.length - 1;
//
//    while( low <= high ) {
//        var mid = Math.floor((low + high) / 2);
//
//        var realStartTime = (parseInt(startTime[mid].innerHTML)/1000 ) + openingDuration - fineTuning;
//        var realDuration = parseInt(duration[mid].innerHTML)/1000;
//
//        var currentTime = player.getCurrentTime();
//
//        if(( currentTime >= realStartTime )&&( currentTime <= ( realStartTime + realDuration ))){
//			
//			
//			console.log();
//			
//            $(".subtitle").css("background-color", "#ffffff");
//            $(".subtitle").eq(mid).css("background-color","#dddddd");
//
//            var halfWindow = window.innerHeight/2;
//
//            // 字幕のウインドウ内でのオフセットと高さを取得
//            var subtitleOffset = $(".subtitle").eq(mid).offset();
//            var subtitleHeight = $(".subtitle").eq(mid).outerHeight();
//
//            // .subtitle-iframeの全高さ内のオフセットを取得
//            var scrollPosition = $(".subtitle-iframe").scrollTop();
//            var scrollOffset = subtitleOffset.top + scrollPosition;
//
//            var videoHeight = $(".video-area").outerHeight()
//
//            if( $(window).innerWidth() <= 767 ){
//                // AutoscrollのON/OFFを確認
//                if($('#Checkbox5').prop('checked')){
//                    // 28はnavbarの高さ/2
//                    $("#move-subtitle").animate({scrollTop:scrollOffset-halfWindow+subtitleHeight/2-28-videoHeight/2},animateDuration);
//                }
//            } else {
//                // AutoscrollのON/OFFを確認
//                if($('#Checkbox5').prop('checked')){
//                    // 25はnavbarの高さ/2
//                    $("#move-subtitle").animate({scrollTop:scrollOffset-halfWindow+subtitleHeight/2-25},animateDuration);
//                }
//            }
//            break;
//        } else if ( currentTime < realStartTime ){
//            high = mid - 1;
//        } else if ( currentTime > ( realStartTime + realDuration )){
//            low = mid + 1;
//        } else {
//            console.error( 'error:SubtitleScroll' );
//        }
//    }
}


