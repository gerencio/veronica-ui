'use strict';

/**
 * @ngdoc function
 * @name dashyAngular.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of dashyAngular
 */
angular.module('dashyAngular')
  .controller('DashboardCtrl', function($scope, $state, UserService) {

        $scope.$state = $state;



        var promisePicture = UserService.getPicture();
        var promiseProfile = UserService.getProfile();

        promisePicture
            .then(function(response){ $scope.picture = response.data}, function (erro) {
                console.log(erro.status);
                console.log(erro.statusText)
            });

        promiseProfile
            .then(function(response){$scope.profile = response.data.obj}, function (erro) {
                console.log(erro.status);
                console.log(erro.statusText)
            });

        $scope.date = new Date();
        $scope.eventSources = [];

  
  });
