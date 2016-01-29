(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name veronicaApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of veronicaApp
   */
  angular.module('veronicaApp').controller('PopoverDemoCtrl', function ($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';
  });

})();