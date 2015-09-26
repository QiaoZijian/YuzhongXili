/**
 * Created by Qiao on 9/8/15.
 */
var NameArray=["刘娟","林洁","林欢"];
var ShareNameArray=["林洁","斌哥","刘娟","阿瓜","乔哥"];
var TypeArray=["蔬菜水果小吃","柴米油盐酱醋茶","酒水饮料","生活用品","水电暖","娱乐","其他"];
var nameMap = [2,0,3]; //出资人的0，1，2对应share人的2，0，3
var ShareAssign=[0,0,0,0,0]; //按顺序的，每个人分得多少收益
var ManRandom = function (shareArray, need, withoutWho){
    // 分钱可能分不整，需要随机有人来承担某1分钱，将随机分配的结果返回，但出资人会被排除
    //shareArray是收益人的数组，need是需要随机分配的个数，without是除了投资人
    var assignArray = [0,0,0,0,0]; //大家都是0，还没随机，被随机到的之后会变成1
    for(var i = 0; i < need; i){ //i并不需要自加，满足条件再自加
        var which = Math.floor(Math.random() * shareArray.length);
        var j = 0;
        for(j = 0 ; j < assignArray.length ; j++){
            if(shareArray[which] == withoutWho || assignArray[shareArray[which]] == 1)
                break; //break的意义就是这次随机失效了
        }
        if(j == assignArray.length){ //说明按照规则执行还未被选中过
            assignArray[shareArray[which]] = 1;
            i++;
        }
    }
    return assignArray; //这个函数返回的结果就是按照规则被随机到的人是1，没有的是0
};
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
$(document).ready(function () {
    $("#queryBill").click(function () {
        $("#recordDiv").css("display","none");
        $("#queryDiv").css("display","block");
        return false;
    });
    $(".btn-round").click(function () {
        $("#fakeContainer").hide();
        $("#realContainer").show();
        $("#formWho").data("who",Number(($(this)).attr("who")));
        $("#formWho").attr("placeholder", NameArray[$("#formWho").data("who")]);
    });

    $(".small-round").click(function () {
        //算出来每人要分多少钱
        var who = $("#formWho").data("who");
        var costFen = $("#formCost").val() * 100;
        var whoShare =$("#formShare").val(); //数组，有哪些人
        var eachOneFen = Math.floor(costFen / whoShare.length); //一个人分到的基本收益
        for (index in whoShare){
            ShareAssign[whoShare[index]] = eachOneFen; //基本分红先分掉
        }
        var restFen = costFen - (eachOneFen * whoShare.length); //剩余这么多分，这是小于whoShare人数的数
        if(restFen != 0){
            var assignArray = ManRandom(whoShare, restFen, nameMap[who]);//只可能某几个人分得一分钱
            for (index in assignArray){
                if(assignArray[index] == 1){
                    ShareAssign[index] ++;
                }
            }
        }
        //在这儿传给服务器
        var time = new Date();
        jQuery.ajax({
            url: "/submitBill",
            type: "post",
            data: {
                who: $("#formWho").data("who"), // 0.1.2
                when: time.getTime(),
                which: $("#formWhich").val(),  // 0.1....6
                cost: costFen,  //单位：分
                whoShare: JSON.stringify(ShareAssign),  //单位：分
                note: $("#formNote").val()
            },
            success: function (response) {
                if(response.status == "ok"){
                    //收到服务器确认信息，负责展示
                    var thanksTip = $("#thanksDiv strong").html();
                    $("#thanksDiv strong").html(thanksTip + costFen/100 + " 元~");
                    var thanksSentence = "这个小家诚挚地感谢 <span>";
                    thanksSentence += NameArray[$("#formWho").data("who")] + "</span> 女士为家庭和睦幸福奉献的点点滴滴~ 本次消费账单如下所示~ 下个月月初我们再来算总账！</p>";
                    $("#thanksDiv p").html(thanksSentence);
                    //账单信息：出资人，账单形成时间，种类，备注
                    $("#thanksContainer ul li")[0].innerHTML += NameArray[$("#formWho").data("who")];
                    $("#thanksContainer ul li")[1].innerHTML += displayTimeString(time);
                    $("#thanksContainer ul li")[2].innerHTML += TypeArray[$("#formWhich").val()];
                    $("#thanksContainer ul li")[3].innerHTML += $("#formNote").val();
                    //账单表格
                    for(var index = 0 ; index < 10 ; index += 2){
                        $("#billTable td")[index].innerText = ShareAssign[index/2]/100;
                    }
                    $("#billTable td")[nameMap[who]*2+1].innerText = costFen/100;
                    $("#realContainer").hide();
                    $("#thanksContainer").show();
                    ShareAssign=[0,0,0,0,0]; //点一次清零一次
                }
            },
            error: function () {
                alert("出错了，请联系哈密瓜！~");
                ShareAssign=[0,0,0,0,0]; //点一次清零一次
            }
        });
       // return false;
    });

});