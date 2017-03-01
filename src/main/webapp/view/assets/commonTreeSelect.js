define(function(require, exports, module) {
	require('ztree/js/jquery.ztree.core.js')(jQuery);
	require('ztree/js/jquery.ztree.excheck.js')(jQuery);
	var commonTreeSelect = function(config) {
		var selectTreeSetting = {
			check: {
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
		
		this.objId = config.id || config.hiddenInputId;
		this.label = config.label || "";
		this.url = config.url;
		this.params = config.params || {};
		this.hiddenInputId = config.hiddenInputId;
		this.displayInputId = config.displayInputId;
		this.width = config.width || 400;
		this.height = config.height || 600;
		this.config = config;
		this.selectTreeId=null;
		this.selectTree=null;
		this.selectTreeSetting = config.selectTreeSetting || selectTreeSetting;
		appObj[this.objId] = this;
		this.initSelectInput();
	}
	commonTreeSelect.prototype.initSelectInput = function() {
		var $me = this;
		$me.hiddenInputObj = getDomById(this.config.hiddenInputId);
		$me.displayInputObj = getDomById(this.config.displayInputId);
		if ($me.config.value) {
			$me.hiddenInputObj.value = config.value;
		}
		if ($me.config.displayValue) {
			$me.displayInputObj.value = config.displayValue;
		}
		jQuery(this.displayInputObj).attr({readOnly : true}).css({cursor : 'pointer'});
		this.displayInputObj.onclick = function() {
			$me.initSelectWindow();
		}
	}
	commonTreeSelect.prototype.initSelectWindow = function() {
		var $me = this;
		$me.objWindowId = "selectWindow_" + this.objId;
		var closeWindowIconId = "closeWindowIcon_" + this.objId;
		var openTreeBtnId = "openNode_" + this.objId;
		var closeTreeBtnId = "closeNode_" + this.objId;
		var selectAllBtnId = "selectAllBtn_" + this.objId;
		var deselectAllBtnId = "deselectAllBtn_" + this.objId;
		$me.selectTreeId = "tree_" + this.objId;
		var closeWindowBtnId = "closeWindowBtn_" + this.objId;
		var selectBtnId = "selectBtn_" + this.objId;
		var clearBtnId = "clearBtn_" + this.objId;
		if(this.isinitwindow==true){
			$me.showSelectWindow();
		}else{
			var container = document.body;
			var windowHtmlStr = [];
			windowHtmlStr.push('<div id="' + $me.objWindowId + '" class="modal hide" style="width:600px;left:40%;">');
			windowHtmlStr.push('	<div class="modal-header">');
			windowHtmlStr.push('		<button class="close" onclick="_close(\'#' + $me.objWindowId + '\')" type="button">&times;</button>');
			windowHtmlStr.push('		<h3>' + $me.label + '</h3>');
			windowHtmlStr.push('	</div>');
			windowHtmlStr.push('	<div class="modal-body" style="height: 480px;">');
			windowHtmlStr.push('		<div>');
			windowHtmlStr.push('			<a href="#" id="' + openTreeBtnId + '">全部展开</a>');
			windowHtmlStr.push('			&nbsp;&nbsp;');
			windowHtmlStr.push('			<a href="#" id="' + closeTreeBtnId + '">全部折叠</a>');
			windowHtmlStr.push('			&nbsp;&nbsp;');
			windowHtmlStr.push('			<a href="#" id="' + selectAllBtnId + '">全选</a>');
			windowHtmlStr.push('			&nbsp;&nbsp;');
			windowHtmlStr.push('			<a href="#" id="' + deselectAllBtnId + '">取消全选</a>');
			windowHtmlStr.push('			<br>');
			windowHtmlStr.push('			<div style="width:100%;height: 405px;overflow: auto;border: 1px solid #00CC33;">');
			windowHtmlStr.push('				<ul id="' + $me.selectTreeId + '" class="ztree"></ul>');
			windowHtmlStr.push('			</div>');
			windowHtmlStr.push('		</div>');
			windowHtmlStr.push('	</div>');
			windowHtmlStr.push('	<div class="modal-footer">');
			windowHtmlStr.push('		<button type="button" class="btn btn-primary" id="' + selectBtnId + '">选择</button>');
			windowHtmlStr.push('		<button type="button" class="btn btn-primary" id="' + clearBtnId + '">清空</button>');
			windowHtmlStr.push('		<button type="button" class="btn btn-default" onclick="_close(\'#' + $me.objWindowId + '\')">关闭</button>');
			windowHtmlStr.push('	</div>');
			windowHtmlStr.push('</div>');
			jQuery(container).append(windowHtmlStr.join(""));
			
			var openTreeBtn = getDomById(openTreeBtnId);
			openTreeBtn.onclick = function() {
				$me.openAllSelectTreeNodes();
			};
			var closeTreeBtn = getDomById(closeTreeBtnId);
			closeTreeBtn.onclick = function() {
				$me.closeAllSelectTreeNodes();
			};
			var selectBtn = getDomById(selectBtnId);
			selectBtn.onclick = function() {
				var checkedNodes = $me.selectTree.getCheckedNodes();
				if(checkedNodes.length == 0){
					alert("请勾选数据再提交！");
					return;
				}
				var idArr = [];
				var nameArr = [];
				for(var i = 0; i < checkedNodes.length; i++){
					if(checkedNodes[i].getCheckStatus().half == false){
						idArr.push(checkedNodes[i]['id']);
						nameArr.push(checkedNodes[i]['name']);
					}
				}
				//$me.hiddenInputObj.value = idArr.join(",");
				//$me.displayInputObj.value = nameArr.join(",");
				$($me.hiddenInputObj).val(idArr.join(",")).blur();
				$($me.displayInputObj).val(nameArr.join(",")).blur();
				_close("#" + $me.objWindowId);
			}
			var clearBtn = getDomById(clearBtnId);
			clearBtn.onclick = function() {
				$me.clearVal();
			}
			var selectAllBtn = getDomById(selectAllBtnId);
			selectAllBtn.onclick = function() {
				$me.selectTree.checkAllNodes(true);
			}
			var deselectAllBtn = getDomById(deselectAllBtnId);
			deselectAllBtn.onclick = function() {
				$me.selectTree.checkAllNodes(false);
			}
			$me.initSelectTree();
			$me.showSelectWindow();
			$me.isinitwindow=true;
		}
	}
	commonTreeSelect.prototype.initSelectTree = function(){
		var $me = this;
		if($me.selectTree != null){
			$.fn.zTree.destroy($me.selectTreeId);
		}
		
		var params = $me.params;
		$.ajax({
			type: "POST",
			url: $me.url,
			data: $.toJSON(params),
			contentType: 'application/json',
			success: function(res){
				if(res.status == "success"){
					var treeData = res.response;
					if($me.hiddenInputObj.value){
						var hiddenVal = $me.hiddenInputObj.value;
						var selectIdArr = hiddenVal.split(",");
						for(var index in treeData){
							if(selectIdArr.indexOf(treeData[index]["id"]) != -1){
								treeData[index]['checked'] = true;
							}
						}
					}
					$me.selectTree = $.fn.zTree.init($("#" + $me.selectTreeId), $me.selectTreeSetting, treeData);
					$me.openAllSelectTreeNodes();
				}else{
					alert("加载数据失败！");
				}
			}
		});
	}
	commonTreeSelect.prototype.showSelectWindow = function(){
		var treeWindow = $("#" + this.objWindowId);
		treeWindow.addClass("in");
		treeWindow.css("display", "block");
		treeWindow.attr("aria-hidden", false);
		$("body").append("<div class='modal-backdrop  in'></div>");
	}
	commonTreeSelect.prototype.closeSelectWindow = function(){
		var treeWindow = $("#" + this.objWindowId);
		treeWindow.removeClass("in");
		treeWindow.css("display", "none");
		treeWindow.attr("aria-hidden", true);
		$(".modal-backdrop").hide();
	}
	commonTreeSelect.prototype.clearVal = function(){
		var $me = this;
		$($me.hiddenInputObj).val("").blur();
		$($me.displayInputObj).val("").blur();
		$me.selectTree.checkAllNodes(false);
		$me.closeSelectWindow();
	}
	commonTreeSelect.prototype.openAllSelectTreeNodes = function(){
		this.selectTree.expandAll(true);
	}
	commonTreeSelect.prototype.closeAllSelectTreeNodes = function(){
		this.selectTree.expandAll(false);
	}
	var getDomById = function(id, context) {
		if (typeof id == "string") {
			if (id.charAt(0) == '#')
				id = id.substr(1);
			var el = document.getElementById(id);
			if (el)
				return el;
			if (context && !getDomIsAncestor(document.body, context)) {
				var els = context.getElementsByTagName("*");
				for (var i = 0, l = els.length; i < l; i++) {
					el = els[i];
					if (el.id == id)
						return el;
				}
				el = null;
			}
			return el;
		} else {
			return id;
		}
	};
	var getDomIsAncestor = function(p, c) {
		var ret = false;
		p = getDomById(p);
		c = getDomById(c);
		if (p === c)
			return true;
		if (p && c) {
			if (p.contains) {
				try {
					return p.contains(c);
				} catch (e) {
					return false;
				}
			} else if (p.compareDocumentPosition) {
				return !!(p.compareDocumentPosition(c) & 16);
			} else {
				while (c = c.parentNode) {
					ret = c == p || ret;
				}
			}
		}
		return ret;
	};
	return commonTreeSelect;
});