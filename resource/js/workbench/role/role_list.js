var vue=new Vue({
	el:"#app",
	data:{
		roleList:[],
		//分页时的当前页码，默认值为1
		pageNumber:1,
		//分页时每页显示的数量
		pageSize:5,
		total:0,
		pageCount:0,
		//上一页 不可点击cass样式
		upDisable:"disabled",
		//下一页 不可点击的cass样式
		nextDisable:"disabled",
		roleIds:[]
	},
	methods:{
		showRoleList:function(){
		
			axios({
				url:"http://localhost:8080/workbench/role/getRoleList",
				params:{
					pageNumber:vue.pageNumber,
					pageSize:vue.pageSize,
					token:sessionStorage.getItem("token")
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				if(responseData.code==2){
					alert(responseData.msg)
					window.top.location.href="../../login.html"
					return false
				}
				if(responseData.code==1){
					alert(responseData.msg)
				
					return false
				}
				//将响应的集合绑定到vue
				vue.roleList=responseData.result.data
				//将总记录数绑定到vue
				vue.total=responseData.result.total
				//将总页数绑定到vue
				vue.pageCount=responseData.result.pageCount
				//进入if表示当前页码为1证明是第一页，上一页按钮拥有不可点击样式
				if(vue.pageNumber==1){
					vue.upDisable="disabled"
				}else{
					//进入else表示当前页码非第一页，上一页按钮取消不可点击样式
					vue.upDisable=""
				}
				//进入if表示当前页码为最后一页，下一页按钮拥有不可点击样式
				if(vue.pageNumber==vue.pageCount){
					vue.nextDisable="disabled"
				}else{
					//进入else表示当前页码非最后一页，下一页按钮取消不可点击样式
					vue.nextDisable=""
				}
				
			})
		},
		/**
		 * 翻页函数
		 * @param {Object} pageNum 计算后的当前页码
		 */
		nextPage:function(pageNum){
			//进入if表示当前是第一页，用户点击了上一页，阻止用户的操作行为
			if(pageNum==0){
				return false
			}
			//进入if表示当前页为最后一页，用户点击了下一页，阻止用户的操作行为
			if(pageNum>vue.pageCount){
				return false
			}
			//修改vue绑定的当前页面数据
			vue.pageNumber=pageNum
			//调用分页获取数据的函数
			vue.showRoleList()()
		},
		setPageSize:function(pageSize){
			//将信息的每页显示记录数量绑定到vue
			vue.pageSize=pageSize
			//重置当前页码为1，要显示一页数据
			vue.pageNumber=1
			//改变每页显示记录数量后调用分页获取数据的函数，更新页面效果
			vue.showRoleList()
		},
		initPermissionTreeData:function(){
			if(vue.roleIds.length!=1){
				alert("请选择一个角色后再分配权限")
				return
			}
			var setting = {
				check: {
					enable: true
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				async: {//配置异步加载
					enable: true,
					url: "http://localhost:8080/workbench/role/initPermissionTreeDataByRoleId",
					otherParam: { "roleId":vue.roleIds[0],"token":sessionStorage.getItem("token")}
				},
				callback: {//配置事件
						//异步加载成功后的回调
						onAsyncSuccess: function(event, treeId, treeNode, msg){
							//msg是Ztree的Ajax请求成功后的响应数据，如果这个属于中有code则证明请求失败可能是没有登录获取没有权限
							if(msg.indexOf("code")>0){
								//字符串解析，读取响应结果中code的数据
								var code=msg.substring(8,9)
								 if(code=="2"){
									alert("请登录在操作操作")
									window.top.location.href="../../login.html"
									return false
								 }
								 if(code=="1"){
									alert("对不起没有权限，请联系管理员")
									return false
								 }
								
							}
							
							//树初始化完成后调用模态窗口显示的方法
							//建议在这弹出窗口，在Ajax没有完成响应时可以给用户先显示另外一个模态窗口里面显示数据正在加载即可
								$("#disPerModal").modal()
						}
					}
			};
			$.fn.zTree.init($("#treeDemo"), setting, null);
		},
		disPerm:function(){
			//根据页面中显示Ztree的Dom容器的id值获取树的对象
			var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
			
			var nodes=treeObj.getCheckedNodes();
			var permIds=""
			for(var i=0;i<nodes.length;i++){
				if(i==nodes.length-1){
					permIds+=nodes[i].id
				}else{
					permIds+=nodes[i].id+","
				}
				
			}
			axios({
				url:"http://localhost:8080/workbench/role/disPerm",
				params:{
					roleId:vue.roleIds[0],
					permIds:permIds,
					token:sessionStorage.getItem("token")
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				
				if(responseData.code==2){
					alert(responseData.msg)
					window.top.location.href="../../login.html"
					return false
				}
				if(responseData.code==1){
					alert(responseData.msg)
					return false
				}
				
				
				
			})
		}
		
	}
})

vue.showRoleList()