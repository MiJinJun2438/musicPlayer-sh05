// 保存音乐列表信息
var musicList = [];
// 声明变量，保存当前播放的歌曲
var currentIndex = 0;

// 加载音乐列表信息
$.ajax({
    type:"GET",
    url:"./musicList.json",
    dataType:"json",
    success: function (data) {
        musicList=data;
        render(musicList[currentIndex]);
        renderMusicList(musicList);
        
    }
});

// 给播放按钮绑定事件
$("#playBtn").on("click",function(){
    if ($("audio").get(0).paused){
        $(this).removeClass("icon-yunhang").addClass("icon-zanting");
        $(".player-info").animate(
            {
                top:"-100%",
                opacity:1
            },
            "slow"
        );
        $(".cover").css({
            "animation-play-state":"running"
        });
        $("audio").get(0).play();
    }
    else {
        $(this).removeClass("icon-zanting").addClass("icon-yunhang");
        $(".player-info").animate(
            {
                top:"0%",
                opacity:0
            },
            "slow"
        );
        $(".cover").css({
          "animation-play-state":"paused"  
        });
        $("audio").get(0).pause();
    }

    renderMusicList(musicList);
})

// 给上一首按钮绑定事件
$("#prevBtn").on("click",function(){
    if (currentIndex >0) {
        currentIndex--;
    }
    else {
        currentIndex = musicList.length-1;
    }
    render(musicList[currentIndex]);
    $("#playBtn").trigger("click");
});

$("#nextBtn").on("click",function(){
    if (currentIndex < musicList.length-1) {
        currentIndex++;
    }
    else {
        currentIndex=0;
    }
    render(musicList[currentIndex]);
    $("#playBtn").trigger("click");
});
$("#openModal").on("click" ,function(){
    $(".modal").css({
        display:"block"
    });
});
$(".modal-close").on("click",function(){
    $(".modal").css({
        display:"none"
    });
});

$("audio").on("timeupdate", function(){
    var currentTime = $("audio").get(0).currentTime ||0;
    var duration = $("audio").get(0).duration || 0;
    $(".current-time").text(formatTime(currentTime));
    var value = (currentTime / duration) * 100;
    $(".music_progress_line").css({
        width: value + "%"
    });
});

$(".music-list").on("click","span",function(){
    if ($(this).hasClass("icon-yunhang")) {
        var index = $(this).attr("data-index");
        currentIndex = index;
        render(musicList[currentIndex]);
        $("#playBtn").trigger("click");
    }
    else {
        $("#playBtn").trigger("click");
    }
});

function formatTime(time) {
  // 329 -> 05:29
    var min = parseInt(time / 60);
    var sec = parseInt(time % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;
    return `${min}:${sec}`;
}

function render(data) {
    $(".name").text(data.name);
    $(".singer-album").text(`${data.singer} - ${data.album}`);
    $(".total-time").text(data.time);
    $(".cover img").attr("src",data.cover);
    $("audio").attr("src",data.audio_url);
    $(".page-bg").css({
        background: `url("${data.cover}") no-repeat center center`,
        backgroundSize: 'cover'
    });
};

function renderMusicList(list) {
    $(".music-list").empty();
    $.each(list,function (index,item){
        var $li = $(`
            <li class="${index == currentIndex ? "playing" : ""}">
                <span>0${index+1}.${item.name} - ${item.singer}</span>
                <span data-index="${index}" class="btn iconfont ${
                    index == currentIndex && !$("audio").get(0).paused ? "icon-zanting" : "icon-yunhang"
                }"></span>
            </li>
        `);
        
        $(".music-list").append($li);
    });
}