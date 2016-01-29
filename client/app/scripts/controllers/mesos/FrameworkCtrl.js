(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');
    mesosApp.controller('FrameworkCtrl', function($scope, $stateParams) {
        var update = function() {
            if ($stateParams.id in $scope.completed_frameworks) {
                $scope.framework = $scope.completed_frameworks[$stateParams.id];
                $scope.alert_message = 'This framework has terminated!';
                $('#alert').show();
                $('#framework').show();
            } else if ($stateParams.id in $scope.frameworks) {
                $scope.framework = $scope.frameworks[$stateParams.id];
                $('#framework').show();
            } else {
                $scope.alert_message = 'No framework found with ID: ' + $stateParams.id;
                $('#alert').show();
            }
        };

        if ($scope.state) {
            update();
        }

        var removeListener = $scope.$on('state_updated', update);
        $scope.$on('$routeChangeStart', removeListener);
    });

})();