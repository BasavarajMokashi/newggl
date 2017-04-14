// set up ======================================================================
var async = require('async');
var express = require('express');
var app = express(); 						// create our app w/ express
//var mysql = require('mysql');
var session = require('express-session');
var AppConstants = require("./app/models/common/constants.js");
var database = require('./config/database'); // load the database config
var smsgateway = require('./config/sms_gateway');			// load the sms gateway config
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var winston = require('winston');
var fileUpload = require('express-fileupload');
var fs = require('fs');
//Method promises
var Q = require('q');

/*Set server port and project path*/
app.set('port', (process.env.PORT || 3000));
// set the static files location /public/img will be /img for users
app.use(express.static('./public/'));
app.use(express.static('apps'));
		
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
// default options to upload the file
app.use(fileUpload());

// routes ======================================================================
require('./app/routes.js')(app);

//Starlly Constants
app.constants = AppConstants.Constants;

//Establish MySql DB Pool Connections
/*
* A pool manages many lazily-created (in felixge's module) connections. While one connection is busy 
* running a query, others can be used to execute subsequent queries. This can result in an increase in 
* application performance as it allows multiple queries to be run in parallel.
*/
// Commeted DB related code as it has been added to database.js directly.
// app._conn = mysql.createPool(database.localhost);
app._sms = smsgateway.localhost;
// listen (start app with node server.js) ======================================

//app._sms = smsgateway.localhost;

// Added to avoid http error 304 due to etag validation issue
app.set('etag', false);

/*
 * Store the db connection and start listening on a port.
 */
function startExpress() {
    // This method will listen created server and with that port 
    // If this method is not there server will be created and but not listen that port 
    app.listen(app.get('port'), function() {
        //app.listen(app.get('port'), '0.0.0.0', function() {
        console.log("Node app is running at localhost:" + app.get('port'), app.settings.env)
    });
}

/*
* Page-not-found middleware. 
*/
function handle404(req, res, next) {
    res.status(404).end('not found');
}

/*
 * Generic error handling middleware.
 * Send back a 500 page and log the error to the console.
 */
function handleError(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        err: err.message
    });
}

/*
* Runs an array of functions in series, 
* each passing their results to the next in the array. 
* However, if any of the functions pass an error to the callback, 
* the next function is not executed and the main callback is 
* immediately called with the error.
*/
async.waterfall([
    function connect(callback) {
        callback();
    }
], function(err) {
    if (err) {
        console.error(err);
        process.exit(1);
        return;
    };
    startExpress();
});
