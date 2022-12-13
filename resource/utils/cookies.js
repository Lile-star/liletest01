/**
 * 设置Cookie
 * @param {Object} name Cookie名称
 * @param {Object} value Cooke的值
 */
function setCookie(name,value)
{
	//定义超时时间的变量为30天
    var Days = 30;
    var exp = new Date();//定义当前系统的时间对象
    exp.setTime(exp.getTime() + Days*24*60*60*1000);//对当前系统时间+30天
	//对Cookie进行设置
    document.cookie = name + "=" + escape (value) + ";expires=" + exp.toGMTString();
} 
/**
 * 获取Cookie数据
 * @param {Object} name Cookie名称
 */
function getCookie(name)
{    
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval=getCookie(name);
    if(cval!=null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}