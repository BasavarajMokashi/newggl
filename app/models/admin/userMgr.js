//Custome Dependency Modules
var dbutils = require("./dbUtils.js");
var myPromise = require(__dirname + "/../dbOperationUtils.js");
var logger = require('../../../config/logger.js');

function getIntervalInfo(interval){
    var dateRange = {}, start = new Date(), end = new Date();
    dateRange.interval = 'HOUR';
    if(interval.toUpperCase() === 'WEEKLY'){
        var curr = new Date; // get current date
        var first = curr.getDate() - (curr.getDay() > 0 ? curr.getDay() : 7); // First day is the day of the month - the day of the week
        var last = first + 6;
        start = new Date(curr.setDate(first + 1));
        end = new Date(curr.setDate(last + 1));
        dateRange.interval = 'DAY';
    }else if(interval.toUpperCase() === 'MONTHLY'){
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        start = new Date(y, m, 1);
        end = new Date(y, m + 1, 0);
        dateRange.interval = 'DATE';
    }else if(interval.toUpperCase() === 'YEARLY'){
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        start = new Date(y, 0, 1);
        end = new Date(y, 12, 0);
        dateRange.interval = 'MONTH';
    }
    dateRange.start = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 00:00:00";
    dateRange.end = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 23:59:59";
    return dateRange;
}

function getPreviousIntervalInfo(interval){
    var dateRange = {};
    var start = new Date();
    var end = new Date();
    if(interval.toUpperCase() === 'DAILY'){
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
    }else if(interval.toUpperCase() === 'WEEKLY'){
        var curr = new Date(new Date().setDate(new Date().getDate()-7)); // get current date
        var first = curr.getDate() - (curr.getDay() > 0 ? curr.getDay() : 7); // First day is the day of the month - the day of the week
        var last = first + 6;
        start = new Date(curr.setDate(first + 1));
        end = new Date(curr.setDate(last + 1));
        dateRange.interval = 'DAY';
    }else if(interval.toUpperCase() === 'MONTHLY'){
        var date = new Date(), y = date.getFullYear(), m = date.getMonth()-1;
        start = new Date(y, m, 1);
        end = new Date(y, m + 1, 0);
        dateRange.interval = 'DATE';
    }else if(interval.toUpperCase() === 'YEARLY'){
        var date = new Date(), y = date.getFullYear()-1, m = date.getMonth();
        start = new Date(y, 0, 1);
        end = new Date(y, 12, 0);
        dateRange.interval = 'MONTH';
    }
    dateRange.end = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " 23:59:59";
    dateRange.start = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " 00:00:00";
    return dateRange;
}

function starllyUsers(req, response){
    dbutils.getStarllyUsers()
    .then(values =>{
        response.status(200).json(values);
    },error =>{
        response.status(500).json({"status": error });
    })
}

function userRegistrationStatistic(req, response){
    var interval = req.params.interval;
    var currentIntervalFilter = getIntervalInfo(interval);
    dbutils.getregistrationStatistic(currentIntervalFilter)
    .then(values =>{
        response.status(200).json(values);
    },error =>{
        response.status(500).json({"status": error });
    })
}

function usersTrends(req, response){
    var interval = req.params.interval;
    var currentIntervalFilter = getIntervalInfo(interval);
    dbutils.getUsersTrend(currentIntervalFilter)
    .then(values =>{
        response.status(200).json(values);
    },error =>{
        response.status(500).json({"status": error });
    })
}

module.exports = {
    getUsersTrends : function(req, response) {
        usersTrends(req,response);
    },
    getUsersRegistrationStatistic : function(req, response) {
        userRegistrationStatistic(req,response);
    },
    getStarllyUsers : function(req, response) {
        starllyUsers(req,response);
    }
}
