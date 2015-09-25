/**
 * Created by Qiao on 9/15/15.
 */
//常值
var NameArray=["刘娟","林洁","林欢"];
var ShareNameArray=["洁","斌","娟","瓜","乔"];
var TypeArray=["蔬菜水果小吃","柴米油盐酱醋茶","酒水饮料","生活用品","水电暖","娱乐","其他"];
//得到这一天0:00:00:000点时的 number 表示
var oneDayBegin = function (dateString) {
    //如果有值，那么那天的0点；如果没有，就是上线前的某个时间，是之后记录的最早的即可
    if(dateString){
        var tmp = new Date(dateString);
        return tmp.setHours(0);
    }else{
        return (new Date("2015-9-1")).getTime();
    }
};
//得到这一天23:59:59:999 时的 number 表示
var oneDayEnd = function (dateString) {
    //如果有值，那么那天的最后；如果没有，就是当前时间
    if(dateString){
        var tmp = new Date(dateString);
        return tmp.setHours(23,59,59,999);
    }else{
        return (new Date()).getTime();
    }
};
//bills.js里也有，但不想引用那个js
var addZero = function (num) { //设x=num，如果x小于10，返回0x
    if(num < 10){
        return "0" + num;
    }else{
        return ""+num;
    }
};
var displayTimeString= function (time){//负责展示时间， time是Date对象，返回一个字符串
    var timeString="";
    timeString += time.getFullYear() + "-" + addZero(time.getMonth()+1) + "-" + addZero(time.getDate()) + " ";
    timeString += addZero(time.getHours()) + ":" + addZero(time.getMinutes()) + ":" + addZero(time.getSeconds());
    return timeString;
};
var displayBills = function (bills) {
    var billsNum = bills.length;
    $("#billsNum").text(billsNum);
    var $results = $("#resultsDiv");
    for(var i = 0 ; i < billsNum; i++){
        var $resultWrap = $('<div class="resultWrap"></div>');

        var $resultHeading = $('<div class="resultHeading"></div>');
        var $media = $('<div class="media"></div>');
        var $media_body = $('<div class="media-body">'+
            '<h5><span class="glyphicon glyphicon-user" aria-hidden="true"></span> <span>'+
            NameArray[bills[i].who] +'</span></h5>'+
            '<p><span class="glyphicon glyphicon-time" aria-hidden="true"></span> <span>'+
            displayTimeString(new Date(bills[i].when))+'</span></p></div>');
        var $media_right= $('<div class="media-right"><h2 class="media-object">￥<span>'+
            bills[i].cost/100 +'</span></h2>' +
            '<h2 class="pull-right down dropdown"><span class="caret"></span></h2></div>');
        $media.append($media_body,$media_right);
        $resultHeading.append($media);

        var $resultMore = $('<div class="resultMore"></div>');
        var $ul = $('<ul class="list-unstyled"></ul>');
        var $li_1 = $('<li><span class="glyphicon glyphicon-tag" aria-hidden="true">:</span>'+
            ' <span class="billType">'+ TypeArray[bills[i].which] +'</span></li>');
        var $li_2 = $('<li><span class="glyphicon glyphicon-usd" aria-hidden="true">:</span>'+
            ' <div class="btn-group" role="group" aria-label="收益"></div></li>');
        for(var j = 0 ; j < bills[i].whoShare.length; j++){
            if(bills[i].whoShare[j] != 0){
                var $button = $('<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="'+
                    bills[i].whoShare[j]/100 +'">'+ ShareNameArray[j] +'</button>');
                $li_2.find("div").append($button);
            }
        }
        var $li_3 = $('<li></li>');
        if(bills[i].note.length != 0 ){
            //如果有备注，那么显示；没有的话，直接显示空的li
            $li_3 = $('<li><span class="glyphicon glyphicon-info-sign" aria-hidden="true">:</span>'+
                ' <span>'+ bills[i].note +'</span></li>');
        }
        $ul.append($li_1, $li_2, $li_3);
        $resultMore.append($ul);

        $resultWrap.append($resultHeading,$resultMore);
        $results.append($resultWrap);
    }
};

$(document).ready(function () {
    $("#queryButton").click(function () {
        //先清空，再去查询
        $("#resultsDiv").empty();

        var who = Number($("#queryWho").val());
        var start = oneDayBegin($("#startTime").val());
        var end = oneDayEnd($("#endTime").val());
        jQuery.ajax({
            url: "/queryBills",
            type: "get",
            data:{
                who: who,
                start: start,
                end: end
            },
            success: function (bills) {
                //展示出来查到的这些bills
                displayBills(bills);
                //展示完毕还需要激活一下tooltip
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function () {
                alert("出错了，请联系哈密瓜！~");
            }
        });
        return false;
    });
    $("#resultsDiv").on("click", "div.resultHeading" , function () {
        var _this = this;
        //如果有active的class，说明被点开了，要关掉
        if($(_this).hasClass("active")){
            $(_this).siblings(".resultMore").slideUp("fast", function () {
                $(_this).find("div.media-right h2.down").removeClass("dropup").addClass("dropdown");
                $(_this).removeClass("active");
            });
        }else{
            $(_this).addClass("active");
            $(_this).siblings(".resultMore").slideDown("normal");
            $(_this).find("div.media-right h2.down").removeClass("dropdown").addClass("dropup");
        }
    });
});