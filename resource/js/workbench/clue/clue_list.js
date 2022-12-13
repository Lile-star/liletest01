var vue=new Vue({
	el:"#app",
	data:{
		clueList:[],
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
		clueStateList:[],
		sourceList:[],
		appellationList:[],
		fullName:"",
		company:"",
		phone:"",
		source:"",
		owner:"",
		mphone:"",
		clueState:"",
		addClue:{},
		clueIds:[],
		updateClue:{},
		token:sessionStorage.getItem("token")
	},
	methods:{
		showClueList:function(){
			axios({
				url:"http://localhost:8080/workbench/clue/getClueList",
				params:{
					pageNumber:vue.pageNumber,
					pageSize:vue.pageSize,
					fullName:vue.fullName,
					company:vue.company,
					phone:vue.phone,
					source:vue.source,
					owner:vue.owner,
					mphone:vue.mphone,
					clueState:vue.clueState,
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
				vue.clueList=responseData.result.data
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
			vue.showClueList()
		},
		setPageSize:function(pageSize){
			//将信息的每页显示记录数量绑定到vue
			vue.pageSize=pageSize
			//重置当前页码为1，要显示一页数据
			vue.pageNumber=1
			//改变每页显示记录数量后调用分页获取数据的函数，更新页面效果
			vue.showClueList()
		},
		initDivValue:function(){
			axios({
				url:"http://localhost:8080/workbench/dic/getDivValueByTypeCodeFromRedis",
				params:{
					
					//传递需要初始化的数据字典的TypeCode，如果有多个TypeCode使用逗号分割
					typeCodes:"clueState,source,appellation"
					
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				
				vue.clueStateList=responseData.result.clueState
				vue.sourceList=responseData.result.source
				vue.appellationList=responseData.result.appellation
			})
		},
		setParams:function(){
			vue.pageNumber=1
			vue.showClueList()
		},
		addClueFun:function(){
			axios({
				url:"http://localhost:8080/workbench/clue/addClue?token="+sessionStorage.getItem("token"),
				params:vue.addClue
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				if(responseData.code==2){
					alert(responseData.msg)
					window.top.location.href="../../login.html"
					return false
				}
				
				//调用查询功能刷新列表，但是可能会因为查询条件的存在到时无法查看到新添加的数据解方案有种
				//1. 重置查询时所有的条件例如 vue.fullName=""  vue.pageNumber=1 ...
				//2. 刷新当前页面例如 window.location.reload()  这个方法相当于点击键盘F5刷新
				// vue.showClueList()
				window.location.reload()
				
			})
		},
		deleteClue:function(){
	
			if(vue.clueIds.length==0){
				alert("请选择1条或多条需要删除的数据？")
				return false
			}
			
			//confirm会弹出一个带有确定和取消的对话框,点击确定返回true 点击取消返回false
			if(!confirm("确定要删除数据吗?")){
				return false
			}
			var clueParamIds=""
			for(var i=0;i<vue.clueIds.length;i++){
				clueParamIds+=vue.clueIds[i]+","
			}
			clueParamIds=clueParamIds.substring(0,clueParamIds.length-1)
			axios({
				url:"http://localhost:8080/workbench/clue/deleteClue",
				params:{
					clueIds:clueParamIds
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				
				//重置当前业务为第一个调用获取分页数据的方法，这时就会根据当前页面的查询条件显示第1页的数据
				vue.pageNumber=1
				vue.showClueList()
			})
		},
		toUpdateClue:function(){
			
			//进入if表示用户点击修改时没有选择或选择了多条记录
			if(vue.clueIds.length==0||vue.clueIds.length>1){
				alert("必须要选择1条需要修改的记录！")
				return false
			}
			
			axios({
				url:"http://localhost:8080/workbench/clue/getClueInfoById",
				params:{
					clueId:vue.clueIds[0]
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				//将响应数据绑定vue
				vue.updateClue=responseData.result
				//显示id为editClueModal的模态窗口
				$("#editClueModal").modal()
			})
			
		}
		,
		updateClueFun:function(){
			/**
			 * 根据主键修改数据参数vue.updateClue是查询时绑定到vue的，这个对象中有线索的所有数据包括主键值
			 * 利用vue的双向数据绑定在页面中修改了vue.updateClue对象中的部分数据，因此这个对象中的id没有被修改过
			 * 所以可以直接提交到后台用于数据修改
			 */
			axios({
				url:"http://localhost:8080/workbench/clue/update?token="+sessionStorage.getItem("token"),
				params:vue.updateClue
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				if(responseData.code==2){
					alert(responseData.msg)
					window.top.location.href="../../login.html"
					return false
				}
				//修改后不改变当前页码直接刷新当前页的数据
				vue.showClueList()
			})
		},
		showClueDetail:function(clueId){
		
			sessionStorage.setItem("clueId",clueId)
			window.location.href="clue_detail.html"
		}
	}
})
vue.initDivValue()
vue.showClueList()