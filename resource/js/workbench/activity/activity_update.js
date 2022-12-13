var vue=new Vue({
	el:"#main-container",
	data:{
		activityId:"",
		activity:{}
	},
	methods:{
		/**
		 * 修改市场活动
		 */
		updateActivity:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/update",
				params:{
					id:vue.activityId,
					name:vue.activity.name,
					cost:vue.activity.cost,
					startDate:vue.activity.startDate,
					endDate:vue.activity.endDate,
					description:vue.activity.description,
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
				window.location.href="activity_list.html"
				
			})	
		},
		getActivityInfo:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/getActivityInfo",
				params:{
					activityId:vue.activityId,
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
				vue.activity=responseData.result
			
			})
		},
		resetData:function(){
			vue.getActivityInfo()
		}
	}
})
//获取浏览器地址路径
var path= window.location.href
//根据地址路径解析出活动Id
vue.activityId=path.substr(path.lastIndexOf("=")+1)
//调用获取市场活动的的函数
vue.getActivityInfo()





