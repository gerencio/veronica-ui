(function () {
	'use strict';

	angular.module('veronicaApp')
		.directive('notification',function(){
			return {
				templateUrl:'scripts/directives/sidenav/notification/notification.html',
				restrict: 'E',
				replace: true
			};
		});

})();


