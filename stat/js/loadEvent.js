////////////////////////////////////////////////////
// ウインドウのロード時のイベント処理.//
////////////////////////////////////////////////////
$(window).load(function(){
	console.log("loadEvent");
	var youtubeId = $("#YouTubeID").text();
	// 字幕の表示(日本語).
	$.get("/stat/resource/"+youtubeId+"(ja).xml", function(xml){
		var count = 0;
		$(xml).find("text").each(function(){
			var text = $(this).text();
			var start = $(this).attr("start");
			var dur = $(this).attr("dur");
			$("#japanese-script").append("<span start="+start+" dur="+dur+" count="+count+"> "+text+" <span><br>");
			
			count++;
		});
	});
	// 字幕の表示(英語).
	$.get("/stat/resource/"+youtubeId+"(en).xml", function(xml){
		var count = 0;
		$(xml).find("text").each(function(){
			var text = $(this).text();
			var start = $(this).attr("start");
			var dur = $(this).attr("dur");
			$("#english-script").append("<span start="+start+" dur="+dur+" count="+count+"> "+text+" <span><br>");
			
			count++;
		});
	});
	    // 字幕情報を取得
//    subtitleIndex = $('.subtitleIndex');
//    startOfParagraph = $('.startOfParagraph');
//    startTime = $('.startTime');
//    duration = $('.duration');

//    // 字幕をシングルクリックしたら動画を一時停止
//    $('.subtitle').bind('click', function( event ) {
//        if( playerState == YT.PlayerState.PLAYING ){
//            clearInterval(intervalId);
//            player.pauseVideo();
//        }
//    });
//
//    // 字幕をダブルクリックしたら動画を再生
//    $('.subtitle').bind('dblclick', function( event ) {
//        clearInterval(intervalId);
//
//        var startTime = $('.startTime').eq($('.subtitle').index(this)).text();
//        player.seekTo((startTime/1000)+openingDuration);
//        player.playVideo();
//
//        intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
//    });
//
//    $('.subtitle').bind('dblTap', function( event ) {
//        clearInterval(intervalId);
//
//        var startTime = $('.startTime').eq($('.subtitle').index(this)).text();
//        player.seekTo((startTime/1000)+openingDuration);
//        player.playVideo();
//
//        intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
//    });

//    $(document).mousewheel(function(event){
//        // AutoscrollのON/OFFを確認
//        if($('#Checkbox5').prop('checked')){
//            if( playerState != -1 ){
//                // 動画が未開始以外の時に一時停止する
//                clearInterval(intervalId);
//                player.pauseVideo();
//            }
//        }
//    });
//
//    $(document).bind('touchmove',function(){
//        // AutoscrollのON/OFFを確認
//        if($('#Checkbox5').prop('checked')){
//            if( playerState != -1 ){
//                // 動画が未開始以外の時に一時停止する
//                clearInterval(intervalId);
//                player.pauseVideo();
//            }
//        }
//    });

//    $('#Checkbox1').change(function(){
//        $(".subtitle").css("background-color", "#ffffff");
//        $('.content_1').toggle();
//        checkSubtitleCheckbox1();
//        updateSubtitleScroll(0);
//
//        var checkBoxeToggle = $("#Checkbox3");
//        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
//    });
//
//    $('#Checkbox2').change(function(){
//        $(".subtitle").css("background-color", "#ffffff");
//        $('.content_2').toggle();
//        checkSubtitleCheckbox1();
//        updateSubtitleScroll(0);
//
//        var checkBoxeToggle = $("#Checkbox4");
//        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
//    });
//
//    $('#Checkbox3').change(function(){
//        $(".subtitle").css("background-color", "#ffffff");
//        $('.content_1').toggle();
//        checkSubtitleCheckbox2();
//        updateSubtitleScroll(0);
//
//        var checkBoxeToggle = $("#Checkbox1");
//        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
//    });
//
//    $('#Checkbox4').change(function(){
//        $(".subtitle").css("background-color", "#ffffff");
//        $('.content_2').toggle();
//        checkSubtitleCheckbox2();
//        updateSubtitleScroll(0);
//
//        var checkBoxeToggle = $("#Checkbox2");
//        checkBoxeToggle.prop("checked", !checkBoxeToggle.prop("checked"));
//    });
//
//    $('#Checkbox5').change(function(){
//        if($('#Checkbox5').prop('checked')){
//            $("#Checkbox6").prop("checked", true);
//        } else{
//            $("#Checkbox6").prop("checked", false);
//        }
//    });
//
//    $('#Checkbox6').change(function(){
//        if($('#Checkbox6').prop('checked')){
//            $("#Checkbox5").prop("checked", true);
//        } else {
//            $("#Checkbox5").prop("checked", false);
//        }
//    });
//
//    $('#reset-button').click(function() {
//        var urlJump = location.href;
//        var paramSearch = location.search;
//
//        var urlAfter = urlJump.replace( paramSearch, "" );
//        location.href = urlAfter;
//    });
//
//    $(".subtitle").hover(function(){
//        $('.permalink').eq($('.subtitle').index(this)).animate({opacity:1},100);
//    },function(){
//        $('.permalink').eq($('.subtitle').index(this)).animate({opacity:0},100);
//    });
//
//    $(function () {
//        $('[data-toggle="tooltip"]').tooltip()
//    })
//
//    if( isFinite( subtitlePosition ) ){
//        // 動画開始位置が指定されている
//            clearInterval(intervalId);
//
//            var numStartTimeLength = $('.startTime').length;
//            if( subtitlePosition >= numStartTimeLength ){
//                // 再生指定位置が字幕の長さを超えていればリターン
//                return;
//            }
//
//            // 指定位置までシークして再生
//            var startPosition = $('.startTime')[subtitlePosition].innerHTML;
//            // startPositionのままだと字幕位置がひとつ前にずれてしまう事がある為に++する
//            startPosition++;
//
//            // 字幕指定位置再生時少し音が出てしまう為、一度muteする
//            if( ! player.isMuted()){
//                player.mute();
//                playerWasMuted = false;
//            }
//
//            player.seekTo((startPosition/1000)+openingDuration);
//
//            // seekTo()直後はまだ動画が再生されていないから、pauseYTPrayer()内でポーズする
//            intervalId2 = setInterval(function(){pauseYTPlayer()},100);
//            intervalId = setInterval(function(){updateSubtitleScroll(autoScrollSpeed)},250);
//    }
});
