(function(){
    'use strict';
    var url = 'http://192.168.96.99:8081'
    angular
        .module('shipyard.plugins')
        .factory('StrategyService', StrategyService)

        StrategyService.$inject = ['$http'];
    function StrategyService($http) {
        return {
            list: function(pluginId) {
                var promise = $http
                    .get(url+'/plugins/'+pluginId+'/strategies')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            enable: function(strategy) {
                strategy.Status='enable';
                var promise = $http
                    .put(url+'/plugins/'+strategy.PluginName+'/strategies/' + strategy.Name,strategy)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(strategy) {
                strategy.Status='disable';
                var promise = $http
                    .put(url+'/plugins/'+strategy.PluginName+'/strategies/' + strategy.Name,strategy)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            delete: function(strategy) {
                var promise = $http
                    .delete(url+'/plugins/'+strategy.PluginName+'/strategies/' + strategy.Name,strategy)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            edit: function(strategy) {
                var promise = $http
                    .put(url+'/plugins/'+strategy.PluginName+'/strategies/' + strategy.Name,strategy)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            inspect: function(PluginName,strategy) {
                var promise = $http
                    .get(url+'/plugins/'+PluginName+'/strategies/'+strategy)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
        } 
    }


})();
