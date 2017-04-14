//Custome Dependency Modules
//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var dbFieldsMapping = require(__dirname + "/../mapping.js");
var offersMgmt = require(__dirname + "/../offersManagement.js");
var waiverMgmt = require(__dirname + "/../waiverManagement.js");
var AppConstants = require(__dirname + "/../common/constants.js");
var myPromise = require(__dirname + "/../dbOperationUtils.js");
var bounceBackMgmt = require(__dirname + "/../bouncebackManagement.js");
var bounceBackMgmt = require(__dirname + "/../bouncebackManagement.js");
var logger = require('../../../config/logger.js');
var http = require('http');
var _ = require('lodash');

function newUserObj(userid,restid) {
    var user = {
        "restid": null,
        "userid": userid,
        "restid": restid, 
        "txn_type": "BONUS"
    }
    return user;
}

function getThisYearTotalPoints(req, response, data, callback) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), 0, 1);
    var lastDay = new Date(date.getFullYear(), 11 + 1, 0);
    logger.info(JSON.stringify(data));
    try {
        if (data.uid) {
            try {
                var userPointsQuery = "SELECT SUM(points) from user_txn where uid = '" + data.uid + "' and ( created_date between '" + new Date(firstDay).toMysqlFormat() + "' and '" + new Date(lastDay).toMysqlFormat() + "') order by created_date desc";
                logger.info(userPointsQuery);
                database.dbTransaction(req, response, userPointsQuery, function(userPoints) {
                    logger.info(userPoints[0]['SUM(points)']);
                    if (userPoints && userPoints.length > 0) {
                        callback(userPoints[0]['SUM(points)']);
                    } else {
                        callback(0);
                    }
                });
            } catch (error) {
                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
            }
        } else {
            return response.status(400).json({ "code": 400, "status": "User Id is Empty!!" });
        }
    } catch (error) {
        return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
    }
}

function recorduserpoints(req, response, data, callback) {
    try {
        if (data.uid) {
            try {
                var isExistUserQuery = "SELECT * from point where uid = '" + data.uid + "'";
                logger.info(isExistUserQuery);
                database.dbTransaction(req, response, isExistUserQuery, function(userPoints) {
                    logger.info('userPoints : ' + JSON.stringify(userPoints));
                    if (userPoints && userPoints.length > 0) {
                        getThisYearTotalPoints(req, response, data, function(yearPoints) {
                            var totalPoints;
                            if (data.txn_type.toUpperCase() === 'REDEEM') {
                                totalPoints = userPoints[0].total_points - data.points;
                            } else {
                                totalPoints = userPoints[0].total_points + data.points;
                            }
                            var query = "UPDATE point SET total_points = '" + totalPoints + "', this_year_points = '" + yearPoints + "' WHERE id = '" + userPoints[0].id + "'";
                            logger.info('Query : ' + query);
                            database.dbTransaction(req, response, query, function(resultSet) {
                                if (resultSet) {
                                    callback();
                                } else {
                                    return response.status(400).json({ "code": 400, "status": "failed to update user points table" });
                                }
                            });
                        });
                    } else {
                        data.total_points = data.points;
                        data.this_year_points = data.points;
                        var collection = dbFieldsMapping.userPoints(data);
                        logger.info(JSON.stringify(collection));
                        var query = "INSERT INTO  point (" + collection.fields.join() + ") VALUES " + collection.values;
                        logger.info(query);
                        database.dbTransaction(req, response, query, function(resultSet) {
                            if (resultSet) {
                                callback();
                            } else {
                                return response.status(400).json({ "code": 400, "status": "failed to update user points table" });
                            }
                        });
                    }
                });
            } catch (error) {
                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
            }
        } else {
            return response.status(400).json({ "code": 400, "status": "User Id is Empty!!" });
        }
    } catch (error) {
        return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
    }
}

