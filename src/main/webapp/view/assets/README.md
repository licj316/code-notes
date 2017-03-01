# commonTreeSelect.js

一个可以用seajs加载的弹出层树形选择组件。

需要bootstrap2，jquery，zTree，seajs。适应bootstrap3需要自行修改样式。



## 使用方法

1. html 定义两个input，一个隐藏一个显示
~~~html
<input type="hidden" id="hiddenInputId"  />
<input type="text" id="displayInputId" />
~~~

2. js 使用seajs调用初始化，以下5个参数为必选参数
~~~javascript
seajs.use('assets/commonTreeSelect.js', function(commonTreeSelect){
	new commonTreeSelect({
		label : "选择部门",
		url : s_contractservice + "/department/getDepartmentTreeList",
		hiddenInputId : "departmentIds",
		displayInputId : "departmentNames",
		params:{rootDepartmentId:'68'}
	});
});
~~~

