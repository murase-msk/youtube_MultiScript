////////////////////////////////////////////////////
// ウインドウのロードやリサイズの時のイベント処理.//
////////////////////////////////////////////////////
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