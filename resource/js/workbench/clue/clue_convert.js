var vue=new Vue({
	el:"#app",
	data:{
		clueId:sessionStorage.getItem("clueId"),
		clueConvertInfo:{},
		activityName:"",
		activityList:[],
		activityId:"",
		actName:"",
		stageList:[],
		token:sessionStorage.getItem("token"),
		money:"",
		name:"",
		expectedDate:"",
		stage:""
	},
	methods:{
		getClueConvertInfo:function(){
			axios({
				url:"http://localhost:8080/workbench/clue/getClueConvertInfo",
				params:{
					clueId:	vue.clueId
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				vue.clueConvertInfo=responseData.result
			})
		},
		queryActivity:function(){
			//进入if则表示用于利用删除按键将输入框中所有数据删除掉，直接返回不执行查询，保留当前页面中显示有的所有市场活动信息
			//如果注释掉这个if则当利用删除按键删除所输入框中的数据时将查询所有的市场活动
			//如果市场互动数据量比较多这里建议分页显示
			if(vue.activityName==""){
				return false
			}
			axios({
				url:"http://localhost:8080/workbench/activity/queryActivityByName",
				params:{
					activityName:vue.activityName
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)
				
				vue.activityList=responseData.result
			})
		},
		setActivity:function(actName){
			vue.actName=actName
		},
		initDivValue:function(){
			axios({
				url:"http://localhost:8080/workbench/dic/getDivValueByTypeCodeFromRedis",
				params:{
					
					//传递需要初始化的数据字典的TypeCode，如果有多个TypeCode使用逗号分割
					typeCodes:"stage"
					
				}
			}).then(function(data){
					
				var responseData=data.data
				console.log(responseData)
				
				vue.stageList=responseData.result.stage
				
			})
		},
		clueConvert:function(){
			axios({
				url:"http://localhost:8080/workbench/clue/clueConvert",
				params:{
					token:vue.token,
					clueId:vue.clueId,
					activityId:vue.activityId,
					money:vue.money,
					name:vue.name,
					expectedDate:vue.expectedDate,
					stage:vue.stage
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)	
				if(responseData.code==2){
					alert(responseData.msg)
					window.top.location.href="../../login.html"
					return false
				}
				alert("转换成功！")
				window.location.href="clue_list.html"
				
			})
		}
	}
})
vue.getClueConvertInfo()
vue.initDivValue()