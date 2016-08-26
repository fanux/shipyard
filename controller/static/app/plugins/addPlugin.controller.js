(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .controller('PluginAddController', PluginAddController);

    PluginAddController.$inject = ['$http', '$state', '$base64'];
    function PluginAddController($http, $state) {
        var vm = this;
        vm.request = {};
        vm.addNode = addNode;
        vm.name = "";
        vm.addr = "";
        vm.request = null;

        function isValid() {
            return $('.ui.form').form('validate form');
        }

        function addNode() {
            if (!isValid()) {
                return;
            }
            vm.request = {
                name: vm.name,
                addr: vm.addr,
            }
            $http
                .post('/api/nodes', vm.request)
                .success(function(data, status, headers, config) {
                    $state.transitionTo('dashboard.nodes');
                })
                .error(function(data, status, headers, config) {
                    vm.error = data;
                });
        }
    }
})();
