(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');

    mesosApp.controller('MesosHomeCtrl', function($dialog, $scope,$misc , $pailer) {
        $scope.log = function($event) {
            if (!$scope.state.external_log_file && !$scope.state.log_dir) {
                $dialog.messageBox(
                    'Logging to a file is not enabled',
                    "Set the 'external_log_file' or 'log_dir' option if you wish to access the logs.",
                    [{label: 'Continue'}]
                ).open();
            } else {
                $pailer.messageBox(
                    'Logs',
                    null,
                    '/master/log'
                ).open();
            }
        };
    });

})();