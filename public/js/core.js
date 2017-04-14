
var eLearningApp = angular.module('eLearningApp', ['ngMaterial', 'Auth', 'ConfigHttpReq', 'Errors','md.data.table', 'SessionStore']);
/**
 * Enabling CORS and gzip compression for AngularJS $httpProvider globally.
 */
eLearningApp.config(['$httpProvider', function($httpProvider) {
	     $httpProvider.defaults.useXDomain = true;
	     $httpProvider.defaults.headers.common = {"Access-Control-Allow-Origin":"*"};
	     delete $httpProvider.defaults.headers.common['X-Requested-With'];
     }
]);

eLearningApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('light-blue').accentPalette('light-blue');
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
	$mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
	$mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
	$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});