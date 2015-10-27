(function () {
    'use strict';

    /**
     * @ngdoc function
     * @name dashyAngular.controller:HomeCtrl
     * @description
     * # HomeCtrl
     * Controller of dashyAngular
     */
    angular.module('dashyAngular')
        .controller('HomeCtrl', function($scope, $location) {

            var vm = this;

            vm.user = {};

            vm.userFields = [
                {
                    key: 'escolha',
                    type: 'select',
                    templateOptions: {
                        label: 'Escolha abaixo:',
                        placeholder: 'Escolha',
                        valueProp: 'value',
                        options: [
                            {
                                name: 'Opção 1',
                                value: 1
                            },
                            {
                                name: 'Opção 2',
                                value: 2
                            },
                            {
                                name: 'Opção 3',
                                value: 3
                            }
                        ]
                    }
                },
                {
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Email address',
                        placeholder: 'Enter email'
                    }
                },
                {
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'Password'
                    }
                },
                {
                    key: 'checked',
                    type: 'checkbox',
                    templateOptions: {
                        label: 'Check me out'
                    }
                }
            ];


        });

})();

