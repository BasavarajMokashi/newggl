//Custome Dependency Modules
var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var logger = require('../../config/logger.js');

function waiverInfoByResto(req, response, restid, callback) {
    try {
        var waiverQuery = "SELECT hex(commissionid) as commissionid, incentive, is_new_customer_waiver, starlly_discount_on_commission from waiver_setting WHERE rid = '"+restid+"' ";
        logger.info(waiverQuery);
        database.dbTransaction(req, response, waiverQuery, function(waiver) {
            callback(waiver);
        });
    } catch (error) {
        return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
    }
}

module.exports = {

    create: function(req, response) {
        try {
            if (req.body.restid) {
                try {
                    var popRestoQuery = "SELECT id from restaurant WHERE rid = unhex('" + req.body.restid + "')";
                    database.dbTransaction(req, response, popRestoQuery, function(resultSet) {
                        if (resultSet && resultSet.length > 0) {
                            try {
                                req.body.rid = resultSet[0].id;
                                var isExistWavier = "SELECT id from waiver_setting WHERE rid ='" + req.body.rid + "'";
                                database.dbTransaction(req, response, isExistWavier, function(waiverInfo) {
                                    if(waiverInfo && waiverInfo.length > 0){
                                        return response.status(409).json({ "code": 409, "status": "Setting already exixts, please update setting if any changes needed!" });
                                    }else{
                                        var collection = dbFieldsMapping.createWaiver(req.body);
                                        var query = "INSERT INTO  waiver_setting (" + collection.fields.join() + ") VALUES " + collection.values;
                                        database.dbTransaction(req, response, query, function(offerResult) {
                                            if (offerResult) {
                                                return response.status(200).json({ "code": 200, "status": "Waiver setting created successfully!!" });
                                            } else {
                                                return response.status(200).json({ "code": 200, "status": "Failed to waiver setting, inconsistent data" });
                                            }
                                        });
                                    }
                                });
                            } catch (error) {
                                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                            }
                        } else {
                            return response.status(400).json({ "code": 400, "status": "No Data Found!!" });
                        }
                    });
                } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Restaurant ID is invalid!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    waiverInfoByRid: function(req, response, restid, callback) {
        waiverInfoByResto(req, response, restid, function(waiver) {
            callback(waiver);
        });
    },

    populate: function(req, response) {
        try {
            if (req.params.restid) {
                try {
                    var popRestoQuery = "SELECT id from restaurant WHERE rid = unhex('" + req.params.restid + "')";
                    database.dbTransaction(req, response, popRestoQuery, function(restData) {
                        if (restData && restData.length > 0) {
                             waiverInfoByResto(req, response, restData[0].id, function(waiver) {
                                if (waiver.length > 0) {
                                    return response.status(200).json({ "code": 200, "waiver": waiver[0] });
                                } else {
                                    //Modified response object key from status to offers
                                    return response.status(409).json({ "code": 409, "status": "Waiver setting not yet configured. Please create waiver setup" });
                                }
                            });
                        }else{
                            return response.status(500).json({ "code": 500, "status": "Invalid Restaurant ID!!" });
                        }
                    });
                } catch (error) {
                    return response.status(500).json({ "code": 500, "status": "Waiver Transaction Failed!!" });
                }
            } else {
                return response.status(500).json({ "code": 500, "status": "Invalid Restaurant ID!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    update: function(req, response) {
         try {
            logger.info(req.body.restid);
            if (req.body.restid) {
                try {
                    var popRestoQuery = "SELECT id from restaurant WHERE rid = unhex('" + req.body.restid + "')";
                    database.dbTransaction(req, response, popRestoQuery, function(resultSet) {
                        if (resultSet && resultSet.length > 0) {
                            try {
                                req.body.rid = resultSet[0].id;
                                var updateWavierQuery = "SELECT id from waiver_setting WHERE commissionid = unhex('" + req.body.commissionid + "')";
                                database.dbTransaction(req, response, updateWavierQuery, function(waiverInfo) {
                                    if(waiverInfo && waiverInfo.length > 0){
                                        var updateWavierQuery = "UPDATE waiver_setting SET incentive = "+req.body.incentive+", is_new_customer_waiver = "+req.body.is_new_customer_waiver+", starlly_discount_on_commission = "+req.body.starlly_discount_on_commission+" WHERE rid ='" + req.body.rid + "'";
                                        logger.info(updateWavierQuery);
                                        database.dbTransaction(req, response, updateWavierQuery, function(offerResult) {
                                            if (offerResult) {
                                                return response.status(200).json({ "code": 200, "status": "Waiver setting update successfully!!" });
                                            } else {
                                                return response.status(204).json({ "code": 204, "status": "Wavier setting is not exixts, please config!!" });
                                            }
                                        });
                                    }else{
                                        return response.status(409).json({ "code": 409, "status": "Incorrect wavier ID, Please or Not yet configured!" });
                                    }
                                });
                            } catch (error) {
                                return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                            }
                        } else {
                            return response.status(400).json({ "code": 400, "status": "No Record Found!!" });
                        }
                    });
                } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Restaurant ID is invalid!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    }
}
