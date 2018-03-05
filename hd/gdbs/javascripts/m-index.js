var url='http://webapi.zeju.com/loupans/valla_index';
// var url='http://192.168.3.231:9999/loupans/valla_index';

//留资入口
var zjfrom = getQueryString('zjfrom')!=null?getQueryString('zjfrom'):getCookie('zjfrom');
var tgjh   = getQueryString('tgjh')!=null?getQueryString('tgjh'):getCookie('tgjh');
var tgdy   = getQueryString('tgdy')!=null?getQueryString('tgdy'):getCookie('tgdy');
var gjc    = getQueryString('gjc')!=null?getQueryString('gjc'):getCookie('gjc');
var gjcpm  = getQueryString('gjcpm')!=null?getQueryString('gjcpm'):getCookie('gjcpm');
var gjcppms= getQueryString('gjcppms')!=null?getQueryString('gjcppms'):getCookie('gjcppms');
var tgcy   = getQueryString('tgcy')!=null?getQueryString('tgcy'):getCookie('tgcy');
var ggsc   = getQueryString('ggsc')!=null?getQueryString('ggsc'):getCookie('ggsc');
var ggw    = getQueryString('ggw')!=null?getQueryString('ggw'):getCookie('ggw');
var pd     = getQueryString('pd')!=null?getQueryString('pd'):getCookie('pd');
var xq     = getQueryString('xq')!=null?getQueryString('xq'):getCookie('xq');
var xb     = getQueryString('xb')!=null?getQueryString('xb'):getCookie('xb');
var nld    = getQueryString('nld')!=null?getQueryString('nld'):getCookie('nld');


$.ajax({
	type:"POST",
	url:url,
	dataType:"json",
	async:false,
	success:function(data){
		var code='';
		var code1='';
		$.each(data.data.hot_loupans,function(i,itme){
			code+=hotHtmlCode(itme)
		})
		$.each(data.data.genaral_loupans,function(i,itme){
			code1+=paiHtmlCode(itme)
		})
		$('#itmeHot').html(code);
		$('#itmeTotal').html(code1)
	}
})

/*热门楼盘*/
function hotHtmlCode(dataobj){
	var code ='<li>'+
				'<a href="http://m.zeju.com/bj/loupan/'+dataobj.item_id+'.html">'+
					'<div class="box-left fl">'+
						'<img class="itme-img" src="http://imgs.zeju.cn'+dataobj.cover_pic+'" alt="">'+
					'</div>'+
					'<div class="box-right">'+
						'<ul>'+
							'<li class="name">'+dataobj.item_name+'</li>'+
							'<li class="address">'+dataobj.sales_address+'</li>'+
							'<li><a class="phone" href="tel://'+(dataobj.extension_num!=null?"4000-808-303,"+dataobj.extension_num+zjfrom:"4000-808-303,10927")+'"><i class="iconfont">&#xe64c;</i></a></li>'+
							'<li class="tag-reason">推荐理由</li>'+
							'<li class="contains">'+dataobj.recommend+'</li>'+
						'</ul>'+
					'</div>'+
				'</a>'+
			'</li>';
	return code;
}
function paiHtmlCode(dataobj){
	var code='<li>'+
				'<a href="http://m.zeju.com/bj/loupan/'+dataobj.item_id+'.html">'+
					'<div class="box-left fl">'+
						'<img class="itme-img" src="http://imgs.zeju.cn'+dataobj.cover_pic+'" alt="">'+
					'</div>'+
					'<div class="box-right">'+
						'<ul>'+
							'<li class="name">'+dataobj.item_name+'</li>'+
							'<li>'+dataobj.sales_address+'</li>'+
							'<li><a class="phone" href="tel://'+(dataobj.extension_num!=null?"4000-808-303,"+dataobj.extension_num+zjfrom:"4000-808-303,10927")+'"><i class="iconfont">&#xe64c;</i></a></li>'+
							'<li class="list_last">';
							$.each(dataobj.labels.split('、'),function(i,itme){
								code+='<label class="tag">'+itme+'</label>';
							})
							code+='</li>'+
						'</ul>'+
					'</div>'+
				'</a>'+
			'</li>';
	code+='</div></a></li>';
	return code;
}
phone();
function phone(){
	var str='<a class="btn-footer" href="http://m.zeju.com/yueche.html">报名看房</a><a href="tel://4000-808-303,10927'+zjfrom+'">24h电话咨询</a>';
	$('.footer').html(str);
}


//存储留资
if(getQueryString('zjfrom')!=null){setCookie('zjfrom',zjfrom)}
if(getQueryString('tgjh')!=null){setCookie('tgjh',tgjh)}
if(getQueryString('tgdy')!=null){setCookie('tgdy',tgdy)}
if(getQueryString('gjc')!=null){setCookie('gjc',gjc)}
if(getQueryString('gjcpm')!=null){setCookie('gjcpm',gjcpm)}
if(getQueryString('gjcppms')!=null){setCookie('gjcppms',gjcppms)}
if(getQueryString('tgcy')!=null){setCookie('tgcy',tgcy)}
if(getQueryString('ggsc')!=null){setCookie('ggsc',ggsc)}
if(getQueryString('ggw')!=null){setCookie('ggw',ggw)}
if(getQueryString('pd')!=null){setCookie('pd',pd)}
if(getQueryString('xq')!=null){setCookie('xq',xq)}
if(getQueryString('xb')!=null){setCookie('xb',xb)}
if(getQueryString('nld')!=null){setCookie('nld',nld)}

/*统计代码*/
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?03cf2b129bc3e77b681764ab590e4c39";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

//取得地址栏  指定参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	try {
		return decodeURI(r[2]); 
	} catch(e){
		try {
			return $URL.decode(r[2]); 
		}catch(e) {
			return null;
		} 
	}   	
}
	/*cookie 存储zjfrom 的值*/
function setCookie(name,value,days){
	var Days = 1000 ;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ encodeURI (value) + ";expires=" + exp.toGMTString()+";domain = zeju.com"+";path=/";
}
//获取cookie
function getCookie(name) {
	var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg)){
		return decodeURI(arr[2]); 
	} else {
		return null;
	}
}