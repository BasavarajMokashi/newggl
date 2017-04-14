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

starllyApp.controller('fileUploadCtrl',function($scope, $http, $rootScope, genericService) {
	$scope.uploadFile = function(restoName, type){
		// $('#load').show();
		if($scope.myFile) {
			if(restoName) {
				var file = $scope.myFile;
				//console.dir(file);
				genericService.uploadFileToUrl(file, restoName, type);
			}else{
				$scope.myFile = null;
				var data = {
					uploadType: type,
					files: []
				}
				$rootScope.$broadcast("uploadedFilePath", data);
				alert("Resto Name should not be empty!");
			}
		} else {
			$scope.myFile = null;
			alert("Please select an image file!");
		}
    };
    $scope.triggerFileUpload = function(myFile, triggerId) {
    	$scope.myFile = myFile.files;
    	angular.element('#'+triggerId).trigger('click');
    }
    $scope.triggerPrimaryFileUpload = function(myFile) {
    	$scope.myFile = myFile.files;
    	angular.element('#triggerPrimaryFileUpload').trigger('click');
    }
    $scope.triggerSecondaryFileUpload = function(myFile) {
    	$scope.myFile = myFile.files;
    	angular.element('#triggerSecondaryFileUpload').trigger('click');
    }
});