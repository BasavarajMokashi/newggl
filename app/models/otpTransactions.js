//Custome Dependency Modules
var database = require("./database.js");
var dbFieldsMapping = require("./mapping.js");
var userTrsn = require(__dirname + "/user/userTransactions.js");
var http = require('http');
var speakeasy = require("speakeasy");
var logger = require('../../config/logger.js');

var getUserInfo = function(info){
    return new Promise(function(resolve,reject){
        var userIdQuery = "SELECT id, phone from user where uid = unhex('" + info.userId + "')";
        database.dbTransaction(info.req, info.response, userIdQuery, function(resultSet) {
            if(resultSet.length > 0){
                info.userInfo = resultSet[0];
                resolve(info);
            }else{
                reject("Invalid userid!!");
            }
        });
    });
}

var getOtpInfo = function(info){
    return new Promise(function(resolve,reject){
        var otpQuery = "SELECT * from otp_txn where uid ='" + info.userInfo.id + "'";
        database.dbTransaction(info.req, info.response, otpQuery, function(resultSet) {
            if (resultSet.length > 0) {
                info.otpInfo = resultSet[0];
                resolve(info);
            }else{ 
                info.otpInfo = null;
                resolve(info);
            }
        });
    });
}


var checkForOTPDetails = function(info){
    return new Promise(function(resolve,reject){
        var otpQuery = "SELECT * from otp_txn where uid ='" + info.userInfo.id + "'";
        database.dbTransaction(info.req, info.response, otpQuery, function(resultSet) {
            if (resultSet.length > 0) {
                info.otpInfo = resultSet[0];
                resolve(info);
            }else{ 
                info.otpInfo = null;
                resolve(info);
            }
        });
    });
}


var insertOtpTxn = function(info){
    return new Promise((resolve,reject) =>{
        database.getDBConnection(connection => {
            var query = "INSERT INTO otp_txn(uid,otp,status,resent_count) VALUES(?,?,?,?)";
            connection.query(query,[info.userInfo.id,info.otpInfo.otp,'SENT',0], function(err,result){
                connection.release();
                if(err) reject(err);
                if(result.affectedRows > 0){
                    resolve(info);
                }else{
                    reject("Failed while creating otp!!");
                }       
            });
        });
    });
}


var updateOtpTxn = function(info){
	return new Promise(function(resolve,reject){
        var query = "UPDATE otp_txn SET otp = '" + info.otpInfo.otp + "',status = '" + info.otpInfo.status + "', resent_count = '" + info.otpInfo.resent_count + "' WHERE id = '" + info.otpInfo.id + "'";
        database.dbTransaction(info.req, info.response, query, function(resentResults) {
            if (resentResults) {
                info.otpUpdate = "success";
                resolve(info);
            } else {
                reject("failed");
            }
        });
    });
}

var updateOtpTxnWithDONE = function(info){
    return new Promise((resolve,reject) =>{
        database.getDBConnection(connection => {
            var query = "UPDATE otp_txn SET status='DONE',resent_count = 0 WHERE id = ? ";
            connection.query(query,[info.otpInfo.id], function(err,result){
                connection.release();
                if(err) reject(err);
                if(result.changedRows > 0){
                    info.otpInfo.verification = "success";
                    resolve(info);
                }else{
                    reject("Invalid userid!!");
                }       
            });
        });
    });
}

var getUserPoint = function(info){
    return new Promise((resolve,reject) =>{
        database.getDBConnection(connection =>{
            var query = "SELECT * from point WHERE uid= ?";
            connection.query(query,[info.userInfo.id], function(err,result){
                connection.release();
                if(err) reject(err);
                resolve(result[0].total_points);      
            });

        });
    });
}

var newUserOtpTxn = function(info){
    return new Promise((resolve,reject) =>{
        database.getDBConnection(connection =>{
            var newUserRuleQuery = "SELECT value from rules where name = 'STARLLY_NEW_USER_BONUS_POINT'";
            connection.query(newUserRuleQuery, (err, newUserBonusPoint) =>{
                if(err) reject(err);
                var updateVerification = "UPDATE user SET verified=true WHERE id = ?";
                logger.info(newUserBonusPoint);                                            
                connection.query(updateVerification , [info.userInfo.id] , (err,result) =>{
                    if(err) reject(err);
                    userTrsn.newuser(info.req, info.response, info.req.body.userid, info.req.body.restid, function(transaction) {
                        if(parseInt(newUserBonusPoint[0].value) > 0){
                            var message = "Welcome to StarLLy, Your account has been verified successfully and you have earned " + newUserBonusPoint[0].value + " StarLLy reward points";
                            sendsms(info.req, info.response, info.userInfo.phone , message, info.otpInfo.otp,function(){
                                resolve(newUserBonusPoint[0].value);
                            });
                        }else{
                            var message = "Welcome to StarLLy, Your account has been verified successfully and you have earned " + newUserBonusPoint[0].value + " StarLLy reward points";
                            sendsms(info.req, info.response, info.userInfo.phone , message, info.otpInfo.otp,function(){
                                resolve(newUserBonusPoint[0].value);
                            });
                        }
                    });
                });
            })
        })
    })
}

