//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var logger = require('../../../config/logger.js');

module.exports = {
    //Utility Promise.
    getStarllyUsers : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT hex(uid) as uid, firstname, lastname, phone, email, dob, tier, image_url, anniversary_dt, gender, spouse_name, spouse_dob, verified, created_date as joined from user where login_type='STARLLY' ORDER BY `created_date` DESC";
                connection.query(query,[], function(err,rows){
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

    userRegistrationStatistic : function(filter){
        return new Promise(function(resolve,reject){
            database.getDBConnectionForGroupBy(connection => {
                var query = "SELECT count(*) AS `points` FROM `users` WHERE `created_date` BETWEEN ? AND ?";
                connection.query(query,[filter.start,filter.end], function(err,rows){
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

    getUsersTrend : function(filter){
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
                var query = "SELECT "+ param + "(`created_date`) as `period`, count(*) FROM `users` WHERE `created_date` BETWEEN ? AND ? GROUP BY " + filter.interval +"(`created_date`) ORDER BY `id`";
                
                connection.query(query,[filter.start,filter.end], function(err,rows){
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

    getStarllyResturants : function(status){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = `SELECT hex(rid) AS restid,name,CONCAT(contact_person_fname ,'' , contact_person_lname) AS contact_persion,
                                    phone,email,lat,lng,primary_image_url,logo_url,cost_for_2_people,veg_type,status,verified,created_date
                                    FROM restaurant WHERE status = ? `;
                connection.query(query,[status.toUpperCase()], function(err,rows){
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

    setRestaurantAsLive : function(restid){
        return new Promise(function(resolve,reject){
            database.getDBConnection(connection => {
                var query = "UPDATE `restaurant` SET `status` = 'LIVE' WHERE `rid` = unhex(?)";
                connection.query(query,[restid], function(err,rows){
                    connection.release();
                    if(!err) {
                        resolve({"status" : "Restaurant is live now!!"});
                    } else {
                        reject(err);
                    }     
                });
            });
        });
    }
}
