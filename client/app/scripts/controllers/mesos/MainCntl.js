(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');


    // Main controller that can be used to handle "global" events. E.g.,:
    //     $scope.$on('$afterRouteChange', function() { ...; });
    //
    // In addition, the MainCntl encapsulates the "view", allowing the
    // active controller/view to easily access anything in scope (e.g.,
    // the state).
    mesosApp.controller('MainCntl', [
        '$scope', '$http', '$location', '$timeout', '$modal', '$misc',
        function($scope, $http, $location, $timeout, $modal , $misc) {
            $scope.doneLoading = true;

            // Adding bindings into scope so that they can be used from within
            // AngularJS expressions.
            $scope._ = _;
            $scope.stringify = JSON.stringify;
            $scope.encodeURIComponent = encodeURIComponent;
            $scope.basename = function(path) {
                // This is only a basic version of basename that handles the cases we care
                // about, rather than duplicating unix basename functionality perfectly.
                if (path === '/') {
                    return path;  // Handle '/'.
                }

                // Strip a trailing '/' if present.
                if (path.length > 0 && path.lastIndexOf('/') === (path.length - 1)) {
                    path = path.substr(0, path.length - 1);
                }
                return path.substr(path.lastIndexOf('/') + 1);
            };

            $scope.$location = $location;
            $scope.delay = 2000;
            $scope.retry = 0;
            $scope.time_since_update = 0;

            // Ordered Array of path => activeTab mappings. On successful route changes,
            // the `pathRegexp` values are matched against the current route. The first
            // match will be used to set the active navbar tab.
            var NAVBAR_PATHS = [
                {
                    pathRegexp: /^\/slaves/,
                    tab: 'slaves'
                },
                {
                    pathRegexp: /^\/frameworks/,
                    tab: 'frameworks'
                },
                {
                    pathRegexp: /^\/offers/,
                    tab: 'offers'
                }
            ];

            // Set the active tab on route changes according to NAVBAR_PATHS.
            $scope.$on('$routeChangeSuccess', function(event, current) {
                var path = current.$$route.originalPath;

                // Use _.some so the loop can exit on the first `pathRegexp` match.
                var matched = _.some(NAVBAR_PATHS, function(nav) {
                    if (path.match(nav.pathRegexp)) {
                        $scope.navbarActiveTab = nav.tab;
                        return true;
                    }
                });

                if (!matched) { $scope.navbarActiveTab = null; }
            });

            var poll = function() {
                $http.get('/mesos/master/state.json',
                    {transformResponse: function(data) { return data; }})
                    .success(function(data) {
                        if ($misc.update($scope, $timeout, data)) {
                            $scope.delay = $misc.updateInterval(_.size($scope.slaves));
                            $timeout(poll, $scope.delay);
                        }
                    })
                    .error(function() {
                        if ($scope.delay >= 128000) {
                            $scope.delay = 2000;
                        } else {
                            $scope.delay = $scope.delay * 2;
                        }

                        var errorModal = $modal.open({
                            controller: function($scope, $modalInstance, scope) {
                                // Give the modal reference to the root scope so it can access the
                                // `retry` variable. It needs to be passed by reference, not by
                                // value, since its value is changed outside the scope of the
                                // modal.
                                $scope.rootScope = scope;
                            },
                            resolve: {
                                scope: function() { return $scope; }
                            },
                            templateUrl: "template/dialog/masterGone.html"
                        });

                        // Make it such that everytime we hide the error-modal, we stop the
                        // countdown and restart the polling.
                        errorModal.result.then(function() {
                            if ($scope.countdown != null) {
                                if ($timeout.cancel($scope.countdown)) {
                                    // Restart since they cancelled the countdown.
                                    $scope.delay = 2000;
                                }
                            }

                            // Start polling again, but do it asynchronously (and wait at
                            // least a second because otherwise the error-modal won't get
                            // properly shown).
                            $timeout(poll, 1000);
                        });

                        $scope.retry = $scope.delay;
                        var countdown = function() {
                            if ($scope.retry === 0) {
                                errorModal.close();
                            } else {
                                $scope.retry = $scope.retry - 1000;
                                $scope.countdown = $timeout(countdown, 1000);
                            }
                        };
                        countdown();
                    });
            };

            poll();
        }]);

})();