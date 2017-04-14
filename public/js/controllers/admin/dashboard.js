/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('dashboardCtrl',function($scope, $rootScope, $filter, $timeout, $mdMedia, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){

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
	function drawChart() {
		var chartData = getMyTrendsData();
		var data = [];
		data[0] = [$scope.dashboardInfo.interval, 'Transaction'];
		if(chartData.length > 0){
			for(var i = 0; i < chartData.length; i++){
				data[i + 1] = [chartData[i].period,chartData[i].booking];
			}
		}else{
			data[1] = ['',0];
		}
		var options = {
		  title: 'Transaction Summary',
		  legend: { position: 'bottom' },
		  vAxis: {
			  format: '#,###',
			  minValue: 0,
			  maxValue: 4,
			  logscale: true
		  },
		  hAxis: {format: '#', logscale: true, minValue: 1, maxValue: data[data.length-1][0], slantedTextAngle: 90, showTextEvery: $scope.dashboardInfo.interval=='daily' ? 3 : $scope.dashboardInfo.interval=='monthly' ? 0 : 1}
		};
		var chart = new google.visualization.LineChart(document.getElementById('transaction_chart'));
		chart.draw(google.visualization.arrayToDataTable(data), options);
  	}
	var drawTransactionChart = function() {
	    google.charts.load('current', {'packages':['corechart']});
	    google.charts.setOnLoadCallback(drawChart);
	}

	function drawChartForRating() {
		var ratingChartData = $scope.dashboardInfo.ratingSummary.starRating;
		var data = [];
		data[0] = ['', 'Review'];
		data[1] = ['5 star', ratingChartData.fiveStar];
		data[2] = ['4 star', ratingChartData.fourStar];
		data[3] = ['3 star', ratingChartData.threeStar];
		data[4] = ['2 star', ratingChartData.twoStar];
		data[5] = ['1 star', ratingChartData.oneStar];
		
		var datasource = google.visualization.arrayToDataTable(data);
      	var options = {
	        title: 'Restaurant Review',
	        width: 300,
	        height: 160,
	        legend: {position: 'none'}
      	};
      	var chart = new google.visualization.BarChart(document.getElementById('rating_chart_div'));
      	chart.draw(datasource, options);
    }

	var drawRatingChart = function() {
	    google.charts.load('current', {'packages':['bar']});
	    google.charts.setOnLoadCallback(drawChartForRating);
	}

	var getTransactionSummary = function(restSid, interval) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.TransactionSummary.replace('{restSid}',restSid).replace('{interval}',interval), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.dashboardInfo.transactionSummary = resp;
				drawTransactionChart();
			}, function(resp) { 
				console.log('Error');
			}
		);
	};

	var getRatingSummary = function(restSid, interval) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.RatingSummary.replace('{restSid}',restSid).replace('{interval}',interval), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.dashboardInfo.ratingSummary = resp;
				drawRatingChart();
			}, function(resp) { 
				console.log('Error');
			}
		);
	};

	var getOfferStatus = function(restSid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.OfferSummary.replace('{restSid}',restSid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.dashboardInfo.offerStatus = resp;
				if(resp.currentOfferInfo.start_date !== 'NA'){
					var offer_start_date = new Date(resp.currentOfferInfo.start_date);
					var offer_end_date = new Date(resp.currentOfferInfo.end_date);
					var offer_start_time = $scope.dashboardInfo.offerStatus.currentOfferInfo.start_time;
					var offer_end_time = $scope.dashboardInfo.offerStatus.currentOfferInfo.end_time;
					$scope.dashboardInfo.offerStatus.currentOfferInfo.start_date = offer_start_date.getFullYear() + "-" + (offer_start_date.getMonth() + 1) + "-" + offer_start_date.getDate();
					$scope.dashboardInfo.offerStatus.currentOfferInfo.end_date = offer_end_date.getFullYear() + "-" + (offer_end_date.getMonth() + 1) + "-" + offer_end_date.getDate();
					$scope.dashboardInfo.offerStatus.currentOfferInfo.start_time = offer_start_date === 'NA' ? 'NA' : fromatTime(offer_start_time);
					$scope.dashboardInfo.offerStatus.currentOfferInfo.end_time = offer_end_date === 'NA' ? 'NA' : fromatTime(offer_end_time);
				}
				if(resp.bounceBackOffer.start_date !== 'NA'){
					$scope.isBBSet = true;
					var offer_start_date = new Date(resp.currentOfferInfo.start_date);
					var offer_end_date = new Date(resp.currentOfferInfo.end_date);
					var bb_offer_start_date = new Date(resp.bounceBackOffer.start_date);
					var bb_offer_end_date = new Date(resp.bounceBackOffer.end_date);
					$scope.dashboardInfo.offerStatus.bounceBackOffer.start_date = bb_offer_start_date.getFullYear() + "-" + (bb_offer_start_date.getMonth() + 1) + "-" + bb_offer_start_date.getDate();
					$scope.dashboardInfo.offerStatus.bounceBackOffer.end_date = bb_offer_end_date.getFullYear() + "-" + (bb_offer_end_date.getMonth() + 1) + "-" + bb_offer_end_date.getDate();
				}else{
					$scope.isBBSet = false;
				}
				
			}, function(resp) { 
				console.log('Error');
			}
		);
	};


	var getBounceBackOffers = function(restSid, interval) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.BounceBackSummary.replace('{restSid}',restSid).replace('{interval}',interval), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.dashboardInfo.bounceBackOffers = resp;



			}, function(resp) { 
				console.log('Error');
			}
		);
	};

	var fromatTime = function(time) {
		var str = "" + time;
		var len = str.length;
		return str.substring(0, len-2) + ":" + str.substring(len-2);
	}

	$scope.initDashboard = function(interval) {
		var restSid = $rootScope.restaurantDetails.restid;
		$scope.dashboardInfo = {};
		$scope.dashboardInfo.interval = interval
		getTransactionSummary(restSid, interval);
		getRatingSummary(restSid, interval);
		getOfferStatus(restSid, interval);
		getBounceBackOffers(restSid, interval);
	};

	$scope.$on("DASHBOARD", function(e, data) {
		$scope.initDashboard(data);
	});
	$scope.initDashboard('daily');
	
});