(function(){
	'use strict';
	
    angular
        .module('shipyard.plugins')
        .controller('StrategyController', StrategyController);

	StrategyController.$inject = ['resolvedStrategy', 'StrategyService', '$state'];
	function StrategyController(resolvedStrategy, StrategyService, $state) {
        var vm = this;
        vm.strategy = resolvedStrategy;
        vm.StrategyStatusText = StrategyStatusText;
	}
    function StrategyStatusText(strategy) {
        if(strategy.Status.indexOf("enable")==0){
            if (strategy.Status.indexOf("(disable)") != -1) {
                return "disable";
            }
            return "enable";
        }
    }
})();
