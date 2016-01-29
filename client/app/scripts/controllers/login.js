(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name veronicaApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of veronicaApp
   */
  angular.module('veronicaApp')
    .controller('LoginCtrl', function($scope, $location) {

      $scope.submit = function() {

        $location.path('/dashboard');

        return false;
      };

    });

})();
