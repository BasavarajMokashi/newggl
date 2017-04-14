//Custome Dependency Modules
var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var AppConstants = require(__dirname + "/common/constants.js");
var logger = require('../../config/logger.js');

var dbDateFormate = function(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate();
}

var getOfferInfo = function(info){
    return new Promise(function(resolve,reject){
        var offerQuery = "SELECT id,offerid,rid,name,discount,offer_status,start_date,end_date,BIN(days) as days,start_time,end_time,created_date,updated_date from offer WHERE offerid = unhex('" + info.offerid + "')";
        database.dbTransaction(info.req, info.response, offerQuery, function(resultSet) {
            if (resultSet.length > 0) {
                console.log(resultSet[0]);
                info.offerInfo = resultSet[0];
                resolve(info);
            }else{
                reject("Invalid offerid!!");
            }
        });
    });
}

var getOfferUpdateHours = function(info){
    return new Promise(function(resolve,reject){
        var offerUpdatePolicyQuery  = "SELECT value from rules WHERE name = 'STARLLY_OFFER_UPDATE_HOUR'";
        database.dbTransaction(info.req, info.response, offerUpdatePolicyQuery, function(resultSet) {
            if (resultSet.length > 0) {
                info.hours = resultSet[0].value;
                resolve(info);
            }else{
                reject("Invalid rule!!");
            }
        });
    });
}
var updateOffer = function(info){
    return new Promise(function(resolve,reject){
        database.getDBConnection(con => {
            var offerInfo = info.req.body;
            var updateQuery = "UPDATE offer SET name = ?,discount = ?,end_date = ? WHERE offerid = unhex(?)";
            con.query(updateQuery,[offerInfo.name,offerInfo.discount,offerInfo.end_date,offerInfo.offerid],function(err,rows){
            if(rows){
                info.updateOfferMsg = 'success';
                resolve(info);
            }else{
                reject("failed");
            }
        }) 
        })
    });
}

var createNewOffer = function(info){
    return new Promise(function(resolve,reject){
    var updatedOffer = {};
    var today = new Date();
    today = today.setDate(today.getDate() + 1);
    updatedOffer.rid = info.offerInfo.rid;
    updatedOffer.name = info.req.body.name;
    updatedOffer.discount = info.req.body.discount;
    updatedOffer.offer_status = info.offerInfo.offer_status;
    updatedOffer.start_date = dbDateFormate(new Date(today));
    updatedOffer.end_date = dbDateFormate(new Date(info.req.body.end_date));
    updatedOffer.days = info.offerInfo.days;
    updatedOffer.start_time = info.offerInfo.start_time;
    updatedOffer.end_time = info.offerInfo.end_time;
    logger.info(updatedOffer);
    var collection = dbFieldsMapping.createOffers(updatedOffer);
        var query = "INSERT INTO  offer (" + collection.fields.join() + ") VALUES " + collection.values;
        database.dbTransaction(info.req, info.response, query, function(offerResult) {
            if (offerResult) {
                return resolve(info);
            } else {
                return reject('failed');
            }
        }); 
    })
    
}


var createNewOfferWithTodayASStartDate = function(info){
    return new Promise(function(resolve,reject){
    console.log(info.offerInfo.days);
    var updatedOffer = {};
    updatedOffer.rid = info.offerInfo.rid;
    updatedOffer.name = info.req.body.name;
    updatedOffer.discount = info.req.body.discount;
    updatedOffer.offer_status = info.offerInfo.offer_status;
    updatedOffer.start_date = dbDateFormate(new Date());
    updatedOffer.end_date = dbDateFormate(new Date(info.req.body.end_date));
    updatedOffer.days = info.offerInfo.days;
    updatedOffer.start_time = info.offerInfo.start_time;
    updatedOffer.end_time = info.offerInfo.end_time;
    console.log(updatedOffer);

    var collection = dbFieldsMapping.createOffers(updatedOffer);
        var query = "INSERT INTO  offer (" + collection.fields.join() + ") VALUES " + collection.values;
        database.dbTransaction(info.req, info.response, query, function(offerResult) {
            if (offerResult) {
                return resolve(info);
            } else {
                return reject('failed');
            }
        }); 
    })
    
}

var updateOfferEndDateToToday = function(info){
    return new Promise(function(resolve,reject){
        var date = new Date();
        var end_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var updateQuery = "UPDATE offer SET end_date = '" + end_date + "' WHERE offerid = unhex('" + info.offerid + "')";
        database.dbTransaction(info.req, info.response, updateQuery, function(resultSet) {
        if (resultSet.affectedRows === 1) {
            info.updateOfferMsg = 'success';
            resolve(info);
        } else {
            reject("Failed to update record");
        }
        });
    });
}

