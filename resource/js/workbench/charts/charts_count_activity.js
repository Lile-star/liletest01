var vue=new Vue({
	el:"#main",
	data:{
	
	},
	methods:{
		showChartsCountActivity:function(){
			axios({
				url:"http://localhost:8080/workbench/activity/getChartsCountActivityData",
				params:{
					
				}
			}).then(function(data){
				var responseData=data.data
				console.log(responseData)	
				
				var chartDom = document.getElementById('main');
				var myChart = echarts.init(chartDom);
				var option;
				option = {
				  xAxis: {
					type: 'category',
					data: responseData.result.xdata
				  },
				  yAxis: {
					type: 'value'
				  },
				  series: [
					{
					  data: responseData.result.ydata,
					  type: 'bar'
					}
				  ]
				};
				 myChart.setOption(option);
					
				})
		}
	}
})
vue.showChartsCountActivity()