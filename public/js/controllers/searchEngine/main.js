/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

var starllySearchEngine = angular.module('starllySearchEngine', ['ConfigHttpReq']);
/**
 * Enabling CORS and gzip compression for AngularJS $httpProvider globally.
 */
starllySearchEngine.config(['$httpProvider', function($httpProvider) {
	     $httpProvider.defaults.useXDomain = true;
	     $httpProvider.defaults.headers.common = {"Access-Control-Allow-Origin":"*"};
	     delete $httpProvider.defaults.headers.common['X-Requested-With'];
     }
]);

starllySearchEngine.controller('userCtrl',function($scope, $rootScope, $filter, $timeout, configHttpReqService){

	$rootScope.route = function(templateUrl) {
		$rootScope.viewTemplate = templateUrl;
		
	}	

	$rootScope.route('pages/main.html');	
});

// Including facebook login config and FB developer SDK
// Old SDK (deprecated)
//js.src = "//connect.facebook.net/en_US/all.js";

// New SDK (v2.x)
//js.src = "//connect.facebook.net/en_US/sdk.js";
//appId: starlly'855403734599841', watnext - 721577611276328

 window.fbAsyncInit = function() {
    FB.init({
      appId      : Constants.Global.FB_CONFIG.FB_APPID_DEV,
      xfbml      : true,
      version    : Constants.Global.FB_CONFIG.FB_SDKVERSION
    });
    FB.AppEvents.logPageView();
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
