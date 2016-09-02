(function(){
    'use strict';

    angular
        .module('shipyard.plugins')
        .controller('strategiesController', StrategiesController);

    StrategiesController.$inject = ['$scope', 'StrategyService', '$state','$stateParams'];
    function StrategiesController($scope, StrategyService, $state,$stateParams) {
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
        vm.Name = "";
        vm.PluginName = $stateParams.id;
        vm.Status = "";
        vm.Document = "";
        vm.jsonDocument=jsonDocument;
        
        vm.showDeletePluginDialog = showDeletePluginDialog;
        vm.showEnablePluginDialog = showEnablePluginDialog;
        vm.showDisablePluginDialog = showDisablePluginDialog;
        vm.showEditStrategyDialog = showEditStrategyDialog;
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
        function jsonDocument(obj){
            try {
             var res= new Function("return " + obj + ";")();
            } catch (e) {
              var res={"error": "类型异常,请修改!!!"};
            } 
            var out = JSON.stringify(res, null, 4);
            return out;
        }
        function clearAll() {
            angular.forEach(vm.selected, function (s) {
                vm.selected[s.Id].Selected = false;
            });
        }

        function restartAll() {
            angular.forEach(vm.selected, function (s) {
                if(s.Selected == true) {
                    StrategyService.restart(s.Id)
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
                    StrategyService.stop(s.Id)
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
                    StrategyService.destroy(s.Id)
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
            StrategyService.list(vm.PluginName)
                .then(function(data) {
                    vm.plugins = data; 
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
            vm.selectedPlugin = plugin;
            vm.selectedPluginId = plugin.Name;
            $('#delete-modal').modal('show');
        }

        function showEnablePluginDialog(plugin) {
            vm.selectedPlugin = plugin;
            $('#enable-modal').modal('show');
        }

        function showDisablePluginDialog(plugin) {
            vm.selectedPlugin = plugin;
            $('#disable-modal').modal('show');
        }


        function showEditStrategyDialog(plugin) {
            vm.selectedPlugin = plugin;
            $('#edit-modal').modal('show');
        }


        function enablePlugin(strategy) {
            StrategyService.enable(strategy)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function disablePlugin(strategy) {
            StrategyService.disable(strategy)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function editPlugin(strategy) {
            StrategyService.edit(strategy)
                .then(function(data) {
                    vm.refresh();
                }, function(data) {
                    vm.error = data;
                });
        }

        function deletePlugin(plugin) {
            StrategyService.delete(plugin)
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
