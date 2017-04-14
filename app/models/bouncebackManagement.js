//Custome Dependency Modules
var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var AppConstants = require("./common/constants.js");
var myPromise = require("./dbOperationUtils.js");
var logger = require('../../config/logger.js');

function dbDateFormate(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate();
}

function bouncebackByTransaction(req, response, data, callback) {
    var query = "SELECT bouncebackid, claimed_bouncebackid from user_txn WHERE rid = '" + data.rid + "' AND uid='"+data.uid+"' AND txn_type='REWARD' ORDER BY created_date DESC";
    database.dbTransaction(data.req, data.response, query, function(bouncebackResult) {
        if( bouncebackResult.length > 0 ) {
            var bouncebackid = bouncebackResult[0].bouncebackid ? bouncebackResult[0].bouncebackid : null;
            if( bouncebackid ) {
                var query = "SELECT bouncebackid, bounceback_in_days, bounceback_discount, start_date, end_date from bounceback_offer WHERE rid = '" + data.rid + "' AND bouncebackid='"+ bouncebackid +"'";
                database.dbTransaction(data.req, data.response, query, function(resultset) {
                    callback(resultset);
                });
            }else{
               callback([]); 
            }
        }else{
           callback([]); 
        }
    });
}

function liveBouncebackByResto(req, response, data, callback) {
    var currentDate = dbDateFormate(new Date);
    var dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
    var query = "SELECT bouncebackid, bounceback_in_days, bounceback_discount, start_date, end_date, active from bounceback_offer WHERE rid = '" + data.rid + "' AND active=true AND " + dateRange+"";
    database.dbTransaction(req, response, query, function(resultset) {
        if (resultset) {
            callback(resultset);
        } else {
            callback([]);
        }
    });
}

function getMyLiveBounceBack(req, response) {
    try {
        var info = {};
        info.req = req;
        info.response = response;
        info.bounceBackDetails = {};
        info.input = {};
        info.input.restid = req.params.restid;
        myPromise.getRestaurantInfo(info)
        .then( info => {
           return new Promise(function(resolve,reject){
                var currentDate = dbDateFormate(new Date);
                var dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
                var query = "SELECT bouncebackid, bounceback_in_days, bounceback_discount, start_date, end_date, active from bounceback_offer WHERE rid = '" + info.restInfo.id + "' AND active=true AND " + dateRange+"";
                database.dbTransaction(info.req, info.response, query, function(resultset) {
                    if (resultset) {
                        return response.status(200).json(resultset);
                    } else {
                        return response.status(400).json({ "code": 200, "status": "DB Expections!" });
                    }
                });
            });
        })
        .catch( err => {
            return response.status(500).json({ "status" : err });
        })
    } catch (error) {
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}

function updateBounceBack(req, response) {

    
    
}

function inActiveExistingBounceBack(info) {
    return new Promise(function(resolve,reject){
        var query = "UPDATE bounceback_offer SET active = false WHERE rid = '" + info.bounceBackDetails.rid + "'";
        database.dbTransaction(info.req, info.response, query, function(resentResults) {
            if (resentResults) {
                info.isExistingBounceBackUpdated = true;
                resolve(info);
            } else {
                reject("failed");
            }
        });
    });
}

function createBounceBack(info) {
    return new Promise(function(resolve,reject){
        var collection = dbFieldsMapping.createBounceBackOffers(info.bounceBackDetails);
        var query = "INSERT INTO  bounceback_offer (" + collection.fields.join() + ") VALUES " + collection.values;                         
        database.dbTransaction(info.req, info.response, query, function(resentResults) {
            if (resentResults) {
                info.isBounceBackCreated = true;
                resolve(info);
            } else {
                reject("failed");
            }
        });
    });
}

function createOrUpdateBounceBack(req, response) {
    try {
        if(Number(req.body.bounceback_discount) < AppConstants.Constants.MAXPossibleBB){
        var info = {};
        info.req = req;
        info.response = response;
        info.bounceBackDetails = req.body;
        info.input = {};
        info.input.restid = req.body.restid;
        myPromise.getRestaurantInfo(info)
        .then( info => {
            return new Promise(function(){
                info.bounceBackDetails.rid = info.restInfo.id;
                database.getDBConnection(connection => {
                    var isExistsBounceBackQuery = "SELECT hex(bouncebackid) as bid, rid from bounceback_offer WHERE rid='"+info.restInfo.id+"' AND active=true";
                    connection.query(isExistsBounceBackQuery, function(err,rows){
                        connection.release();
                        if(!err) {
                            if(rows.length > 0){
                                inActiveExistingBounceBack(info)
                                .then( info => {
                                    if( info.isExistingBounceBackUpdated ){
                                        info.bounceBackDetails.active = true;
                                        createBounceBack(info)
                                        .then( info => {
                                            if( info.isBounceBackCreated ){
                                                return response.status(200).json({ "code": 200, "status": "Bounceback Offer created successfully!!" });
                                            }
                                        });
                                    }
                                });
                            }else{
                                info.bounceBackDetails.active = true;
                                createBounceBack(info)
                                .then( info => {
                                    if( info.isBounceBackCreated ){
                                        return response.status(200).json({ "code": 200, "status": "Bounceback Offer created successfully!!" });
                                    }
                                });
                            }
                        } else {
                            return response.status(500).json({ "status": err });
                        }        
                    });
                });   
            });
        })
        .catch( err => {
            return response.status(500).json({ "status" : err });
        })
    }else{
        return response.status(400).json({ "status": "Please enter valid number in discount(MAX - " + AppConstants.Constants.MAXPossibleBB +"% field."});
    }
    } catch (error) {
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}

function deleteBounceback(req, response) {
    try {
        var info = {};
        info.req = req;
        info.response = response;
        info.bounceBackDetails = {};
        info.input = {};
        info.input.restid = req.params.restid;
        myPromise.getRestaurantInfo(info)
        .then( info => {
            info.bounceBackDetails.rid = info.restInfo.id;
            inActiveExistingBounceBack(info)
            .then( info => {
                if( info.isExistingBounceBackUpdated ){
                    return response.status(200).json({ "code": 200, "status": "Bounceback Offer deleted successfully!!" });
                }
            });
        })
        .catch( err => {
            return response.status(500).json({ "status" : err });
        })
    } catch (error) {
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
}
module.exports = {

    create: function(req, response) {
        createOrUpdateBounceBack(req, response);
    },

    populate: function(req, response) {
        getMyLiveBounceBack(req, response);
    },

    update: function(req, response) {
        updateBounceBack(req, response);
    },

    delete: function(req, response) {
        deleteBounceback(req, response);
    },

    updatewithnew: function(req, response) {
        createOrUpdateBounceBack(req, response);
    },

    liveBouncebackByResto: function(req, response, data, callback) {
        liveBouncebackByResto(req, response, data, callback);
    }, 

    bouncebackByTransaction: function(req, response, data, callback) {
        bouncebackByTransaction(req, response, data, callback);
    }

}