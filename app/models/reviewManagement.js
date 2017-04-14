var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var otpMgmt = require("./otpTransactions.js");
var myPromise = require("./dbOperationUtils.js");
var logger = require('../../config/logger.js');
var EventEmitter = require('events');

function reviewSummaryEventHandler(reqbody){
    "use strict";
    class MyEmitter extends EventEmitter {}
    var myEmitter = new MyEmitter();
    var avgreview = (reqbody.variety_rating + reqbody.taste_rating + reqbody.service_rating)/3;
    
    myEmitter.once('reviewevent', function(points,rid){
        logger.info('Update review summary for the restaurant.');
        database.getDBConnection(con =>{
            var selectQuery = "SELECT `user_count`,`overall_rating` FROM `rating_summary` WHERE `rid` = ?";
            con.query(selectQuery,[rid],function(err, rows){
                if(rows.length > 0){
                    var uc = rows[0].user_count;
                    var or = rows[0].overall_rating;
                    var new_or = ((or * uc ) + points ) / (uc + 1);
                    var query = "UPDATE `rating_summary` SET `user_count` = `user_count` + 1 , `overall_rating` = ROUND( ? , 1 ) WHERE `rid` = ?";
                        con.query(query,[new_or,rid],function(err, result){
                            if(!err) logger.info('Review summary updated successfuly');
                        });
                }
            })
        });
    });

    myEmitter.emit('reviewevent', avgreview , reqbody.rid);                                                           
}
function deleteReviewSummaryEventHandler(reqbody){
    "use strict";
    class MyEmitter extends EventEmitter {}
    var myEmitter = new MyEmitter();
    var avgreview = (reqbody.variety_rating + reqbody.taste_rating + reqbody.service_rating)/3;
    myEmitter.once('deletereviewevent', function(points,rid){
        logger.info('Update review summary for the restaurant.');
        database.getDBConnection(con =>{
            var selectQuery = "SELECT `user_count`,`overall_rating` FROM `rating_summary` WHERE `rid` = ?";
            con.query(selectQuery,[rid],function(err, rows){
                if(rows.length > 0){
                    var uc = rows[0].user_count;
                    var or = rows[0].overall_rating;
                    var new_or = ((or * uc ) - points ) / (uc - 1);
                    var query = "UPDATE `rating_summary` SET `user_count` = `user_count` - 1 , `overall_rating` = ROUND( ? , 1 ) WHERE `rid` = ?";
                        con.query(query,[new_or,rid],function(err, result){
                            if(!err) logger.info('Review summary updated successfuly');
                        });
                }
            })
        });
    });
    myEmitter.emit('deletereviewevent', avgreview , reqbody.rid);                                                           
}


function deleteReviewById(req, response, reviewId){
    var info = {};
    info.reviewId = req.headers['reviewid'];
    myPromise.getReviewById(info)
    .then( info => {
        deleteReviewSummaryEventHandler(info.review);
        return myPromise.deleteReviewById(info)
    })
    .then(info =>{
        delete info.review;
        return response.status(200).json(info);
    })
    .catch(err =>{
        return response.status(400).json({ "status" : err });
    })
}

module.exports = {

    submit: function(req, response) {
        try {
            if (req.body.restid) {
                try {
                    var restaurant_id = "SELECT id from restaurant where rid = unhex('" + req.body.restid + "')";
                    database.dbTransaction(req, response, restaurant_id, function(resultSet) {
                        if (resultSet.length == 0) {
                            return response.status(400).json({ "code": 400, "status": " Invalid Restaurant Id.!!" });
                        } else {
                            if (req.body.userid) {
                                try {
                                    var user_id = "SELECT id, phone from user where uid = unhex('" + req.body.userid + "')";
                                    database.dbTransaction(req, response, user_id, function(resultSetForUserQuery) {
                                        if (resultSetForUserQuery.length == 0) {
                                            return response.status(400).json({ "code": 400, "status": " Invalid User Id.!!" });
                                        } else {
                                            // UserId and RestaurantId both valid now add review.
                                            var reqbody = req.body;
                                            reqbody.rid = resultSet[0].id;
                                            reqbody.uid = resultSetForUserQuery[0].id;
                                            try {
                                                var collection = dbFieldsMapping.submitReview(reqbody);
                                                var query = "INSERT INTO review (" + collection.fields.join() + ") VALUES " + collection.values;

                                                database.dbTransaction(req, response, query, function(resultSet) {
                                                    logger.info(JSON.stringify(resultSet));
                                                    if (resultSet) {
                                                        var fetchRecord = "SELECT hex(reviewid) as reviewid from review where id='" + resultSet.insertId + "'";
                                                        database.dbTransaction(req, response, fetchRecord, function(record) {
                                                            var smsMessage;
                                                            if (req.body.isNewUser) {
                                                                smsMessage = 'OTP for starlly is {OPT}. Welcome to StarLLy. Please use the OTP for verification of your mobile number. This is valid only for 5 mins. Bon Appetite!'
                                                            } else if (req.body.isRedeem) {
                                                                smsMessage = 'OTP for starlly is {OPT} to redeem your points.'
                                                            } else {
                                                                smsMessage = 'OTP for starlly is {OPT} to verify your accounts.';
                                                            }
                                                            otpMgmt.sendOTP(req, response, resultSetForUserQuery[0].phone, smsMessage, req.body.userid, function() {
                                                                reviewSummaryEventHandler(reqbody);
                                                                return response.status(200).json({ "code": 200, "status": "Review submited successfuly!! and OTP is sent by " + resultSetForUserQuery[0].phone, "reviewid": record[0].reviewid });
                                                            });
                                                        });
                                                    } else {
                                                        return response.status(400).json({ "code": 400, "status": "failed" });
                                                    }
                                                });
                                            } catch (error) {
                                                logger.info(error.message);
                                                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                                            }
                                        }
                                    });
                                } catch (error) {
                                    return response.status(400).json({ "code": 400, "status": "Internal Error!!" });
                                }
                            } else {
                                // This is to add annonimous review.
                                var reqbody = req.body;
                                reqbody.rid = resultSet[0].id;
                                reqbody.uid = null;
                                try {
                                    var collection = dbFieldsMapping.submitReview(reqbody);
                                    var query = "INSERT INTO review (" + collection.fields.join() + ") VALUES " + collection.values;

                                    database.dbTransaction(req, response, query, function(resultSet) {
                                        logger.info(JSON.stringify(resultSet));
                                        if (resultSet) {
                                            return response.status(200).json({ "code": 200, "status": "Review submitted successfuly" });
                                        } else {
                                            return response.status(400).json({ "code": 400, "status": "failed" });
                                        }
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
    },
    delete: function(req,response){
        deleteReviewById(req, response);
    }

}
