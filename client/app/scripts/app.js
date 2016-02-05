(function () {
    'use strict';

    /**
    * @ngdoc home
    * @name veronicaApp
    * @description
    * # veronicaApp
    *
    * Main module of the application.
    */
    window.app_version = 2;
    /*'base64'  analisar o codigo inserido */
    angular
    .module('veronicaApp', [
        'ngRoute',
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
        'ui.bootstrap.dialog',
        'textAngular',
        'ui.calendar',
        'perfect_scrollbar',
        'angular-loading-bar',
        'chart.js',
        'angular-growl',
        'angulartics',
        'angulartics.google.analytics',
        'gridshore.c3js.chart',
        'growlNotifications',
        'formly',
        'formlyBootstrap',
        'mesos.services'
    ])
     .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 5;
          cfpLoadingBarProvider.includeSpinner = false;
      }])
        .config(function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider
                .when('/mesos', '/page/mesos/home')
                .when('/jobs', '/page/jobs/home');
            $stateProvider
                .state('plain', {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/layouts/plain.html?v='+window.app_version
                })
                .state('boxed', {
                    abstract: true,
                    url: '',
                    parent: 'plain',
                    templateUrl: 'views/layouts/boxed.html?v='+window.app_version
                })
                .state('login', {
                    url: '/login',
                    parent: 'boxed',
                    templateUrl: 'views/pages/login.html?v='+window.app_version,
                    controller: 'LoginCtrl'
                })
                .state('page', {
                    url: '/page',
                    parent: 'plain',
                    templateUrl: 'views/layouts/page.html?v='+window.app_version,
                    controller: 'PageCtrl'
                })
                .state('home', {
                    url: '/home',
                    parent: 'page',
                    templateUrl: 'views/pages/main/home.html?v='+window.app_version,
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                })
                .state('jobs', {
                    url: '/jobs',
                    parent: 'page',
                    templateUrl: 'views/pages/jobs/jobs.html?v='+window.app_version,
                    controller: 'JobsCtrl'
                })
                .state('mesos', {
                    url: '/mesos',
                    parent: 'page',
                    templateUrl: 'views/pages/mesos/mesos.html?v='+window.app_version,
                    controller: 'MainCntl'
                })
                .state('homeMesos', {
                    url: '/home',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/home.html?v='+window.app_version,
                    controller: 'MesosHomeCtrl'
                })
                .state('frameworks/:id', {
                    url: '/frameworks/:id',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/framework.html?v='+window.app_version,
                    controller: 'FrameworkCtrl'
                })
                .state('frameworks', {
                    url: '/frameworks',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/frameworks.html?v='+window.app_version,
                    controller: 'FrameworksCtrl'
                })
                .state('slaves/:slave_id/frameworks/:framework_id/executors/:executor_id/browse', {
                    url: '/slaves/:slave_id/frameworks/:framework_id/executors/:executor_id/browse',
                    parent: 'mesos',
                    templateUrl: '',
                    controller: 'SlaveExecutorRerouterCtrl'
                })
                .state('slaves/:slave_id/frameworks/:framework_id/executors/:executor_id', {
                    url: '/slaves/:slave_id/frameworks/:framework_id/executors/:executor_id',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/slave_executor.html?v='+window.app_version,
                    controller: 'SlaveExecutorCtrl'
                })
                .state('slaves/:slave_id/frameworks/:framework_id', {
                    url: '/slaves/:slave_id/frameworks/:framework_id',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/slave_framework.html?v='+window.app_version,
                    controller: 'SlaveFrameworkCtrl'
                })
                .state('slaves/:slave_id/browse', {
                    url: '/slaves/:slave_id/browse',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/browse.html?v='+window.app_version,
                    controller: 'BrowseCtrl'
                })
                .state('slaves/:slave_id', {
                    url: '/slaves/:slave_id',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/slave.html?v='+window.app_version,
                    controller: 'SlaveCtrl'
                })
                .state('slaves', {
                    url: '/slaves',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/slaves.html?v='+window.app_version,
                    controller: 'SlavesCtrl'
                })
                .state('offers', {
                    url: '/offers',
                    parent: 'mesos',
                    templateUrl: 'views/pages/mesos/offers.html?v='+window.app_version,
                    controller: 'MainCntl'
                })
                .state('404-page', {
                    url: '/404',
                    parent: 'boxed',
                    templateUrl: 'views/pages/404-page.html?v='+window.app_version
                })
                .state('500-page', {
                    url: '/500',
                    parent: 'boxed',
                    templateUrl: 'views/pages/500-page.html?v='+window.app_version
                });
            $urlRouterProvider.otherwise('/page/mesos/home');

        })
        .run(function(){

            var switchValue = JSON.parse(localStorage.getItem("switched"));
            if(switchValue) {
                $('body').addClass('box-section');
            }
        })
        // ---- filters do MESOS ---- //
        .filter('truncateMesosID', function() {
            return function(id) {
                if (id) {
                    var truncatedIdParts = id.split('-');

                    if (truncatedIdParts.length > 3) {
                        return 'â€¦' + truncatedIdParts.splice(3, 3).join('-');
                    } else {
                        return id;
                    }
                } else {
                    return '';
                }
            };
        })
        .filter('truncateMesosState', function() {
            return function(state) {
                // Remove the "TASK_" prefix.
                return state.substring(5);
            };
        })
        .filter('isoDate', function($filter) {
            return function(date) {
                var i = parseInt(date, 10);
                if (_.isNaN(i)) { return ''; }
                return $filter('date')(i, 'yyyy-MM-ddTH:mm:ssZ');
            };
        })
        .filter('relativeDate', function() {
            return function(date, refDate) {
                var i = parseInt(date, 10);
                if (_.isNaN(i)) { return ''; }
                return relativeDate(i, refDate);
            };
        })
        .filter('slice', function() {
            return function(array, begin, end) {
                if (_.isArray(array)) {
                    return array.slice(begin, end);
                }
            };
        })
        .filter('unixDate', function($filter) {
            return function(date) {
                if ((new Date(date)).getFullYear() === (new Date()).getFullYear()) {
                    return $filter('date')(date, 'MMM dd HH:mm');
                } else {
                    return $filter('date')(date, 'MMM dd yyyy');
                }
            };
        })
        .filter('dataSize', function() {
            var BYTES_PER_KB = Math.pow(2, 10);
            var BYTES_PER_MB = Math.pow(2, 20);
            var BYTES_PER_GB = Math.pow(2, 30);

            return function(bytes) {
                if (bytes === null || isNaN(bytes)) {
                    return '';
                } else if (bytes < BYTES_PER_KB) {
                    return bytes.toFixed() + ' B';
                } else if (bytes < BYTES_PER_MB) {
                    return (bytes / BYTES_PER_KB).toFixed() + ' KB';
                } else if (bytes < BYTES_PER_GB) {
                    return (bytes / BYTES_PER_MB).toFixed() + ' MB';
                } else {
                    return (bytes / BYTES_PER_GB).toFixed(1) + ' GB';
                }
            };
        })
        .directive('mTimestamp', [ '$rootScope', function($rootScope) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    value: '@'
                },
                link: function($scope, element, attrs) {
                    $scope.longDate = JSON.parse(
                        localStorage.getItem('longDate') || false);

                    $scope.$on('mTimestamp.toggle', function() {
                        $scope.longDate = !$scope.longDate;
                    });

                    $scope.toggle = function() {
                        localStorage.setItem('longDate', !$scope.longDate);
                        $rootScope.$broadcast('mTimestamp.toggle');
                    };
                },
                templateUrl: 'scripts/directives/mesos/timestamp.html'
            };
        }])
        .directive('mTable', ['$compile', '$filter', function($compile, $filter) {
            /* This directive does not have a template. The DOM doesn't like
             * having partially defined tables and so they don't work well with
             * directives and templates. Because of this, the sub-elements that this
             * includes are their own directive/templates and it adds them via. DOM
             * manipulation here.
             */
            return {
                scope: true,
                link: function(scope, element, attrs) {
                    var defaultOrder = true;

                    _.extend(scope, {
                        originalData: [],
                        columnKey: '',
                        sortOrder: defaultOrder,
                        pgNum: 1,
                        pageLength: 50,
                        filterTerm: '',
                        headerTitle: attrs.title
                    });
                    // ---

                    // --- Allow sorting by column based on the <th> data-key attr
                    var th = element.find('th');
                    th.attr('ng-click', 'sortColumn($event)');
                    $compile(th)(scope);

                    var setSorting = function(el) {
                        var key = el.attr('data-key');

                        if (scope.columnKey === key) {
                            scope.sortOrder = !scope.sortOrder;
                        }
                        else { scope.sortOrder = defaultOrder; }

                        scope.columnKey = key;

                        th.removeClass('descending ascending');
                        el.addClass(scope.sortOrder ? 'descending' : 'ascending');
                    };

                    var defaultSortColumn = function() {
                        var el = element.find('[data-sort]');
                        if (el.length === 0) {
                            el = element.find('th:first');
                        }
                        return el;
                    };

                    scope.sortColumn = function(ev) {
                        setSorting(angular.element(ev.target));
                    };

                    setSorting(defaultSortColumn());
                    // ---

                    scope.$watch(attrs.tableContent, function(data) {
                        if (!data) { scope.originalData = []; return; }
                        if (angular.isObject(data)) { data = _.values(data); }

                        scope.originalData = data;
                    });

                    var setTableData = function() {
                        scope.filteredData = $filter('filter')(scope.originalData, scope.filterTerm);
                        scope.$data = $filter('orderBy')(
                            scope.filteredData,
                            scope.columnKey,
                            scope.sortOrder).slice(
                            (scope.pgNum - 1) * scope.pageLength,
                            scope.pgNum * scope.pageLength);
                    };

                    // Reset the page number for each new filtering.
                    scope.$watch('filterTerm', function() { scope.pgNum = 1; });

                    _.each(['originalData', 'columnKey', 'sortOrder', 'pgNum', 'filterTerm'],
                        function(k) { scope.$watch(k, setTableData); });

                    // --- Pagination controls
                    var elin = angular.element('<div m-pagination></div>');
                    $compile(elin)(scope);
                    element.after(elin);
                    // ---

                    // --- Filtering
                    elin = angular.element('<div m-table-header></div>');
                    $compile(elin)(scope);
                    element.before(elin);
                    // ---
                }
            };
        }]);






})();