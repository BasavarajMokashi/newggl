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

starllyApp.controller('SignUp',function($scope, $rootScope, $timeout, $mdDialog, genericService, configHttpReqService, errorService){
	$scope.initSignUpCtrl = function() {
		$scope.loadingSpinnerInSignUp = false;
		$scope.OnlyNumbersNChar = Constants.Global.OnlyNumbersNChar;
		if(HOSTNAME.indexOf('localhost') >= 0){
			$scope.captchaSiteKey = '6Le-LygTAAAAAMw3QFG7-Y3qL3AxxI4TryBlYn1J';
		}else{
			$scope.captchaSiteKey = '6LcL3AcUAAAAABtOuAAzLkp94K3l3eq52uGUumQ4';
		}
		//List of veg type of restaurant to display in restaurant type in signup
		$scope.vegType = [
			{label: 'Pure Veg', value: 'VEG'},
			{label: 'Non Veg', value: 'NONVEG'},
			{label: 'Both', value: 'BOTH'}
		];
		$scope.rest_types = [{
			"name":"Fast Food",
			"selected":false
		},
		{
			"name":"Fine Dining",
			"selected":false
		},
		{
			"name":"Pub",
			"selected":false
		},
		{
			"name":"Ethnic",
			"selected":false
		},
		{
			"name":"Casual Dining",
			"selected":false
		},
		{
			"name":"Cafe",
			"selected":false
		},
		{
			"name":"Lounge",
			"selected":false
		}];

		$scope.project = {
		   "name": "",
		   "username": "",
		   "password": "",
		   "confirmPassword":"",
		   "tab_pin": "5555",
		   "phone": "",
		   "email":"",
		   "lat": 0,
		   "lng": 0,
		   "primary_image_url":"",
		   "logo_url": "",
		   "cost_for_2_people":"",
		   "rest_type":[],
		   "address1":"",
		   "address2":"",
		   "city":"",
		   "state":"Karnataka",
		   "pin":"",	
		   "locality":"",
		   "contact_person_fname":"",
		   "contact_person_lname":"",
		   "veg_type":'VEG'
		 };
	   	//List of states to display in address and location in signup
	   	$scope.states = [
	   		'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajashthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
	   	]
	   	//Call Google API fn
        $scope.callGoogleMapAPI();
	};
	
		

	//Load Google API for google map
	$scope.callGoogleMapAPI = function() {

			
		 	var myLatLng = {lat: 12.9716, lng: 77.5946};
		    var map = new google.maps.Map(document.getElementById('map'), {
		      center: myLatLng,
		      zoom: 13
		    });

		    var defaultBounds = new google.maps.LatLngBounds(
  				new google.maps.LatLng(12.9716, 77.5946),
  				new google.maps.LatLng(12.9716, 77.5946));

		    var input = document.getElementById('pac-input');
		    var options = {
  					bounds: defaultBounds,
  					types: ['establishment']
				};
			 map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', map);
			autocomplete.setOptions({strictBounds: true})
		     // var autocomplete = new google.maps.places.Autocomplete(input);
		     // autocomplete.bindTo('bounds', map);

		  

		    var infowindow = new google.maps.InfoWindow();
		    var marker = new google.maps.Marker({
		      position :  myLatLng,
		      map: map,
		      draggable:true,
		      clickable: true,
		      title: 'lat: ' + myLatLng.lat+ '\n' +'lng: '+ myLatLng.lng
		      

		    });
		    marker.addListener('click', function() {
		      infowindow.open(map, marker);
		    });

		    google.maps.event.addListener(marker, 'dragend', function(marker){
		        var latLng = marker.latLng; 
		        currentLatitude = latLng.lat();
		        currentLongitude = latLng.lng();
		        $scope.project.lat = latLng.lat();
		        $scope.project.lng = latLng.lng();
		       	myLatLng = {lat:currentLatitude, lng:currentLongitude};
		        $("#spnLat").text(currentLatitude);
		         $("#spnLng").text(currentLongitude);
		       if( infowindow)
		       {
		       	 infowindow.close();
		       }
		     });

		     autocomplete.addListener('place_changed', function() {
		      infowindow.close();
		      var place = autocomplete.getPlace();
		      if (!place.geometry) {
		        return;
		      }

		      if (place.geometry.viewport) {
		        map.fitBounds(place.geometry.viewport);
		      } else {
		        map.setCenter(place.geometry.location);
		        map.setZoom(17);
		       
		      }
		      //angular.element('body').scope().$broadcast("latLngFromMap", {"lat":place.geometry.location.lat(), "lng":place.geometry.location.lng()});
		      // Set the position of the marker using the place ID and location.
		       $scope.project.lat = place.geometry.location.lat();
		        $scope.project.lng = place.geometry.location.lng();
		         $("#spnLat").text(place.geometry.location.lat());
		         $("#spnLng").text(place.geometry.location.lng());
		      marker.setOptions({
		      		draggable: true,
		      		place: place.place_id,
		      		position: place.geometry.location
		      });

		      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          			place.formatted_address);
      		   infowindow.open(map, marker);
		     
		    });
		   
		    setTimeout(function() { google.maps.event.trigger(map, "resize"); },100);

	};

	function openInfoWindow(map, marker)
	{

	}
	
	$scope.validateRestoUserId = function(name) {
    	var updateHeaders = Constants.Global.DefaultHTTPHeader;
    	updateHeaders.username = name;
		configHttpReqService.httpRequestWithPromise(Constants.URLS.IsValidRestoUserId, Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				if( resp.code === 200 ){
					$scope.isRestoUserIdExists = true;
				}else if( resp.code === 404 ) {
					$scope.isRestoUserIdExists = false;
				}
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.registration = function(e, signupForm) {
		if( signupForm.$valid && !$scope.isRestoUserIdExists ){
			if($scope.project.lat == 0 || $scope.project.lng == 0 )
			{
				alert("Location not selected on map, please mark your location by dragging the marker/searching the location.");
				return;
			}
			if($scope.project.conditions) {
				$scope.loadingSpinnerInSignUp = true;
				if(!$scope.project.primary_image_url) {
					$scope.project.primary_image_url = "https://storage.cloud.google.com/starlly/web/photo_not_available.png?_ga=1.96420890.742823991.1487762716";
				}
				//delete $scope.project.contact_person_fname;
				//delete $scope.project.contact_person_lname;
				delete $scope.project.conditions;
				//$scope.$broadcast("uploadFile", {"values":$scope.project, "eventOrLoadAPI":e});
			    configHttpReqService.httpRequest(Constants.URLS.RESTAURENT_SIGNUP, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, $scope.project, Constants.HTTP_REQ.SIGNUP, e);
			} else {
				alert("Not accepted the StarLLy Terms and Conditions!!");
			}
		}else{
			alert("Please fill all the mandatory fields!!");
		}
	};

	$scope.changeOnRestType = function(name, value) {
		if(value) {
			$scope.project.rest_type.push(name);
		} else {
			var index = $scope.project.rest_type.indexOf(name);
			if (index > -1) {
			    $scope.project.rest_type.splice(index, 1);
			}
		}
	};


	$rootScope.successOutputOfRegistration = function(resp, optionalData) {
		$scope.loadingSpinnerInSignUp = false;
		// Appending dialog to document.body to cover sidenav in docs app
	    // Modal dialogs should fully cover application
	    // to prevent interaction outside of dialog
	    $mdDialog.show($mdDialog.alert()
	    				.parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Congratulations!!!')
				        .textContent('We have sent you an email. Please go to your Inbox for email verification.')
				        .ariaLabel('Alert Dialog')
				        .ok('OK')
				        .targetEvent(optionalData))
	    .then(function(answer) {
	    	$scope.$emit("toChangeCurrentPage", "HomePage");
	    }, function() {
	    	console.log("Error");
	    });
	};

	$scope.$on("spinnerInSignUp", function(e, data) {
		$scope.loadingAdditionalPage = data;
	});

	$scope.$on("uploadedFilePath", function(e, data) {
		if( data.uploadType === 'PRIMARY' ) {
			if( data.files && data.files.length ) {
				$scope.project.primary_image_url = data.files[0];
			}else{
				angular.element('[name="primaryImage"]').val('');
			}
		}else if( data.uploadType === 'LOGO' ) {
			if( data.files && data.files.length ) {
				$scope.project.logo_url = data.files[0];
			}else{
				angular.element('[name="logoImage"]').val('');
			}			
		}
	});

	$scope.$on("latLngFromMap", function(e, data){
		if(data) {
			if(data.lat && data.lng) {
				$scope.project.lat = data.lat;
				$scope.project.lng = data.lng;
			}
		}
	});

	//Load initSignUpCtrl fn when SignUp ctrl loaded
	$scope.initSignUpCtrl();
}).directive("compareTo", function() {
	return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
             
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
 
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
});


