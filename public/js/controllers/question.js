eLearningApp.controller('Quesctrl',function($scope, $rootScope,$location,$window, $timeout, $mdMedia, $mdDialog, $filter, genericfactory, genericService, configHttpReqService, errorService, sessionStoreService){


    $scope.getQuestionPage = function(classid,caption){
		$scope.classId=classid;
		$scope.caption=caption;
	    $window.location.href = 'question.html'; 
    };
	
	
  
});