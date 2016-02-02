(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name veronicaApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of veronicaApp
   */
  angular.module('veronicaApp').controller('TooltipDemoCtrl', function ($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  });

})();