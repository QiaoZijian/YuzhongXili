/**
 * Created by Qiao on 4/12/15.
 */
var Bill = require('../mongoModel').Bill;
exports.getRecordPage = function(req, res){
    res.render('record');
};
exports.getQueryPage = function(req, res){
    res.render('query');
};

exports.haveALook = function (req, res) {
    Bill.find({},'who when cost whoShare', function (err, bills) {
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