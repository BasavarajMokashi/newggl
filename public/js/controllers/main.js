eLearningApp.controller('Appctrl',function($scope, $rootScope, $http, $timeout, $window, $mdDialog, $q, genericService, authentication, configHttpReqService, errorService, sessionStoreService){
	$scope.initUserInfo = function() {
		$rootScope.userDetails = "";
 				$scope.userDetails = {
	    		"username":"",
	    		"upassword":""
	    		};
 		

	};
	//Fn to load User Details Variable
	$scope.initUserDeatils = function() {
		//sessionStoreService.emptySessionObject();
		if(!sessionStoreService.getOwnerSession())
		{
			
			//Init authentication to $rootScope var to access it in configHttpReqService
			$rootScope.authentication = authentication;
			//$rootScope var to store restaurant details after login
			$rootScope.userDetails = "";
			//load initUserInfo fn to init User Details Variable
			$scope.initUserInfo();
	    	//Default currentPage is home screen
	    	$scope.currentPage = "home.html";
	    	sessionStoreService.setCurrentPage($scope.currentPage);
	    	//To show Top slider
	    	$scope.topSlider = true;
	    }
	    else
	    {
			
			$rootScope.userDetails = sessionStoreService.getOwnerSession();
	    	$scope.currentPage = sessionStoreService.getCurrentPage();
	    }
	  
	};
	//Loading home screen via ng-include
	$scope.loadHomePage = function() {
        $scope.currentPage = "home.html";
		sessionStoreService.setCurrentPage($scope.currentPage);
	};
	
	//Loading Offer Page after login via ng-include
	$scope.userDashboard = function() {
		$scope.currentPage = "dashboard.html";
		sessionStoreService.setCurrentPage($scope.currentPage);
	};
	
	//Initialization of Appctrl
	$scope.initAppCtrl = function() {
		//Load User Details Variable when app loaded
		$scope.initUserDeatils();
		$scope.getClassInfo();
	}
	
	
	
    //Login popup
    $scope.showLoginPopup = function(userDetails) {
		if($scope.userDetails.username && $scope.userDetails.upassword) {
    		var header = angular.copy(Constants.Global.DefaultHTTPHeader);
    	    header.username = userDetails.username.trim();
    	    header.upassword = userDetails.upassword.trim();
			configHttpReqService.httpRequestWithPromise(Constants.URLS.USER_DashBoard, Constants.Global.METHOD.GET, header, null, null, null, null)
		  .then(
		    function(resp) {
			if (!sessionStoreService.getOwnerSession(resp.LoginUserId))
 			{
                sessionStoreService.setOwnerSession(resp);
				 
 			}	
             $scope.showUserInfoPopup(resp);	 
			   
			}, function(resp) { 
			
				alert(resp.status);
			}
		);
	        
    	} else {
    		alert("Username or Password is empty!!");
    	}
	  
    };
	
	$scope.getClassInfo =function(){
		configHttpReqService.httpRequestWithPromise(Constants.URLS.Class_Info, Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
		.then(
			function(resp) { 
			console.log(resp);
				$scope.classInfo = resp;
				}, function(resp) { 
				console.log('Error');
			}
		);
		
	};
	
	
	
	$scope.showUserInfoPopup =function(resp){
		$scope.ResUserName = resp.UserName;
	    $('#myModal').modal({
	    });
	};
	
	$scope.showUserDashboard = function() {
		 location.reload();
	   $rootScope.$broadcast('loadPageFromAuthModule', {"pageToLoad":"dashboard"});
    };
	
	$scope.$on('loadPageFromAuthModule', function(e, data) {
	if(data.resp) {
 			$rootScope.restaurantDetails = data.resp;
	   }
	if(data.pageToLoad == "dashboard") {
		$scope.userDashboard();
       }
    });
	
	//Handling toChangeCurrentPage event emited from signUp and offers controller
 	$scope.$on("toChangeCurrentPage", function(e, data) {
 		if(data == "HomePage") {
 			$scope.initAppCtrl();
 		}
 	});

    
    //Load initAppCtrl fn when Appctrl loaded
    $scope.initAppCtrl();
});