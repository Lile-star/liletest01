var vue=new Vue({
	el:"#main-container",
	data:{
		activityId:sessionStorage.getItem("id"),
		activity:{},
		createName:"",
		noteContent:""
	},
	methods:{
		showActivityDetail:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/getActivityDetail",
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
				vue.createName=vue.activity.createByUser.name
			})
		},
		addActivityRemark:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/addActivityRemark",
				params:{
					activityId:vue.activityId,
					noteContent:vue.noteContent,
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
				//备注添加成功，刷新页面数据
				vue.showActivityDetail()
			})
		}
	}
})
vue.showActivityDetail()





