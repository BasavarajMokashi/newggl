var errorServiceModule = angular.module('Errors',[]);
errorServiceModule.service('errorService', function($http, $rootScope, $timeout, $filter, $compile){

	this.errorOutputOfRegistration = function(resp, optionalData) {
		$rootScope.$broadcast('spinnerInSignUp', false);
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfAdditionalInfo = function(resp, optionalData) {
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfGetActiveOffers = function(resp, optionalData) {
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfCreateOffer = function(resp, optionalData) {
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfDeleteOffer = function(resp, optionalData) {
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfGoLiveOffer = function(resp, optionalData) {
		if(resp && resp.status) {
			console.log(resp.status);
			alert(resp.status);
		}
	};

	this.errorOutputOfOfferUpdate = (res, optionalData) =>{
		if(res && res.status){
			console.log(res.status);
			alert(res.status);
		}
	}
});