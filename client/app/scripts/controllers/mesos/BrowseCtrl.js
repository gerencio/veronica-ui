/**
 * Created by clayton on 03/02/16.
 */
mesosApp.controller('BrowseCtrl', function($scope, $routeParams, $http) {
    var update = function() {
        if ($routeParams.slave_id in $scope.slaves && $routeParams.path) {
            $scope.slave_id = $routeParams.slave_id;
            $scope.path = $routeParams.path;

            var pid = $scope.slaves[$routeParams.slave_id].pid;
            var hostname = $scope.slaves[$routeParams.slave_id].hostname;
            var id = pid.substring(0, pid.indexOf('@'));
            var host = hostname + ":" + pid.substring(pid.lastIndexOf(':') + 1);
            var url = '//' + host + '/files/browse?jsonp=JSON_CALLBACK';

            $scope.slave_host = host;

            $scope.pail = function($event, path) {
                pailer(host, path, decodeURIComponent(path));
            };

            // TODO(bmahler): Try to get the error code / body in the error callback.
            // This wasn't working with the current version of angular.
            $http.jsonp(url, {params: {path: $routeParams.path}})
                .success(function(data) {
                    $scope.listing = data;
                    $('#listing').show();
                })
                .error(function() {
                    $scope.alert_message = 'Error browsing path: ' + $routeParams.path;
                    $('#alert').show();
                });
        } else {
            if (!($routeParams.slave_id in $scope.slaves)) {
                $scope.alert_message = 'No slave found with ID: ' + $routeParams.slave_id;
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