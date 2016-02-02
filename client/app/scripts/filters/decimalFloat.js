(function() {
    'use strict';

    var mesosFilter = angular.module('mesos.filters', []);

    // Add a filter to convert small float number to decimal string
    mesosFilter.filter('decimalFloat', function() {
        return function(num) {
            return parseFloat(num.toFixed(4)).toString();
        }
    });

})();