//Custome Dependency Modules
var database = require("./database.js");
var mysql = require('mysql');
var dbFieldsMapping = require("./mapping.js");
var logger = require('../../config/logger.js');

function dbDateFormate(date) {
   return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate();
}

function getFiscalYearStartDate(){
    var sd = new Date();
    if(sd.getMonth() < 3) sd.setFullYear(sd.getFullYear() - 1);
    sd.setMonth(3); sd.setDate(1);
    return sd;
}

module.exports = {
    //Utility Promise.
    getUserInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `id`,`phone` FROM `user` WHERE `uid` = unhex(?)";
                connection.query(userIdQuery,[info.input.userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                        info.userInfo = rows[0];
                        resolve(info);
                        }else{
                            reject("Invalid userid!!");
                        }
                    } else {
                        reject(err);
                    }        
                });
            });   
        });
    },
    getUserAndPointInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `u`.`id`,`u`.`phone`,`p`.`total_points` FROM `user` `u`,`point` `p` WHERE `u`.`uid` = unhex(?) AND `u`.`id` = `p`.`uid`";
                connection.query(userIdQuery,[info.input.userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                        info.userInfo = rows[0];
                        resolve(info);
                        }else{
                            reject("Invalid userid!!");
                        }
                    } else {
                        reject(err);
                    }        
                });
            });   
        });
    },

    getRestaurantInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `id` FROM `restaurant` WHERE `rid` = unhex(?)";
                connection.query(userIdQuery,[info.input.restid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                        info.restInfo = rows[0];
                        resolve(info);
                        }else{
                            reject("Invalid restid!!");
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestaurantByRestID : function(rid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `id` FROM `restaurant` WHERE `rid` = unhex(?)";
                connection.query(userIdQuery,[rid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].id);
                        }else{
                            reject("Invalid restid!!");
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoProfileInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT hex(rid) as restid, name, username, tab_pin, contact_person_fname, contact_person_lname, phone, email, lat, lng, primary_image_url, logo_url, cost_for_2_people, veg_type FROM `restaurant` WHERE `id` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.restDetails = rows[0];
                            resolve(info);
                        }else{
                            reject("Invalid restid!!");
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoAddressInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT address1, address2, city, state, pin, locality FROM `restaurant_address` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.address = rows[0];
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoBusinessHours : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT openning_time, closing_time, first_sift_start, first_sift_end, secound_sift_start, secound_sift_end, third_sift_start, third_sift_end, BIN(closed_on) as closed_on FROM `business_hour` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.businessHours = rows[0];
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoCuisineInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT cuision_type FROM `restaurant_has_cuisine` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.cuisine = rows;
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoServicesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT id, service FROM `restaurant_has_service` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.services = rows;
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoTagsInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT tagname FROM `restaurant_has_tags` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.tags = rows;
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoTypesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT type FROM `restaurant_has_type` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.types = rows[0];
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoSecondaryImagesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT image_url, image_type FROM `restaurant_image` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.secondaryImages = rows;
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoAdditionalInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT bus_contact_number, alt_bus_contact_number, website_url, facebook_handle, twitter_handle, description FROM `restaurant_profile` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.additionalDetails = rows[0];
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    getRestoTxnInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT `*` FROM `restaurant_txn` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            info.txnDetails = rows[0];
                            resolve(info);
                        }else{
                            resolve(info);
                        }
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoProfileInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `name` = ?, `phone` = ?, `email` = ?, `cost_for_2_people` = ? WHERE `id` = ?";
                connection.query(query,[info.postData.name, info.postData.phone, info.postData.email, info.postData.cost_for_2_people, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoAdminPassword : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `password` = ? WHERE `id` = ?";
                connection.query(query,[info.postData.password, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }    
                });
            });
        });
    },

    setRestoTabPin : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `tab_pin` = ? WHERE `id` = ?";
                connection.query(query,[info.postData.tab_pin, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }    
                });
            });
        });
    },

    setRestoAddressInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant_address` SET `address1` = ?, `locality` = ? WHERE `rid` = ?";
                connection.query(query,[info.postData.address.address1, info.postData.address.locality, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoBusinessHours : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `business_hour` SET `openning_time` = ?, `closing_time` = ?, `first_sift_start` = ?, `first_sift_end` = ?, `secound_sift_start` = ?, `secound_sift_end` = ?, `third_sift_start` = ?, `third_sift_end` = ? WHERE `rid` = ?";
                var businessHours = info.postData.businessHours;
                connection.query(query,[businessHours.openning_time, businessHours.closing_time, businessHours.first_sift_start, businessHours.first_sift_end, businessHours.secound_sift_start, businessHours.secound_sift_end, businessHours.third_sift_start, businessHours.third_sift_end, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoCuisineInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT cuision_type FROM `restaurant_has_cuisine` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoServicesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT service FROM `restaurant_has_service` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    iconnection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }      
                });
            });
        });
    },

    setRestoTagsInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT tagname FROM `restaurant_has_tags` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoTypesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT type FROM `restaurant_has_type` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }      
                });
            });
        });
    },

    setRestoSecondaryImagesInfo : function(info, newlyUploadedImageSet){
        return new Promise(function(resolve,reject){
            if(newlyUploadedImageSet != null && newlyUploadedImageSet.length > 0){
                var image_urls_coll = dbFieldsMapping.secondaryImageUpload(newlyUploadedImageSet,info.restInfo.id);
                var image_urls_insert_query = "INSERT INTO restaurant_image (" + image_urls_coll.fields.join() + ") VALUES " + image_urls_coll.values;
                logger.info(image_urls_insert_query);
                database.dbTransaction(info.req, info.response, image_urls_insert_query, function(image_urls_resultSet) {
                     resolve(info);
                });
            }else {
                reject('No Data to Insert');
            }
            //Need to come back and look into the code
            /*database.getDBConnection(connection => {
                var query = "SELECT image_url, image_type FROM `restaurant_image` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }      
                });
            });*/
        });
    },

    deleteRestoSecondaryImagesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "DELETE from `restaurant_image` WHERE `id` = ?";
                connection.query(query,[info.deleteImageId], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }      
                });
            });
        });
    },

    setRestoPrimaryImagesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `primary_image_url` = ? WHERE `id` = ?";
                connection.query(query,[info.postData.primary_image_url, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoLogoImagesInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `logo_url` = ? WHERE `id` = ?";
                logger.info('Update Logo query ----> ' + query +' & Path ---> '+ info.postData.logo_url + ' & restaurant id --->'+info.restInfo.id);
                connection.query(query,[info.postData.logo_url, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    },

    setRestoAdditionalInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant_profile` SET `website_url` = ?, `facebook_handle` = ?, `twitter_handle` = ? WHERE `rid` = ?";
                var profileDetails = info.postData.additionalDetails;
                connection.query(query,[profileDetails.website_url, profileDetails.facebook_handle, profileDetails.twitter_handle, info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }    
                });
            });
        });
    },

    setRestoTxnInfo : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "SELECT `*` FROM `restaurant_txn` WHERE `rid` = ?";
                connection.query(query,[info.restInfo.id], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }   
                });
            });
        });
    },

    validateInvoiceNumber : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var fiscalYearStartDate = dbDateFormate(getFiscalYearStartDate());
                var userIdQuery = "SELECT count(*) AS txncount FROM `user_txn` WHERE `rid` = ? AND `created_date` > ? AND `invoice_no` = ?";
                connection.query(userIdQuery,[info.restInfo.id,fiscalYearStartDate,info.input.invoice_no], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve(info);
                    } else {
                        reject(err);
                    }    
                });
            });
        });
    },

    getCurrentRunningOffer: function(info) {
        return new Promise((resolve,reject) =>{
            var currentDate, currentTime, dateRange, activeOfferQuery, dayInBinary = '0b';
            for (var i = 1; i <= 7; i++) {
                if (i === new Date().getDay() || (i === 7 && new Date().getDay() === 0)) { dayInBinary += '1' } else { dayInBinary += '0' }
            }
            currentDate = new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate();
            currentTime = (new Date().getHours() < 10 ? '0' : '') + new Date().getHours() + (new Date().getMinutes() < 10 ? '0' : '') + new Date().getMinutes();
            dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
            timeRange = "( start_time <= " + currentTime + " && " + currentTime + " <= end_time )";
            activeOfferQuery = "SELECT `id` AS `offerid`,`name`,`discount`,`start_date`,`end_date`,`start_time`,`end_time` FROM `offer` WHERE ( `rid` = '" 
                                + info.restInfo.id + "' AND `offer_status` = 'LIVE'  AND `days` & " + dayInBinary 
                                + " AND " + dateRange + " AND " + timeRange + ") ORDER BY created_date DESC";
            database.dbTxn(activeOfferQuery , resultSet =>{
                if (resultSet && resultSet.length > 0) {
                    info.currentOfferInfo = resultSet[0];
                    resolve(info);
                } else {
                    debugger;
                    var defaultOfferQuery = "SELECT hex(ruleid) as offerid, value as discount from rules where name = 'STARLLY_DEFAULT_OFFER'";
                    database.dbTxn(defaultOfferQuery , defaultOffer =>{
                        info.currentOfferInfo = defaultOffer[0];
                        info.currentOfferInfo.name = 'Default Offer';
                        info.currentOfferInfo.start_date = 'NA';
                        info.currentOfferInfo.end_date = 'NA';
                        info.currentOfferInfo.start_time = 'NA';
                        info.currentOfferInfo.end_time = 'NA';
                        resolve(info);
                    });
                }
            });
        });
    },

    getDefaultOffer: function(){
        return new Promise((resolve,reject) =>{
            var defaultOfferQuery = "SELECT hex(ruleid) as offerid, value as discount from rules where name = 'STARLLY_DEFAULT_OFFER'";
            database.dbTxn(defaultOfferQuery , defaultOffer =>{
                if(defaultOffer.length > 0){
                    resolve(defaultOffer[0].discount);
                }else{
                   reject(0); 
                }
            });
        })
    },

    getLiveBounceBackByRestaurant : function(rid) {
       return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var currentDate = dbDateFormate(new Date);
                var dateRange = "(STR_TO_DATE(start_date,'%Y-%m-%d') <= STR_TO_DATE('" + currentDate + "','%Y-%m-%d') && STR_TO_DATE('" + currentDate + "','%Y-%m-%d') <= STR_TO_DATE(end_date,'%Y-%m-%d'))";
                var query = "SELECT bouncebackid, bounceback_in_days, bounceback_discount, start_date, end_date, active from bounceback_offer WHERE rid = ? AND active = true AND " + dateRange +"";
                connection.query(query,[rid], function(err,rows){
                if(!err) {
                    if(rows.length > 0){
                        resolve(rows[0]);
                    }else{
                        var bb = {};
                        bb.bouncebackid = 'NA';
                        bb.bounceback_in_days = 'NA';
                        bb.bounceback_discount = 0;
                        bb.start_date = 'NA';
                        bb.end_date = 'NA';
                        resolve(bb);
                    }
                } else {
                    reject(err);
                }     
                });
            });
        });
    },

    getBillDetails: function(info){
        return new Promise((resolve,reject) =>{
            var total_points = info.userInfo.total_points;
            var bill_amount = info.input.bill_amount;
            var billInfo = {};
            //Check for Transaction Type
            if(info.input.txn_type == "REDEEM"){
                if (info.input.isMaxRedeem) {
                    if (total_points && total_points <= (bill_amount / 2)) {
                        billInfo.redeem_point = Math.round(total_points);
                    } else if (total_points && total_points > (bill_amount / 2)) {
                        billInfo.redeem_point = Math.round((bill_amount / 2));
                    }
                } else {
                    var points = info.input.points;
                    if((total_points >= points) && (points <= (bill_amount /2 ))){
                        billInfo.redeem_point = Math.round(points);
                    }else if((total_points >= points) && (points > (bill_amount / 2 ))){
                        billInfo.redeem_point = Math.round((bill_amount / 2));
                    }else if((total_points <= points) && (total_points <= (bill_amount / 2 ))){
                        billInfo.redeem_point = Math.round(total_points);
                    }else if((total_points <= points) && (total_points > (bill_amount /2 ))){
                        billInfo.redeem_point = Math.round((bill_amount / 2));
                    }else{
                        billInfo.redeem_point = 0;
                    }
                }
            }else{
                billInfo.redeem_point = 0;
            }
            //Calculate Reward Point.
            billInfo.total_points = total_points;
            billInfo.invoice_no = info.input.invoice_no;
            billInfo.bill_amount = bill_amount;
            billInfo.payable_amount = bill_amount - billInfo.redeem_point ;
            billInfo.reward_points = parseInt(billInfo.payable_amount * (info.currentOfferInfo.discount / 100));
            billInfo.status = "Invoice calculation success!!"
            resolve(billInfo);
        });
    },

    updateReviewDetails : function(info){
        var query = "UPDATE `review` SET `approval_status` = 'TRANSACTION_COMPLETED' WHERE `reviewid` = unhex(?)";
        database.getDBConnection( connection =>{
            connection.query(query,[info.reviewid],function(err, result){
                if(!err){
                    logger.info('Review Status updated successfully.');
                }else{
                    logger.info('Invalid reviewId!!');
                }
            })
        });
    },

    getReviewById : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var reviewByIdQuery = "SELECT * FROM REVIEW WHERE `reviewid` = unhex(?) AND `approval_status` = 'NEW'";
                connection.query(reviewByIdQuery,[info.reviewId], function(err,result){
                    connection.release();
                    if(!err && result.length > 0) {
                        info.review = result[0];
                        resolve(info);
                    }else{
                            reject("Invalid reviewid!!");
                    }
                });
            });   
        });
    },

    deleteReviewById : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var deleteReviewByIdQuery = "DELETE FROM REVIEW WHERE `reviewid` = unhex(?) AND `approval_status` = 'NEW'";
                connection.query(deleteReviewByIdQuery,[info.reviewId], function(err,result){
                    connection.release();
                    if(!err) {
                        if(result.affectedRows > 0){
                        info.status = "success";
                        resolve(info);
                        }else{
                            reject("Invalid reviewid!!");
                        }
                    } else {
                        reject(err);
                    }        
                });
            });   
        });
    },
    getNewUserBonusPoint : function(){
        return new Promise((resolve,reject) =>{
            database.getDBConnection(conn =>{
                var ruleQuery = "SELECT value from rules where name = 'STARLLY_NEW_USER_BONUS_POINT'";
                conn.query(ruleQuery, function(err,result){
                    if(result.length > 0){
                        resolve(result[0].value);
                    }else{
                        reject("StarLLy Default offer is not set!!");
                    }
                });
            })
        });
    }
}