function calculateTransPoints(req, response, data, callback) {
    var myPointsQuery = "SELECT * from point where uid = '" + data.uid + "'";
    database.dbTransaction(req, response, myPointsQuery, function(userPoints) {
        callback(userPoints[0]);
    });
}

function redeemPointsByTrans(userPoints, invoiceInfo) {
    logger.info('Redeem triggred');
    if (invoiceInfo.isMaxRedeem) {
        if (userPoints.total_points && userPoints.total_points <= (invoiceInfo.bill_amount / 2)) {
            invoiceInfo.points = Math.round(userPoints.total_points);
        } else if (userPoints.total_points && userPoints.total_points > (invoiceInfo.bill_amount / 2)) {
            invoiceInfo.points = Math.round((invoiceInfo.bill_amount / 2));
        }
    } else {
        var points = invoiceInfo.points;
        var total_points = userPoints.total_points;
        var bill_amount = invoiceInfo.bill_amount;
        if((total_points >= points) && (points <= (bill_amount /2 ))){
            invoiceInfo.points  = Math.round(points);
        }else if((total_points >= points) && (points > (bill_amount / 2 ))){
            invoiceInfo.points  = Math.round((bill_amount / 2));
        }else if((total_points <= points) && (total_points <= (bill_amount / 2 ))){
            invoiceInfo.points  = Math.round(total_points);
        }else if((total_points <= points) && (total_points > (bill_amount /2 ))){
            invoiceInfo.points  = Math.round((bill_amount / 2));
        }else{
            invoiceInfo.points  = 0;
        }
        /*
        if (userPoints.total_points && invoiceInfo.points > (invoiceInfo.bill_amount / 2)) {
            invoiceInfo.points = Math.round((invoiceInfo.bill_amount / 2));
        } else if (!userPoints.total_points) {
            invoiceInfo.points = 0;
        }
        */
    }
    logger.info('After redeem : ' + JSON.stringify(invoiceInfo));
    return invoiceInfo;
}

function getMyRewardPoints(req, response, data, callback) {
    offersMgmt.populateByTimeRange(req, response, data, function(activeOffer) {
        if( activeOffer.offerid ){
            callback(activeOffer);
        }else{
            AppConstants.defaultOffer(req, response, function(defaultOffer){
                callback(defaultOffer);
            });
        }
    });
}

function calculateStarllyCommision(req, response, data, callback) {
    //Starlly Commitions Calculations
    var commisionPercentage, applyCommision;
    if( data.offerDetails && data.txn_type !== 'BONUS') {
        for( var commision = 0; commision < req.app.constants.Commision.Loyalty.length; commision++) {
            if( data.offerDetails.discount >= req.app.constants.Commision.Loyalty[commision].offersRange.min && data.offerDetails.discount <= req.app.constants.Commision.Loyalty[commision].offersRange.max){
                applyCommision = req.app.constants.Commision.Loyalty[commision];
            }
        }
        if( applyCommision && data.offerDetails.discount > 0){
            commisionPercentage = applyCommision.commisionPercentage.base + parseFloat(parseFloat((( data.offerDetails.discount - applyCommision.offersRange.min ) * applyCommision.commisionPercentage.additional ) / 100).toFixed(1));
        }else{
            commisionPercentage =  0;
        }
        data.starlly_commision = data.bill_amount * ( parseFloat(commisionPercentage).toFixed(2) / 100 );
    }else{
        data.starlly_commision = 0;
    }
    //Starlly Wavier Calculations
    if( data.rid ) {
        waiverMgmt.waiverInfoByRid(req, response, data.rid, function(waiverInfo) {
            if (waiverInfo.length > 0) {
                waiverInfo = waiverInfo[0];
                data.commission_discount_percentage = waiverInfo.starlly_discount_on_commission;
                if( data.txn_type === 'BONUS' ) {
                    var restIncentiveQuery = "INSERT INTO restaurant_txn (rid, points, txn_type) VALUES (" + data.rid +","+ waiverInfo.incentive +"," + "'INCENTIVE'"+")";
                    database.dbTransaction(req, response, restIncentiveQuery, function(resultSet) {
                        callback(data);
                    });
                }else{
                   callback(data); 
                }
            } else {
                data.commission_discount_percentage = 0;
                callback(data);
            }
        });
    } else {
        data.starlly_commision = 0;
        data.commission_discount_percentage = 0;
        callback(data);
    }
}

