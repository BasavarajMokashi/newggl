var mysql = require('mysql');
var database = require('../../config/database');
var logger = require('../../config/logger.js');
var pool = mysql.createPool(database.localhost);


/*Actual module functions are starts here*/
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}



/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

module.exports = {


    createDatabase: function(req, callback) {
        
    },

    clearDatabase:function(data,callback){
       
    },

    dbTransaction: function(req, res, query, callback) {
        pool.getConnection(function(err,connection){
            if (err) {
                connection.release();
                logger.error(err);
                return res.status(100).json({"code" : 100, "status" : "Error in connection database"});
            }   
            connection.query(query, function(err,rows){
                connection.release();
                if(!err) {
                    callback(rows);
                } else {
                    logger.error(err);
                    return res.status(100).json({"code" : 100, "status" : err});
                    //throw err;
                }        
            });
            // Commenting out this code as it is causing unnessesory memory leak.
            /*
            connection.on('error', function(err) {
                connection.release();
                throw err;
            });
            */
        });
    },

    getDBConnection: function(callback){
        pool.getConnection((err, connection) =>{
            if(err){
                logger.error(err);
                throw err;
            }else{
                callback(connection)
            }
        });
    },

    getDBConnectionForGroupBy : function(callback){
        pool.getConnection((err, connection) =>{
            if(err){
                logger.error(err);
                throw err;
            }else{
                var query = "SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))";
                connection.query(query, function(err,rows){
                    if(!err) {
                    callback(connection)
                    } else {
                        logger.error(err);
                        throw err;
                    }        
                });
            }
        });
    },


    dbTxn: function(query , callback) {
        pool.getConnection((err,connection) => {
            if (err) {
                connection.release();
                logger.error(err);
                throw err;
            } 
            connection.query(query, function(err,rows){
                connection.release();
                if(!err) {
                    callback(rows);
                } else {
                    logger.error(err);
                    throw err;
                }        
            });
            // Commenting out this code as it is causing unnessesory memory leak.
            /*
            connection.on('error', function(err) {
                connection.release();
                throw err;
            });
            */
        });
    }

}