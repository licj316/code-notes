#方法说明

##通用分页加载数据
1. 使用方式如下
   ~~~javascript
   var params = [];
   params.push({name:"queryMapper", value:"com.licj.common.dao.TableDao.getData"});
   $.ajax({
   	type: "POST",
   	url: "/table/getTableData",
   	data: JSON.stringify(params),
   	contentType: 'application/json',
   	dataType: 'json',
   	success: function(json) {
   		console.info(json);
   	}
   });
   ~~~

##通用的Excel导出
1. 页面上以如下方式调用

   ~~~javascript
   exportExcel({
   	excelName: "Excel导出数据",//导出的表格名称
   	columnsConfig: [//表格标题栏和sql中列名对应配置
   		{header: "xxx1", field: "xxxa"},
   		{header: "xxx2", field: "xxxb"},
   		{header: "xxx3", field: "xxxc"},
   		{header: "xxx4", field: "xxxd"},
   	],
   	columnsTransfer: [{
   			name: "xxxb",//需要转换的属性，比如把xxxb以数据字典规则把id转换为对应的name
   			dict: dict.b,//转换的数据字典，如[{"id":"a","value":"1"},{"id":"b","value":"2"}]
   			fromAttr: "attrA",//转换前在数据字典中对应的属性
   			toAttr: "attrB"//转换后在数据字典中对应的属性
   		}
   	],
   	params: searchParams,//传给SQL的参数
   	queryMapper: "com.licj.common.dao.TableDao.getData"//mybatis中对应的查询sql的完整路径。
   });
   ~~~

2. exportExcel代码

   ~~~javascript
   //导出Excel
   function exportExcel(config){
   	var defaults = {
   			excelName: "导出数据",
   			columnsConfig: [],
   			columnsTransfer: [],
   			params: {},
   			queryMapper: {}
   		};
   	
   	var settings = $.extend({}, defaults, config);
   	exportFormSubmit(s_contractservice + "/table/exportExcel/", {exportConfig: JSON.stringify(settings)});
   }

   //js方式表单提交,导出/下载 文件
   function exportFormSubmit(url, obj) {
   	//debugger;
   	$("#downloadIframe").remove();
   	$("#downloadForm").remove();
   	var iframe = $('<iframe id="downloadIframe" name="downloadIframe" height="0px" width="0px"></iframe>');
   	var form = $('<form id="downloadForm" style="display:none;"></form>');
   	form.attr('action', url);
   	form.attr('method', 'post');
   	form.attr('target', 'downloadIframe');
   	for(var key in obj){
   		var input = $('<input type="text" name="' + key + '" />');
   		input.attr("value", obj[key]);
   		form.append(input);
   	}
   	iframe.appendTo(document.body);
   	form.appendTo(document.body);
   	form.submit();
   }
   ~~~

   ​