function liveBouncebackOfferByTransaction(req, response, data, callback) {
    bounceBackMgmt.liveBouncebackByResto(req, response, data, function(livebounceBackOffer) {
        if( livebounceBackOffer.length ){
            callback(livebounceBackOffer);
        }else {
            callback([]);
        }
    });
}

function userTransactions(req, response, data, callback) {
    calculateStarllyCommision(req, response, data, function(data) {
        liveBouncebackOfferByTransaction(req, response, data, function(liveBouncebackOffer) {
            data.bouncebackid = liveBouncebackOffer.length > 0 ? liveBouncebackOffer[0].bouncebackid : null;
            var collection = dbFieldsMapping.userTransaction(data);
            var query = "INSERT INTO user_txn (" + collection.fields.join() + ") VALUES " + collection.values;
            logger.info('Insert Query..........' + query);
            database.dbTransaction(req, response, query, function(resultSet) {
                if (resultSet) {
                    recorduserpoints(req, response, data, function() {
                        var fetchRecord = "SELECT points, invoice_no, bill_amount, total_points FROM user_txn AS t LEFT JOIN point AS p ON t.uid = p.uid where t.id='" + resultSet.insertId + "'";
                        logger.info('fetchRecord Query..........' + fetchRecord);
                        database.dbTransaction(req, response, fetchRecord, function(transaction) {
                            if (transaction.length > 0) {
                                callback(transaction[0]);
                            } else {
                                return response.status(400).json({ "code": 400, "status": "failed" });
                            }
                        });
                    });
                } else {
                    return response.status(400).json({ "code": 400, "status": "failed" });
                }
            });
        });
    });
}

function bouncebackOfferByTransaction(req, response, data, callback) {
    bounceBackMgmt.bouncebackByTransaction(req, response, data, function(bounceBackOffer) {
        if( bounceBackOffer.length ){
            callback(bounceBackOffer);
        }else {
            callback([]);
        }
    });
}

function rewardTransaction(req, response, data, callback) {
    getMyRewardPoints(req, response, data, function(activeOffer) {
        data.offerDetails = activeOffer;
        bouncebackOfferByTransaction(req, response, data, function(bounceBackOffer) {
            logger.info(JSON.stringify(bounceBackOffer));
            data.bounceBackDiscount = bounceBackOffer.length > 0 ? bounceBackOffer[0].bounceback_discount : 0;
            data.claimed_bouncebackid = bounceBackOffer.length > 0 ? bounceBackOffer[0].bouncebackid : null;
            data.points = parseInt(data.payable_amount * ((data.offerDetails.discount + data.bounceBackDiscount) / 100));
            userTransactions(req, response, data, function(transaction) {
                transaction.redeem_point = (data.redeem_point) ? data.redeem_point : 0;
                transaction.reward_points = data.points;
                transaction.payable_amount = (data.payable_amount) ? data.payable_amount : data.bill_amount;
                delete transaction.points;
                callback(transaction);
            });
        });
    });
}

function typeOfUserTransactions(req, response, data, callback) {
    data.points = (data.points) ? data.points : 0;
    calculateTransPoints(req, response, data, function(userPoints) {
        if (data.txn_type.toUpperCase() === 'REDEEM') {
            data = redeemPointsByTrans(userPoints, data);
            
            userTransactions(req, response, data, function(redeemTransaction) {
                data.txn_type = 'REWARD';
                data.redeem_point = data.points;
                data.payable_amount = data.bill_amount - data.redeem_point;
                data.points = 0;
                rewardTransaction(req, response, data, function(transaction) {
                    callback(transaction);
                });
            });
        } else if (data.txn_type.toUpperCase() === 'REWARD') {
            data.payable_amount = data.bill_amount;
            rewardTransaction(req, response, data, function(transaction) {
                callback(transaction);
            });
        } else {
            userTransactions(req, response, data, function(transaction) {
                callback(transaction);
            });
        }
    });
}