function generateOTP() {
    // Generate a secret key. 
    var secret = speakeasy.generateSecret({ length: 20 });
    // Access using secret.ascii, secret.hex, or secret.base32. 
    // Generate a time-based token based on the base-32 key. 
    // HOTP (counter-based tokens) can also be used if `totp` is replaced by 
    // `hotp` (i.e. speakeasy.hotp()) and a `counter` is given in the options. 
    var token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });

    // Returns token for the secret at the current time 
    // Compare this to user input 
    return token;
}

function sendsms(req, response, whom, message, otp, callback) {
    whom = (whom.length == 10) ? 91 + whom : whom;
    var otp = otp ? otp : generateOTP();
    logger.info('OTP value is : '+ otp);
    var options = {
        host: req.app._sms.host,
        path: req.app._sms.path.replace('{to}', whom).replace('{message}', message.replace('{OPT}', otp)).replace(/ /g, '%20'),
        method: 'GET'
    }

    logger.info(options.host + options.path);
    var request = http.request(options.host + options.path, function(res) {
        var body = ""
        res.on('data', function(data) {
            body += data;
        });
        res.on('end', function() {
            callback(otp);
        });
    });

    request.on('error', function(e) {
        logger.info('Problem with request: ' + e.message);
    });

    request.end();
}

