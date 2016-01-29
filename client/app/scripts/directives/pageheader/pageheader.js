(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name DashveronicaApp.directive:pageHeader
	 * @description
	 * # pageHeader
	 */
	angular.module('veronicaApp')
		.directive('pageheader',function(){
			return {
			templateUrl:'scripts/directives/pageheader/pageheader.html?v='+window.app_version,
			restrict: 'E',
			replace: true,
			scope: {
				'pagename': '@',
				'subtitle': '@'
				}
			};
		});
})();


