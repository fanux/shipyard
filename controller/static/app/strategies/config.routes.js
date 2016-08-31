(function(){
    'use strict';

    angular
        .module('shipyard.strategies')
        .config(getRoutes);

    getRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function getRoutes($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard.strategies', {
                url: '^/strategies',
                templateUrl: 'app/strategies/strategies.html',
                controller: 'strategiesController',
                controllerAs: 'vm',
                authenticate: true
            })
            .state('dashboard.addStrategy', {
                url: '^/strategies/add',
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
