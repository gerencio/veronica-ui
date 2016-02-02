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
    .controller('PageCtrl', function($scope, $state) {

      $scope.$state = $state;

      $scope.date = new Date();
      $scope.eventSources = [];


    });

})();