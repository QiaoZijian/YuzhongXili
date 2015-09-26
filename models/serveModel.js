/**
 * Created by Qiao on 4/12/15.
 */
var Bill = require('../mongoModel').Bill;
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