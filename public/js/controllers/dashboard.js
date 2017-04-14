eLearningApp.controller('dashboardCntrl',function($scope, $rootScope, $timeout, $mdMedia, $mdDialog, $filter, genericfactory, genericService, configHttpReqService, errorService, sessionStoreService){


    $scope.logOut = function(){
	    sessionStoreService.emptyOwnerSession();
		$scope.currentPage = "home.html";
	    $rootScope.userDetails = "";
		$scope.$emit("toChangeCurrentPage", "HomePage");
    };
   
	$scope.initUserDetails = function() {
	$scope.LoginUserInfo = $rootScope.userDetails;
	};
	
	$scope.initUserDetails();
	
	

	
	
	
});