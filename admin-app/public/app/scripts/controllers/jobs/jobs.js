(function() {
    'use strict';

    var app = angular.module('dashyAngular');

    app.controller('JobsCtrl', [
        '$scope', '$http', '$location',
        function($scope, $http, $location) {

            $scope.jobs = {};

            // lista de jobs (chronos)
            $scope.jobs_view = function () {

                $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('master' + ':' + '1234');
                $http({method: 'GET', url: '/chronos/scheduler/jobs'}).
                    success(function(data) {
                        console.log(data);
                        $scope.jobs = data;



                    }).
                    error(function(err) {
                        console.log(err);
                    });

            };



        }]);

})();