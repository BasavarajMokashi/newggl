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

starllyApp.controller('additionalInfoCtrl',function($scope, $rootScope, $timeout, $filter, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){
	$scope.initAdditionalInfoPage = function() {
		$scope.additionalInfo = {
			"bus_contact_number":"",
			"alt_bus_contact_number":"",
			"cuisines":[],
			"services":[],
			"tags":[],
			"openning_time":"",
			"closing_time":"",
			"description":"",
			"facebook_handle":"",
			"twitter_handle":"",
			"website_url":"",
			"closed_on":"",
			"first_shift_st": "",
		    "first_shift_et": "",
		    "second_shift_st": "",
		    "second_shift_et": "",
		    "third_shift_st": "",
		    "third_shift_et": "",
		    "image_urls" : []
		};
		$scope.mon = false;
		$scope.tue = false;
		$scope.wed = false;
		$scope.thurs = false;
		$scope.fri = false;
		$scope.sat = false;
		$scope.sun = false;
		$scope.features = [{
			"name":"Vallet Parking",
			"selected":false
		},
		{
			"name":"Free Wi-fi",
			"selected":false
		},
		{
			"name":"Serves Wine",
			"selected":false
		},
		{
			"name":"Smoking",
			"selected":false
		},
		{
			"name":"Music",
			"selected":false
		},
		{
			"name":"Vegan Food",
			"selected":false
		},
		{
			"name":"Wheelchair Accessible",
			"selected":false
		},
		{
			"name":"Self Parking",
			"selected":false
		},
		{
			"name":"Alcohol",
			"selected":false
		},
		{
			"name":"Serves Beer",
			"selected":false
		},
		{
			"name":"TV",
			"selected":false
		},
		{
			"name":"Gluton/Casein Free Food",
			"selected":false
		},
		{
			"name":"Jain Food",
			"selected":false
		}];
		$scope.allCuisines = [
			'Multicuisine', 'Afghani', 'African', 'American', 'Andhra', 'Anglo Indian','Arabian', 'Armenian', 'Asian', 'Assamese', 'Australian', 'Awadhi', 'Bakery', 'Bangladeshi', 'Belgian', 'Bengali', 'Beverages', 'Bihari', 'Biryani', 'British', 'Bistro', 'Burger', 'Burmese', 'Cafe', 'Charcoal', 'Grill', 'Chettinad', 'Chili', 'Chinese', 'Coastal Karnataka', 'Continental', 'Coorg', 'Desserts', 'European', 'Fast Food', 'Fijian', 'Finger Food', 'French', 'German', 'Goan', 'Greek', 'Gujarati', 'Healthy Food', 'Hyderabadi', 'Ice Cream', 'Indonesian', 'Indian Chinese', 'Iranian', 'Irish', 'Israeli', 'Italian', 'Japanese', 'Juices', 'Kashmiri', 'Kerala', 'Konkan', 'Korean', 'Kumauni', 'Lebanese', 'Lounge', 'Lucknowi', 'Maharashtrian', 'Malaysian', 'Malwani', 'Mangalorean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Modern Australian', 'Mongolian', 'Moroccan', 'Mughlai', 'Naga', 'Native Australian', 'Nepalese', 'North Indian', 'North Karnataka', 'Oriya', 'Pakistani', 'Panini', 'Parsi', 'Persian', 'Pizza', 'Punjabi', 'Portuguese', 'Rajasthani', 'Raw Meats', 'Russian', 'Salad', 'Seafood', 'Sindhi', 'Singaporean', 'South American', 'South Indian', 'Spanish', 'Sri Lankan', 'Steakhouse', 'Street Food', 'Sushi', 'Tea', 'Tex-Mex', 'Thai', 'Tibetan', 'Turkish', 'Udupi', 'Vietnamese'
	    ];
	    $scope.additionalInfo.cuisines = [$scope.allCuisines[0]];
	    $scope.timeFrom = (Constants.Global.FROM_AND_TO_TIME).split(' ').map(function(tFrom){
		    return{timingFrom: tFrom};
		});
		$scope.timeTo = (Constants.Global.FROM_AND_TO_TIME).split(' ').map(function(tTo){
		    return{timingTo: tTo};
		});
	   	$scope.tags = [];
	   	$scope.shifts = [{'id': 'Shift1'}];
		//upload Additional Images
		$scope.imageFields = [{'id': 'img1'}];
	};
	$scope.queryCuisines = function(search) {
        var firstPass = $filter('filter')($scope.allCuisines, search);
        return firstPass.filter(function(cuisineItem) {
            return $scope.additionalInfo.cuisines.indexOf(cuisineItem) === -1;
        });
    };
    $scope.changeOnFeature = function(name, value) {
    	if(value) {
			$scope.additionalInfo.services.push(name);
		} else {
			var index = $scope.additionalInfo.services.indexOf(name);
			if (index > -1) {
			    $scope.additionalInfo.services.splice(index, 1);
			}
		}
    };
    $scope.calculateClosedOn = function() {
    	$scope.additionalInfo.closed_on = genericfactory.calculateClosedOnOrOfferDays($scope.mon, $scope.tue, $scope.wed, $scope.thurs, $scope.fri, $scope.sat, $scope.sun, $scope.additionalInfo.closed_on);
    };
    $scope.calculateShiftsTime = function() {
    	for(var key=0;key<$scope.shifts.length;key++) {
    		if($scope.shifts[key].shiftFrom) {
    			$scope.shifts[key].shiftFrom = parseInt(genericfactory.replaceSemiColonWithEmptyString($scope.shifts[key].shiftFrom));
    		} else {
    			$scope.shifts[key].shiftFrom = null;
    		}
    		if($scope.shifts[key].shiftTo) {
    			$scope.shifts[key].shiftTo = parseInt(genericfactory.replaceSemiColonWithEmptyString($scope.shifts[key].shiftTo));
    		} else {
    			$scope.shifts[key].shiftTo = null;
    		}
    		if(key == 0) {
    			$scope.additionalInfo.first_shift_st = $scope.shifts[key].shiftFrom;
		    	$scope.additionalInfo.first_shift_et = $scope.shifts[key].shiftTo;
    		} else if(key == 1) {
    			$scope.additionalInfo.second_shift_st = $scope.shifts[key].shiftFrom;
		    	$scope.additionalInfo.second_shift_et = $scope.shifts[key].shiftTo;
    		} else if(key == 2) {
    			$scope.additionalInfo.third_shift_st = $scope.shifts[key].shiftFrom;
		    	$scope.additionalInfo.third_shift_et = $scope.shifts[key].shiftTo;
    		}
    	}
    	//Changing openning and closing time to required json
    	$scope.additionalInfo.openning_time = parseInt(genericfactory.replaceSemiColonWithEmptyString($scope.additionalInfo.openning_time));
		$scope.additionalInfo.closing_time = parseInt(genericfactory.replaceSemiColonWithEmptyString($scope.additionalInfo.closing_time));
    };
    $scope.addCuisine = function(cuisine) {
        $scope.additionalInfo.cuisines.push(cuisine);
    };
	//Tags
	$scope.addItem = function () {
    	$scope.errortext = "";
    	if (!$scope.addTag) {return;}
    	if ($scope.additionalInfo.tags.indexOf($scope.addTag) == -1) {
        	$scope.additionalInfo.tags.push($scope.addTag);
        	$scope.addTag = null;
	    } else {
	        $scope.errortext = "This Tag is already in your list.";
	    }
	};
	$scope.removeItem = function (x) {
	    $scope.errortext = "";
	    $scope.additionalInfo.tags.splice(x, 1);
	};
	$scope.saveAdditionalInfoOfRestaurent = function() {
		$scope.calculateClosedOn();
		$scope.calculateShiftsTime();
		$scope.additionalInfo.restid = $rootScope.restaurantDetails.restid;
		$scope.additionalInfo.name = $rootScope.restaurantDetails.name;
		if($scope.additionalInfo.image_urls.length <= 0) {
			$scope.additionalInfo.image_urls = ["https://storage.cloud.google.com/starlly/web/photo_not_available.png?_ga=1.96420890.742823991.1487762716"];
		}
		//console.log($scope.additionalInfo);
		//$scope.$broadcast("uploadFile", {"values":$scope.additionalInfo, "eventOrLoadAPI":"loadUpdateInfoAPI"});
		configHttpReqService.httpRequest(Constants.URLS.RESTAURENT_UPDATEINFO, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, $scope.additionalInfo, Constants.HTTP_REQ.UPDATEINFO, null);
	};

	$rootScope.successOutputOfAdditionalInfo = function(resp, optionalData) {
		//console.log(resp);
		if(resp.status) {
			alert(resp.status);
		} else {
			alert("Information Updated!!");
		}
		$scope.$emit("toChangeCurrentPage", "OfferDashboard");
	};

	$scope.addNewShift = function() {
	    if($scope.shifts.length >= 3) {
	    	alert("Maximum Shifts are already added!!")
	    } else {
	    	var newItemNo = $scope.shifts.length+1;
	    	$scope.shifts.push({'id':'Shift'+newItemNo});
	    }
	};
	$scope.removeShift = function() {
	    var lastItem = $scope.shifts.length-1;
	    $scope.shifts.splice(lastItem);
	};

	$scope.$on("uploadedFilePath", function(e, data) {
		$scope.additionalInfo.image_urls = data.files;
	});
	//Load initAdditionalInfoPage fn when AdditionalInfo ctrl loaded
	$scope.initAdditionalInfoPage();
});