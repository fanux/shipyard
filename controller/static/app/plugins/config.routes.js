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
            })
            .state('dashboard.strategies', {
                url: '^/plugins/{id}/strategies',
                templateUrl: 'app/strategies/strategies.html',
                controller: 'strategiesController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('dashboard.addStrategy', {
                url: '^/plugins/{id}/strategies',
                templateUrl: 'app/strategies/addStrategy.html',
                controller: 'StrategyAddController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('dashboard.sdetail', {
                url: '^/strategies/{id}',
                templateUrl: 'app/strategies/sdetail.html',
                controller: 'StrategyController',
                controllerAs: 'vm',
                authenticate: true,
                resolve: {
                    resolvedStrategy: ['StrategyService', '$state', '$stateParams', function(StrategyService, $state, $stateParams) {
                        return StrategyService.inspect($stateParams.id).then(null, function(errorData) {
                            $state.go('error');
                        });
                    }]
                }
            });
    }
})();
