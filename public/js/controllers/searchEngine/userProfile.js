/*
 * Starlly.
 * 
 * Copyright (c) 2016 ariveguru.com
 * http://ariveguru.com
 *
 */

starllySearchEngine.controller('profileCtrl', function($scope, $rootScope, $filter, $timeout, configHttpReqService) {

    $scope.initReviews = function() {
         configHttpReqService.httpRequestWithPromise(Constants.URLS.UserReviews.replace('{userid}', $rootScope.userDetails.userid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
            .then(
                function(resp) {
                    $scope.reviewDetails = resp;
                },
                function(resp) {
                    alert(resp.status);
                }
            );
    }

    $scope.initMyRewards = function() {
         configHttpReqService.httpRequestWithPromise(Constants.URLS.UserRewards.replace('{userid}', $rootScope.userDetails.userid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
            .then(
                function(resp) {
                    $scope.rewardDetails = resp;
                },
                function(resp) {
                    alert(resp.status);
                }
            );
    }

    function populateUser() {
        configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateUser.replace('{userid}', $rootScope.userDetails.userid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
            .then(
                function(resp) {
                    resp.name = resp.firstname ? resp.firstname : ' ' + resp.lastname ? resp.lastname : ' ';
                    $rootScope.userDetails = resp;
                },
                function(resp) {
                    alert(resp.status);
                }
            );
    }
    $scope.initSaveProfile = function() {
        configHttpReqService.httpRequestWithPromise(Constants.URLS.PopulateUser.replace('{userid}', $rootScope.userDetails.userid), Constants.Global.METHOD.GET, Constants.Global.DefaultHTTPHeader, null, null, null, null)
            .then(
                function(resp) {
                    populateUser();
                },
                function(resp) {
                    alert(resp.status);
                }
            );
    }

    function init() {
        $scope.initMyRewards();
    }

    init();

});
