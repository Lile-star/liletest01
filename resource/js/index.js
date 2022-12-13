var vue=new Vue({
	el:"#app",
	data:{
		
	},
	methods:{
		autoLogin:function (){
			//从Cookie获取账号和密码
			var loginAct=getCookie("loginAct")
			var loginPwd=getCookie("loginPwd")
			//进入表示Cookie没有账号或没有密码，无法自动登录转向登录页面
			if(loginAct==null||loginPwd==null){
				window.location.href="login.html"
			}
			//程序到了这里，表示Cookie中有账号和密码，需要到后台验证账号和密码是否正确
			axios({
				url:"http://localhost:8080/login",
				params:{
					loginAct:loginAct,
					//使用jQuery的md5插件对用户输入的密码进行加密处理
					loginPwd:loginPwd
				}
			}).then(function(data){
		
				var responseData=data.data
				console.log(responseData)
				//进入if表示请求失败，登录信息错误，可能在保存登录信息后修改过数据库中的密码
				//需要转向登录页面
				if(responseData.code==1){
					window.location.href="login.html"
					return false
				}
				//获取后台的响应数据（后台暂时只响应了用户的Token）
				var token=responseData.result
				//将用户Tokken存入本地会话中
				sessionStorage.setItem("token",token)
				//将账号和密码再次存入Cookie覆盖Cookie的信息，重置自动登录的天数
				setCookie("loginAct",loginAct)
				setCookie("loginPwd",loginPwd)
			
				window.location.href="workbench/main.html"
			})
		}
	}
})

vue.autoLogin()

