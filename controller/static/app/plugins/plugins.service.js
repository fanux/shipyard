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
                    .get('http://192.168.86.170:5000/plugins')
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            enable: function(pluginId,plugin) {
                plugin.Status='enable';
                var promise = $http
                    .post('http://192.168.86.170:5000/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            disable: function(pluginId,plugin) {
                plugin.Status='disable';
                var promise = $http
                    .post('http://192.168.86.170:5000/plugins/' + pluginId,plugin)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            delete: function(pluginId) {
                var promise = $http
                    .delete('http://192.168.86.170:5000/plugins/' + pluginId)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            rename: function(old, newName) {
                var promise = $http
                    .post('/containers/' + old + '/rename?name=' + newName)
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
        } 
    }


})();
