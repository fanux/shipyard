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
        vm.jsonDocument=jsonDocument;
	}
            
    function jsonDocument(obj){
        try {
         var res= new Function("return " + obj + ";")();
        } catch (e) {
          var res={"error": "类型异常,请修改!!!"};
        } 
        var out = JSON.stringify(res, null, 4);
        return out;
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
