var vue=new Vue({
	el:"#main-container",
	data:{
		activityList:[],
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
		name:"",
		uname:'',
		startDate:"",
		endDate:"",
		token:sessionStorage.getItem("token")
	},
	methods:{
		/**
		 * 分页获取数据
		 */
		showActivityList:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/getActivityList",
				params:{
					pageNumber:vue.pageNumber,
					pageSize:vue.pageSize,
					uname:vue.uname,
					name:vue.name,
					startDate:vue.startDate,
					endDate:vue.endDate,
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
				vue.activityList=responseData.result.data
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
			vue.showActivityList()
		},
		/**
		 * 设置每页显示的记录数量函数，通过这个函数可以改变每页显示多条少条数据
		 * @param {Object} pageSize 新的每页显示记录数量
		 */
		setPageSize:function(pageSize){
			//将信息的每页显示记录数量绑定到vue
			vue.pageSize=pageSize
			//重置当前页码为1，要显示一页数据
			vue.pageNumber=1
			//改变每页显示记录数量后调用分页获取数据的函数，更新页面效果
			vue.showActivityList()
		},
		setParams:function(){
			vue.pageNumber=1
			vue.showActivityList()
		},
		/**
		 * 根据主键删除数据
		 * @param {Object} id 活动主键
		 */
		deleteActivity:function(id){
			//confirm会弹出一个带有确定和取消的对话框，用户点击确定返回true
			//点击取消会返回false
			//进入if表示用户点击了取消，不会执行删除
			if(!confirm("确定要删除数据吗？")){
				return false
			}
			axios({
				url:"http://localhost:8080/workbench/activity/deleteActivityById",
				params:{
					activityId:id,
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
				//刷新分页数据 显示第一页，避免当前页面没有数据
				vue.pageNumber=1
				//重新获取分页数据
				vue.showActivityList()
			})
		},
		/**
		 * 根据活动Id显示活动详细信息
		 * @param {Object} id
		 */
		showActivityDetail:function(id){
			//将活动Id存入SessionStoreage（本地会话存储）
			sessionStorage.setItem("id",id);
			window.location.href="activity_detail.html"
		}
	}
})

vue.showActivityList()



