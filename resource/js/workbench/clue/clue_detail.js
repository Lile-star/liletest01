var vue=new Vue({
	el:"#app",
	data:{
		//获取当前需要操作的线索Id，绑定到Vue
		clueId:sessionStorage.getItem("clueId"),
		clue:{},
		activityName:"",
		activityList:[],
		activityIds:[],
		appellationDicValue:"",
		remarkContent:""
	},
	methods:{
		showClueDetail:function(){
			axios({
				url:"http://localhost:8080/workbench/clue/getClueDetail",
				params:{
					clueId:vue.clueId
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)
				
				vue.clue=responseData.result
				
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
		relationActivity:function(){
		if(vue.activityIds.length==0){
			return 
		}
			var actIdsStr=""
			for(var i=0;i<vue.activityIds.length;i++){
				actIdsStr+=vue.activityIds[i]+","
			}
			actIdsStr=actIdsStr.substring(0,actIdsStr.length-1)
			
			axios({
				url:"http://localhost:8080/workbench/clue/relationActivity",
				params:{
					activityIds:actIdsStr,
					clueId:vue.clueId
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)
				
				vue.showClueDetail()
				
			})
		},
		showRelactionModalWindow:function(){
			//关联成功后清空输入框中输入的内容
			//以及模糊查询获取的市场活动列表，
			//这样再次点击关联市场活动模态窗口时将清空所有数据
			vue.activityName=""
			vue.activityList=[]
			vue.activityIds=[]
			//显示模态窗口
			$("#bundModal").modal()
		},
		deleteActivityRelation:function(relationId){
			
			axios({
				url:"http://localhost:8080/workbench/clue/deleteActivityRelation",
				params:{
					relationId:relationId
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)
				vue.showClueDetail()
			})
		},
		addRemark:function(){
			//去掉字符串前后的空格后如果是""表示用户没有输入备注
			if(vue.remarkContent.trim()==""){
				alert("请输入备注信息后再点击保存")
				return false
			}
			axios({
				url:"http://localhost:8080/workbench/clueRemark/addRemark",
				params:{
					clueId:vue.clueId,
					remarkContent:vue.remarkContent,
					token:sessionStorage.getItem("token")
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)
				vue.showClueDetail()
			})
		},
		clueConvert:function(){
			window.location.href="clue_convert.html"
		}
	}
})

vue.showClueDetail()