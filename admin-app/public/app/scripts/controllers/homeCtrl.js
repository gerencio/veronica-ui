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
                    template: '<hr />'
                },
                {
                    key: 'email',
                    type: 'input',
                    templateOptions: {
                        type: 'email',
                        label: 'Seu email',
                        placeholder: 'jonh@email.com'
                    }
                },
                {
                    key: 'password',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Senha',
                        placeholder: 'Senha'
                    }
                },
                {
                    key: 'checked',
                    type: 'checkbox',
                    templateOptions: {
                        label: 'Estou de bom humor'
                    }
                },
                {
                    type: "textarea",
                    key: "about",
                    templateOptions: {
                        label: "No que está pensando?",
                        placeholder: "em um hotdog...",
                        rows: 4,
                        cols: 15
                    },
                    expressionProperties: {
                        'templateOptions.disabled': '!model.checked'
                    }
                }
            ];

            vm.addInput = function(){
                vm.userFields.push({
                    key: 'new',
                    type: 'input',
                    templateOptions: {
                        type: 'text',
                        label: 'Novo input',
                        placeholder: 'Surpresa!!!'
                    }
                });
            }

        });

})();

