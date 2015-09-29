var express = require('express');
var serveModel = require('../models/serveModel.js');
var router = express.Router();

/* GET  */
router.get('/record', serveModel.getRecordPage);
router.get('/look', serveModel.haveALook);
router.get('/calcBills', serveModel.calcBills);
router.get('/queryBills', serveModel.queryBills);

/* POST */
router.post('/submitBill', serveModel.submitBill);

module.exports = router;
