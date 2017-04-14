//Custome Dependency Modules
var database = require(__dirname + "/../database.js");
var dbFieldsMapping = require(__dirname + "/../mapping.js");
var offersMgmt = require(__dirname + "/../offersManagement.js");
var waiverMgmt = require(__dirname + "/../waiverManagement.js");
var AppConstants = require(__dirname + "/../common/constants.js");
var myPromise = require(__dirname + "/../dbOperationUtils.js");
var bounceBackMgmt = require(__dirname + "/../bouncebackManagement.js");
var bounceBackMgmt = require(__dirname + "/../bouncebackManagement.js");
var logger = require('../../../config/logger.js');
var http = require('http');
var _ = require('lodash');
module.exports = {

    getClassInfo: function(req, response) {
		try {
		database.getDBConnection(connection => {
		var classInfoQuery = "SELECT ClassId,ClassName,Captions,Description,Skills FROM class WHERE ClassStatus = 1"
	    connection.query(classInfoQuery, function(err,rows){
		connection.release(classInfoQuery);
		if(!err) {
		if(rows.length > 0){
			return response.status(200).json(rows);
	       }
         else{
             return response.status(204).json({ "status": "No Records Found" });
               }			   
		     }
		  });
        });   
        
	 } catch (error) {
        logger.info(error);
        return response.status(500).json({ "status": "Internal Server Error!!" });
    }
    }

    
    
}



