/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('restaurantsCtrl',function($scope, $rootScope, $filter, $timeout, $mdMedia, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){

	$scope.loadRestaurants = function(status) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.Restaurants.replace('{status}',status), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.restaurantsList = resp;
			    if( $scope.restaurantsList.length ) {
			    	$scope.currentRestaurant($scope.restaurantsList[0]);
			    }
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	function populateLiveRestos(status) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.Restaurants.replace('{status}',status), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.liveRestaurants = resp;
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}	

	function populatePendingApprovalRestos(status) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.Restaurants.replace('{status}',status), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.approvalPenddingRestaurants = resp;
			    if( $scope.approvalPenddingRestaurants.length ) {
			    	$scope.currentRestaurant($scope.approvalPenddingRestaurants[0]);
			    }
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	function populateRestoProfile(restSid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateRestoProfile.replace('{restSid}',restSid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.selectedResaurantInfo = resp;
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.currentRestaurant = function(restaurant) {
		populateRestoProfile(restaurant.restid);
	}

	$scope.approveRestaurant = function(restaurant, status, index) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.SetLiveRestaurant.replace('{restid}',restaurant.restid), Constants.Global.METHOD.PUT, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.approvalPenddingRestaurants.splice(index, 1);
			    if( $scope.liveRestaurants.length ) {
			    	$scope.liveRestaurants.push(restaurant);
			    }else{
			    	$scope.liveRestaurants = [];
			    	$scope.liveRestaurants.push(restaurant);
			    }
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	$scope.deleteRestaurant = function(restaurant, status, index) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.BlockRestaurant.replace('{restid}',restaurant.restid), Constants.Global.METHOD.PUT, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.approvalPenddingRestaurants.splice(index, 1);
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	//$scope.loadRestaurants('ALL');
	function init() {
		populateLiveRestos('live');
		populatePendingApprovalRestos('new');
	}
	init();
});