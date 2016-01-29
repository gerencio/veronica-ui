(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');

    mesosApp.controller('SlaveCtrl', [
        '$dialog', '$scope', '$stateParams', '$http', '$q', '$timeout', 'top', '$misc',
        function($dialog, $scope, $stateParams, $http, $q, $timeout, $top , $misc) {
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
                var host = hostname + ":" + pid.substring(pid.lastIndexOf(':') + 1);

                $scope.log = function($event) {
                    if (!$scope.state.external_log_file && !$scope.state.log_dir) {
                        $dialog.messageBox(
                            'Logging to a file is not enabled',
                            "Set the 'external_log_file' or 'log_dir' option if you wish to access the logs.",
                            [{label: 'Continue'}]
                        ).open();
                    } else {
                        $misc.pailer(host, '/slave/log', 'Mesos Slave');
                    }
                };

                // Set up polling for the monitor if this is the first update.
                if (!$top.started()) {
                    $top.start(host, $scope);
                }

                $http.jsonp('//' + host + '/' + id + '/state.json?jsonp=JSON_CALLBACK')
                    .success(function (response) {
                        $scope.state = response;

                        $scope.slave = {};
                        $scope.slave.frameworks = {};
                        $scope.slave.completed_frameworks = {};

                        $scope.slave.staging_tasks = 0;
                        $scope.slave.starting_tasks = 0;
                        $scope.slave.running_tasks = 0;

                        // Computes framework stats by setting new attributes on the 'framework'
                        // object.
                        function computeFrameworkStats(framework) {
                            framework.num_tasks = 0;
                            framework.cpus = 0;
                            framework.mem = 0;

                            _.each(framework.executors, function(executor) {
                                framework.num_tasks += _.size(executor.tasks);
                                framework.cpus += executor.resources.cpus;
                                framework.mem += executor.resources.mem;
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
                    })
                    .error(function(reason) {
                        $scope.alert_message = 'Failed to get slave usage / state: ' + reason;
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