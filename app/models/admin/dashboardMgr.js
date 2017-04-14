//Custome Dependency Modules
var dbutils = require("./restDBUtils.js");
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

function getIncrementPercentage(current , previous){
    var sign = "+";
    var percentage;
    if(current < previous){
        sign = "-";
    }
    if(current === previous){
        percentage = 0;
    }else if(current === 0){
        percentage = previous * 100;
    }else if(previous === 0){
        percentage = current * 100;
    }else if(previous > current){
        percentage = (previous/current) * 100;
    }else{
        percentage = (current/previous) * 100;
    }
    return sign + percentage;  
}

function doSummaryCalculation(oldCustPoints,newCustPoints){
    var info = {};
    info.new = { 'point' : newCustPoints};
    info.returnning = {'point' : oldCustPoints - newCustPoints};
    info.total = { 'point' : oldCustPoints};
    return info;
}

function doRatingCalculation(values){
    var ratingSummary = {};
    ratingSummary.starRating = {};
    ratingSummary.starRating.oneStar = 0;
    ratingSummary.starRating.twoStar = 0;
    ratingSummary.starRating.threeStar = 0;
    ratingSummary.starRating.fourStar = 0;
    ratingSummary.starRating.fiveStar = 0;
    var totalRating = 0;
    var ratingCount = 0;
    values.map(rating =>{
        var total = rating.variety_rating + rating.taste_rating + rating.service_rating;
        var ret = Math.round(total / 3);
        totalRating = totalRating + total;
        ratingCount++;
        if(ret == 5){
            ratingSummary.starRating.fiveStar++;
        }else if(ret == 4){
            ratingSummary.starRating.fourStar++;
        }else if(ret == 3){
            ratingSummary.starRating.threeStar++;
        }else if(ret == 2){
            ratingSummary.starRating.twoStar++;
        }else if(ret == 1){
            ratingSummary.starRating.oneStar++;
        }
    })
    ratingSummary.averageRating = ratingCount != 0 ? ((totalRating/3)/ratingCount).toFixed(2) : 0;
    ratingSummary.ratingCount = ratingCount;
    return ratingSummary;
}

function doTxnCount(values) {
    var txnCount = { 'new' : 0 ,'returnning' : 0 };
    values.map( val =>{
        if(val.txn_count > 1){
            //txnCount.new++;
            txnCount.returnning += val.txn_count;
        }else{
            txnCount.new++;
        }
    });
    txnCount.total = txnCount.new + txnCount.returnning;
    return txnCount;
}

function getRestTxnSummary(req, response){
    var interval = req.params.interval;
    dbutils.getRestaurantInfo(req.params.restid)
    .then(rid => {
        var currentIntervalFilter = getIntervalInfo(interval);
        var previousIntervalFilter = getPreviousIntervalInfo(interval);
        currentIntervalFilter.rid = rid.id;
        previousIntervalFilter.rid = rid.id;
        Promise.all([
            dbutils.getCustomerTxnSummary(currentIntervalFilter),
            dbutils.getCustomerTxnSummary(previousIntervalFilter),
            dbutils.getCustomerTxnTrend(currentIntervalFilter),
            dbutils.getNewCustomerCount(currentIntervalFilter),
            dbutils.getReturningCustomerCount(currentIntervalFilter),
            dbutils.getNewCustomerTxnSummary(currentIntervalFilter),
            dbutils.getNewCustomerTxnSummary(previousIntervalFilter)
        ])
        .then(values => {
            var currentIntervalInfo = doSummaryCalculation(values[0],values[5]);
            var previousIntervalInfo = doSummaryCalculation(values[1],values[6]);
            //var txnCount = doTxnCount(values[3]);
            currentIntervalInfo.new.growth = parseInt(getIncrementPercentage(currentIntervalInfo.new.point,previousIntervalInfo.new.point));
            currentIntervalInfo.returnning.growth = parseInt(getIncrementPercentage(currentIntervalInfo.returnning.point,previousIntervalInfo.returnning.point));
            currentIntervalInfo.total.growth = parseInt(getIncrementPercentage(currentIntervalInfo.total.point,previousIntervalInfo.total.point));
            currentIntervalInfo.trend = values[2];
            currentIntervalInfo.new.customerCount = values[3];
            currentIntervalInfo.returnning.customerCount = values[4] - values[3];
            currentIntervalInfo.total.customerCount = values[4];
            response.status(200).json(currentIntervalInfo);
        }, error =>{
            response.status(500).json({"status": error });
        })
    })
    .catch(error =>{
        response.status(500).json({"status": error });
    })
    
}

function getOfferSummary(req, response){
    dbutils.getRestaurantInfo(req.params.restid)
    .then(rid => {
        var info = {};
        info.restInfo = {"id": rid.id};
        Promise.all([
            myPromise.getCurrentRunningOffer(info),
            myPromise.getLiveBounceBackByRestaurant(rid.id)
        ])
        .then(values =>{
            delete values[0].restInfo;
            delete values[0].currentOfferInfo.offerid;
            delete values[1].bouncebackid;
            values[0].bounceBackOffer = values[1];
            response.status(200).json(values[0]);
        },error =>{
            response.status(500).json({"status": error });
        });
    })
    .catch(error =>{
        response.status(500).json({"status": error });
    })
}

function getRatingSummary(req, response){
    var interval = req.params.interval;
    dbutils.getRestaurantInfo(req.params.restid)
    .then(rid => {
        var currentIntervalFilter = getIntervalInfo(interval);
        currentIntervalFilter.rid = rid.id;
        dbutils.getRestaurantRattingInfo(currentIntervalFilter)
        .then(values =>{
            response.status(200).json(doRatingCalculation(values));
        },error =>{
            response.status(500).json({"status": error });
        })
    })
    .catch(error =>{
        response.status(500).json({"status": error });
    })
}

module.exports = {
    getRestTxnSummary : function(req, response) {
        getRestTxnSummary(req,response);
    },
    getOfferSummary : function(req, response){
        getOfferSummary(req, response);
    },
    getRatingSummary : function(req, response){
        getRatingSummary(req, response);
    }
}
