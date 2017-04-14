/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('usersCtrl',function($scope, $rootScope, $filter, $timeout, $mdMedia, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){

	function isTrendDataExists(period) {
		return $filter('filter')($scope.dashboardInfo.transactionSummary.trend, {'period' : period})[0];
	}

	function getMyTrendsData() {
		var trendData = []; var trendOrginalObj = {"period":"","booking": null};
		switch($scope.dashboardInfo.interval) {
			case 'daily':
				for( var i = 0; i < 24; i++ ) {
					var trendObj = angular.copy(trendOrginalObj);
					trendObj.period = i.toString().length <= 1 ? '0'+i+':00' : i+':00';
					var isDataAvail = isTrendDataExists(i);
					if(isDataAvail) {
						trendObj.booking = isDataAvail.booking;
					}else {
						trendObj.booking = new Date().getHours() >= i ? 0 : null;
					}
					trendData.push(trendObj) 
				}
			break;
			case 'weekly':
				for( var i = 0; i < Constants.Global.DAYS_BY_WEEKLY.length; i++ ) {
					var trendObj = angular.copy(trendOrginalObj);
					trendObj.period = Constants.Global.DAYS_BY_WEEKLY[i].substring(0,3);
					var isDataAvail = isTrendDataExists(Constants.Global.DAYS_BY_WEEKLY[i]);
					if(isDataAvail) {
						trendObj.booking = isDataAvail.booking;
					} else {
						trendObj.booking = new Date().getDay() === 0 ? 0 : new Date().getDay() > i ? 0 : null;
					}
					trendData.push(trendObj)
				}
			break;
			case 'monthly':
				var date = new Date(), y = date.getFullYear(), m = date.getMonth();
				var monthLastDay = new Date(y, m + 1, 0).getDate();
				for( var i = 1; i <= monthLastDay; i++ ) {
					var trendObj = angular.copy(trendOrginalObj);
					trendObj.period = i;
					var isDataAvail = isTrendDataExists(i);
					if(isDataAvail) {
						trendObj.booking = isDataAvail.booking;
					} else {
						trendObj.booking = new Date().getDate() >= i ? 0 : null;
					}
					trendData.push(trendObj)
				}
			break;
			case 'yearly':
				for( var i = 0; i < Constants.Global.MONTHS_BY_YEARLY.length; i++ ) {
					var trendObj = angular.copy(trendOrginalObj);
					trendObj.period = Constants.Global.MONTHS_BY_YEARLY[i].substring(0,3);
					var isDataAvail = isTrendDataExists(Constants.Global.MONTHS_BY_YEARLY[i]);
					if(isDataAvail) {
						trendObj.booking = isDataAvail.booking;
					} else {
						trendObj.booking = new Date().getMonth() >= i ? 0 : null;
					}
					trendData.push(trendObj)
				}
			break;
		}
		return trendData;
	}

	function getUsersList() {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.StarllyUsers, Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			    $scope.usersList = resp;
			    if( $scope.currentUser.length ) {
			    	$scope.currentUser($scope.usersList[0]);
			    }
			}, function(resp) { 
				console.log('Error in populating the users!');
			}
		);
	}

	$scope.currentUser = function(user) {
		$scope.selectedUser = user;
	}
	function loadUsersSummary(interval) {
		var restSid = $rootScope.restaurantDetails.restid;
		$scope.dashboardInfo = {};
		$scope.dashboardInfo.interval = interval
		getUsersList();
	};

	loadUsersSummary('daily');
	
});