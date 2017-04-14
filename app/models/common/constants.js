//Starlly Commission Constants
var database = require(__dirname + "/../database.js");
module.exports = {
	Constants : (function() {
		var Commision = {
			Loyalty : [
				{
					"offersRange": {
						min: 0,
						max: 5
					},
					"commisionPercentage": {
						"base": 2,
						"additional": 0
					}
				},
				{
					"offersRange": {
						min: 5.1,
						max: 10
					},
					"commisionPercentage": {
						"base": 2,
						"additional": 20
					}
				},
				{
					"offersRange": {
						min: 10.1,
						max: 100
					},
					"commisionPercentage": {
						"base": 3,
						"additional": 10
					}
				}
			]
		};

		var MailOptions = {
			to: '',
			template: '',
			subject: ''
		};


		var SMSTemplates = {
			TransactionComplete: 'Dear {customer}, at {restaurant} you have just earned {earned} StarLLy reward points, redeemed {redeemed} points, your total outstanding rewards points are {total}'
		};

	    var Constants = {
			Commision: Commision,
			MailOptions: MailOptions,
			SMSTemplates: SMSTemplates,
			MAXPossibleBB: 100,
			MAXPossibleOffer: 100
	    };
	    return Constants;
	})(),

	defaultOffer: function(req, response, callback) {
        var defaultOfferQuery = "SELECT hex(ruleid) as offerid, value as discount from rules where name = 'STARLLY_DEFAULT_OFFER'";
        database.dbTransaction(req, response, defaultOfferQuery, function(defaultOffer) {
        	if(defaultOffer.length > 0){
                callback(defaultOffer[0]);
            }else{
            	var offers = {
                    "offerid": null,
                    "discount": 0
                }
            	callback(offers);
            }
        });
	}	
}


