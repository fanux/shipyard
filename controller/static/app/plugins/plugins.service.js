(function(){
    'use strict';
    var url = 'http://localhost:8081'; 
    angular
        .module('shipyard.plugins')
        .factory('PluginService', PluginService)

        PluginService.$inject = ['$http', '$rootScope'];
    function PluginService($http, $rootScope) {
        url = $rootScope.url
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
                    .put(url + '/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(pluginId,plugin) {
                plugin.Status='disable';
                var promise = $http
                    .put(url + '/plugins/' + pluginId,plugin)
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
            edit: function(plugin) {
                var promise = $http
                    .put(url + '/plugins/' + plugin.Name,plugin)
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
