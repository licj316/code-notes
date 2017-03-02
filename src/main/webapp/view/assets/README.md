# commonTreeSelect.js

一个可以用seajs加载的弹出层树形选择组件。

需要bootstrap2，jquery，zTree，seajs，可以修改js以适应bootstrap3及去除seajs依赖。



## 使用方法

1. 定义两个input，一个隐藏一个显示。
~~~html
<input type="hidden" id="hiddenInputId"  />
<input type="text" id="displayInputId" />
~~~
2. 使用seajs调用初始化，以下5个参数为必选参数，其它参数可查看commonTreeSelect.js文件。
~~~javascript
seajs.use('assets/commonTreeSelect.js', function(commonTreeSelect){
	new commonTreeSelect({
		label : "选择xxx",
		url : "/xxxx/xxxx",
		hiddenInputId : "hiddenInputId",
		displayInputId : "displayInputId",
		params:{rootId:'68'}
	});
});
~~~

