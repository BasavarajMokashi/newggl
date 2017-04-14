var authModule = angular.module('Auth',['ConfigHttpReq','SessionStore']);
authModule.service('authentication',function($http, $rootScope, $timeout, $filter, sessionStoreService, configHttpReqService){
	
	  this.loginToUserDashboard = function(userDetails, $mdDialog) {
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
			    $rootScope.$broadcast('loadPageFromAuthModule', {"pageToLoad":"dashboard", "resp":resp});
				$mdDialog.hide();
			}, function(resp) { 
		       alert(resp.status);
			}
		);
 	};
});