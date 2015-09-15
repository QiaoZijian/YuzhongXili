/**
 * Created by Qiao on 4/14/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/YuzhongXili' , function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log('connect to YuzhongXili mongodb succeed!');
    }
});

//所有的账单
var billSchema = new Schema ({
    who: {type: Number}, //0:娟；1:洁；2:瓜
    when: {type: Number}, //用于记录时间，反解析时间在前端和其他地方；
    which: {type: Number},
    /*  0：蔬菜水果小吃
        1：柴米油盐酱醋茶
        2：酒水饮料
        3：生活用品
        4：水电暖
        5：娱乐
        6：其他
     */
    cost: {type: Number}, //花费多少  单位：分
    whoShare: [], //0:洁； 1:斌； 2:娟； 3:瓜； 4:我   单位：分
    note: {type: String} //备注信息
});
var billModel = mongoose.model("bill", billSchema);
exports.Bill = billModel;