var exireCurrentOffer = function(info){
    return new Promise(function(resolve,reject){
        var date = new Date();
        var end_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var updateQuery = "UPDATE offer SET offer_status = 'EXPIRED', end_date = '" + end_date + "' WHERE offerid = unhex('" + info.offerid + "')";
        database.dbTransaction(info.req, info.response, updateQuery, function(resultSet) {
        if (resultSet.affectedRows === 1) {
            info.updateOfferMsg = 'success';
            resolve(info);
        } else {
            reject("Failed to update offer");
        }
        });
    });
}

var updateOfferEndDate = function(info){
    return new Promise(function(resolve,reject){
        var date = new Date(new Date().getTime() + ( info.hours * 60 * 60 * 1000));
        var end_date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var updateQuery = "UPDATE offer SET end_date = '" + end_date + "' WHERE offerid = unhex('" + info.offerid + "')";
        database.dbTransaction(info.req, info.response, updateQuery, function(resultSet) {
        if (resultSet) {
            info.status = "Offer will expire in next " + info.hours + " hours";
            resolve(info);
        } else {
            reject("Failed to update record");
        }
    });
    });
}

var deleteOffer = function(info){
    return new Promise(function(resolve,reject){
        var deleteQuery = "DELETE from offer WHERE offerid = unhex('" + info.offerid + "')";
        database.dbTransaction(info.req, info.response, deleteQuery, function(resultSet) {
        if (resultSet) {
            info.status = "Offer deleted successfully.";
            resolve(info);
        } else {
            reject("Failed to update record.");
        }
    });
    });
}

