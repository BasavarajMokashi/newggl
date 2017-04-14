/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 * Version 			: 	0.00.01
 * Author			:	Vinay N M
 * Date				:	12-Sept-2016
 */

eLearningApp.factory('genericfactory', function() {
	var genericVar = {
		"calculateClosedOnOrOfferDays" : 
			function(mon, tue, wed, thurs, fri, sat, sun, value) {
				if(mon) {
					value = "1";
				} else {
					value = "0";
				}
				if(tue) {
					value += "1";
				} else {
					value += "0";
				}
				if(wed) {
					value += "1";
				} else {
					value += "0";
				}
				if(thurs) {
					value += "1";
				} else {
					value += "0";
				}
				if(fri) {
					value += "1";
				} else {
					value += "0";
				}
				if(sat) {
					value += "1";
				} else {
					value += "0";
				}
				if(sun) {
					value += "1";
				} else {
					value += "0";
				}
				return value;
			},
		"replaceSemiColonWithEmptyString" : function(str) {
			if(typeof str == "string") {
				return str.replace(":", "");
			} else {
				return str;
			}
		},
		"dateFormatorYYYYMMDD" : function(date) {
    		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate();
		}
	};
	return genericVar;
});
