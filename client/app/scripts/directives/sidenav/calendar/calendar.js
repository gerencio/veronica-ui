(function () {
	'use strict';

	angular.module('veronicaApp')
		.directive('calendar',function(){
			return {
				templateUrl:'scripts/directives/sidenav/calendar/calendar.html?v='+window.app_version,
				restrict: 'E',
				replace: true
			};
		});

})();


