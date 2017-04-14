 var sessionApp = angular.module('SessionStore', ['ngStorage']);

  sessionApp.service('sessionStoreService', function ($http, $rootScope, $sessionStorage) {
            
            //Store user details in JSON string format soon after the successful login

            this.setOwnerSession = function(data){
            	$sessionStorage.restuarantUserSession = data;
            }
            this.getOwnerSession = function(key){
            	return $sessionStorage.restuarantUserSession;
            } 
            this.emptyOwnerSession = function(key){
            	$sessionStorage.restuarantUserSession="";
            } 

            this.setCurrentPage = function(pageURL){
            	$sessionStorage.currentPage = pageURL;
            }
            this.getCurrentPage = function(){
            	return $sessionStorage.currentPage;
            } 

             this.setCurrentFeature = function(pageURL){
            	$sessionStorage.currentFeature = pageURL;
            }
            this.getCurrentFeature = function(){
            	return $sessionStorage.currentFeature;
            } 

               
    });