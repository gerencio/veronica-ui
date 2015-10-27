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
        'formlyBootstrap'
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
        });

})();