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
                templateUrl: 'app/plugins/addPlugin.html',
                controller: 'PluginAddController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('dashboard.pdetail', {
                url: '^/plugins/{id}',
                templateUrl: 'app/plugins/pdetail.html',
                controller: 'PluginController',
                controllerAs: 'vm',
                authenticate: true,
                resolve: {
                    resolvedPlugin: ['PluginService', '$state', '$stateParams', function(PluginService, $state, $stateParams) {
                        return PluginService.inspect($stateParams.id).then(null, function(errorData) {
                            $state.go('error');
                        });
                    }]
                }
            });
    }
})();
