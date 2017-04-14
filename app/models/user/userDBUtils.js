//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

module.exports = {
    //Utility Promise.
    getUserInfo : function(userid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `id`,`phone` FROM `user` WHERE `uid` = unhex(?)";
                connection.query(userIdQuery,[userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0]);
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
    getUserAndPointInfo : function(userid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `u`.`id`,`u`.`phone`,`p`.`total_points`,`p`.`this_year_points` FROM `user` `u`,`point` `p` WHERE `u`.`uid` = unhex(?) AND `u`.`id` = `p`.`uid`";
                connection.query(userIdQuery,[userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0]);
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
    getUserPointsInfo : function(userid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT txn_type,sum(points) AS points FROM user_txn WHERE uid = ? AND txn_type='REDEEM' OR txn_type = 'REWARD' GROUP BY txn_type";
                connection.query(userIdQuery,[userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows);
                        }else{
                            reject([]);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });   
        });
    },

    
    getUserTxns : function(userid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = `SELECT hex(rest.rid) AS restid,hex(rev.reviewid) AS reviewid,
                                    txn.created_date,rest.name,txn.invoice_no,
                                    GROUP_CONCAT( CONCAT(IF(txn.txn_type = 'REDEEM', '-' ,'+'),
                                    txn.points)) AS txn_point_detail, rev.comment,
                                    bb_offer.bounceback_in_days AS bb_in_days,bb_offer.bounceback_discount AS bb_discount,
                                    bb_offer.start_date AS bb_start_date,bb_offer.end_date AS bb_end_date
                                    FROM user_txn txn 
                                    LEFT JOIN restaurant rest ON txn.rid = rest.id 
                                    LEFT JOIN review rev ON txn.reviewid = rev.id 
                                    LEFT JOIN bounceback_offer bb_offer ON txn.bouncebackid = bb_offer.bouncebackid
                                    WHERE txn.uid = ? AND (txn.txn_type='REDEEM' OR txn.txn_type = 'REWARD') 
                                    GROUP BY txn.reviewid;`;
                connection.query(query,[userid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows);
                        }else{
                            resolve([]);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
    },

    getUserReviews : function(userid){
        return new Promise(function(resolve,reject){
            database.getDBConnection( connection =>{
                var query = `SELECT rest.name AS restaurant_name,rest.primary_image_url AS restaurant_image,rest.logo_url AS restaurant_logo_image,
                                    ROUND((rev.variety_rating + rev.taste_rating + rev.service_rating)/3,1) AS rating,
                                    rev.comment,rev.image_url AS review_image_url, rev.created_date
                                    FROM review rev LEFT JOIN restaurant rest ON rev.rid = rest.id WHERE rev.uid = ?`;

                connection.query(query,[userid], function(err, rows){
                    connection.release();
                    if(!err){
                        resolve(rows);
                    }else{
                        reject(err);
                    }
                })
            })
        });
    }
}
