/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('txnInvoiceCntrl',function($scope, $rootScope, $timeout, $mdMedia, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){

	$scope.limitOptions = [10, 25, 50, 100, 250];        
    $scope.query = {
    order: 'name',
    limit: 10,
    page: 1
  };
  var totalTransaction = {
    'invoiceAmount': 0,
    'redemptionAmt': 0,
    'rewardAmt': 0,
    'bounceBackAmt': 0,
    'starllyCommision': 0,
    'totalAmt': 0,
    'netAmt': 0
  }
  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [10, 15, 20];
  };
  $scope.loadStuff = function () {
    getTransactionReport($rootScope.restaurantDetails.restid, $scope.txnReport.interval);
  }
  
  $scope.logItem = function (item) {
    console.log(item.name, 'was selected');
  };
  
  $scope.logOrder = function (order) {
    console.log('order: ', order);
  };
  
  
  $scope.logPagination = function (page, limit) {
	 
    console.log('page: ', page);
    console.log('limit: ', limit);
    getTransactionTotalValue();
  };
	
	
	$scope.getInvoicePeriod = function(){
		var restSid = $rootScope.restaurantDetails.restid;
		configHttpReqService.httpRequestWithPromise(Constants.URLS.InvoicePeriod.replace('{restSid}',restSid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			console.log(resp);
				$scope.invoicePeriod = resp;
				}, function(resp) { 
				console.log('Error');
			}
		);
	};
	$scope.initInvoiceReport = function(data){
		var restSid = $rootScope.restaurantDetails.restid;
		configHttpReqService.httpRequestWithPromise(Constants.URLS.InvoiceDetails.replace('{restSid}',restSid).replace('{invoiceId}',data), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			console.log(resp);
				$scope.invceReport = resp;
				}, function(resp) { 
				console.log('Error');
			}
		);
	};
	

	
	$scope.$on("INVOICE", function(e, data) {
		$scope.getInvoicePeriod();
		
	});

});