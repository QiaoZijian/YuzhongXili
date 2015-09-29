/**
 * Created by Qiao on 4/12/15.
 */
var Bill = require('../mongoModel').Bill;
var async = require('async');
exports.getRecordPage = function(req, res){
    res.render('record');
};

exports.haveALook = function (req, res) {
    Bill.find({}, function (err, bills) {
        if(err){
            console.log("find class error")
        }else{
            res.send(bills);
        }
    });
};
//提交账单
exports.submitBill = function(req, res){
//    console.log(req.body);
    var oneBill = new Bill({
        who: req.body.who,
        when: req.body.when,
        which: req.body.which,
        cost: req.body.cost,
        whoShare: JSON.parse(req.body.whoShare),
        note: req.body.note
    });
    oneBill.save(function (err) {
        if(err){
            console.log("sth error in save bill");
        }else{
            res.send({
                status: "ok"
            })
        }
    });
};
//查账
exports.queryBills = function (req, res) {
    var who = req.query.who;
    var start = req.query.start;
    var end = req.query.end;
//    console.log(who,start,end);
    Bill.
        find({who: who}).
        where('when').gt(start).lt(end).
        sort('when').
        exec(function (err, bills) {
            if(err){
                console.log("find class error")
            }else{
                res.send(bills);
            }
        });
};
//算账
exports.calcBills = function (req, res) {
    var start = req.query.start;
    var end = req.query.end;
    Bill.
        find({}).
        where('when').gt(start).lt(end).
        exec(function (err, bills) {
            if(err){
                console.log("find class error")
            }else{
                var costArray = [0,0,0];    //0:娟；1:洁；2:瓜
                var earnArray = [0,0,0];    //0:娟；1:洁；2:瓜
                var shareArray = [0,0,0,0,0];   //0:洁； 1:斌； 2:娟； 3:瓜； 4:我
                var exception = [];
                if(bills){
                    async.eachSeries(bills, function iterator(bill, callback) {
                        if(bill.whoShare.length){
                            costArray[bill.who] += bill.cost ;
                            for(var i = 0 ; i < 5 ; i++){
                                shareArray[i] += bill.whoShare[i];
                            }
                        }else{
                            exception.push(bill);
                        }
                        callback();
                    }, function done() {
                        earnArray[0] = shareArray[2];   //娟家
                        earnArray[1] = shareArray[0] + shareArray[1];   //洁家
                        earnArray[2] = shareArray[3] + shareArray[4];   //瓜家
                        res.send({
                            cost: costArray,
                            earn: earnArray,
                            exception: exception
                        });
                    });
                }else{
                    res.send({
                        cost: costArray,
                        earn: earnArray,
                        exception: exception
                    });
                }

            }
        });
};