function transaction(req, response, data, callback) {
    try {
        if (data.userid) {
            try {
                var userSetQuery = "SELECT id, firstname, phone from user where uid = unhex('" + data.userid + "')";
                database.dbTransaction(req, response, userSetQuery, function(resultSet) {
                    if (resultSet.length == 0) {
                        return response.status(400).json({ "code": 400, "status": " Invalid User Id.!!" });
                    } else {
                        if (data.restid) {
                            try {
                                var user_id = "SELECT id, name from restaurant where rid = unhex('" + data.restid + "')";
                                database.dbTransaction(req, response, user_id, function(resultSetForRestQuery) {
                                    if (resultSetForRestQuery.length == 0) {
                                        return response.status(400).json({ "code": 400, "status": " Invalid restaurant Id.!!" });
                                    } else {
                                        try {
                                            var user_id = "SELECT id from review where reviewid = unhex('" + data.reviewid + "')";
                                            database.dbTransaction(req, response, user_id, function(reviewRecord) {
                                                data.uid = resultSet[0].id;
                                                data.customer = resultSet[0].firstname;
                                                data.phone = resultSet[0].phone;
                                                data.rid = resultSetForRestQuery[0].id;
                                                data.restaurant = resultSetForRestQuery[0].name;
                                                data.reviewid = (reviewRecord.length > 0) ? reviewRecord[0].id : null;
                                                // Need to check if invoice is already precessed for this review id.
                                                // To avoid duplicate transation.
                                                var user_txn_query = "SELECT * from user_txn where uid = " + data.uid + " AND rid = " + data.rid + " AND reviewid = " + data.reviewid;
                                                database.dbTransaction(req,response,user_txn_query, function(txnRecord){
                                                    if(txnRecord.length == 0){
                                                        // New Txn Request processing....
                                                        typeOfUserTransactions(req, response, data, function(transaction) {
                                                            callback(transaction, data);
                                                        });
                                                    }else{
                                                        //Duplicate Txn Request Processing....
                                                        var fetchRecord = "SELECT total_points FROM point  where uid = " + data.uid;
                                                        database.dbTransaction(req, response, fetchRecord, function(transaction) {
                                                        if (transaction.length > 0) {
                                                            transaction[0].invoice_no = data.invoice_no;
                                                            transaction[0].bill_amount = data.bill_amount;
                                                            for(var i = 0 ; i < txnRecord.length ; i++){
                                                                if(txnRecord[i].txn_type == "REWARD"){
                                                                    transaction[0].reward_points = txnRecord[i].points;
                                                                }
                                                                if(txnRecord[i].txn_type == "REDEEM"){
                                                                    transaction[0].redeem_point =  txnRecord[i].points;
                                                                    transaction[0].payable_amount = data.bill_amount - txnRecord[i].points;
                                                                }
                                                            }
                                                            callback(transaction[0], data);
                                                        } else {
                                                            return response.status(400).json({ "code": 400, "status": "failed" });
                                                        }
                                                        });
                                                    }
                                                }); 
                                            });
                                        } catch (error) {
                                            return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                                        }
                                    }
                                });
                            } catch (error) {
                                return response.status(400).json({ "code": 400, "status": "Internal Error!!" });
                            }
                        } else {
                            try {
                                var user_id = "SELECT id from review where reviewid = unhex('" + data.reviewid + "')";
                                database.dbTransaction(req, response, user_id, function(reviewRecord) {
                                    data.uid = resultSet[0].id;
                                    data.rid = null;
                                    data.customer = resultSet[0].firstname;
                                    data.phone = resultSet[0].firstname;
                                    data.reviewid = (reviewRecord.length > 0) ? reviewRecord[0].id : null;
                                    typeOfUserTransactions(req, response, data, function(transaction) {
                                        callback(transaction, data);
                                    });
                                    //data.points = (data.bill_amount - data.redeem_point) * 0.1; //Hard Coded 10%
                                });
                            } catch (error) {
                                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                            }
                        }
                    }
                });

            } catch (error) {
                return response.status(400).json({ "code": 400, "status": "Internal Error!!" });
            }
        } else {
            return response.status(400).json({ "code": 400, "status": "Restaurant Id is Empty!!" });
        }
    } catch (error) {
        return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
    }
}

