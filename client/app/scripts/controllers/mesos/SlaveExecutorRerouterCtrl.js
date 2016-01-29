(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');


    // Reroutes a request like
    // '/slaves/:slave_id/frameworks/:framework_id/executors/:executor_id/browse'
    // to the executor's sandbox. This requires a second request because the
    // directory to browse is known by the slave but not by the master. Request
    // the directory from the slave, and then redirect to it.
    //
    // TODO(ssorallen): Add `executor.directory` to the state.json output so this
    // controller of rerouting is no longer necessary.
    mesosApp.controller('SlaveExecutorRerouterCtrl',
        function($alert, $http, $location, $stateParams, $scope, $window) {

            function goBack(flashMessageOrOptions) {
                if (flashMessageOrOptions) {
                    $alert.danger(flashMessageOrOptions);
                }

                if ($window.history.length > 1) {
                    // If the browser has something in its history, just go back.
                    $window.history.back();
                } else {
                    // Otherwise navigate to the framework page, which is likely the
                    // previous page anyway.
                    $location.path('/mesos/frameworks/' + $stateParams.framework_id).replace();
                }
            }

            // When navigating directly to this page, e.g. pasting the URL into the
            // browser, the previous page is not a page in Mesos. In that case, navigate
            // home.
            if (!$scope.slaves) {
                $alert.danger({
                    message: "Navigate to the slave's sandbox via the Mesos UI.",
                    title: "Failed to find slaves."
                });
                return $location.path('/').replace();
            }

            var slave = $scope.slaves[$stateParams.slave_id];

            // If the slave doesn't exist, send the user back.
            if (!slave) {
                return goBack("Slave with ID '" + $stateParams.slave_id + "' does not exist.");
            }

            var pid = slave.pid;
            var hostname = $scope.slaves[$stateParams.slave_id].hostname;
            var id = pid.substring(0, pid.indexOf('@'));
            var port = pid.substring(pid.lastIndexOf(':') + 1);
            var host = hostname + ":" + port;

            // Request slave details to get access to the route executor's "directory"
            // to navigate directly to the executor's sandbox.
            $http.jsonp('//' + host + '/' + id + '/state.json?jsonp=JSON_CALLBACK')
                .success(function(response) {

                    function matchFramework(framework) {
                        return $stateParams.framework_id === framework.id;
                    }

                    var framework =
                        _.find(response.frameworks, matchFramework) ||
                        _.find(response.completed_frameworks, matchFramework);

                    if (!framework) {
                        return goBack(
                            "Framework with ID '" + $stateParams.framework_id +
                            "' does not exist on slave with ID '" + $stateParams.slave_id +
                            "'."
                        );
                    }

                    function matchExecutor(executor) {
                        return $stateParams.executor_id === executor.id;
                    }

                    var executor =
                        _.find(framework.executors, matchExecutor) ||
                        _.find(framework.completed_executors, matchExecutor);

                    if (!executor) {
                        return goBack(
                            "Executor with ID '" + $stateParams.executor_id +
                            "' does not exist on slave with ID '" + $stateParams.slave_id +
                            "'."
                        );
                    }

                    // Navigate to a path like '/slaves/:id/browse?path=%2Ftmp%2F', the
                    // recognized "browse" endpoint for a slave.
                    $location.path('/dashboard/mesos/slaves/' + $stateParams.slave_id + '/browse')
                        .search({path: executor.directory})
                        .replace();
                })
                .error(function(response) {
                    $alert.danger({
                        bullets: [
                            "The slave's hostname, '" + hostname + "', is not accessible from your network",
                            "The slave's port, '" + port + "', is not accessible from your network",
                            "The slave timed out or went offline"
                        ],
                        message: "Potential reasons:",
                        title: "Failed to connect to slave '" + $stateParams.slave_id +
                        "' on '" + host + "'."
                    });

                    // Is the slave dead? Navigate home since returning to the slave might
                    // end up in an endless loop.
                    $location.path('/').replace();
                });
        });


    mesosApp.controller('BrowseCtrl',function($scope, $stateParams, $http, $location, $misc) {
        var update = function() {
            var path_head = $location.$$search.path;

            if ($stateParams.slave_id in $scope.slaves && path_head) {
                $scope.slave_id = $stateParams.slave_id;
                $scope.path = path_head;

                var pid = $scope.slaves[$stateParams.slave_id].pid;
                var hostname = $scope.slaves[$stateParams.slave_id].hostname;
                var id = pid.substring(0, pid.indexOf('@'));
                var host = hostname + ":" + pid.substring(pid.lastIndexOf(':') + 1);
                var url = '//' + host + '/files/browse.json?jsonp=JSON_CALLBACK';

                $scope.slave_host = host;

                $scope.pail = function($event, path) {
                    $misc.pailer(host, path, decodeURIComponent(path));
                };

                // TODO(bmahler): Try to get the error code / body in the error callback.
                // This wasn't working with the current version of angular.
                $http.jsonp(url, {params: {path: path_head}})
                    .success(function(data) {
                        $scope.listing = data;
                        $('#listing').show();
                    })
                    .error(function() {
                        $scope.alert_message = 'Error browsing path: ' + path_head;
                        $('#alert').show();
                    });
            } else {
                if (!($stateParams.slave_id in $scope.slaves)) {
                    $scope.alert_message = 'No slave found with ID: ' + $stateParams.slave_id;
                } else {
                    $scope.alert_message = 'Missing "path" request parameter.';
                }
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