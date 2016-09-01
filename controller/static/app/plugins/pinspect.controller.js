(function(){
	'use strict';
	
    angular
        .module('shipyard.plugins')
        .controller('PluginController', PluginController);

	PluginController.$inject = ['resolvedPlugin', 'PluginService', '$state'];
	function PluginController(resolvedPlugin, PluginService, $state) {
        var vm = this;
        vm.plugin = resolvedPlugin;
        vm.pluginStatusText=pluginStatusText;
	}
    function pluginStatusText(plugin) {
        if(plugin.Status.indexOf("enable")==0){
            if (plugin.Status.indexOf("(disable)") != -1) {
                return "disable";
            }
            return "enable";
        }
    }
})();
