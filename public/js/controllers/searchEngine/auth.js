/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllySearchEngine.controller('userAuth', function($scope, $rootScope, $filter, $timeout, configHttpReqService) {

    function initSignUp() {
        $scope.signUpData = {
            name: '',
            phone: ''
        }
    }

    function initOTP() {
        $scope.verifyOtp = '';
    }

    function initSignIn() {
        $scope.signInData = {
            phone: '',
            password: ''
        }
    }

    function sendOTP() {
    	var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
	    	customHeader.userid = $scope.authDetails.userid;
        configHttpReqService.httpRequestWithPromise(Constants.URLS.sentUserOTP, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
            .then(
                function(resp) {
                    $scope.setAuthForm('OTP');
                },
                function(resp) {
                	alert(resp.status);
                    console.log('Error in sendOTP!');
                }
            );
    }

    $rootScope.resendOTP = function() {
    	//sendOTP();
      var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
        customHeader.userid =  Constants.userid ;   //$scope.authDetails.userid;
        configHttpReqService.httpRequestWithPromise(Constants.URLS.sentUserOTP, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
            .then(
                function(resp) {
                    $scope.setAuthForm('OTP');
                },
                function(resp) {
                  alert(resp.status);
                    console.log('Error in sendOTP!');
                }
            );
    }

    $scope.userAuth = function(formInfo) {
    	if( formInfo.$valid ) {
	    	var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
	    	customHeader.phone = $scope.signInData.phone;
	        configHttpReqService.httpRequestWithPromise(Constants.URLS.UserAuth, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
	            .then(
	                function(resp) {
	                	$scope.authDetails = resp;
                    Constants.userid = resp.userid;
	                    $scope.setAuthForm('OTP');
	                    sendOTP();
	                },
	                function(resp) {
	                	alert(resp.status);
	                    console.log('Error in user auth!');
	                }
	            );
	    }else{
	    	alert("Please fill the mandatory fields!!");
	    }
    }

    $scope.userRegistration = function(formInfo) {
    	if( formInfo.$valid ) {
	    	var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
	    	customHeader.phone = $scope.signUpData.phone;
	    	customHeader.name = $scope.signUpData.name;
	        configHttpReqService.httpRequestWithPromise(Constants.URLS.UserAuth, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
	            .then(
	                function(resp) {
	                	$scope.authDetails = resp;
	                    $scope.setAuthForm('OTP');
	                    sendOTP();
	                },
	                function(resp) {
	                	alert(resp.status);
	                    console.log('Error in user register/auth!');
	                }
	            );
	    }else{
	    	alert("Please fill the mandatory fields!!");
	    }
    }

     function populateUser() {
    	configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateUser.replace('{userid}',$scope.authDetails.userid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
	            .then(
	                function(resp) {
                        resp.name = resp.firstname ? resp.firstname : ' ' + resp.lastname ? resp.lastname : ' ';
	                    $rootScope.userDetails = resp;
	                },
	                function(resp) {
	                    alert(resp.status);
	                }
	            );
    }

    $scope.verifyOTP = function(formInfo) {
    	if( formInfo.$valid ) {
    		var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
	    	customHeader.userid = $scope.authDetails.userid;
	    	customHeader.otp = $scope.verifyOtp.length < 6 ? '0' + $scope.verifyOtp : $scope.verifyOtp;
	        configHttpReqService.httpRequestWithPromise(Constants.URLS.verifyUserOTP, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
	            .then(
	                function(resp) {
	                    $('[data-dismiss="modal"]').trigger('click');
	                    populateUser();
	                },
	                function(resp) {
                        alert(resp.status);
	                    console.log('Error in user verifyOTP!');
	                }
	            );
        }else{
	    	alert("Please fill the mandatory fields!!");
	    }
    }

    $scope.setAuthForm = function(form) {
        $rootScope.authForm = form;
        switch(form) {
        	case 'SIGNIN':
        		initSignIn();
        	break;
        	case 'SIGNUP':
        		initSignUp();
        	break;
        	case 'OTP':
        		initOTP();
        	break;
        	default:
        		initSignUp();
        }
    };

    $rootScope.initAuthForm = function() {
    	$scope.setAuthForm('SIGNUP');
    }


    // section included for facebook login......

     $scope.loginFromFB = function(formInfo){
        
     FB.getLoginStatus(function(response) {
          if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token 
            // and signed request each expire
            var uid = response.authResponse.userID;
               FB.api('/me','get', {fields:'name,first_name,last_name,picture,gender,email'}, function(fbResponse) {
                       console.log('Good to see you, ' + fbResponse.name + fbResponse.id);
                       console.log(fbResponse.picture.data.url);
                       // Validte if profile already exists in Starlly... Add if not existed
                       checkFBProfileExists(fbResponse);
                     });
          } else if (response.status === 'not_authorized') {
              // the user is logged in to Facebook, 
             // but has not authenticated your app
             alert("You have logged in to Facebook however you don't have access to use Starrly app!")
          } else {
            // the user isn't logged in to Facebook.
                 FB.login(function(fbResponse) {
               
                      if (fbResponse.authResponse) {
                    
                      FB.api('/me','get', {fields:'name,first_name,last_name,picture,gender,email'}, function(fbResponse) {
                       console.log('Good to see you, ' + fbResponse.name + fbResponse.id);
                       console.log(fbResponse.picture.data.url);
                       // Validte if profile already exists in Starlly... Add if not existed
                       checkFBProfileExists(fbResponse);
                     });
            
            } else {
                alert('User cancelled login or did not fully authorize.');
            }
          });

        }
      });
    }
    // Validate if facebook profile already exists in the starlly application.. add profile if unavailble
     function checkFBProfileExists(fbResponse){
        var customHeader = angular.copy(Constants.Global.DefaultHTTPHeader);
            customHeader.profileid = fbResponse.id;
          
            configHttpReqService.httpRequestWithPromise(Constants.URLS.socNetUserExists, Constants.Global.METHOD.GET, customHeader, null, null, null, null)
                .then(
                    function(resp) {
                         if(!resp.isNew)
                         {
                             //user already exists load profile
                            //alert("user exists in starlly");
                            populateSocUser(fbResponse.id);

                           
                         }
                         else
                         {
                           addFBProfile(fbResponse);
                           
                           populateSocUser(fbResponse.id);
                            
                         }
                    },
                    function(resp) {
                        alert(resp.status);
                        console.log('Error in social user register/auth!');
                    }
                );
               
    }

    // Add FB profile to starlly database
      function addFBProfile(fbResponse){
       
          var data = { 
            profile_id: fbResponse.id,
            firstname: fbResponse.first_name,
            lastname: fbResponse.last_name, 
            gender: fbResponse.gender,
            image_url: fbResponse.picture.data.url,
            auth_type: 'FACEBOOK',
            verified: 1
        };
      
         configHttpReqService.httpRequest(Constants.URLS.registerSocNetUser, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, JSON.parse(JSON.stringify(data)), Constants.HTTP_REQ.SOCIAL, null);
      
    }
    // Populate facebook user details after the successful login
       function populateSocUser(profileid) {

      configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateSocUser.replace('{profileid}',profileid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
              .then(
                  function(resp) {
                      resp.name = resp.firstname ? resp.firstname : ' ' + resp.lastname ? resp.lastname : ' ';
                      $rootScope.userDetails = resp;
                      $scope.authDetails = resp;
                       $('[data-dismiss="modal"]').trigger('click');
                  },
                  function(resp) {
                      alert(resp.status);
                  }
              );
    }


    // end section facebook login

});
