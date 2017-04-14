//Custome Dependency Modules
var homeInfo    = require(__dirname + "/models/home/homeManagement.js");
var userMgmt    = require(__dirname + "/models/user/userManagement.js");
var userTrsn    = require(__dirname + "/models/user/userTransactions.js");
var userProfile = require(__dirname + "/models/user/userProfile.js");
var restoMgmt   = require(__dirname + "/models/restaurant/restoManagement.js");
var restDashboardMgr = require(__dirname + "/models/restaurant/dashboardMgr.js");
var reviewMgmt = require(__dirname + "/models/reviewManagement.js");
var otpMgmt = require(__dirname + "/models/otpTransactions.js");
var offersMgmt = require(__dirname + "/models/offersManagement.js");
var fUpload = require(__dirname + "/models/fileUpload.js");
var eMail = require(__dirname + "/models/mail.service.js");
var waiverMgmt = require(__dirname + "/models/waiverManagement.js");
var bouncebackMgmt = require(__dirname + "/models/bouncebackManagement.js");
var ruleMgmt = require(__dirname + "/models/ruleManagement.js");
var adminMgmt = require(__dirname + "/models/admin/adminManagement.js");
var starllyUserMgmt = require(__dirname + "/models/admin/userMgr.js");
var starllyRestoMgmt = require(__dirname + "/models/admin/resturantMgr.js");
var searchEngineMgmt = require(__dirname + "/models/searchEngine/searchEngine.js");
var demoMgr = require(__dirname + "/models/restaurant/demoMgr.js");
var logger = require('../config/logger.js');
module.exports = function(app) {
    app.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });
     /************** API Routhing **************/
    app.get('/userDashboard/auth', function(req, response) {
        try {
            userMgmt.auth(req, response);
        } catch (err) {
            logger.error(err.message);
            response.writeHead(500, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                "errorMessage": err.message
            }));
        }
    });
   
   app.get('/homePage/getClassInfo', function(req, response) {
        try {
            homeInfo.getClassInfo(req, response);
        } catch (err) {
            logger.error(err.message);
            response.writeHead(500, {
                'Content-Type': 'application/json'
            });
            response.end(JSON.stringify({
                "errorMessage": err.message
            }));
        }
    });
   
};
