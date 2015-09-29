/**
 * Created by Qiao on 9/29/15.
 */
var MonthBeginEnd = function (dateString) {
    //得到一个月的第一天,和最后一天
    var result= []; //分别存第一天第一秒和最后一天最后一秒
    var begin;
    if(dateString){
        //选了月份就是这个月
        begin = new Date(dateString);   //1号8点
        begin.setHours(0);
    }else{
        //没选就是当前月
        begin = new Date();
        begin.setDate(1);
        begin.setHours(0,0,0,0);
    }
    result.push(begin.getTime());
    var end = begin;
    if(begin.getMonth() < 11){
        //月份是0-11，不是12月就下个月的第一天减1ms；12月就明天的第一天减1ms
        end.setMonth(begin.getMonth()+1);
    }else{
        end.setFullYear(begin.getFullYear()+1 , 0);
    }
    result.push(end.getTime()-1);
    return result;
};
$(document).ready(function () {
    $("#calcDiv .back").click(function () {
        $("#recordDiv").css("display", "block");
        $("#calcResult").css("display","none");
        $("#calcDiv").css("display", "none");
        return false;
    });
    $("#calc").click(function () {
        var month = $("#calcMonth").val();
        var begin_end = MonthBeginEnd(month);
        //显示账单期数
        var year = (new Date(begin_end[0])).getFullYear();
        var month = (new Date(begin_end[0])).getMonth()+1;
        $("#calcResult h4 span")[1].innerText =" "+ year + "年"+ month+ "月结算单";
        jQuery.ajax({
            url: "/calcBills",
            type: "get",
            data:{
                start: begin_end[0],
                end: begin_end[1]
            },
            success: function (billObj) {
                //填表，然后显示
                var finalCalc = [];
                for(var i = 0 ; i < 3 ; i++){
                    finalCalc[i] = billObj.earn[i] - billObj.cost[i];
                }
                $("#calcDiv .table td").each(function (index) {
                    if(index < 3){
                        $(this).text(billObj.cost[index] / 100);
                    }else if(index>=3 && index<6){
                        $(this).text(billObj.earn[index%3] / 100);
                    }else{
                        $(this).text(finalCalc[index%3] / 100);
                    }
                });
                $("#calcDiv .billTime span").text(displayTimeString(new Date()));
                $("#calcResult").css("display","block");
            },
            error: function () {
                alert("出错了，请联系哈密瓜！~");
            }
        });
        return false;
    });
});