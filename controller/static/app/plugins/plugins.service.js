(function(){
    'use strict';
    var url = 'http://192.168.96.99:8081'; 
    angular
        .module('shipyard.plugins')
        .factory('PluginService', PluginService)

        PluginService.$inject = ['$http'];
    function PluginService($http) {
        return {
            list: function() {
                var promise = $http
                    .get(url + '/plugins')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            enable: function(pluginId,plugin) {
                plugin.Status='enable';
                var promise = $http
                    .post(url + '/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(pluginId,plugin) {
                plugin.Status='disable';
                var promise = $http
                    .post(url + '/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            delete: function(pluginId) {
                var promise = $http
                    .delete(url + '/plugins/' + pluginId)
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
                    .post(url + '/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            inspect: function(pluginId) {
                var promise = $http
                    .get(url + '/plugins/' + pluginId)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
        } 
    }


})();
