var vue=new Vue({
	el:"#main-container",
	data:{
		activity:{}
	},
	methods:{
		activityAdd:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/addActivity",
				params:{
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
				
				window.location.href="activity_list.html"
				
			})
		},
		resetData:function(){
			vue.activity={}
		}
	}
})






