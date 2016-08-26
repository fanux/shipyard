(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .config(getRoutes);

    getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function getRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard.plugins', {
                url: '^/plugins',
                templateUrl: 'app/plugins/plugins.html',
                controller: 'pluginsController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('dashboard.addPlugin', {
                url: '^/plugins/add',
                templateUrl: 'app/plugins/addplugin.html',
                controller: 'PluginAddController',
                controllerAs: 'vm',
                authenticate: true
            });
    }
})();
