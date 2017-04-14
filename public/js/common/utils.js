/*
 * Starlly.
 * 
 * Copyright (c) 2015 ariveguru.com
 * http://ariveguru.com
 *
 * Version 			: 	0.00.01
 * Author			:	Vinay N M
 * Date				:	12-Sept-2016
 */
 
var CommonUtils = (function() {
		
 	/**
	 * @param - field to check whether empty or not.
	 * @returns 
	 *        true if empty
	 *        false if not empty.
	 */
	this.isEmpty = function(param){
		if (param == null)
			return true;
		if (param != null && param.length != 0)
			return false;

		return true;
	};
	
	/**
	 * @param - field to check whether not empty or not.
	 * @returns 
	 *        true if not empty
	 *        false if empty.
	 */
	this.isNotEmpty = function(param){
		return !this.isEmpty(param);
	};
		
	/**
	 * @param - field to check the length.
	 * @param2 - length of the value to check 
	 * @returns 
	 *        true if length equals.
	 *        false if length not equals.
	 */
	this.isLength = function(param,param2){
		if (this.isNotEmpty(param)
			&& param.length == param2){
			return true;
		}
		
		return false;
	};
	
	/**
	 * @param - field to compare
	 * @param2 - field to compare
	 * @returns 
	 *        true if both param are equal.
	 *        false if both param are not equal
	 */
	this.isEqual = function(param,param2){
		if (this.isNotEmpty(param)
			&& this.isNotEmpty(param2)
			&& param == param2){
			return true;
		}
		
		return false;
	};
	
	this.isTrue = function(param){
		if (param == null)
			return false;
		if (param != null
			&& param == true){
			return true;
		}
		
		return false;
	};
	
	this.isFalse = function(param){
		return !this.isTrue(param);
	};
	
	/**
	 * @param - field to compare without case.
	 * @param2 - field to compare without case.
	 * @returns 
	 *        true if both param are equal.
	 *        false if both param are not equal
	 */
	this.isEqualIgnoreCase = function(param,param2){
		if (this.isNotEmpty(param)
			&& this.isNotEmpty(param2)
			&& param.toUpperCase() == param2.toUpperCase()){
			return true;
		}
		
		return false;
	};
	
	/**
	 * To check whether empty array or not.
	 */
	this.isEmptyArray = function(array){
		if (array != null 
				&& array.length > 0){
			return false;
		}
		
		return true;
	};
	
	/**
	 * To check whether array contains element or not.
	 * @array - list of elements
	 * @param - element
	 * 
	 */
	this.isContains = function(array,param){
		if (!this.isEmptyArray(array)
				&& this.isNotEmpty(param)
				&& array.indexOf(param) != -1)
		return true;
		
		return false;
	};
	
	/*
	 * To check wheather numeric value is positive or not
	 * @numeric : Numeric Value
	 */
	this.isPositiveNumeric = function(numeric) {
		//Regex Expression to validate the numeric values
		var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
		if( numeric && ( !numberRegex.test(numeric) || ( numberRegex.test(numeric) && numeric == 0) ) ) 
		return true;
		
		return false
	};
	

	/**
	 * Validate the email ID
	 * @param email - String
	 * @returns - boolean 
	 */
	this.validateEmail = function(email) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\	".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	};
	
	/**
	 * To check whether string contains param2.
	 * @param - string
	 * @param2 - string
	 * 
	 */
	this.isStringContains = function(param,param2){
		if (this.isNotEmpty(param)
				&& this.isNotEmpty(param2)
				&& param.toUpperCase().indexOf(param2.toUpperCase()) >= 0){
				return true;
		}
			
		return false;
	};
	
	
	/**
	 * To check whether string starts with param2.
	 * @array - list of elements
	 * @param - element
	 * 
	 */
	this.isStringStartsWith = function(param,param2){
		if (this.isNotEmpty(param)
				&& this.isNotEmpty(param2)
				&& param.indexOf(param2) == 0){
				return true;
		}
			
		return false;
	};
		
	/**
	 * Generate unique id
	 * @returns - boolean 
	 */
	this.getUniqueId = function() {
	    function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		    .toString(16)
		    .substring(1);
	    }
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	}
	
	return this;
})();
