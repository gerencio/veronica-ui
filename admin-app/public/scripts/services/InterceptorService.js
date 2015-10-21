angular.module('dashyAngular')
    .factory('xDevInterceptor', function($location,$q){
        return {
            // optional method
            'request': function(config) {
                // do something on success
                return config;
            },

            // optional method
            'requestError': function(rejection) {
                // do something on error
                if (rejection.status == 401) {
                    $location.path('/login');
                }

                //if (canRecover(rejection)) {
                //    return responseOrNewPromise
                //}
                return $q.reject(rejection);
            },

            // optional method
            'response': function(response) {
                // do something on success
                return response;
            },

            // optional method
            'responseError': function(rejection) {
                // do something on error
                //if (canRecover(rejection)) {
                //    return responseOrNewPromise
                //}
                if (rejection.status == 401) {
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        };
    });