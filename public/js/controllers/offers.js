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

starllyApp.controller('offerCtrl',function($scope, $rootScope, $timeout, $mdMedia, $mdDialog, $filter, genericfactory, genericService, configHttpReqService, errorService, sessionStoreService){

	$scope.logout = function() {
		sessionStoreService.emptyOwnerSession();
		$scope.currentPage = "pages/main.html";
		$scope.topSlider = true;
		$rootScope.restaurantDetails = "";
		$scope.$emit("toChangeCurrentPage", "HomePage");
    };

    $scope.openMenu = function($mdOpenMenu, e) {
		$mdOpenMenu(e);
    };

    $scope.closeDialog = function() {
    	if($mdDialog) {
    		$mdDialog.hide();
    	}
	};
    $scope.loadContentPage = function(page) {
		
    	/*if($scope.contentToShowInOfferPage != 'Offers') {
			$scope.$emit("toChangeCurrentPage", "Offers");
		}*/
		
		if(page.toUpperCase() == 'OFFERS')
		{
			$scope.$emit("toChangeCurrentPage", "Offers");
		}
    	$scope.contentToShowInOfferPage = page;
    	sessionStoreService.setCurrentFeature(page.toUpperCase());
    	$scope.closeDialog();
    	switch(page.toUpperCase()){
			case 'DASHBOARD':
				$scope.$broadcast("DASHBOARD", 'daily');
				break;
			case 'REPORT':
				$scope.$broadcast("REPORT", 'daily');
				break;
				case 'INVOICE':
				$scope.$broadcast("INVOICE", 'daily');
				break;
			case 'RESTURANTPROFILE':
				$scope.$broadcast("RESTURANTPROFILE", '');
				break;
			default:
				break
		}
    };
    $scope.loadHomePageFromOfferPage = function(e) {
    	if(e) {
    		$scope.$emit("toChangeCurrentPage", "HomePage");
    	}
    };
    $rootScope.successOutputOfDeleteOffer = function(resp, optionalData) {
    	if(resp && resp.status) {
    		alert(resp.status);
    		$scope.loadContentPage('Offers');
    	}
    };
    $scope.editOffer = function(editItem) {
    	var editItemNewProp = {};
    	editItemNewProp.offerid = editItem.offerid;
    	editItemNewProp.name = editItem.name;
    	editItemNewProp.discount = parseInt((editItem.discount).replace('%','').replace(' ', ''));
    	editItemNewProp.offer_status = editItem.offer_status;
    	editItemNewProp.start_date = genericfactory.dateFormatorYYYYMMDD(new Date(editItem.startDate));
    	editItemNewProp.end_date = genericfactory.dateFormatorYYYYMMDD(new Date(editItem.endDate));
    	editItemNewProp.days = editItem.days;
    	editItemNewProp.start_time = genericfactory.replaceSemiColonWithEmptyString(editItem.startTime);
    	editItemNewProp.end_time = genericfactory.replaceSemiColonWithEmptyString(editItem.endTime);
    	configHttpReqService.httpRequest(Constants.URLS.UPDATEOFFER, Constants.Global.METHOD.PUT, Constants.Global.DefaultHTTPHeader, editItemNewProp, Constants.HTTP_REQ.EDITOFFER, null);
    };

    $rootScope.successOutputOfOfferUpdate = function(res, optionalData){
    	$scope.closeDialog();
    	$scope.loadContentPage('Offers');
    }

    $scope.saveOfferAfterEditInCreateOfferPage = function(index) {
    	console.log(index);
		$scope.createNewOffers[index].hiddenDiv = false;
		$scope.editOffer($scope.createNewOffers[index]);
    };


    $scope.showConfirm = function(e, item, value) {
		// Appending dialog to document.body to cover sidenav in docs app
		var confirm = $mdDialog.confirm()
		      .title('Are you sure to delete ?')
		      .textContent('All your data can be lost.')
		      .ariaLabel('Lucky day')
		      .targetEvent(e)
		      .ok('YES')
		      .cancel('NO');
		$mdDialog.show(confirm).then(function() {
			configHttpReqService.httpRequest(Constants.URLS.DELETEOFFER.replace('{offerid}',item.offerid), Constants.Global.METHOD.DELETE, Constants.Global.DefaultHTTPHeader, null, Constants.HTTP_REQ.DELETEPARTICULAROFFER, null);
		}, function() {

		});
	};
	$rootScope.successOutputOfGoLiveOffer = function(resp, optionalData) {
		$scope.loadContentPage('Offers');
	};
	$scope.makeOfferGoLive = function(e, i, item) {
		var confirm = $mdDialog.confirm()
		      .title('Are you sure to make this offer to go live ?')
		      .textContent('Changes may affect to dashboard and offer page')
		      .ariaLabel('Lucky day')
		      .targetEvent(e)
		      .ok('YES')
		      .cancel('NO');
		$mdDialog.show(confirm).then(function() {
			var header = angular.copy(Constants.Global.DefaultHTTPHeader);
			header.offerid = item.offerid;
			var optionalData = {"index":i,"item":item};
			configHttpReqService.httpRequest(Constants.URLS.GOLIVEOFFER, Constants.Global.METHOD.PUT, header, null, Constants.HTTP_REQ.GOLIVEPARTICULAROFFER, optionalData);
		}, function() {

		});
	};
	$scope.showCustom = function(e, item, value) {
		function checkHex(n){return/^[0-9A-Fa-f]{1,64}$/.test(n)}
		function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)}
		$scope.editItem = {
			"offerid": item.offerid,
			"name":item.name,
			"discount":item.discount,
			"offer_status" : item.offer_status,
			"startDate": new Date(item.start_date),
		    "endDate": new Date(item.end_date),
		    "days" : Hex2Bin(item.days),
		    "startTime": $scope.timeFrom[0].timingFrom,
		    "endTime": $scope.timeFrom[0].timingFrom,
		    "maxDate": new Date()
		}
		$mdDialog.show({
		    clickOutsideToClose: true,
          	targetEvent: e,
			scope: $scope,        
			preserveScope: true,           
		    template: '<div layout="column" class="popup-dialog" style="font-size:16px;">' +
		                '<div class="popup_head"><h3>Edit Offer</h3></div>' + 

		                '<div layout="row" style="padding:15px;padding-top:1.5em;">' + 
		                        '<md-input-container class="md-block" flex="65">' +
		                            '<label>Offer Name</label>' +
		                            '<input ng-model="editItem.name">' +
		                      '</md-input-container>' +
		                       '<md-input-container class="md-block" flex="35">' +
		                            '<label>Percent</label>' +
		                             '<input ng-model="editItem.discount">' +
		                      '</md-input-container>' +
		                 '</div>' +
		            	'<div layout="column" style="margin:-30px 15px 30px 15px;padding-top:0.5em;">' +
		                  '<div flex-gt-xs style="margin-bottom:10px;">'+
		                    '<div flex-gt-xs>'+
		                      '<label>End Date </label>' +
		                      '<md-datepicker md-min-date="editItem.maxDate" ng-model="editItem.endDate" md-placeholder="Enter date" style="margin-left:19px!important;"></md-datepicker > '   +
		                    '</div>' +
		           		'</div>'+
				        '<div layout="row" style="padding-top:2em;margin:0 auto;">'+
				        '<span flex></span>'+
				          ' <md-button class="md-raised md-warn btn-action" ng-click="closeDialog()">Cancel</md-button>'+
				           '<md-button class="md-raised md-warn btn-action" ng-click="editOffer(editItem);">Ok</md-button>'+
				        '</div>'+
						'</div>'
					});
	};

	$scope.commonFnToModifyJSON = function(value) {
		var position = 1, leftDaysCount = 7 - value.days.length, getLeftDays = '';;
		value.start_time = value.start_time.toString();
		if(value.start_time.length == 4) {
			position = 2;
		}
		var start_time = [value.start_time.slice(0, position), ":", value.start_time.slice(position)].join('');
		value.end_time = value.end_time.toString();
		if(value.end_time.length == 4) {
			position = 2;
		}
		var end_time = [value.end_time.slice(0, position), ":", value.end_time.slice(position)].join('');
		value.time = start_time+' to '+end_time;
		var start_date = new Date(value.start_date);
		var end_date = new Date(value.end_date);
		value.date = start_date.getDate() + ' ' + $scope.monthNames[start_date.getMonth()] + ' ' + start_date.getFullYear()+' to '+end_date.getDate() + ' ' + $scope.monthNames[end_date.getMonth()] + ' ' + end_date.getFullYear();
		value.discount = value.discount+" %";
		for( var i = 0; i < leftDaysCount; i++ ) {
			getLeftDays += '0';
		}
		value.days = getLeftDays + value.days;
		return value;
	};
	
	$rootScope.successOutputOfGetActiveOffers = function(resp, optionalData) {
		//console.log(resp.offers);
		/*{
			face : imagePath,
			name: 'Offers Name',
			discount: '50% OFF',
			date: '7Sep 2016 to 8Sep 2016',
			time: '11:30am to 5:30pm'
		}*/
		if(optionalData == Constants.HTTP_REQ.GETLIVEOEFFER) {
			if(resp.offers) {
				$scope.activeOffers = true;
				$scope.active = resp.offers;
				if( $scope.active.length <= 0 ){
					$scope.active.push({
			            "offerid": "",
			            "name": "Starlly",
			            "discount": $rootScope.restaurantDetails.starllyDefaultOffer,
			            "offer_status": "STARLLY_LIVE",
			            "start_date": "",
			            "end_date": "",
			            "days": "1111111",
			            "start_time": 0,
			            "end_time": 2359
			        });
				}
				angular.forEach($scope.active, function(value, key) {
					value = $scope.commonFnToModifyJSON(value);
					value.applicableDays = value.days.split('');
					value.weekdays = angular.copy(Constants.Global.DAYS_BY_WEEKLY);
				});

				//Active Offers filter, Show only current date
				$scope.active = $filter('filter')($scope.active, 
					function(offer) { 
						var timeFormats = offer.start_time.length <= 3 ? '0'+offer.start_time : offer.start_time;
						var getTimings = timeFormats.match(/.{1,2}/g);
						if( getTimings.length < 2 ) {
							getTimings.push('00');
						}
						return new Date(new Date(new Date(offer.start_date).setHours(getTimings[0])).setMinutes(getTimings[1])).getTime() <= new Date().getTime() && parseInt(offer.days.split('')[new Date().getDay()-1]); 
					})

				//Upcoming Offers
				$scope.upcomingOffers = $filter('filter')(resp.offers, 
					function(offer) { 
						var timeFormats = offer.start_time.length <= 3 ? '0'+offer.start_time : offer.start_time;
						var getTimings = timeFormats.match(/.{1,2}/g);
						if( getTimings.length < 2 ) {
							getTimings.push('00');
						}
						return new Date(new Date(new Date(offer.start_date).setHours(getTimings[0])).setMinutes(getTimings[1])).getTime() >= new Date().getTime() || !parseInt(offer.days.split('')[new Date().getDay()-1]); 
					})
			} else {
				$scope.activeOffers = false;
				$scope.upcomingOffers = [];
			}
		} else if(optionalData == Constants.HTTP_REQ.GETDRAFTOEFFER) {
			if(resp.offers && resp.offers.length > 0) {
				$scope.draftOffers = true;
				$scope.draft = resp.offers;
				angular.forEach($scope.draft, function(value, key) {
					value = $scope.commonFnToModifyJSON(value);
					value.applicableDays = value.days.split('');
					value.weekdays = angular.copy(Constants.Global.DAYS_BY_WEEKLY);
				});
			} else {
				$scope.draftOffers = false;
			}
		} else if(optionalData == Constants.HTTP_REQ.GETEXPIREDOEFFER) {
			if(resp.offers && resp.offers.length > 0) {
				$scope.expiredOffers = true;
				$scope.expired = resp.offers;
				angular.forEach($scope.expired, function(value, key) {
					value = $scope.commonFnToModifyJSON(value);
					value.applicableDays = value.days.split('');
					value.weekdays = angular.copy(Constants.Global.DAYS_BY_WEEKLY);
				});
			} else {
				$scope.expiredOffers = false;
			}
		} else if(optionalData == Constants.HTTP_REQ.GETCANCELEDOEFFER) {
			if(resp.offers && resp.offers.length > 0) {
				$scope.cenceledOffers = true;
				$scope.canceled = resp.offers;
				angular.forEach($scope.canceled, function(value, key) {
					value = $scope.commonFnToModifyJSON(value);
					value.applicableDays = value.days.split('');
					value.weekdays = angular.copy(Constants.Global.DAYS_BY_WEEKLY);
				});
			} else {
				$scope.cenceledOffers = false;
			}
		}
	};

    $scope.addNewOffer = function() {
        $scope.createNewOffers.push($scope.getEmptyOfferFields());
    };
    $scope.removeOffer = function(index) {
		$scope.createNewOffers.splice(index);
    };
    $rootScope.successOutputOfCreateOffer = function(resp, optionalData) {
    	if(resp && resp.status) {
    		alert(resp.status);
    	}
    };

    $scope.validateEndDateWithStart = function(offer) {
    	if( new Date(offer.endDate).getTime() <= new Date(offer.startDate).getTime() ) {
    		offer.endDate = '';
    	}
    	$scope.endMinDate = offer.startDate;
    };

    function isMinOneDaySelected(offer) {
    	if( !offer.mon && !offer.tue && !offer.wed && !offer.thurs && !offer.fri && !offer.sat && !offer.sun ) {
    		return false;
    	}
    	return true;
    }
	$scope.saveCreatedOffer = function(index, createofferform) {
		if( createofferform.$valid ){
			angular.forEach($scope.createNewOffers, function(value, key) {
				if(key == index && isMinOneDaySelected(value)) {
					if( parseInt(genericfactory.replaceSemiColonWithEmptyString(value.endTime)) > parseInt(genericfactory.replaceSemiColonWithEmptyString(value.startTime)) ) {
						var startDate = new Date(value.startDate);
						var endDate = new Date(value.endDate);
						value.hiddenDiv = false;
						value.edit = true;
						value.days = genericfactory.calculateClosedOnOrOfferDays(value.mon, value.tue, value.wed, value.thurs, value.fri, value.sat, value.sun, value.days);
						value.start_date = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" +startDate.getDate();
						value.end_date = endDate.getFullYear()+ "-" + (endDate.getMonth() + 1) + "-" +endDate.getDate();
						value.start_time = genericfactory.replaceSemiColonWithEmptyString(value.startTime);
						value.end_time = genericfactory.replaceSemiColonWithEmptyString(value.endTime);
						var values = angular.copy(value);
						delete values.mon;
						delete values.tue;
						delete values.wed;
						delete values.thurs;
						delete values.fri;
						delete values.sat;
						delete values.sun;
						delete values.startTime;
						delete values.endTime;
						delete values.startDate;
						delete values.endDate;
						delete values.hiddenDiv;
						delete values.edit;
						configHttpReqService.httpRequest(Constants.URLS.CREATEOFFER, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, values, Constants.HTTP_REQ.CREATENEWOFFER, null);
					} else {
						alert(value.name + ': End Time should be greater that start time!')
					}
				}else{
					alert(value.name + ': Please fill all the mandatory fields with valid data!')
				}
			});
		}else{
			alert("Please fill all the mandatory fields with valid data!");
		}
	};
	$scope.editOfferInCreateOfferPage = function(index) {
		//console.log(index);
		$scope.createNewOffers[index].hiddenDiv = true;
	};
	$scope.getEmptyOfferFields = function() {
		var emptyCreateOfferObj = {
			"restid" : $rootScope.restaurantDetails.restid,
			"name" : "",
			"discount" : "",
			"offer_status" : "",
			"startDate": new Date(),
		    "endDate": "",
		    "days": "",
		    "startTime": "07:00",
		    "endTime": "22:00",
			"mon" : true,
			"tue" : true,
			"wed" : true,
			"thurs" : true,
			"fri" : true,
			"sat" : true,
			"sun" : true,
			"hiddenDiv" : true,
			"edit": false
		};
		emptyCreateOfferObj.offer_status = Constants.Global.OFFER_TYPE.DRAFT;
		return emptyCreateOfferObj;
	};

	function getStarllyDefaultOffer() {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.DefaultStarllyOffer, Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.defaultStarllyOffer = resp;
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.initVarForCreatingNewOffers = function() {
		$scope.createNewOffers = [];
		$scope.createNewOffers.push($scope.getEmptyOfferFields());
		getStarllyDefaultOffer();
	};

    $scope.initOfferCtrl = function() {
    	//Storing restaurant details in local var
    	$scope.userDetailsForOfferPage = $rootScope.restaurantDetails;
		$scope.contentToShowInOfferPage = 'Dashboard';
		$scope.$broadcast("DASHBOARD", 'weekly');
		$scope.transaction = [
			{
				name: 'New Customer Transaction',
				percent: '20,000'
			},
			{
				name: 'Returning Customer Transaction',
				percent: '10,000'
			},
			{
				name: 'Redemption Points',
				percent: '5,000'
			},
			{
				name: 'Total Transaction',
				percent: '50,000'
			}
		];
		var imagePath = 'https://storage.googleapis.com/starlly/web/IMG_5713.jpg';
		$scope.upcoming = [];
		$scope.draft = [];
		$scope.active = [];
		$scope.expired = [];
		$scope.canceled = [];
		$scope.activeOffers = false;
		$scope.draftOffers = false;
		$scope.expiredOffers = false;
		$scope.cencelledOffers = false;
		$scope.bouncebackOffers = false;
		$scope.bounceBack = [];
		$scope.myDate = new Date();
		$scope.timeFrom = (Constants.Global.FROM_AND_TO_TIME).split(' ').map(function(tFrom){
		    return{timingFrom: tFrom};
		});
		$scope.timeTo = (Constants.Global.FROM_AND_TO_TIME).split(' ').map(function(tTo){
		    return{timingTo: tTo};
		});
		$scope.monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
		$scope.minDate = new Date(
          	$scope.myDate.getFullYear(),
          	$scope.myDate.getMonth(),
          	$scope.myDate.getDate());
		$scope.maxDate = new Date(
			$scope.myDate.getFullYear(),
          	$scope.myDate.getMonth() + 11,
          	$scope.myDate.getDate());
		$scope.endMinDate = new Date(
          	$scope.myDate.getFullYear(),
          	$scope.myDate.getMonth(),
          	$scope.myDate.getDate());
		//For Creating New Offer
		$scope.initVarForCreatingNewOffers();
	};
	$scope.initOfferCtrl();

	/************* Bounce Back Offers ****************/

	var bouncebackOffersObj = {
		    "restid": $rootScope.restaurantDetails.restid,
		    "bounceback_discount": "",
		    "start_date": new Date(),
		    "end_date": new Date(),
		    "bounceback_in_days": ""
		}

	function dbDateFormate(date) {
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +date.getDate();
	}

	function populateBounceBackOffers(restid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.LiveBounceBack.replace('{restid}',restid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.bounceBackOffers = resp;
				if( $scope.bounceBackOffers.length > 0 ){
					angular.forEach($scope.bounceBackOffers, function(offer) {
						offer.active = offer.active ? true : false;
					})
				}
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	function initBounceBackOffers() {
		$scope.bouncebackMinDate = new Date();
		$scope.bouncebackMaxDate = new Date(
			$scope.myDate.getFullYear(),
          	$scope.myDate.getMonth() + 11,
          	$scope.myDate.getDate());
		populateBounceBackOffers($rootScope.restaurantDetails.restid);
	}

	$scope.createBounceBackOffers = function(bouncebackform) {
		if( bouncebackform.$valid ){
			//update Date format
			var postData = angular.copy($scope.bounceBackOffers);
			postData.start_date = dbDateFormate(new Date(postData.start_date));
			postData.end_date = dbDateFormate(new Date(postData.end_date));
			configHttpReqService.httpRequestWithPromise(Constants.URLS.CreateBounceBack, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, postData, null, null, null)
			.then(
				function(resp) { 
					$scope.loadContentPage('Offers');
					initBounceBackOffers();
				}, function(resp) { 
					console.log('Error');
				}
			);
		}else {
			alert("Please fill all the mandatory fields with valid data!");
		}
	}

	$scope.saveBounceBackOffers = function() {
		//update Date format
		var postData = angular.copy($scope.bounceBackOffers);
		postData.start_date = dbDateFormate(new Date(postData.start_date));
		postData.end_date = dbDateFormate(new Date(postData.end_date));
		configHttpReqService.httpRequestWithPromise(Constants.URLS.CreateBounceBack, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, postData, null, null, null)
		.then(
			function(resp) { 
				$scope.loadContentPage('Offers');
				initBounceBackOffers();
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.deleteBounceBackOffers = function(restid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.DeleteBounceBack.replace('{restid}',restid), Constants.Global.METHOD.DELETE, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.loadContentPage('Offers');
				initBounceBackOffers();
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.initCreateBounceback = function() {
		$scope.bounceBackOffers = angular.copy(bouncebackOffersObj);
	}
	$scope.editBounceBack = function(offers) {
		$scope.loadContentPage('CreateBounceBackOffers');
		$scope.bounceBackOffers = angular.copy(offers);
		$scope.bounceBackOffers.restid = $rootScope.restaurantDetails.restid;
		$scope.bounceBackOffers.start_date = new Date($scope.bounceBackOffers.start_date);
		$scope.bounceBackOffers.end_date = new Date($scope.bounceBackOffers.end_date);
	}
	initBounceBackOffers();
});