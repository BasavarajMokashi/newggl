/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllyApp.controller('starllyAdmin',function($scope, $rootScope, $filter, $timeout, $mdMedia, $mdDialog, genericfactory, genericService, configHttpReqService, errorService){

	$scope.setMyPage = function(myPage) {
		
		switch(myPage.toUpperCase()) {
			case 'DASHBOARD':
				$scope.myCurrentPage = 'dashboard.html';
			break;
			case 'USERS':
				$scope.myCurrentPage = 'users.html';
			break;
			case 'RESTURANTS':
				$scope.myCurrentPage = 'resturants.html';
			break;
			case 'INVOICE':
				$scope.myCurrentPage = 'invoice.html';
			break;
			case 'SETTINGS':
				$scope.myCurrentPage = 'setting.html';
			break;
			default:
				$scope.myCurrentPage = 'dashboard.html';
		}
	}

	function init() {
		$scope.setMyPage('Dashboard');
	};

	init();
	
});