module.exports = {

    create: function(req, response) {
        try {
            if (req.body.restid) {
                if(Number(req.body.discount) < AppConstants.Constants.MAXPossibleOffer){
                try {
                    var popRestoQuery = "SELECT id from restaurant WHERE rid = unhex('" + req.body.restid + "')";
                    database.dbTransaction(req, response, popRestoQuery, function(resultSet) {
                        if (resultSet && resultSet.length > 0) {
                            try {
                                req.body.rid = resultSet[0].id;
                                var collection = dbFieldsMapping.createOffers(req.body);
                                var query = "INSERT INTO  offer (" + collection.fields.join() + ") VALUES " + collection.values;
                                database.dbTransaction(req, response, query, function(offerResult) {
                                    if (offerResult) {
                                        return response.status(200).json({ "code": 200, "status": "Offer created successfully!!" });
                                    } else {
                                        return response.status(200).json({ "code": 200, "status": "Failed to create offer, inconsistent data" });
                                    }
                                });
                            } catch (error) {
                                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                            }
                        } else {
                            return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                        }
                    });
                    } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                    }
                } else {
                return response.status(400).json({ "code": 400, "status": "Please enter valid number in discount(Max- " + AppConstants.Constants.MAXPossibleOffer + "%) field."});
                }   
            } else {
                return response.status(400).json({ "code": 400, "status": "Restaurant ID is invalid!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    populate: function(req, response) {
        try {
            if (req.params.restid) {
                try {
                    var popRestoQuery = "SELECT id from restaurant WHERE rid = unhex('" + req.params.restid + "')";
                    database.dbTransaction(req, response, popRestoQuery, function(restData) {
                        if (restData && restData.length > 0) {
                            try {
                                var offersQuery;
                                var currentDate = dbDateFormate(new Date);
                                var dateRange = "STR_TO_DATE(end_date,'%Y-%m-%d') >= STR_TO_DATE('" + currentDate + "','%Y-%m-%d')";
                                if (req.params.status.toUpperCase() !== 'ALL') {
                                    offersQuery = "SELECT hex(offerid) as offerid, name, discount, offer_status, start_date, end_date, BIN(days) as days, start_time, end_time from offer WHERE ( rid = '" + restData[0].id + "' && offer_status = '" + req.params.status + "') AND " + dateRange + "";
                                } else {
                                    offersQuery = "SELECT hex(offerid) as offerid, name, discount, offer_status, start_date, end_date, BIN(days) as days, start_time, end_time from offer WHERE ( rid = '" + restData[0].id + "') AND " + dateRange + "";
                                }
                                database.dbTransaction(req, response, offersQuery, function(offers) {
                                    if (offers.length > 0) {
                                        return response.status(200).json({ "code": 200, "offers": offers });
                                    } else {
                                        //Modified status 400 (Bad Request) to 200 (empty array)
                                        offers = [];
                                        //Modified response object key from status to offers
                                        return response.status(200).json({ "code": 200, "offers": offers });
                                    }
                                });
                            } catch (error) {
                                return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
                            }
                        }
                    });
                } catch (error) {

                }
            } else {

            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    populateByTimeRange: function(req, response, data, callback) {
        try {
            var currentDate, currentTime, dateRange, activeOfferQuery, dayInBinary = '0b';
            for (var i = 0; i < 7; i++) {
                if (i === new Date().getDay()) { dayInBinary += '1' } else { dayInBinary += '0' }
            }
            currentDate = dbDateFormate(new Date);
            currentTime = parseInt((new Date().getHours() < 10 ? '0' : '') + new Date().getHours() + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes());
            dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
            timeRange = "( start_time <= " + currentTime + " && " + currentTime + " <= end_time )";
            activeOfferQuery = "SELECT hex(offerid) as offerid, discount from offer WHERE ( rid = '" + data.rid + "' AND offer_status = 'LIVE'  AND days & " + dayInBinary + " AND " + dateRange + " AND " + timeRange + ") ORDER BY created_date DESC";
            database.dbTransaction(req, response, activeOfferQuery, function(resultSet) {
                if (resultSet && resultSet.length > 0) {
                    callback(resultSet[0]);
                } else {
                    var offers = {
                        "offerid": null,
                        "discount": 0
                    }
                    callback(offers);
                }
            });
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },
    // Deleteing offer.
    // In case of offer is live it should just update the end date based on STARLLY setting.
    // Offer that are live but upcomming or draft offers will be deleted from System.
    delete: function(req, response) {
       if (req.params.offerid) {
                var info = {};
                info.offerid = req.params.offerid;
                info.req = req;
                info.response = response;
                getOfferInfo(info)
                .then( info => {
                    var todayDate = new Date();

                    var today = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();
                    var start_date = new Date(info.offerInfo.start_date);
                    if(start_date > today || info.offerInfo.offer_status == "DRAFT"){
                        info.operation = "delete";
                        return Promise.resolve(info);
                    }else{
                        
                        info.operation = "update";
                        return Promise.resolve(info);
                    }
                }).then(info =>{
                    if(info.operation == "delete"){
                        return deleteOffer(info);
                    }else{
                        return Promise.resolve(info);
                    }
                }).then(info =>{
                    if(info.operation == "update"){
                        return getOfferUpdateHours(info);
                    }else{
                        return Promise.resolve(info);
                    }
                }).then(info =>{
                    if(info.operation == "update"){
                        return updateOfferEndDate(info);
                    }else{
                        return Promise.resolve(info);
                    }
                })
                .then( info => {
                   return response.status(200).json({"status": info.status }); 
                }).catch(function(err){
                    return response.status(400).json({"status": err });
                });
                logger.info("End of Method..");
            } else {
                return response.status(400).json({"status": " Invalid offerid!!"});
            }
    },

    update: function(req, response) {
        logger.info('Offer Update : ' + req.body);
        if (req.body.offerid) {
            var info = {};
            info.offerid = req.body.offerid;
            info.req = req;
            info.response = response;
            getOfferInfo(info)
            .then( info => {
                var todayDate = new Date();
                var today = dbDateFormate(todayDate);
                var start_date = new Date(info.offerInfo.start_date);
                if((start_date > new Date(today)) 
                    || (info.offerInfo.discount === info.req.body.discount) 
                    || info.offerInfo.offer_status === "DRAFT"){

                    info.operation = 'update';
                    return Promise.resolve(info);
                    
                }else{
                    info.operation = 'create';

                    return Promise.resolve(info);
                }
            })
            .then( info => {
                if(info.operation === 'create'){
                    if(info.req.body.discount > info.offerInfo.discount){
                        info.operation = 'crateAndExpire';
                        return createNewOfferWithTodayASStartDate(info);
                    }else{
                        return createNewOffer(info);
                    }
                }else{
                    return updateOffer(info);
                }
            })
            .then( info => {
                if(info.operation === 'create'){
                    return updateOfferEndDateToToday(info);
                }else if(info.operation === 'crateAndExpire'){
                    return exireCurrentOffer(info);
                }else{
                    Promise.resolve(info);
                }
            })
            .then( info =>{
                return response.status(200).json({status : 'success'});
            })
            .catch(function(err){
                return response.status(400).json({"status": err });
            });
        } else {
            return response.status(400).json({"status": " Invalid offerid!!"});
        }
    },

    golive: function(req, response) {
        try {
            var offerId = req.headers['offerid'];
            if (offerId) {
                try {
                    var deleteQuery = "UPDATE offer SET offer_status = 'LIVE' WHERE offerid = unhex('" + offerId + "')";
                    database.dbTransaction(req, response, deleteQuery, function(restData) {
                        if (restData) {
                            return response.status(200).json({ "status": "success" });
                        } else {
                            return response.status(400).json({ "status": 'failed' });
                        }
                    });
                } catch (error) {
                    return response.status(500).json({ "code": 400, "status": "Data inconsistent!!" });
                }
            } else {

            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    defaultStarllyOffer: function(req, response) {
        try {
            AppConstants.defaultOffer(req, response, function(defaultOffer){
                return response.status(200).json({ "code": 200, "data": defaultOffer });
            });
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    }
}