module.exports = {

    sendsms: function(req, response, whom, message, callback) {
        whom = (whom.length == 10) ? 91 + whom : whom;
        var sendOTP = generateOTP();
        var options = {
            host: req.app._sms.host,
            path: req.app._sms.path.replace('{to}', whom).replace('{message}', message.replace('{OPT}', sendOTP)).replace(/ /g, '%20'),
            method: 'GET'
        }

        logger.info(options.host + options.path);
        var request = http.request(options.host + options.path, function(res) {
            var body = ""
            res.on('data', function(data) {
                body += data;
            });
            res.on('end', function() {
                callback(sendOTP);
            });
        });

        request.on('error', function(e) {
            logger.info('Problem with request: ' + e.message);
        });

        request.end();
    },

    sendOTP: function(req, response, whom, message, userid, callback) {
        var info = {'userId' : userid};
        getUserInfo(info)
        .then(info => {
            return getOtpInfo(info);
        })
        .then(info => {
            if(info.otpInfo){
                //Update opt_txn table with new OTP and return the same.
                info.otpInfo.otp = generateOTP();
                info.otpInfo.status = "SENT";
                info.otpInfo.resent_count = 0;
                return updateOtpTxn(info);
            }else{
                // Insert new OTP record to the table as it is first time request.
                info.otpInfo = {};
                info.otpInfo.uid = info.userInfo.id;
                info.otpInfo.otp = generateOTP();
                info.otpInfo.status = "SENT";
                info.otpInfo.resent_count = 0;
                return insertOtpTxn(info);
            }
        })
        .then(info => {
            try {
                sendsms(req, response, info.userInfo.phone,
                 'OTP for starlly is ' + info.otpInfo.otp, info.otpInfo.otp, function() {
                    callback();
                });
            } catch (error) {
                return response.status(400).json({ "code": 400, "status": "SMS gatway Exceptions" });
            }
        })
    },

    resendOPT: function(req, response) {
        try {
            var userid = req.headers['userid'];
            logger.info('Init Resend OTP : [Userid] - ' + userid)
            if (userid) {
                try {
                    var info = {"userId" : userid,"req" : req, "response" : response};
    				getUserInfo(info).then(function(info){
                    	return getOtpInfo(info);
                    }).then(function(info){
                        if(info.otpInfo){
                        	if(info.otpInfo.resent_count < 3){
                        		var timediff = new Date().getTime() - new Date(info.otpInfo.updated_date).getTime();
                        		//In case OTP Expired , OTP life is 5 minute.
                        		if(Math.floor((timediff/1000)/60) >= 5){
                                	info.otpInfo.otp = generateOTP();
                                    info.otpInfo.status = "RESENT";
                                    info.otpInfo.resent_count = info.otpInfo.resent_count + 1;
                                    return updateOtpTxn(info);
                                }else{
                                	info.otpInfo.status = "RESENT";
                                    info.otpInfo.resent_count = info.otpInfo.resent_count + 1;
                                    return updateOtpTxn(info);
                                }
                            }else{
                            	throw "OTP Max try exceeded!!";
                            }
                        }else{
                            throw "Invalid userid!!";
                        }
                    }).then(function(info){
                    	try {
                            sendsms(info.req, info.response, info.userInfo.phone, 'OTP for starlly is ' + info.otpInfo.otp, info.otpInfo.otp, function() {
                            	return response.status(200).json({ "code": 200, "status": "OTP resent successfully" });
                            });
                        } catch (error) {
                            throw "SMS gatway Exceptions";
                        }

                    }).catch(function(err){
                    	var reserror = {};
                    	reserror.status = err;
                    	return response.status(400).json(reserror);
                    });
            	} catch (error) {
                    return response.status(400).json({"status": "DB Exceptions"});
            	}
        	}else{
    			return response.status(400).json({"status": "Invalid userid!!"});
        	}
    	}catch(err){
    		return response.status(500).json({"status": "Internal Server Error!!"});
    	}
    },
    
    verify: function(req,response){
        if (req.body.userid && req.body.otp) {
            var info = {"userId" : req.body.userid,"req" : req, "response" : response};
            getUserInfo(info)
            .then( info => {
                return getOtpInfo(info);
            })
            .then( info => {
                if(info.otpInfo.otp === info.req.body.otp){
                    return updateOtpTxnWithDONE(info);
                }else{
                    return new Promise( (resolve,reject) =>{
                        reject("OTP is incorrect, please re-try");
                    })
                }
            })
            .then(info => {
                if (info.req.body.isNewUser) {
                    return newUserOtpTxn(info);
                }else{
                    return getUserPoint(info);
                }   
            })
            .then( total_points =>{

                return response.status(200).json({"status": 'success', "total_points": total_points});
            })
            .catch(function(err){
                return response.status(400).json({"status" : err});
            });
        }else{
            return response.status(400).json({"status": "Either userid or otp is Empty!!"});
        }
    },

    profileSendOTP : function(req, response){
        var info = {"userId" : req.headers.userid,"req" : req, "response" : response};
        getUserInfo(info)
        .then( info =>{
            return checkForOTPDetails(info);
        })
        .then( info => {
            if(info.otpInfo == null){
                info.otpInfo = {'otp' : generateOTP()};
                return insertOtpTxn(info);
            }else{
                var timediff = new Date().getTime() - new Date(info.otpInfo.updated_date).getTime();        
                if((info.otpInfo.status == 'SENT' || info.otpInfo.status == 'RESENT') && Math.floor((timediff/1000)/60) < 5){
                    return Promise.resolve(info);
                }else{
                   info.otpInfo.otp = generateOTP();
                    info.otpInfo.status = 'SENT';
                    info.otpInfo.resent_count = 0;
                    return updateOtpTxn(info); 
                }
            }
        })
        .then(info => {
            sendsms(req, response, info.userInfo.phone, "OTP for starlly is {OPT}", info.otpInfo.otp, function(result){
                response.status(200).json({"status" : "OTP Sent successfully."})
            })
        })
        .catch(function(err){
            return response.status(400).json({"status" : "OTP Sending Failed."});
        });
    },

    prfileVerifyOTP : function(req, response){
        var info = {"userId" : req.headers.userid,"req" : req, "response" : response};
        getUserInfo(info)
        .then( info =>{
            return checkForOTPDetails(info);
        })
        .then( info => {
            if(info.otpInfo == null){
                Promise.reject("Verfication failed.");
            }else{
                if(info.otpInfo.otp === info.req.headers.otp){
                    return updateOtpTxnWithDONE(info);
                }else{
                    return Promise.reject("OTP is incorrect, please re-try");
                }
            }
        })
        .then(info => {
            response.status(200).json({"status" : "OTP verified successfully."})
        })
        .catch(function(err){
            return response.status(400).json({"status" : err});
        });
    }
}
