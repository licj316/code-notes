//字符串截取后面加入...
String.prototype.interceptString = function(len) {
	if (this.length > len) {
		return this.substring(0, len) + "...";
	} else {
		return this;
	}
}
// 判断元素是否在数组中
Array.prototype.contains = function (obj) {
	for (var i = 0; i < this.length; i++) {
		if (obj == this[i]) {
			return true;
		}
	}
	return false;
}
//创建的对象全局存储
var appObj = {};
function getAppObj(id){
	return appObj[id];
}
//数字转换为千分位
function number2Thousands(input) {
	var n = parseFloat(input).toFixed(2);
	var re = /(\d{1,3})(?=(\d{3})+(?:\.))/g;
	return n.replace(re, "$1,");
}
//bootstrap datepicker中文语言配置
var datePickerLocale = {
		applyLabel : '确定',
		cancelLabel : '清空',
		fromLabel : '从',
		toLabel : '到',
		customRangeLabel : '自定义',
		daysOfWeek : ['日', '一', '二', '三', '四', '五', '六'],
		monthNames : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		firstDay : 1
	};

//全选方法
function checkAllRows(_this, childInputName){
	var me = _this;
	if(me.checked){
		$("input[name='" + childInputName + "']").each(function(i, n){
			if(!this.checked){
				$(this).click();
			}
		});
	}else{
		$("input[name='" + childInputName + "']").each(function(i, n){
			if(this.checked){
				$(this).click();
			}
		});
	}
}

//单元格渲染方法
function cellRenderer(item, columnName, formatType, formatStr){
	if(isEmptyString(item[columnName])){
		return '';
	}else{
		if(formatType == "date"){
			return dateFormat(item[columnName], formatStr || "yyyy-MM-dd");
		}else if(formatType == "int"){
			
		}else if(formatType == "float"){
			
		}else if(formatType == "thousands"){
			return number2Thousands(item[columnName]);
		}else if(formatType == "dict"){
			return arrayFilter(formatStr, "id", item[columnName]).value;
		}else if(formatType == "ellipsis"){
			return '<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' + formatStr + '" title="'+ item[columnName] +'">'+ item[columnName] +'</div>';
		}else{
			return item[columnName];
		}
	}
}
//判断是否为空字符串
function isEmptyString(str){
	if(str !== null && str !== undefined && str !== ""){
		return false;
	}else{
		return true;
	}
}
//对象数组过滤方法
function arrayFilter(arrayObj, filterKey, filterVal){
	if(isEmptyString(filterKey) || isEmptyString(filterVal)){
		return "";
	}
	var obj;
	$.each(arrayObj, function(i, n){
		if(n[filterKey] == filterVal){
			obj = n;
		}
	});
	return obj;
}
//js方式表单提交
function formSubmit(url, obj) {
	var form = $('<form style="display:none;"></form>');
	form.attr('action', url);
	form.attr('method', 'post');
	form.attr('target', '_self');
	for(var key in obj){
		var input = $('<input type="text" name="' + key + '" />');
		input.attr("value", obj[key]);
		form.append(input);
	};
	form.appendTo(document.body);
	form.submit();
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

//将一个js对象转为datatables支持的数组参数对象
function convertObject2ParamArray(paramObj){
	var paramArr = [];
	for(var key in paramObj){
		if(paramObj[key] != "undefined" && typeof paramObj[key] != "function"){
			paramArr.push({"name":key, "value" : paramObj[key]});
		}
	}
	return paramArr;
}
//数据转换，convertStr : 转换字符串，dict：转换遵循的数据字典，dictAttr1：要转换属性，dictAttr2：转换为的属性
//例：id1,id2,id3 转换为 name1,name2,name3
function convertSpliceStr(convertStr, dict, dictAttr1, dictAttr2){
	var beforeArr = [];
	var afterArr = [];
	if(convertStr != null){
		beforeArr = convertStr.split(",");
		for(var i = 0; i < beforeArr.length; i++){
			afterArr.push(arrayFilter(dict, dictAttr1, beforeArr[i])[dictAttr2]);
		}
	}
	return afterArr.join(",");
}
//更新参数中日期区间参数为SQL中可用的参数
function convertParamsRangeDate(params, convertFieldArr){
	var tempObj = {};
	for(var i = 0; i < convertFieldArr.length;i ++){
		if(params[convertFieldArr[i]] && params[convertFieldArr[i]] != ""){
			var dateArr = params[convertFieldArr[i]].split("~");
			params[convertFieldArr[i] + "Start"] = $.trim(dateArr[0]);
			params[convertFieldArr[i] + "End"] = $.trim(dateArr[1]);
		}
	}
}
//是否存在指定函数 
function isExitsFunction(funcName) {
	try {
		if (typeof (eval(funcName)) == "function") {
			return true;
		}
	} catch (e) {
	}
	return false;
}
// 将数组中连续数字并为数组
function arrange(source) {
	var t;
	var ta;
	var r = [];
	source.forEach(function (v) {
		console.log(t, v); // 跟踪调试用
		if (t === v) {
			ta.push(t);
			t++;
			return;
		}

		ta = [v];
		t = v + 1;
		r.push(ta);
	});
	return r;
}
//校验字符串中是否有大于多少位的连续数字
function checkStrSequenceNumber(numStr, length){
	var count = 0;
	var currNum;
	var prevNum;
	var boo = false;
	for (var i = 0 ; i < numStr.length;i++){
		if(!isNaN(numStr.charAt(i))){
			if(count == 0){
				count = 1;
				prevNum = parseInt(numStr.charAt(i));
			}else{
				currNum = parseInt(numStr.charAt(i));
				if(currNum == prevNum + 1){
					prevNum = currNum;
					count = count + 1;
				}else{
					prevNum = currNum;
					count = 1;
				}
			}
		}else{
			count = 0;
		}
		if(count >= length){
			boo = true;
			break;
		}
	}
	return boo;
}
//检查是否符合金额格式
function checkMoneyFormat(val){
	var reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
	return reg.test(val);
}
//检查是否为正整数
function checkIsPositiveInteger(val){
	var reg = /^[1-9]{1}[0-9]{0,3}$/;
	return reg.test(val);
}
//jqueryUI自动完成，通用代码
function autoCompleteSelect(config){
	$("#" + config.displayInputId).autocomplete({
		source: function(request, response){
			var term = request.term;
			var params = [];
			params.push({name:"iDisplayLength", value: (config.length || 10)});
			params.push({name:"iDisplayStart", value: 1});
			params.push({name:"queryMapper", value: config.queryMapper});
			params.push({name:"term", value: term});
			$.ajax({
				type: "POST",
				url: s_contractservice + "/table/getTableData",
				data: $.toJSON(params),
				contentType: 'application/json',
				success: function(res){
					if(res.aaData.length > 0){
						var data = $.map(res.aaData, function (n) {
							return $.extend(n, {
								value : n[config.displayField]
							});
						});
						response(data);
					}else{
						response([]);
					}
				}
			});
		},
		minLength: 0,
		delay: 200,
		select: function(event, ui){
			if(config.onSelect){
				config.onSelect(event, ui, this);
			}else{
				$("#" + config.hiddenInputId).val(ui['item'][config.valueField]);
			}
		},
		autoFocus: false
	}).focus(function () {
		$(this).autocomplete("search");
	});
}