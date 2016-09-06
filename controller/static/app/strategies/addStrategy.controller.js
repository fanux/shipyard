(function(){
    'use strict';
    var url = "http://192.168.96.99:8081"
    angular
        .module('shipyard.plugins')
        .controller('StrategyAddController', StrategyAddController);

    StrategyAddController.$inject = ['$http', '$state', '$base64','$stateParams'];
    function StrategyAddController($http, $state,$base64,$stateParams) {
        var vm = this;
        vm.error = "";
        vm.request = {};
        vm.addStrategy = addStrategy;
        vm.name='';
        vm.PluginName = $stateParams.id;
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
                PluginName: vm.PluginName,
                Status: vm.status,
                Document: vm.document,
            }
            $http
                .post(url+'/plugins/'+vm.PluginName+'/strategies', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.strategies',{id: vm.PluginName});
                    //$state.go('http://192.168.86.170:8888/#/plugins/'+vm.PluginName+'/strategies');
                })
                .error(function(data, status, headers, config) {
                    vm.error = data;
                });
        }
    }
})();
