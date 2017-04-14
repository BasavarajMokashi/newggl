//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var dbFieldsMapping = require(__dirname + "/../mapping.js");
var offersMgmt = require(__dirname + "/../offersManagement.js");
var eMail = require(__dirname + "/../mail.service.js");
var myPromise = require(__dirname + "/../dbOperationUtils.js");
var dbutils = require("./restDBUtils.js");
var logger = require('../../../config/logger.js');
var EventEmitter = require('events');

function getOfferSummary(req, response){
    dbutils.getRestaurantInfo(req.headers.restid)
    .then(rid => {
        var info = {};
        info.restInfo = {"id": rid.id};
        Promise.all([
            myPromise.getCurrentRunningOffer(info),
            myPromise.getNewUserBonusPoint()
        ])
        .then(values =>{
            var offerDetails = {};
            offerDetails.discount = values[0].currentOfferInfo.discount;
            offerDetails.rewardPoint = values[1];
            response.status(200).json(offerDetails);
        },error =>{
            response.status(400).json({"status": error });
        });
    })
    .catch(error =>{
        response.status(400).json({"status": error });
    })
}

function addReviewSummaryEntryEventHandler(rid){
    "use strict";
    class MyEmitter extends EventEmitter {}
    var myEmitter = new MyEmitter();
    myEmitter.once('addreviewsummaryentryevent', function(rid){
        database.getDBConnection(con =>{
            var query = "INSERT INTO `rating_summary`(`rid`,`user_count`,`overall_rating`) VALUES(?,?,?)";
            con.query(query,[rid,0,0.0],function(err, result){
                if(!err) logger.info('Added riview summary entry for the restaurant.');
            });
        });
    });
    myEmitter.emit('addreviewsummaryentryevent' , rid);                                                           
}

