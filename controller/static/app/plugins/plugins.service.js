(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .factory('PluginService', PluginService)

        PluginService.$inject = ['$http'];
    function PluginService($http) {
        return {
            list: function() {
                var promise = $http
                    .get('/json/plugins.json')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            enable: function(pluginId,plugin) {
                plugin.Status='enable';
                var promise = $http
                    .post('/json/plugins.json' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(pluginId,plugin) {
                plugin.Status='disable';
                var promise = $http
                    .post('/json/plugins.json' + pluginId,plugin)
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
            edit: function(plugin,newKind,newDescription,newSpec,newManual) {
                plugin.Kind = newKind;
                plugin.Description = newDescription;
                plugin.Spec = newSpec;
                plugin.Manual = newManual;
                var promise = $http
                    .post('/json/plugins.json',plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            inspect: function(pluginId) {
                var promise = $http
                    .get('/json/time.json')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
        } 
    }


})();
