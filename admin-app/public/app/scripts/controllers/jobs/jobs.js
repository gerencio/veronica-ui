(function() {
    'use strict';

    var app = angular.module('dashyAngular');

    app.controller('JobsCtrl', [
        '$scope', '$http', '$location',
        function($scope, $http, $location) {

            // lista de jobs (marathon
            $scope.jobs_view = function () {
                $http.get('/marathon/v2/apps')
                    .then(function successCallback(data) {
                        console.log(data);
                    }, function errorCallback(err) {
                        console.log(err);
                });
            };

            // Job especifico (marathon)
            $scope.jobs_views = function (app_id) {
                $http.get('/marathon/v2/apps/' + app_id)
                    .then(function successCallback(data) {
                        console.log(data);
                    }, function errorCallback(err) {
                        console.log(err);
                });
            };

            // Restart Job (marathon)
            $scope.jobs_restart = function (app_id) {
                $http.get('/marathon/v2/apps/' + app_id + '/restart')
                    .then(function successCallback(data) {
                        console.log(data);
                    }, function errorCallback(err) {
                        console.log(err);
                    });
            };

            // Tasks (marathon)
            $scope.jobs_tasks = function (app_id) {
                $http.get('/marathon/v2/apps/' + app_id + '/tasks')
                    .then(function successCallback(data) {
                        console.log(data);
                    }, function errorCallback(err) {
                        console.log(err);
                    });
            };

        }]);

})();