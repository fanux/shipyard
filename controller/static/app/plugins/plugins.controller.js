(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .controller('pluginsController', PluginsController);

    PluginsController.$inject = ['$scope', 'PluginService', '$state'];
    function PluginsController($scope, PluginService, $state) {
        var vm = this;
        vm.error = "";
        vm.errors = [];
        vm.plugins = [];
        vm.selected = {};
        vm.selectedItemCount = 0;
        vm.selectedAll = false;
        vm.numOfInstances = 1;
        vm.selectedPlugin = null;
        vm.selectedPluginId = "";
        vm.Kind = "";
        vm.Description = "";
        vm.Spec = "";
        vm.Manual = "";

        vm.showDeletePluginDialog = showDeletePluginDialog;
        vm.showEnablePluginDialog = showEnablePluginDialog;
        vm.showDisablePluginDialog = showDisablePluginDialog;
        vm.showEditPluginDialog = showEditPluginDialog;
        vm.enablePlugin = enablePlugin;
        vm.disablePlugin = disablePlugin;
        vm.deletePlugin = deletePlugin;
        vm.editPlugin = editPlugin;
        vm.refresh = refresh;
        vm.pluginStatusText = pluginStatusText;
        vm.checkAll = checkAll;
        vm.clearAll = clearAll;
        vm.destroyAll = destroyAll;
        vm.stopAll = stopAll;
        vm.restartAll = restartAll;

        refresh();

        // Apply jQuery to dropdowns in table once ngRepeat has finished rendering
        $scope.$on('ngRepeatFinished', function() {
            $('.ui.sortable.celled.table').tablesort();
            $('#select-all-table-header').unbind();
            $('.ui.right.pointing.dropdown').dropdown();
        });

        $('#multi-action-menu').sidebar({dimPage: false, animation: 'overlay', transition: 'overlay'});

        $scope.$watch(function() {
            var count = 0;
            angular.forEach(vm.selected, function (s) {
                if(s.Selected) {
                    count += 1;
                }
            });
            vm.selectedItemCount = count;
        });

        // Remove selected items that are no longer visible 
/*        $scope.$watchCollection('filteredPlugins', function () {
            angular.forEach(vm.selected, function(s) {
                if(vm.selected[s.Id].Selected == true) {
                    var isVisible = false
                    angular.forEach($scope.filteredPlugins, function(c) {
                        if(c.Id == s.Id) {
                            isVisible = true;
                            return;
                        }
                    });
                    vm.selected[s.Id].Selected = isVisible;
                }
            });
            return;
        });*/

        function clearAll() {
            angular.forEach(vm.selected, function (s) {
                vm.selected[s.Id].Selected = false;
            });
        }

        function restartAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    PluginService.restart(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function stopAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    PluginService.stop(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function destroyAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    PluginService.destroy(s.Id)
                        .then(function(data) {
                            delete vm.selected[s.Id];
                            vm.refresh();
                        }, function(data) {
                            vm.error = data;
                        });
                }
            });
        }

        function checkAll() {
            angular.forEach($scope.filteredPlugins, function (plugin) {
                vm.selected[plugin.Id].Selected = vm.selectedAll;
            });
        }

        function refresh() {
            PluginService.list()
                .then(function(data) {
                    vm.plugins = data; 
                    console.log(data);
                    angular.forEach(vm.plugins, function (plugin) {
                        vm.selected[plugin.Id] = {Id: plugin.Name, Selected: vm.selectedAll};
                    });
                }, function(data) {
                    vm.error = data;
                });

            vm.error = "";
            vm.errors = [];
            vm.plugins = [];
            vm.selected = {};
            vm.selectedItemCount = 0;
            vm.selectedAll = false;
            vm.numOfInstances = 1;
            vm.selectedPluginId = "";
        }

        function showDeletePluginDialog(plugin) {
            vm.selectedPluginId = plugin.Name;
            $('#delete-modal').modal('show');
        }

        function showEnablePluginDialog(plugin) {
            vm.selectedPlugin = plugin;
            vm.selectedPluginId = plugin.Name;
            $('#enable-modal').modal('show');
        }

        function showDisablePluginDialog(plugin) {
            vm.selectedPlugin = plugin;
            vm.selectedPluginId = plugin.Name;
            $('#disable-modal').modal('show');
        }


        function showEditPluginDialog(plugin) {
            vm.selectedPlugin = plugin;
            vm.selectedPluginId = plugin.Name;
            $('#edit-modal').modal('show');
        }


        function enablePlugin(plugin) {
            PluginService.enable(vm.selectedPluginId,plugin)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function disablePlugin(plugin) {
            PluginService.disable(vm.selectedPluginId,plugin)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function editPlugin(plugin) {
            PluginService.edit(plugin,vm.Kind,vm.Description,vm.Spec,vm.Manual)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
                vm.Kind = "";
                vm.Description = "";
                vm.Spec = "";
                vm.Manual = "";
        }

        function deletePlugin() {
            PluginService.delete(vm.selectedPluginId)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function pluginStatusText(plugin) {
            if(plugin.Status.indexOf("enable")==0){
                if (plugin.Status.indexOf("(disable)") != -1) {
                    return "disable";
                }
                return "enable";
            }
        }   
        
    }
})();
