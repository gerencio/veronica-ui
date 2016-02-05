(function() {
    'use strict';

    var mesosApp = angular.module('veronicaApp');
    mesosApp.directive('pailer', [ '$resources',
        function ($resources) {

            return {
                restrict: 'E',
                templateUrl: 'views/pages/mesos/pailerBox.html',
                scope: {
                    host: '@',
                    path: '@'
                },
                link : function($scope) {

                    var callShowData = null;

                    var click = function () {
                        if (angular.isDefined(callShowData)) {
                            $interval.cancel(callShowData);
                            callShowData = undefined;
                        }
                    };

                    //todo desenvolver paginação itens
                    //todo analisar casos quando o len é maior que o tamanho fixo e arrumar dos dois lados
                    var fixLength = 10000;

                    var showData = function($resources) {
                        return $resources
                            .logResourceLength($scope.host,$scope.path)
                            .then(function (data) {
                                var offset = 0;
                                var len = data.offset;

                                if (data.offset - fixLength > 0){
                                    offset = data.offset - fixLength;
                                    len = fixLength;
                                }

                                return $resources.logResource($scope.host,$scope.path, offset, len);
                            })
                            .then(function (data) {
                                $scope.messages = data.data.split('\n').reverse();
                            });
                    };

                    showData($resources);
                    //callShowData = $interval(showData, 1000);

                }
            };

        }
    ])

})();