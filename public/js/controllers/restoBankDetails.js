/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('bankInfoCtrl',function($scope, $rootScope, $filter, $timeout, configHttpReqService){

	function initBankFormDetails() {
		$scope.bankDetails = {
		    "restid": $rootScope.restaurantDetails.restid,
		    "account_holder_name": '',
		    "account_number": '',
		    "confirm_account_number": '',
		    "ifsc_code":'',
		    "cancelled_check_url": '',
		    "address_proof_url": '',
		   	"pan_number" : '',
		    "pan_url": ''
		}
	}

	$scope.setPreviewImageURL = function(imageURL) {
		$scope.previewImageURL = imageURL;
	}
	$scope.saveBankDetails = function(e, bankForm) {
		if( bankForm.$valid ) {
			configHttpReqService.httpRequestWithPromise(Constants.URLS.RestoBankDetails, Constants.Global.METHOD.POST, Constants.Global.DefaultHTTPHeader, $scope.bankDetails, null, null, null)
			.then(
				function(resp) { 
					alert('Banks Info has been saved successfully');
				    $rootScope.additionForm = {
		 				isBank: false,
		 				isAdditional: true
		 			}
				}, function(resp) { 
					console.log('Error in populating the users!');
				}
			);
		}else{
			alert('Please fill all mandatory fields/check formats!');
		}
	}

	$scope.$on("uploadedFilePath", function(e, data) {
		if( data.uploadType === 'CANCELLED_CHEQUE' ) {
			$scope.bankDetails.cancelled_check_url = data.files[0];
		}else if( data.uploadType === 'PAN_CARD' ) {
			$scope.bankDetails.pan_url = data.files[0];
		}else if( data.uploadType === 'ADDRESS_PROOF' ) {
			$scope.bankDetails.address_proof_url = data.files[0];
		}
	});

	initBankFormDetails();
	
});