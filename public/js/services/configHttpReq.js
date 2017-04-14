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
var configHttpReqMod = angular.module('ConfigHttpReq',['Errors']);
configHttpReqMod.service('configHttpReqService', function($http, $rootScope, $q, errorService){
	
	var httpRequestSuccess = function(DATA, SUCCESSCALLBACK, OPTIONALDATA, status, headers, config) {
		switch(SUCCESSCALLBACK){
			case 	Constants.HTTP_REQ.SIGNUP:
				//Success Callback function for signup
				$rootScope.successOutputOfRegistration(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.SOCIAL:
				//Success Callback function for facebook signup
				//$rootScope.successSocialRegistration(DATA,OPTIONALDATA);
				return;
			break;
			case 	Constants.HTTP_REQ.SIGNIN:
				//Success Callback function for signin
				$rootScope.authentication.successOutputOfLoginToStarlly(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.UPDATEINFO:
				//Success Callback function for update info
				$rootScope.successOutputOfAdditionalInfo(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.CREATENEWOFFER:
				//Success Callback function for creating new offer
				$rootScope.successOutputOfCreateOffer(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.GETLIVEOEFFER:
				//Success Callback function for get live offer details
				$rootScope.successOutputOfGetActiveOffers(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.DELETEPARTICULAROFFER:
				//Success Callback function for deleting particular offer
				$rootScope.successOutputOfDeleteOffer(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.GOLIVEPARTICULAROFFER:
				//Success Callback function for particular offer to be go live
				$rootScope.successOutputOfGoLiveOffer(DATA,OPTIONALDATA);
			break;
			case	Constants.HTTP_REQ.EDITOFFER:
				$rootScope.successOutputOfOfferUpdate(DATA,OPTIONALDATA);
			break;
		}
	};
	var httpRequestFailure = function(DATA, ERRORCALLBACK, OPTIONALDATA, status, headers, config) {
		switch(ERRORCALLBACK){
			case 	Constants.HTTP_REQ.SIGNUP:
				//Error Callback function for signup
				errorService.errorOutputOfRegistration(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.SIGNIN:
				//Error Callback function for signin
				$rootScope.authentication.errorOutputOfLoginToStarlly(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.UPDATEINFO:
				//Error Callback function for update info
				errorService.errorOutputOfAdditionalInfo(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.CREATENEWOFFER:
				//Error Callback function for creating new offer
				errorService.errorOutputOfCreateOffer(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.GETLIVEOEFFER:
				//Error Callback function for get live offer details
				errorService.errorOutputOfGetActiveOffers(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.DELETEPARTICULAROFFER:
				//Error Callback function for deleting particular offer
				errorService.errorOutputOfDeleteOffer(DATA,OPTIONALDATA);
			break;
			case 	Constants.HTTP_REQ.GOLIVEPARTICULAROFFER:
				//Error Callback function for particular offer to be go live
				errorService.errorOutputOfGoLiveOffer(DATA,OPTIONALDATA);
			break;
			case	Constants.HTTP_REQ.EDITOFFER:
				errorService.errorOutputOfOfferUpdate(DATA,OPTIONALDATA);
			break;
		}
	};

	var httpRequest = function(HTTPURL, METHOD, HEADERS, POSTDATA, SUCCESSORERRORCALLBACK, OPTIONALDATA){
		if( CommonUtils.isEmpty(HTTPURL) || CommonUtils.isEmpty(METHOD) || CommonUtils.isEmpty(HEADERS) || CommonUtils.isEmpty(SUCCESSORERRORCALLBACK) )
		{
			return;
		}
		
		$http({
			url 	 : HTTPURL,
			method 	 : METHOD,
			dataType : Constants.Global.DATATYPE,
			data 	 : POSTDATA,
			headers  : HEADERS
		}).success(function(respData, status, headers, config) {
			httpRequestSuccess(respData, SUCCESSORERRORCALLBACK, OPTIONALDATA, status, headers, config);
		}).error(function(errorData, status, headers, config) {
			httpRequestFailure(errorData, SUCCESSORERRORCALLBACK, OPTIONALDATA, status, headers, config);
		});
	};

	this.httpRequest = httpRequest;
	
	var httpRequestWithTransformResponse = function(HTTPURL, METHOD, HEADERS, POSTDATA, SUCCESSORERRORCALLBACK, OPTIONALDATA){
		if( CommonUtils.isEmpty(HTTPURL) || CommonUtils.isEmpty(METHOD) || CommonUtils.isEmpty(HEADERS) || CommonUtils.isEmpty(SUCCESSORERRORCALLBACK) )
			{
				return;
			}

		$http({
			url 	 : HTTPURL,
			method 	 : METHOD,
			dataType : Constants.Global.DATATYPE,
			data 	 : POSTDATA,
			headers  : HEADERS,
			transformResponse: [function (data) {
			   return data;
			}]
		}).success(function(respData, status, headers, config) {
			httpRequestSuccess(respData, SUCCESSORERRORCALLBACK, OPTIONALDATA, status, headers, config);
		}).error(function(errorData, status, headers, config) {
			httpRequestFailure(errorData, SUCCESSORERRORCALLBACK, OPTIONALDATA, status, headers, config);
		});
	};
	
	this.httpRequestWithTransformResponse = httpRequestWithTransformResponse;

	var httpRequestWithPromise = function(HTTPURL, METHOD, HEADERS, POSTDATA, SUCCESSCALLBACK, ERRORCALLBACK, OPTIONALDATA){
		var defer = $q.defer();
		
		if( CommonUtils.isEmpty(HTTPURL) || CommonUtils.isEmpty(METHOD) || CommonUtils.isEmpty(HEADERS) )
			defer.reject("Invalid parameters for httpRequestWithPromise");

		$http({
			url : HTTPURL,
			method : METHOD,
			headers : HEADERS,
			data : POSTDATA,
		}).success(function(respData) {
			defer.resolve(respData);
		}).error(function(errorData) {
			defer.reject(errorData);
		});

		return defer.promise;
	};
	
	this.httpRequestWithPromise = httpRequestWithPromise;
});