function calculateInvoiceTxn(req, response, data) {
    try {
        var info = {};
        info.input = data;
        myPromise.getUserAndPointInfo(info)
        .then( info => {
            return myPromise.getRestaurantInfo(info);
        })
        .then( info => {
            return myPromise.validateInvoiceNumber(info);
        })
        .then( info => {
            return myPromise.getCurrentRunningOffer(info);
        })
        .then( info => {
            return myPromise.getBillDetails(info);
        })
        .then( billInfo => {
            return response.status(200).json(billInfo);
        })
        .catch( err => {
            return response.status(500).json({ "status" : err });
        })
    } catch (error) {
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}
function getIntervalInfo(interval){
    var dateRange = {};
    var start = new Date();
    var end = new Date();
    if(interval.toUpperCase() === 'WEEKLY'){
        end.setDate(start.getDate() - 7);
    }else if(interval.toUpperCase() === 'MONTHLY'){
        end.setDate(start.getDate() - 30);
    }else if(interval.toUpperCase() === 'YEARLY'){
        end.setDate(start.getDate() - 356);
    }
    dateRange.end = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
    dateRange.start = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 00:00:00";
    return dateRange;
}

function txnReportByResto(req, response) {
    try {
        var info = {};
        info.input = {};
        info.input.restid = req.params.restid;
        info.input.intervalInfo = getIntervalInfo(req.params.interval);	
        myPromise.getRestaurantInfo(info)
        .then( info => {
            return new Promise(function(){
                database.getDBConnection(connection => {
                    var reportQuery = "SELECT t.created_date as dateTime, t.id as txnId, u.phone as customerId, t.invoice_no as invoiceNo," + 
                        "t.bill_amount as invoiceAmount, t.txn_type as txnType, t.points as points, t.starlly_commision as starllyCommision, "+
                        "t.commission_discount_percentage as commissionDiscountPercentage, o.discount as offerPercentage, "+
                        "r.value as defaultOfferPercentage, bb_o.bounceback_discount as bounceBackDiscount, "+
                        "IFNULL((select 'N' as isnew from starlly_t.user_txn as ttt where ttt.rid=t.rid " +
                        "AND ttt.txn_type='REWARD' and ttt.uid = t.uid having created_date = min(created_date)), 'Y') as isrepeat "+
                        "FROM user_txn AS t LEFT JOIN user AS u ON t.uid = u.id "+
                        "LEFT JOIN offer AS o ON t.offerid = o.offerid "+
                        "LEFT JOIN rules AS r ON r.name = 'STARLLY_DEFAULT_OFFER' "+
                        "LEFT JOIN bounceback_offer AS bb_o ON t.claimed_bouncebackid = bb_o.bouncebackid "+
                        "WHERE t.rid = "+info.restInfo.id+" AND t.txn_type != 'BONUS' "+
                        "AND STR_TO_DATE('"+info.input.intervalInfo.start+"','%Y-%m-%d') <= STR_TO_DATE(t.created_date,'%Y-%m-%d') "+
                        "AND STR_TO_DATE('"+info.input.intervalInfo.end+"','%Y-%m-%d') >= STR_TO_DATE(t.created_date,'%Y-%m-%d') "+
                        "ORDER BY t.created_date DESC";
                    console.log(reportQuery);
                    connection.query(reportQuery, function(err,rows){
                        connection.release();
                        if(!err) {
                            if(rows.length > 0){
                                var uniqueRecordSet = _.uniqBy(rows, 'invoiceNo');
                                var recordSet  = _.groupBy(rows, 'invoiceNo');
                                var resultSet  = {};
                                resultSet.data = [];
                                for(var i = 0; i < uniqueRecordSet.length; i++){
                                    var redeemRecord = _.filter(recordSet[uniqueRecordSet[i].invoiceNo], { 'txnType': 'REDEEM' })[0];
                                    var rewardRecord = _.filter(recordSet[uniqueRecordSet[i].invoiceNo], { 'txnType': 'REWARD' })[0];
                                    var rowRecord = rewardRecord ? rewardRecord : redeemRecord;
                                    rowRecord.repeat = rowRecord.isrepeat;
                                    rowRecord.bounceBackAmt = (rowRecord.invoiceAmount - (redeemRecord && redeemRecord.points ? redeemRecord.points : 0)) * ((rewardRecord.bounceBackDiscount ? rewardRecord.bounceBackDiscount : 0)/100);
                                    rowRecord.redemptionAmt = redeemRecord && redeemRecord.points ? redeemRecord.points : 0;
                                    rowRecord.rewardAmt = rewardRecord.points - rowRecord.bounceBackAmt;
                                    rowRecord.totalAmt = rowRecord.rewardAmt + rowRecord.bounceBackAmt + rewardRecord.starllyCommision;
                                    rowRecord.netAmt = rowRecord.totalAmt - rowRecord.redemptionAmt;
                                    //mask the customer id
									
                                    rowRecord.customerId = rowRecord.customerId.replace(rowRecord.customerId.substring(2,7), 'XXXXX');
                                    resultSet.data.push(rowRecord);
                                }
                                resultSet.count = resultSet.data.length;
                                return response.status(200).json(resultSet);
                            }else{
                                return response.status(204).json({ "status": "No Records Found" });
                            }
                        } else {
                            return response.status(500).json({ "status": err });
                        }        
                    });
                });   
            });
        })
        .catch( err => {
            logger.info(err);
            return response.status(500).json({ "status" : err });
        })
    } catch (error) {
        logger.info(error);
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}

function sendsms(req, response, whom, message, transaction, callback) {
    whom = (whom.length == 10) ? 91 + whom : whom;
    var options = {
        host: req.app._sms.host,
        path: req.app._sms.path.replace('{to}', whom).replace('{message}', message).replace(/ /g, '%20'),
        method: 'GET'
    }

    logger.info(options.host + options.path);
    var request = http.request(options.host + options.path, function(res) {
        var body = ""
        res.on('data', function(data) {
            body += data;
        });
        res.on('end', function() {
            callback(transaction);
        });
    });

    request.on('error', function(e) {
        logger.info('Problem with request: ' + e.message);
    });

    request.end();
}

function validateInvoiceDetails(req, response) {
    try {
        var info = {};
        info.input = {};
        info.input.restid = req.body.restid;
        info.data = req.body;
        info.req = req;
        info.response = response;
        myPromise.getRestaurantInfo(info)
        .then( info => {
            return new Promise(function(resolve,reject){
                database.getDBConnection(connection => {
                    var isExistsQuery = "SELECT invoice_no from user_txn where rid ='"+info.restInfo.id+"' AND invoice_no = '"+info.data.invoice_no+"'";
                    connection.query(isExistsQuery, function(err,rows){
                        connection.release();
                        if(!err) {
                            if(rows.length > 0){
                                return response.status(400).json({ "code": 400, "status": "Invoice no. already exists, please try different one." });
                            }else{
                                if(req.body.bill_amount.toString().length > 8 ) {
                                    return response.status(400).json({ "code": 400, "status": "Invalid Bill Amount" });
                                } else {
                                    myPromise.updateReviewDetails(info.data);
                                    transaction(info.req, info.response, info.data, function(transaction, details) {
                                        var smsTemplate = req.app.constants.SMSTemplates.TransactionComplete.replace('{customer}', (details.customer != null && details.customer != undefined && details.customer != 'undefined' && details.customer != '') ? details.customer : 'Customer').replace('{restaurant}', details.restaurant).replace('{earned}', transaction.reward_points).replace('{redeemed}', transaction.redeem_point).replace('{total}', transaction.total_points);
                                        if( details.phone ) {
                                            sendsms(info.req, info.response, details.phone, smsTemplate, transaction, function(transaction) {
                                                transaction.status = "Invoice submission success!!"
                                                return response.status(200).json(transaction);
                                            });
                                        }else{
                                            transaction.status = "Invoice submission success!!"
                                            return response.status(200).json(transaction);
                                        }
                                    });
                                }
                            }
                        } else {
                            return response.status(500).json({ "status": err });
                        }        
                    });
                });   
            });
        })
        .catch( err => {
            logger.info(err);
            return response.status(500).json({ "status" : err });
        })
    } catch (error) {
        logger.info(error);
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}

function invcePeriodByResto(req, response){
	 try {
		 var info = {};
        info.input = {};
        info.input.restid = req.params.restid;
        myPromise.getRestaurantInfo(info)
		.then( info => {
		return new Promise(function(){
		database.getDBConnection(connection => {
		 var invoicePeriodQuery = "SELECT id as invoiceId, created_date as invoiceCreatedDate FROM invoice WHERE "+
		                          "rid = "+info.restInfo.id+" ORDER BY id desc";
        connection.query(invoicePeriodQuery, function(err,rows){
		connection.release();
		if(!err) {
		if(rows.length > 0){
			return response.status(200).json(rows);
	       }
         else{
             return response.status(204).json({ "status": "No Records Found" });
               }			   
		     }
		  });
        });   
        });
        });		
		
		 
	 } catch (error) {
        logger.info(error);
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}


function invceReportByResto(req, response){
	 try {
		 var info = {};
        info.input = {};
        info.input.restid = req.params.restid;
		info.input.invoiceId = req.params.invoiceId;
        myPromise.getRestaurantInfo(info)
		.then( info => {
		return new Promise(function(){
		database.getDBConnection(connection => {
		 var invoiceReportQuery = "SELECT * FROM invoice WHERE "+
		                          "rid = "+info.restInfo.id+" AND id="+info.input.invoiceId+"";
        connection.query(invoiceReportQuery, function(err,rows){
		connection.release();
		if(!err) {
		if(rows.length > 0){
			return response.status(200).json(rows);
	       }
         else{
             return response.status(204).json({ "status": "No Records Found" });
               }			   
		     }
		  });
        });   
        });
        });		
		
		 
	 } catch (error) {
        logger.info(error);
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}

module.exports = {

    newuser: function(req, response, userid, restid, callback) {
        var data = newUserObj(userid, restid);
        var ruleQuery = "SELECT value from rules where name = 'STARLLY_NEW_USER_BONUS_POINT'";
        database.dbTransaction(req, response , ruleQuery , function(newUserBonusPoint){
            data.points = newUserBonusPoint[0].value;
            transaction(req, response, data, function(transaction) {
                callback(transaction);
            });
        });                                                         
    },

    invoice: function(req, response) {
        validateInvoiceDetails(req, response);
    },

    calculate: function(req, response) {
        calculateInvoiceTxn(req, response, req.body);
    },

    transactionReportByResto: function(req, response) {
        txnReportByResto(req, response);
    },
	invoicePeriodByResto: function(req, response) {
        invcePeriodByResto(req, response);
    },
	invoiceReportByResto: function(req, response) {
        invceReportByResto(req, response);
    }

}
