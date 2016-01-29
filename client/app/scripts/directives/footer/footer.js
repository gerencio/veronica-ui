(function () {
	'use strict';

	angular.module('veronicaApp')
		.directive('footer',function(){
			return {
			templateUrl:'scripts/directives/footer/footer.html?v='+window.app_version,
			restrict: 'E',
			replace: true
			};
		});

})();
