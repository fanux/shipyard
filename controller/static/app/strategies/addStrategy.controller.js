(function(){
    'use strict';

    angular
        .module('shipyard.strategies')
        .controller('StrategyAddController', StrategyAddController);

    StrategyAddController.$inject = ['$http', '$state', '$base64'];
    function StrategyAddController($http, $state) {
        var vm = this;
        vm.error = "";
        vm.request = {};
        vm.addStrategy = addStrategy;
        vm.name='';
        vm.pluginname='';
        vm.status='enable';
        vm.document='[{"Cron":"*/1 * * * * *","Apps":[{"App":"ats","Number":20},{"App":"hadoop:latest","Number":10},]}]';
        vm.request = null;

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function addStrategy() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                Name: vm.name,
                PluginName: vm.pluginname,
                Status: vm.status,
                Document: vm.document,
            }
            $http
                .post('/strategies', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.strategies');
                })
                .error(function(data, status, headers, config) {
                    vm.error = data;
                });
        }
    }
})();