module.exports = {

    auth: function(req, response) {
        try {
            var username = req.headers['username'];
            var pwd = req.headers['password'];
            if (username && pwd) {
                try {
                    var authQuery = "SELECT rest.id,hex(rest.rid) as restid,rest.name,rest.logo_url AS primary_image_url,rest.veg_type,rest.tab_pin,rest.contact_person_fname,rest.email,rest.username,rest.verified,rest.status,address.address1,address.address2,address.locality from restaurant rest,restaurant_address address where ( BINARY username='" + username + "' AND BINARY password='" + pwd + "') AND rest.id = address.rid";
                    database.dbTransaction(req, response, authQuery, function(restoInfo) {
                        if (restoInfo.length > 0) {
                            if( restoInfo[0].verified && restoInfo[0].status == 'LIVE'){
                                var isRestProfileSetQuery = "SELECT * from restaurant_profile where rid=" + restoInfo[0].id + "";
                                database.dbTransaction(req, response, isRestProfileSetQuery, function(profile_resultSet) {
                                    var restInfo = {};
                                    restInfo.rid =  restoInfo[0].id;
                                    var ruleQuery = "SELECT value from rules where name = 'STARLLY_DEFAULT_OFFER'";
                                    database.dbTransaction(req,response, ruleQuery, function(ruleInfo){
                                        if(profile_resultSet.length > 0){
                                            delete restoInfo[0].id;
                                            delete profile_resultSet[0].restprofileid;
                                            delete profile_resultSet[0].rid;
                                            restoInfo[0].starllyDefaultOffer =  ruleInfo[0].value;
                                            restoInfo[0].additionalDetails = profile_resultSet[0];
                                            return response.status(200).json(restoInfo[0]);
                                        }else{
                                            delete restoInfo[0].id;
                                            restoInfo[0].starllyDefaultOffer = ruleInfo[0].value;
                                            restoInfo[0].additionalDetails = null;
                                            return response.status(200).json(restoInfo[0]);
                                        }
                                    });
                                });  
                            } else if( !restoInfo[0].verified){
                                logger.info(req.headers);
                                var eMailOptions = req.app.constants.MailOptions;
                                eMailOptions.to  = restoInfo[0].email;
                                eMailOptions.restoInfo = restoInfo[0];
                                eMailOptions.type = 'VERIFY-EMAIL'
                                eMail.sendEMail(req, response, eMailOptions, function() {
                                    return response.status(401).json({ "code": 401, "status": " Unauthorized: Your account has not yet verified. Please check your eMail to verify your account." });
                                });
                            } else {
                                return response.status(401).json({ "code": 401, "status": "Your account has not yet approved by StarLLy, We are processing your registration, to expedite the process you may write to us at partner@starlly.in" });
                            }
                        } else {
                            return response.status(400).json({ "code": 400, "status": "Invalid Credientials!!" });
                        }
                    });
                } catch (error) {
                    return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "username/Password is Empty!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },
    currentOffer: function(req, response) {
        getOfferSummary(req,response);
    },

    validate: function(req, response) {
        try {
            var username = req.headers['username'];
            if (username) {
                try {
                    var isExistsQuery = "SELECT * from restaurant where username='" + username + "'";
                    database.dbTransaction(req, response, isExistsQuery, function(resultSet) {
                        if (resultSet.length > 0) {
                            return response.status(200).json({ "code": 200, "status": "Already User exists!!" });
                        } else {
                            return response.status(200).json({ "code": 404, "status": "Restaurant not found!!" });
                        }
                    });
                } catch (error) {
                    return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
                }
            } else {
                return response.status(400).json({ "code": 404, "status": "username not fount" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    register: function(req, response) {
        try {
            if (req.body.username) {
                try {
                    var isExistsQuery = "SELECT * from restaurant where username='" + req.body.username + "'";
                    database.dbTransaction(req, response, isExistsQuery, function(rest_resultSet) {
                        if (rest_resultSet.length == 0) {
                            var collection = dbFieldsMapping.restoRegister(req.body);
                            var query = "INSERT INTO restaurant (" + collection.fields.join() + ") VALUES " + collection.values;
                            database.dbTransaction(req, response, query, function(resultSet) {
                                database.dbTransaction(req, response, isExistsQuery, function(rest_resultSet) {
                                if (rest_resultSet.length > 0) {
                                    var add_col_collection = dbFieldsMapping.addRestAddress(req.body,rest_resultSet[0].id);
                                    var add_add_query = "INSERT INTO restaurant_address (" + add_col_collection.fields.join() + ") VALUES " + add_col_collection.values;
                                    database.dbTransaction(req, response, add_add_query, function(add_resultSet) {
                                        if (add_resultSet.affectedRows > 0) {
                                            var eMailOptions = req.app.constants.MailOptions;
                                            eMailOptions.to = req.body.email;
                                            eMailOptions.restoInfo = req.body;
                                            eMailOptions.type = 'VERIFY-EMAIL'
                                            eMail.sendEMail(req, response, eMailOptions, function() {
                                                addReviewSummaryEntryEventHandler(rest_resultSet[0].id);
                                                return response.status(200).json({ "code": 200, "status": "Restaurant successfully registered!!. Please check your eMail to verify your account." });
                                            });
                                        } else {
                                            return response.status(400).json({ "code": 400, "status": "Restaurant registration failed." });
                                        }
                                    });  
                                } else {
                                     return response.status(400).json({ "code": 400, "status": "Restaurant registration failed." });
                                }
                                });   
                            });
                        }else{
                        return response.status(400).json({ "code": 400, "status": "Duplicate Restaurant." });
                        }
                    });
                } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Empty name!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    updateRestaurantProfile: function(req, response) {
        try {
            if (req.body.restid) {
                try {
                    var restaurant_id = "SELECT id as rid from restaurant where rid = unhex('" + req.body.restid + "')";
                    database.dbTransaction(req, response, restaurant_id, function(rest_resultSet) {
                        logger.info(rest_resultSet);
                        if (rest_resultSet.length == 0) {
                            return response.status(400).json({ "code": 400, "status": " Invalid Restaurant Id.!!" });
                        }else{
                            var collection = dbFieldsMapping.restProfileUpdate(req.body,rest_resultSet);
                            var query = "INSERT INTO restaurant_profile (" + collection.fields.join() + ") VALUES " + collection.values;
                            logger.info(query);
                            logger.info(collection);
                            database.dbTransaction(req, response, query, function(resultSet) {
                            logger.info(resultSet);                               

                            if (resultSet.affectedRows > 0) {
                                
                                var business_hour_col =  dbFieldsMapping.restBusHourUpdate(req.body,rest_resultSet);
                                var business_hour_query = "INSERT INTO business_hour (" + business_hour_col.fields.join() + ") VALUES " + business_hour_col.values;
                                logger.info(business_hour_query);
                                database.dbTransaction(req, response, business_hour_query, function(business_resultSet) {
                                   if (business_resultSet.affectedRows > 0) {
                                    //Add Cuisine if present
                                    if(req.body.cuisines != null && req.body.cuisines.length > 0){
                                        var cuision_coll = dbFieldsMapping.cuisionUpdate(req.body.cuisines,rest_resultSet);
                                        var cuisine_insert_query = "INSERT INTO restaurant_has_cuisine (" + cuision_coll.fields.join() + ") VALUES " + cuision_coll.values;
                                        logger.info(cuisine_insert_query);
                                        logger.info(cuisine_insert_query);
                                        database.dbTransaction(req, response, cuisine_insert_query, function(cuisine_resultSet) {
                                            if(cuisine_resultSet.affectedRows > 0) {
                                                
                                            }else{
                                                
                                            }
                                        });
                                    }
                                    //Add Services if present.
                                    if(req.body.services != null && req.body.services.length > 0){
                                        var service_coll = dbFieldsMapping.serviceUpdate(req.body.services,rest_resultSet);
                                        var service_insert_query = "INSERT INTO restaurant_has_service (" + service_coll.fields.join() + ") VALUES " + service_coll.values;
                                        logger.info(service_insert_query);
                                        database.dbTransaction(req, response, service_insert_query, function(service_resultSet) {
                                            if(service_resultSet.affectedRows > 0) {
                                                
                                            }else{
                                                
                                            }
                                        });
                                    }

                                    //Add tags if present.
                                    if(req.body.tags != null && req.body.tags.length > 0){
                                        var tag_coll = dbFieldsMapping.tagUpdate(req.body.tags,rest_resultSet);
                                        var tag_insert_query = "INSERT INTO restaurant_has_tags (" + tag_coll.fields.join() + ") VALUES " + tag_coll.values;
                                        logger.info(tag_insert_query);
                                        database.dbTransaction(req, response, tag_insert_query, function(tag_resultSet) {
                                            if(tag_resultSet.affectedRows > 0) {
                                                
                                            }else{
                                                
                                            }
                                        });
                                    }

                                    //Add Images if present.
                                    if(req.body.image_urls != null && req.body.image_urls.length > 0){
                                        var image_urls_coll = dbFieldsMapping.imageUpdate(req.body.image_urls,rest_resultSet);
                                        var image_urls_insert_query = "INSERT INTO restaurant_image (" + image_urls_coll.fields.join() + ") VALUES " + image_urls_coll.values;
                                        logger.info(image_urls_insert_query);
                                        database.dbTransaction(req, response, image_urls_insert_query, function(image_urls_resultSet) {
                                            if(image_urls_resultSet.affectedRows > 0) {
                                                
                                            }else{
                                                
                                            }
                                        });
                                    }

                                    return response.status(200).json({ "code": 200, "status": "Restaurant profile updated successfully." });
                                } else{
                                    return response.status(400).json({ "code": 400, "status": "Restaurant profile update failed." });
                                }
                                });
                            } else {
                                return response.status(400).json({ "code": 400, "status": "Restaurant profile update failed." });
                            }    
                            });
                        }
                    });
                    } catch (error) {
                    return response.status(400).json({ "code": 400, "status": "DB Exceptions" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Empty Restaurant ID!!" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    updateRestaurantBankDetails : function(req, response){
        dbutils.getRestaurantInfo(req.body.restid)
        .then(rid => {
            var info = req.body;
            info.rid = rid.id;
            return dbutils.insertRestaurantBankDetails(info);
        })
        .then(values => {
            response.status(200).json({"status": values});
        })
        .catch(error =>{
            response.status(400).json({"status": error });
        })
    },

    verifyaccount: function(req, response) {
        try {
            var eMail = req.headers['email'];
            var username = req.headers['username'];
            logger.info(eMail);
            if (eMail && username) {
                try {
                    var fetchRestoQuery = "SELECT id, verified from restaurant WHERE email = '" + eMail + "' AND username = '" + username + "'";
                    logger.info(fetchRestoQuery);
                    database.dbTransaction(req, response, fetchRestoQuery, function(restoInfo) {
                        if( restoInfo.length > 0 ) {
                            if(!restoInfo[0].verified){
                                var updateQuery = "UPDATE restaurant SET verified = true WHERE id = '" + restoInfo[0].id + "'";
                                database.dbTransaction(req, response, updateQuery, function(resultSet) {
                                    logger.info(JSON.stringify(resultSet), updateQuery);
                                    if (resultSet.affectedRows) {
                                        return response.status(200).json({ "code": 200, "status": "Account has been verified successfully. Please wait, We are redirecting to the starlly home page!!" });
                                    } else {
                                        return response.status(400).json({ "code": 400, "status": "verify Updation DB Exceptions" });
                                    }
                                });
                            }else {
                                return response.status(400).json({ "code": 400, "status": "Already account has been verified!!" });
                            }
                        }else{
                           return response.status(400).json({ "code": 400, "status": "InValid Email/UserName!!." }); 
                        }
                    });
                } catch (error) {
                    return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
                }
            } else {
                return response.status(400).json({ "code": 400, "status": "Either eMail/username missing" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    populateProfile: function(req, response) {
        try {
            if (req.params.restid) {
                dbutils.getRestaurantInfo(req.params.restid)
                .then(rid => {
                    var info = {};
                    info.restInfo = {"id": rid.id};
                    info.restDetails = {};
                    info.address = {};
                    info.businessHours = {};
                    info.cuisine = {};
                    info.services = {};
                    info.tags = {};
                    info.types = {};
                    info.secondaryImages = [];
                    info.additionalDetails = {};
                    info.txnDetails = {};
                    Promise.all([
                        myPromise.getRestoProfileInfo(info),
                        myPromise.getRestoAddressInfo(info),
                        myPromise.getRestoCuisineInfo(info),
                        myPromise.getRestoServicesInfo(info),
                        myPromise.getRestoTagsInfo(info),
                        myPromise.getRestoTypesInfo(info),
                        myPromise.getRestoSecondaryImagesInfo(info),
                        myPromise.getRestoAdditionalInfo(info),
                        myPromise.getRestoTxnInfo(info),
                        myPromise.getRestoBusinessHours(info)
                    ])
                    .then(values =>{
                        var restoInfo = values[0].restDetails;
                        restoInfo.address = values[1].address;
                        restoInfo.cuisine = values[2].cuisine;
                        restoInfo.services = values[3].services;
                        restoInfo.tags = values[4].tags;
                        restoInfo.types = values[5].types;
                        restoInfo.secondaryImages = values[6].secondaryImages;
                        restoInfo.additionalDetails = values[7].additionalDetails;
                        restoInfo.txnDetails = values[8].txnDetails;
                        restoInfo.businessHours = values[8].businessHours;
                        response.status(200).json(restoInfo);
                    },error =>{
                        response.status(400).json({"status": error });
                    });
                })
                .catch(error =>{
                    console.log('Error3');
                    response.status(400).json({"status": error });
                })
            } else {
                return response.status(400).json({ "code": 400, "status": "Either eMail/username missing" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    },

    updateProfile: function(req, response) {
        try {
            if (req.body.restid) {
                dbutils.getRestaurantInfo(req.body.restid)
                .then(rid => {
                    var info = {};
                    info.restInfo = {"id": rid.id};
                    info.postData = req.body;
                    info.req = req;
                    info.response = response;
                    var myPromiseList = [];
                    switch(info.postData.updateBy.toUpperCase()){
                        case 'PROFILEANDADDITIONAL': 
                            myPromiseList.push(myPromise.setRestoProfileInfo(info));
                            myPromiseList.push(myPromise.setRestoAddressInfo(info));
                            myPromiseList.push(myPromise.setRestoAdditionalInfo(info));
                        break;
                        case 'BUSINESSHOURS': 
                            myPromiseList.push(myPromise.setRestoBusinessHours(info));
                        break;
                        case 'ACCOUNTINFO': 
                            myPromiseList.push(myPromise.setRestoProfileInfo(info));
                        break;
                        case 'CHANGEPASSWORD': 
                            myPromiseList.push(myPromise.setRestoAdminPassword(info));
                        break;
                        case 'CHANGEPIN': 
                            myPromiseList.push(myPromise.setRestoTabPin(info));
                        break;
                        case 'CUSININEANDSERVICES': 
                            myPromiseList.push(myPromise.setRestoCuisineInfo(info));
                            myPromiseList.push(myPromise.setRestoServicesInfo(info));
                            myPromiseList.push(myPromise.setRestoTagsInfo(info));
                            myPromiseList.push(myPromise.setRestoTypesInfo(info));
                            myPromiseList.push(myPromise.setRestoProfileInfo(info));
                        break;
                        case 'SECONDARYIMAGE': 
                            var newlyUploadedImageSet = [];
                            for( var i = 0; i < info.postData.secondaryImages.length; i++ ) {
                                if( info.postData.secondaryImages[i].isUpload ) {
                                    newlyUploadedImageSet.push(info.postData.secondaryImages[i]);
                                }  
                            }
                            if( newlyUploadedImageSet.length ){
                                myPromiseList.push(myPromise.setRestoSecondaryImagesInfo(info, newlyUploadedImageSet));
                            }else {
                                response.status(400).json({ "code": 400, "status": "Please select file to upload!" });
                                return;
                            }
                        break;
                        case 'PRIMARYIMAGE': 
                            myPromiseList.push(myPromise.setRestoPrimaryImagesInfo(info));
                        break;
                        case 'LOGOIMAGE':
                            logger.info('Init Upload Logo Image')
                            myPromiseList.push(myPromise.setRestoLogoImagesInfo(info));
                        break;
                        default:

                    }
                    Promise.all(myPromiseList)
                    .then(values =>{
                        var errorResp = null;
                        for( var i = 0; i < values.length; i++ ) {
                            if( values[i].code === 400 ) {
                                errorResp = values[i];
                            }
                        }
                        if( errorResp ) {
                            response.status(400).json(errorResp);
                        }else{
                            response.status(200).json({ "code": 400, "status": "Updated Successfully!" });
                        }
                    },error =>{
                        response.status(400).json({"status": error });
                    });
                })
                .catch(error =>{
                    response.status(400).json({"status": error });
                })
            } else {
                return response.status(400).json({ "code": 400, "status": "Resto ID missing" });
            }
        } catch (error) {
            return response.status(500).json({ "code": 500, "status": "Internal Server Error!!" });
        }
    }
}
