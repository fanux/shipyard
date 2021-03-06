(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .controller('PluginAddController', PluginAddController);

    PluginAddController.$inject = ['$http', '$state', '$rootScope'];
    function PluginAddController($http, $state, $rootScope) {
        var vm = this;
        vm.error = "";
        vm.request = {};
        vm.addPlugin = addPlugin;
        vm.name = "";
        vm.kind="";
        vm.status="disable"
        vm.description=""
        vm.spec=""
        vm.maual=""
        vm.request = null;

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function addPlugin() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                name: vm.name,
                kind: vm.kind,
                status: vm.status,
                description: vm.description,
                spec: vm.spec,
                manual: vm.maual,
            }
            $http
                .post($rootScope.url + '/plugins', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.plugins');
                })
                .error(function(data, status, headers, config) {
                    vm.error = data;
                });
        }
    }
})();
