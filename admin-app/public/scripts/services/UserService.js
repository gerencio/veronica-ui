angular.module('dashyAngular').factory('UserService',
    function($http) {
        return {
            'getPicture': function () {

                var promise = $http.get('/user/picture');
                return promise;
            },
            'getProfile': function () {

                var promise = $http.get('/user/json');
                return promise;
            }
        }
    }







);
