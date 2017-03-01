define(function(require, exports, module) {
	require('ztree/js/jquery.ztree.excheck.js')(jQuery);
	
	var setting = {
		check: {
			chkboxType: { "Y" : "s", "N" : "s" },
			enable: true
		},
		data: {
			key: {
				title: "title"
			},
			simpleData: {
				enable: true,
				idKey: "id",
				pIdKey: "pId"
			}
		}
	};
	
	var role
});