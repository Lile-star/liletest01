var vue=new Vue({
	el:"#main-container",
	data:{
		loginAct:"",
		loginPwd:"",
		msg:"",
		isAutoLogin:""
	},
	methods:{
		login:function(){
			
			axios({
				url:"http://localhost:8080/login",
				params:{
					loginAct:vue.loginAct,
					//使用jQuery的md5插件对用户输入的密码进行加密处理
					loginPwd:$.md5(vue.loginPwd),
					isAutoLogin:vue.isAutoLogin
				}
			}).then(function(data){
				//形参数data 是vue的Ajax响应数据封装对象，这个对象中有若干属性
				//例如status 响应状态码  headers 响应头  data响应的具体数据（我们后台控制返回的Json） 等等
				//data.data 是获取我们后台控制器返回的具体数据
				var responseData=data.data
				console.log(responseData)
				//进入if表示请求失败，登录信息错误
				if(responseData.code==1){
					vue.msg=responseData.msg
					return false
				}
				//获取后台的响应数据（后台暂时只响应了用户的Token）
				var token=responseData.result
				//将用户Tokken存入本地会话中
				sessionStorage.setItem("token",token)
				if(vue.isAutoLogin){
					setCookie("loginAct",vue.loginAct)
					setCookie("loginPwd",$.md5(vue.loginPwd))
				}
				window.location.href="workbench/main.html"
			})
		}
	}
})

