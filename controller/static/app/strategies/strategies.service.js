(function(){
    'use strict';
    var url = 'http://192.168.96.99:8081'
    angular
        .module('shipyard.strategies')
        .factory('StrategyService', StrategyService)

        StrategyService.$inject = ['$http'];
    function StrategyService($http) {
        return {
            list: function() {
                var promise = $http
                    .get(url+'/strategies')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            enable: function(pluginId,plugin) {
                plugin.Status='enable';
                var promise = $http
                    .post(url+'/plugins/'+plugin.PluginName+'/strategies/'+plugin.Name,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(pluginId,plugin) {
                plugin.Status='disable';
                var promise = $http
                    .post(url+'/plugins/'+plugin.PluginName+'/strategies/'+plugin.Name,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            delete: function(pluginId) {
                var promise = $http
                    .delete('/json/plugins.json' + pluginId)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            edit: function(plugin,newName,newPluginName,newStatus,newDocument) {
                plugin.Name = newName;
                plugin.PluginName = newPluginName;
                plugin.Status = newStatus;
                plugin.Document = newDocument;
                var promise = $http
                    .post(url+'/plugins/'+plugin.PluginName+'/strategies',plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            inspect: function(pluginId) {
                var promise = $http
                    .get(url+'/plugins/'+plugin.PluginName+'/strategies',plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
        } 
    }


})();
