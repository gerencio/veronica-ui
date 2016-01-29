(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');


    mesosApp.controller('SlaveFrameworkCtrl', [
        '$scope', '$stateParams', '$http', '$q', '$timeout', 'top',
        function($scope, $stateParams, $http, $q, $timeout, $top) {
            $scope.slave_id = $stateParams.slave_id;
            $scope.framework_id = $stateParams.framework_id;

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

                // Set up polling for the monitor if this is the first update.
                if (!$top.started()) {
                    $top.start(host, $scope);
                }

                $http.jsonp('//' + host + '/' + id + '/state.json?jsonp=JSON_CALLBACK')
                    .success(function (response) {
                        $scope.state = response;

                        $scope.slave = {};

                        function matchFramework(framework) {
                            return $scope.framework_id === framework.id;
                        }

                        // Find the framework; it's either active or completed.
                        $scope.framework =
                            _.find($scope.state.frameworks, matchFramework) ||
                            _.find($scope.state.completed_frameworks, matchFramework);

                        if (!$scope.framework) {
                            $scope.alert_message = 'No framework found with ID: ' + $stateParams.framework_id;
                            $('#alert').show();
                            return;
                        }

                        // Compute the framework stats.
                        $scope.framework.num_tasks = 0;
                        $scope.framework.cpus = 0;
                        $scope.framework.mem = 0;

                        _.each($scope.framework.executors, function(executor) {
                            $scope.framework.num_tasks += _.size(executor.tasks);
                            $scope.framework.cpus += executor.resources.cpus;
                            $scope.framework.mem += executor.resources.mem;
                        });

                        $('#slave').show();
                    })
                    .error(function (reason) {
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