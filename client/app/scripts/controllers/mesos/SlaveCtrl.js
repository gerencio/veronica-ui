(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');

    mesosApp.controller('SlaveCtrl', [
        '$dialog', '$scope', '$stateParams', '$http', '$q', '$timeout', 'top', '$pailer', '$misc', '$resources',
        function($dialog, $scope, $stateParams, $http, $q, $timeout, $top, $pailer , $misc, $resources) {
            $scope.slave_id = $stateParams.slave_id;

            var update = function() {
                if (!($stateParams.slave_id in $scope.slaves)) {
                    $scope.alert_message = 'No slave found with ID: ' + $stateParams.slave_id;
                    $('#alert').show();
                    return;
                }

                var pid = $scope.slaves[$stateParams.slave_id].pid;
                var hostname = $scope.slaves[$stateParams.slave_id].hostname;
                var id = pid.substring(0, pid.indexOf('@'));
                var host = 'http://' + hostname + ":" + pid.substring(pid.lastIndexOf(':') + 1);

                $scope.log = function($event) {
                    if (!$scope.state.external_log_file && !$scope.state.log_dir) {
                        $dialog.messageBox(
                            'Logging to a file is not enabled',
                            "Set the 'external_log_file' or 'log_dir' option if you wish to access the logs.",
                            [{label: 'Continue'}]
                        ).open();
                    } else {
                        $pailer.messageBox(
                            'Logs',
                            host,
                            '/slave/log'
                        ).open();
                    }
                };

                // Set up polling for the monitor if this is the first update.
                if (!$top.started()) {
                    $top.start(host, $scope);
                }


                $resources.slaveState(host,id)
                    .then(function (response) {
                        $scope.state = response;

                        $scope.slave = {};
                        $scope.slave.frameworks = {};
                        $scope.slave.completed_frameworks = {};

                        // Computes framework stats by setting new attributes on the 'framework'
                        // object.
                        function computeFrameworkStats(framework) {
                            framework.num_tasks = 0;
                            framework.cpus = 0;
                            framework.mem = 0;
                            framework.disk = 0;

                            _.each(framework.executors, function(executor) {
                                framework.num_tasks += _.size(executor.tasks);
                                framework.cpus += executor.resources.cpus;
                                framework.mem += executor.resources.mem;
                                framework.disk += executor.resources.disk;
                            });
                        }

                        // Compute framework stats and update slave's mappings of those
                        // frameworks.
                        _.each($scope.state.frameworks, function(framework) {
                            $scope.slave.frameworks[framework.id] = framework;
                            computeFrameworkStats(framework);
                        });

                        _.each($scope.state.completed_frameworks, function(framework) {
                            $scope.slave.completed_frameworks[framework.id] = framework;
                            computeFrameworkStats(framework);
                        });

                        $('#slave').show();
                    }).catch(function(reason) {
                        $scope.alert_message = 'Failed to get slave usage / state: ' + reason.message;
                        $('#alert').show();
                });





                $resources.slaveMetricsSnapShot(host)
                .then(function (response) {
                    if (!$scope.state) {
                        $scope.state = {};
                    }
                    $scope.state.staged_tasks = response['slave/tasks_staging'];
                    $scope.state.started_tasks = response['slave/tasks_starting'];
                    $scope.state.finished_tasks = response['slave/tasks_finished'];
                    $scope.state.killed_tasks = response['slave/tasks_killed'];
                    $scope.state.failed_tasks = response['slave/tasks_failed'];
                    $scope.state.lost_tasks = response['slave/tasks_lost'];
                }).catch(function(reason) {
                    $scope.alert_message = 'Failed to get slave metrics: ' + reason.message;
                    $('#alert').show();
                });
            };

            if ($scope.state) {
                update();
            }

            var removeListener = $scope.$on('state_updated', update);
            $scope.$on('$routeChangeStart', removeListener);
        }]);



})();