(function() {
    'use strict';

    var app = angular.module('dashyAngular');

    app.controller('JobsCtrl', [
        '$scope', '$http', '$location',
        function($scope, $http, $location) {

            $scope.jobs = {};
            $scope.job_id = {};
            $scope.jobFields = [
                {
                    key: 'name',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'name'
                    }
                    //initialValue: ''
                },
                {
                    key: 'description',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'description'
                    }
                },
                {
                    key: 'command',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'command'
                    }
                },
                {
                    key: 'owner',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'owner'
                    }
                },
                {
                    key: 'ownerName',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'ownerName'
                    }
                },
                {
                    key: 'schedule',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'schedule'
                    }
                },
                {
                    key: 'executor',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'executor'
                    }
                },
                {
                    key: 'epsilon',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'epsilon'
                    }
                },
                {
                    key: 'async',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'async'
                    }
                },
                {
                    key: 'disabled',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'disabled'
                    }
                },
                {
                    key: 'softError',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'softError'
                    }
                },
                {
                    key: 'cpus',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'cpus'
                    }
                },
                {
                    key: 'mem',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'mem'
                    }
                },
                {
                    key: 'disk',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'disk'
                    }
                },
                {
                    key: 'softError',
                    type: 'input',
                    templateOptions: {
                    type: 'text',
                        label: 'softError'
                    }
                },
            ];

            // lista de jobs (chronos)
            $scope.jobs_view = function () {

                $http.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
                $http.defaults.headers.common['Authorization'] = 'Basic ' + btoa('master' + ':' + '1234');
                $http({method: 'GET', url: '/chronos/scheduler/jobs'}).
                    success(function(data) {
                        $scope.jobs = data;
                    }).
                    error(function(err) {
                        console.log(err);
                    });

            };



            // lista de jobs ID (chronos)
            $scope.jobs_view_id = function (id_job) {
                var k=0;
                $scope.jobs.forEach(function(obj) {
                    if(id_job == obj.name){
                        $scope.job_id = $scope.jobs[k];
                        $("#createJob").modal();
                    }
                    k++;
                });
            };



            // Salvar job no BD
            $scope.jobs_save = function () {
                $http.post('/jobs', { job: $scope.job_id })
                    .then(
                        function(data){
                            $("#createJob").modal('hide');
                        }, function(err){
                            console.log(err)
                        }
                    );
            };

            // Roda job
            $scope.jobs_run = function () {
                $("#runJob").modal('hide');
                $http.put('/chronos/scheduler/job/' + $scope.job_id.name)
                    .then(
                    function(data){

                    }, function(err){
                        console.log(err)
                    }
                );
            };
        }]);

})();