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
        '$scope', '$location', '$timeout', '$modal', '$misc', '$resources', '$dialog',
        function($scope, $location, $timeout, $modal, $misc , $resources, $dialog) {
            $scope.doneLoading = true;

            // Adding bindings into scope so that they can be used from within
            // AngularJS expressions.
            $scope._ = _;
            $scope.stringify = JSON.stringify;
            $scope.encodeURIComponent = encodeURIComponent;
            $scope.basename = function (path) {
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
            $scope.isErrorModalOpen = false;

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
            $scope.$on('$routeChangeSuccess', function (event, current) {
                var path = current.$$route.originalPath;

                // Use _.some so the loop can exit on the first `pathRegexp` match.
                var matched = _.some(NAVBAR_PATHS, function (nav) {
                    if (path.match(nav.pathRegexp)) {
                        $scope.navbarActiveTab = nav.tab;
                        return true;
                    }
                });

                if (!matched) $scope.navbarActiveTab = null;
            });

            var popupErrorModal = function () {
                if ($scope.delay >= 128000) {
                    $scope.delay = 2000;
                } else {
                    $scope.delay = $scope.delay * 2;
                }

                $scope.isErrorModalOpen = true;

                var errorModal = $dialog.messageBox(
                    'Master is not Active',
                    "Reload the page or check the server.",
                    [{label: 'Continue'}]
                ).open();

                // Make it such that everytime we hide the error-modal, we stop the
                // countdown and restart the polling.
                errorModal.then(function () {
                    $scope.isErrorModalOpen = false;

                    if ($scope.countdown != null) {
                        if ($timeout.cancel($scope.countdown)) {
                            // Restart since they cancelled the countdown.
                            $scope.delay = 2000;
                        }
                    }

                    // Start polling again, but do it asynchronously (and wait at
                    // least a second because otherwise the error-modal won't get
                    // properly shown).
                    $timeout(pollState, 1000);
                    $timeout(pollMetrics, 1000);
                });

                //$scope.retry = $scope.delay;
                //var countdown = function () {
                //    if ($scope.retry === 0) {
                //        errorModal.close();
                //    } else {
                //        $scope.retry = $scope.retry - 1000;
                //        $scope.countdown = $timeout(countdown, 1000);
                //    }
                //};
                //countdown();
            };

            var pollState = function () {



                $resources.masterState()
                    .then(function(data){
                        if ($misc.updateState($scope, $timeout, data)) {
                            $scope.delay = $misc.updateInterval(_.size($scope.slaves));
                            $timeout(pollState, $scope.delay);
                        }
                    })
                    .catch(function(err){
                        if ($scope.isErrorModalOpen === false) {
                            popupErrorModal();
                        }
                    });

            };

            var pollMetrics = function () {

                $resources.masterMetricsSnapShot().then(
                    function (data) {
                        if ($misc.updateMetrics($scope, $timeout, data)) {
                            $scope.delay = $misc.updateInterval(_.size($scope.slaves));
                            $timeout(pollMetrics, $scope.delay);
                        }
                    })
                    .catch(function () {
                        if ($scope.isErrorModalOpen === false) {
                            popupErrorModal();
                        }
                    });
            };

            pollState();
            pollMetrics();
        }]
    );

})();