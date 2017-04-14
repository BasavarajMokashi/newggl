/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllySearchEngine.controller('searchRestoCtrl',function($scope, $rootScope, $filter, $timeout, configHttpReqService, $location, $window){

	$scope.searchResto = '';

	function updateRestoIsOpened() {

	}

//Included the method to show location map on the main and details page
	$scope.getLocationMapFromGmap = function(restaurent) {
		
		//Creating a functiona inside so that the map could be resized later
		function initGMap (restaurent)
		{
	       	 var mapcanvas = document.getElementById("myDiv");
			  var mapTitle = document.getElementById("spnTitle");
			  var mapAddress = document.getElementById("spnAdd");
			  var lat = restaurent.lat; var lng=restaurent.lng; var restName = restaurent.name;

			  mapTitle.innerHTML = restName ; 
			  mapAddress.innerHTML = restaurent.locality + ", "+restaurent.city ; 

			  
			  var coords = new google.maps.LatLng(lat, lng);
			  var options = {
			    zoom: 16,
			    center: coords,
			    mapTypeControl: false,
			    navigationControlOptions: {
			        style: google.maps.NavigationControlStyle.SMALL
			    },
			    mapTypeId: google.maps.MapTypeId.ROADMAP
			  };
			  var map = new google.maps.Map(document.getElementById("myDiv"), options);
			  var marker = new google.maps.Marker({
			      position: coords,
			      map: map,
			      title:restaurent.name + ", " + restaurent.locality + ", " + restaurent.city
			  });
			   var currentCenter = map.getCenter();  // Get current center before resizing
  				google.maps.event.trigger(map, "resize");
  				map.setCenter(currentCenter); 
		}

	//resize the map as the map would show grey otherwise due to the issue with Bootstrap modal dialog
	  $('#locationMap').on('shown.bs.modal', function () {
        initGMap(restaurent);
    	});

	  $('#btnDirections').click(function(){
    		var url = "https://www.google.co.in/maps/dir//" + restaurent.lat + "," + restaurent.lng;
    		window.open(url,'_blank');
		});

	};



	function getTimeFormat(timeString) {
		var getHours = timeString.substring(0,2);
		if( getHours.length < 1 ) {
			getHours = '0'+getHours;
		}
		var getMinutes = timeString.substring(2,4);
		if( getMinutes.length === 0 ) {
			getMinutes = '00';
		}else if( getMinutes.length < 1 ) {
			getMinutes = '0'+getMinutes;
		}
		return getHours + ':' + getMinutes;
	}
	function formatRestoInformations(restaurants) {
		if( restaurants.length ) {
			restaurants.forEach(function(resto) {
				if( resto.cuisines ) {
					if( resto.cuisines.split('::').length) {
						resto.cuisines = resto.cuisines.split('::');
					}else{
						resto.cuisines = [];
						resto.cuisines.push(resto.cuisines);
					}
				}
				if( resto.services ) {
					resto.services = resto.services.split('::');
					var listOfServices = [];
					resto.services.forEach(function(s) {
						var serviceInfo = $filter('filter')(Constants.Global.RestoFeatures, {'name': s})[0];
						listOfServices.push({
							name: s,
							image_url: serviceInfo.image_url
						});
					});
					resto.services = listOfServices;
					resto.minServices = listOfServices.slice(0,5);
				}
				resto.isOpened = false;
				if( resto.openning_time ) {
					resto.openning_time = resto.openning_time.length < 3 ? '00'+resto.openning_time : resto.openning_time.length < 4 ? '0'+resto.openning_time : resto.openning_time;
					resto.openTime = getTimeFormat(resto.openning_time);
				}
				if( resto.closing_time ) {
					resto.closing_time = resto.closing_time.length < 3 ? '00'+resto.closing_time : resto.closing_time.length < 4 ? '0'+resto.closing_time : resto.closing_time;
					resto.closeTime = getTimeFormat(resto.closing_time);
				}
				if( !resto.overall_rating ) {
					resto.overall_rating = 0;
				}

				if( resto.first_sift_start ) {
					resto.first_sift_start = resto.first_sift_start.length < 3 ? '00'+resto.first_sift_start : resto.first_sift_start.length < 4 ? '0'+resto.first_sift_start : resto.first_sift_start;
					resto.first_sift_start = getTimeFormat(resto.first_sift_start);
				}
				if( resto.first_sift_end ) {
					resto.first_sift_end = resto.first_sift_end.length < 3 ? '00'+resto.first_sift_end : resto.first_sift_end.length < 4 ? '0'+resto.first_sift_end : resto.first_sift_end;
					resto.first_sift_end = getTimeFormat(resto.first_sift_end);
				}
				if( resto.secound_sift_start ) {
					resto.secound_sift_start = resto.secound_sift_start.length < 3 ? '00'+resto.secound_sift_start : resto.secound_sift_start.length < 4 ? '0'+resto.secound_sift_start : resto.secound_sift_start;
					resto.secound_sift_start = getTimeFormat(resto.secound_sift_start);
				}
				if( resto.secound_sift_end ) {
					resto.secound_sift_end = resto.secound_sift_end.length < 3 ? '00'+resto.secound_sift_end : resto.secound_sift_end.length < 4 ? '0'+resto.secound_sift_end : resto.secound_sift_end;
					resto.secound_sift_end = getTimeFormat(resto.secound_sift_end);
				}
				if( resto.third_sift_start ) {
					resto.third_sift_start = resto.third_sift_start.length < 3 ? '00'+resto.third_sift_start : resto.third_sift_start.length < 4 ? '0'+resto.third_sift_start : resto.third_sift_start;
					resto.third_sift_start = getTimeFormat(resto.third_sift_start);
				}
				if( resto.third_sift_end ) {
					resto.third_sift_end = resto.third_sift_end.length < 3 ? '00'+resto.third_sift_end : resto.third_sift_end.length < 4 ? '0'+resto.third_sift_end : resto.third_sift_end;
					resto.third_sift_end = getTimeFormat(resto.third_sift_end);
				}
				if( resto.openning_time && resto.closing_time) {
					if( parseInt(new Date().getHours() +''+ new Date().getMinutes()) >= parseInt(resto.openning_time) && parseInt(resto.closing_time) >=  parseInt(new Date().getHours() +''+ new Date().getMinutes()) ){
						resto.isOpened = true;
					}
				}
				//Update nonveg key 
				if( resto.veg_type === 'BOTH' ) {
					resto.isNonVeg = 'NonVeg, Non-veg, nonveg';
				}
			});
		}
		$scope.restaurants = restaurants;
	}
	$scope.loadRestaurants = function() {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.SearchRestaurants, Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    formatRestoInformations(resp);
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	$scope.searchRestoByAction = function () {
		var container = angular.element('body'), scrollTo = angular.element('#restoResults');
		container.animate({
		    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
		});
	}

	function additionalImages(restid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.ImagesByRestoId.replace('{restid}', restid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.detailedRestoInfo.additionalImages = resp;
			}, function(resp) { 
				console.log('Error in populating the images!');
			}
		);
	}

	function reviewsByResto(restid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.ReviewsByRestoId.replace('{restid}', restid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.detailedRestoInfo.listOfReviews = resp;
			}, function(resp) { 
				console.log('Error in populating the reviews!');
			}
		);
	}

	$scope.loadDetailedRestoWin = function(restoInfo) {
		$scope.detailedRestoInfo = restoInfo;
		additionalImages(restoInfo.rid);
		reviewsByResto(restoInfo.rid);

		//Following code added to open follow us links on resto details page
		 $('#imgFb').click(function(){
    		var url = "https://www.facebook.com/itsstarlly/";
    		window.open(url,'_blank');
		});
	    $('#imgG').click(function(){
    		var url = "";
    		window.open(url,'_blank');
		});
		 $('#imgTwit').click(function(){
    		var url = "";
    		window.open(url,'_blank');
		});
	}

	$scope.clearAuthDetails = function(userDetails) {
		$rootScope.userDetails = null;
	}

	// $scope.route = function(pageUrl) {
	// 	alert(pageUrl);
	// 	//$location.path(pageUrl);
	// 	$window.location.href = pageUrl;
	// }

	$scope.loadRestaurants('ALL');
	
});