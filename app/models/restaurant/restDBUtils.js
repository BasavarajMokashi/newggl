//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

module.exports = {
    //Utility Promise.
    getCustomerTxnSummary : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT sum(`bill_amount`) AS `points` FROM `user_txn` WHERE `rid`= ? AND `txn_type`='REWARD' AND `created_date` BETWEEN ? AND ?";
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].points);
                        }else{
                            resolve(0);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
    },
    getNewCustomerTxnSummary : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT SUM(`bill_amount`) AS `new_cust_txn` FROM (SELECT `uid`,`bill_amount`,`created_date` FROM `user_txn` WHERE `rid` = ? AND `txn_type`='REWARD' GROUP BY `uid`) AS newCustTxnSumm WHERE `created_date` BETWEEN ? AND ?";
                console.log(query);
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].new_cust_txn === null ? 0 : rows[0].new_cust_txn);
                        }else{
                            resolve(0);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
    },


    getNewCustomerCount : function(filter){

        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT COUNT(`uid`) AS `count` FROM (SELECT DISTINCT(`uid`),`created_date` FROM `user_txn` WHERE `rid` = ? AND `txn_type`='REWARD' GROUP BY `uid`)as custCount WHERE `created_date` BETWEEN ? AND ?";
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].count === null ? 0 : rows[0].count);
                        }else{
                            resolve(0);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
    },

    getReturningCustomerCount : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT sum(`txn_count`) AS `count` FROM (SELECT COUNT(`uid`) AS `txn_count` FROM ( SELECT `uid`,`created_date` FROM `user_txn` WHERE `rid` = ? AND `txn_type`='REWARD' AND `created_date` BETWEEN ? AND ? ) AS Txns GROUP BY `uid`)as custCount";
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].count === null ? 0 : rows[0].count);
                        }else{
                            resolve(0);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });
    },

    getReturningCustomerTxnSummary : function(filter){
      return new Promise(function(resolve,reject){
             database.getDBConnection(connection => {
                var query = "SELECT sum(`bill_amount`) as `points` FROM `user_txn` WHERE `rid`= ? AND `created_date` BETWEEN ? AND ?";
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows[0].points != null ? rows[0].points : 0);
                        }else{
                            resolve(0);
                        }
                    } else {
                        reject(err);
                    }        
                });
            });
        });  
    },
    getCustomerTxnTrend : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var param = filter.interval;
                if(filter.interval.toUpperCase() === 'HOUR'){
                    param = 'HOUR';
                }else if(filter.interval.toUpperCase() === 'DAY'){
                    param = 'DAYNAME';
                }else if(filter.interval.toUpperCase() === 'DATE'){
                    param = 'DAYOFMONTH';
                }else if(filter.interval.toUpperCase() === 'MONTH'){
                    param = 'MONTHNAME';
                }
                var query = "SELECT "+ param + "(`created_date`) as `period`,SUM(`bill_amount`) AS `booking` FROM `user_txn` WHERE `rid`= ? AND `txn_type`='REWARD' AND `created_date` BETWEEN ? AND ? GROUP BY " + filter.interval +"(`created_date`) ORDER BY `id`";
                
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
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

    getRestaurantRattingInfo : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection =>{
                var query = "SELECT `variety_rating`,`taste_rating`,`service_rating` FROM `review` WHERE `rid`= ? AND `approval_status` = 'TRANSACTION_COMPLETED' AND `created_date` BETWEEN ? AND ?";
                connection.query(query,[filter.rid,filter.start,filter.end], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                            resolve(rows);
                        }else{
                            resolve([]);
                        }
                    } else {
                        logger.info(err);
                        reject(err);
                    }        
                });
            });
        });
    },

    getRestaurantInfo : function(rid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var userIdQuery = "SELECT `id` FROM `restaurant` WHERE `rid` = unhex(?)";
                connection.query(userIdQuery,[rid], function(err,rows){
                    connection.release();
                    if(!err) {
                        if(rows.length > 0){
                        resolve(rows[0]);
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

    insertRestaurantBankDetails : function(info){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
            var query = "INSERT INTO `restaurant_bank_details` (`rid`,`account_holder_name`,`account_number`,`ifsc_code`,`cancelled_check_url`,`address_proof_url`,`pan_number`,`pan_url`) VALUES (?,?,?,?,?,?,?,?)";
            connection.query(query,[info.rid,info.account_holder_name,info.account_number,info.ifsc_code,info.cancelled_check_url,info.address_proof_url,info.pan_number,info.pan_url], function(err,resultSet){
                connection.release();
                if(!err && resultSet.insertId > 0) {
                    resolve('success');
                } else {
                    reject(err);
                }     
                });
            });
        });
    }
}
