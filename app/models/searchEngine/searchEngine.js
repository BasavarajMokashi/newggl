//Custome Dependency Modules
var dbutils = require("./dbUtils.js");
var myPromise = require(__dirname + "/../dbOperationUtils.js");
var logger = require('../../../config/logger.js');

function starllyResturants(req, response){
	Promise.all([
		dbutils.getResturants(),
		myPromise.getDefaultOffer()
		])
    .then(values =>{
    	var restaurants = values[0].map(function(value){
    		if(value.discount == null){
    			value.discount = values[1];
    		}
    		return value;
    	});
    	response.status(200).json(restaurants);
    })
    .catch( err =>{
    	console.log(err);
    	response.status(400).json({"status" : err});
    })
}

function getRestaurantImages(req, response){
	
	myPromise.getRestaurantByRestID(req.params.restid)
	.then( rid =>{
		return dbutils.getRestaurantImages(rid);
	})
	.then( urls => {
		var val = [];
		urls.forEach(url =>{
			val.push(url.image_url);
		});
		response.status(200).json(val);
	})
	.catch( err => {
		response.status(400).json({"status" : err});
	})
}

function getRestaurantReviews(req, response){
	
	myPromise.getRestaurantByRestID(req.params.restid)
	.then( rid =>{
		return dbutils.getRestaurantReviews(rid);
	})
	.then( reviews => {
		response.status(200).json(reviews);
	})
	.catch( err => {
		response.status(400).json({"status" : err});
	})
}

module.exports = {
    getResturantsBySearch : function(req, response) {
        starllyResturants(req,response);
    },

    getRestaurantImages : function(req, response) {
    	getRestaurantImages(req, response);
    },
    getRestaurantReviews : function(req, response) {
    	getRestaurantReviews(req, response);
    }
}
