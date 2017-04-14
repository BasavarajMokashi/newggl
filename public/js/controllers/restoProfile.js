/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('restoProfile',function($scope, $rootScope, configHttpReqService){

	$scope.features = Constants.Global.RestoFeatures;
	$scope.allCuisines = Constants.Global.allCuisines;

	$scope.saveRestoPrimaryImage = function() {
		$scope.updateProfile('PRIMARYIMAGE');
	}

	$scope.saveRestoLogoImage = function() {
		$scope.updateProfile('LOGOIMAGE');
	}

	function getTimeFormat(myTimeData) {
		var returnData;
		if( myTimeData ) {
			if( myTimeData.toString().length <= 0 ) {
				return '00:00';
			}
			return myTimeData.substring(0,2) + ":" + myTimeData.substring(2,4);
		}
	}

	function getDBTimeFormat(myTimeData) {
		var returnData;
		if( myTimeData ) {
			if( myTimeData.toString().length <= 0 ) {
				return '0000';
			}
			return myTimeData.replace(/:/g, '');
		}
	}

	$scope.saveRestoSecondayImages = function() {
		$scope.updateProfile('SECONDARYIMAGE');
	}

	function updateBusinessUIHours() {
		$scope.profileInfo.businessHours.closing_time = getTimeFormat($scope.profileInfo.businessHours.closing_time);
		$scope.profileInfo.businessHours.openning_time = getTimeFormat($scope.profileInfo.businessHours.openning_time);
		$scope.profileInfo.businessHours.first_sift_start = getTimeFormat($scope.profileInfo.businessHours.first_sift_start);
		$scope.profileInfo.businessHours.first_sift_end = getTimeFormat($scope.profileInfo.businessHours.first_sift_end);
		$scope.profileInfo.businessHours.secound_sift_start = getTimeFormat($scope.profileInfo.businessHours.secound_sift_start);
		$scope.profileInfo.businessHours.secound_sift_end = getTimeFormat($scope.profileInfo.businessHours.secound_sift_end);
		$scope.profileInfo.businessHours.third_sift_start = getTimeFormat($scope.profileInfo.businessHours.third_sift_start);
		$scope.profileInfo.businessHours.third_sift_end = getTimeFormat($scope.profileInfo.businessHours.third_sift_end);
	}

	function populateProfile(restSid) {
		configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateRestoProfile.replace('{restSid}',restSid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
				$scope.profileInfo = resp;
				updateBusinessUIHours();
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.resetProfileChanges = function() {
		populateProfile($rootScope.restaurantDetails.restid);
	}

	function isValidHours() {
		var isValid = {
			status: true,
			message: ''
		};
		if( !($scope.profileInfo.businessHours.openning_time <= $scope.profileInfo.businessHours.closing_time)) {
			isValid.status = false;
			isValid.message = 'Opening time should be less than ending time!'
			return isValid;
		}
		if ( $scope.profileInfo.businessHours.first_sift_start && !($scope.profileInfo.businessHours.first_sift_start <= $scope.profileInfo.businessHours.first_sift_end ) ) {
			isValid.status = false;
			isValid.message = 'Shift 01 : End time should be greater than start time!';
			return isValid;
		}else if($scope.profileInfo.businessHours.secound_sift_start && !($scope.profileInfo.businessHours.secound_sift_start <= $scope.profileInfo.businessHours.secound_sift_end )) {
			isValid.status = false;
			isValid.message = 'Shift 02 : End time should be greater than start time!';
			return isValid;
		}else if( $scope.profileInfo.businessHours.third_sift_start && !($scope.profileInfo.businessHours.third_sift_start <= $scope.profileInfo.businessHours.third_sift_end ) ) {
			isValid.status = false;
			isValid.message = 'Shift 03 : End time should be greater than start time!';
			return isValid;
		}
		return isValid;
	}

	function updateBusinessDBHours() {
		$scope.profileInfo.businessHours.closing_time = getDBTimeFormat($scope.profileInfo.businessHours.closing_time);
		$scope.profileInfo.businessHours.openning_time = getDBTimeFormat($scope.profileInfo.businessHours.openning_time);
		$scope.profileInfo.businessHours.first_sift_start = getDBTimeFormat($scope.profileInfo.businessHours.first_sift_start);
		$scope.profileInfo.businessHours.first_sift_end = getDBTimeFormat($scope.profileInfo.businessHours.first_sift_end);
		$scope.profileInfo.businessHours.secound_sift_start = getDBTimeFormat($scope.profileInfo.businessHours.secound_sift_start);
		$scope.profileInfo.businessHours.secound_sift_end = getDBTimeFormat($scope.profileInfo.businessHours.secound_sift_end);
		$scope.profileInfo.businessHours.third_sift_start = getDBTimeFormat($scope.profileInfo.businessHours.third_sift_start);
		$scope.profileInfo.businessHours.third_sift_end = getDBTimeFormat($scope.profileInfo.businessHours.third_sift_end);
	}

	$scope.updateProfile = function(updateBy) {
		$scope.profileInfo.updateBy = updateBy;
		if( updateBy === 'BUSINESSHOURS' ) { 
			updateBusinessDBHours(); 
			var isValidBusinessHours = isValidHours();
			if( !isValidBusinessHours.status ) {
				alert(isValidBusinessHours.message);
				updateBusinessUIHours();
				return;
			}
		}
		$scope.modelError = null;
		configHttpReqService.httpRequestWithPromise(Constants.URLS.UpdateRestoProfile.replace('{restSid}',$scope.profileInfo.restid), Constants.Global.METHOD.PUT, Constants.Global.DefaultHTTPHeader, $scope.profileInfo, null, null, null)
		.then(
			function(resp) { 
				populateProfile($rootScope.restaurantDetails.restid);
				alert('Updated Successfully!.');
				angular.element('#changePinModal').modal('hide');
				angular.element('#changePasswordModal').modal('hide');
				angular.element('input[type="file"]').val('');
			}, function(resp) { 
				console.log('Error');
			}
		);
	}

	$scope.initChangePassword = function() {
		$scope.modelError = null;
		$scope.changePassword = {
			password: '',
			confirmPassword: ''
		}
	}

	$scope.updateChangePassword = function(formDetails) {
		if( formDetails.$valid) {
			if( $scope.changePassword.password === $scope.changePassword.confirmPassword ) {
				$scope.profileInfo.password = $scope.changePassword.confirmPassword;
				$scope.updateProfile('CHANGEPASSWORD');
			}
		}else{
			$scope.modelError = "Incorrect password/confirm password!!";
		}
	}

	$scope.updateChangePin = function(formDetails) {
		if( formDetails.$valid) {
			$scope.updateProfile('CHANGEPIN');
		}else{
			$scope.modelError = "Enter valid pin!!";
		}
	}

	$scope.$on("RESTURANTPROFILE", function(e) {
		populateProfile($rootScope.restaurantDetails.restid);
	});

	$scope.$on("uploadedFilePath", function(e, data) {
		if( data.uploadType === 'PRIMARY' ) {
			$scope.profileInfo.primary_image_url = data.files[0];
		}if( data.uploadType === 'LOGO' ) {
			$scope.profileInfo.logo_url = data.files[0];
		}else if( data.uploadType === 'SECONDARY' ) {
			if( $scope.profileInfo.secondaryImages && $scope.profileInfo.secondaryImages.length <= 0 ) {
				$scope.profileInfo.secondaryImages = [];
			}
			for( var i = 0; i < data.files.length; i++ ) {
				$scope.profileInfo.secondaryImages.push({
					'image_url' : data.files[i],
					'image_type' : null,
					'isUpload' : true
				});
			}
		}
	});
});