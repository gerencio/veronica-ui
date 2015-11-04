(function () {
    'use strict';

    /**
    * @ngdoc home
    * @name dashyAngular
    * @description
    * # dashyAngular
    *
    * Main module of the application.
    */
    window.app_version = 2;

    angular
    .module('dashyAngular', [
        'ui.router',
        'ngAnimate',
        'ui.bootstrap',
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

            $urlRouterProvider.when('/dashboard', '/dashboard/home');
            $urlRouterProvider.otherwise('/dashboard');
            $stateProvider

                .state('plain', {
                    abstract: true,
                    url: '',
                    templateUrl: 'views/layouts/plain.html?v='+window.app_version,
                })
                .state('boxed', {
                    abstract: true,
                    url: '',
                    parent: 'plain',
                    templateUrl: 'views/layouts/boxed.html?v='+window.app_version,
                })

                .state('login', {
                    url: '/login',
                    parent: 'boxed',
                    templateUrl: 'views/pages/login.html?v='+window.app_version,
                    controller: 'LoginCtrl'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    parent: 'plain',
                    templateUrl: 'views/layouts/dashboard.html?v='+window.app_version,
                    controller: 'DashboardCtrl'
                })
                .state('home', {
                    url: '/home',
                    parent: 'dashboard',
                    templateUrl: 'views/pages/dashboard/home.html?v='+window.app_version,
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                })
                .state('mesos', {
                    url: '/mesos',
                    parent: 'dashboard',
                    templateUrl: 'views/pages/mesos/home.html?v='+window.app_version,
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
                if (_.isNaN(i)) { return '' };
                return $filter('date')(i, 'yyyy-MM-ddTH:mm:ssZ');
            };
        })
        .filter('relativeDate', function() {
            return function(date, refDate) {
                var i = parseInt(date, 10);
                if (_.isNaN(i)) { return '' };
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
                if ((new Date(date)).getFullYear() == (new Date()).getFullYear()) {
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
                if (bytes == null || isNaN(bytes)) {
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
        });

})();