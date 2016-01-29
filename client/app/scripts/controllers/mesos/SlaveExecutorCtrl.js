(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');

    mesosApp.controller('SlaveExecutorCtrl', [
        '$scope', '$stateParams', '$http', '$q', '$timeout', 'top',
        function($scope, $stateParams, $http, $q, $timeout, $top) {
            $scope.slave_id = $stateParams.slave_id;
            $scope.framework_id = $stateParams.framework_id;
            $scope.executor_id = $stateParams.executor_id;

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

                        function matchExecutor(executor) {
                            return $scope.executor_id === executor.id;
                        }

                        // Look for the executor; it's either active or completed.
                        $scope.executor =
                            _.find($scope.framework.executors, matchExecutor) ||
                            _.find($scope.framework.completed_executors, matchExecutor);

                        if (!$scope.executor) {
                            $scope.alert_message = 'No executor found with ID: ' + $stateParams.executor_id;
                            $('#alert').show();
                            return;
                        }

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