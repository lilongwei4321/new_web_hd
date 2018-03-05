(function(){
  var city_name = '',tuiName='',tgsb = '';
 /*判断当前 设备*/
  function IsPC() {
      let userAgentInfo = navigator.userAgent,
          Agents = ["Android", "iPhone","SymbianOS","Windows Phone","iPad","iPod","MeeGo","Touch","RIM Tablet OS"],
          flag = true;
      for (let v = 0; v < Agents.length; v++) {    
          if(userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
      }
      return flag;
  }
  function getCookie(name) {
	    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr=document.cookie.match(reg)){
	      return decodeURI(arr[2]);
	    } else {
	      return null;
	    }
	  }
  //判断当前城市
  function cityName (name){
    if(name=='bj'){
      return "北京"
    } else if(name=='cs') {
      return "长沙"
    } else if(name=='tj') {
      return "天津"
    } else {
      return "北京"
    }
  }
/* 根据设备  显示不同样式 */
if(!IsPC()){  
    city_name = getCookie('ca_host')!=null?getCookie('ca_host').substring(0,2):'';
    tuiName   = getQueryString('city')!=null?getQueryString('city'):city_name;
    city_name = cityName (tuiName);     
    tgsb = 'm';
    if(city_name=='北京' || city_name=='天津'){         
      $('.ztc_back').attr('src','./images/bj_back_m.png');
      $('.ztc_cont_pic').attr('src','./images/bj_gong_m.png');
      $("#city_num").html('1288');
    } else if( city_name=='长沙'){
      $('.ztc_back').attr('src','./images/cc_back_m.png');
      $('.ztc_cont_pic').attr('src','./images/cc_gong_m.png');
      $("#city_num").html('688');
    }
    /*更改根类名*/
    $(".ztc_wrap").removeClass('ztc_wrap_pc').addClass('ztc_wrap_m');
    var inputStr='<span class="span">验&nbsp;证&nbsp;码</span><span class="span1">'+
                  '<input type="text" placeholder="请输入验证码" id="user_yanzm" maxlength="4">'+
                  '<input type="button" value="获取验证码" id="user_yanzmBtn"><span/>';
}
else{
    city_name = getCookie('city_host')!=null?getCookie('city_host').substring(0,2):'';
    tuiName   = getQueryString('city')!=null?getQueryString('city'):city_name;
    city_name = cityName (tuiName);
    tgsb = 'pc';
    if(city_name=='北京' || city_name=='天津'){        
      $('.ztc_back').attr('src','./images/bj_back.png');
      $('.ztc_cont_pic').attr('src','./images/bj_gong_pc.png');
      $("#city_num").html('1288');
    } else if(city_name=='长沙'){
      $('.ztc_back').attr('src','./images/cc_back.png');
      $('.ztc_cont_pic').attr('src','./images/cc_gong_pc.png');
      $("#city_num").html('688');
    }     
    $(".ztc_wrap").removeClass('ztc_wrap_m').addClass('ztc_wrap_pc');
    $(".flex").removeClass('flex');
    var inputStr='<span>验&nbsp;证&nbsp;码</span>'+
                  '<input type="text" placeholder="请输入验证码" id="user_yanzm" maxlength="4">'+
                  '<input type="button" value="获取验证码" id="user_yanzmBtn">';
}
$('#san').html(inputStr);   
$('.ztc_box').show();

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
qiang_name()
  //抢红包计数
function  qiang_name(){
  $.ajax({
    type: "GET",
    url: "http://webapi.zeju.com/liuzi/hd_count",
    data: { 
      name      : 'lqhb1288',
      city_name : city_name
    },
    dataType: "json",
    success: function(data) {
        var count = Number(data.data.count),
            qing_name = count +148;
      if(Number(qing_name)>=800){
        var num = 1000-Number(qing_name);
        var str = '<span>还剩<b id="qing_name">'+num+'</b>份</span>'+
                  '<span>限额送<b>1000</b>份</span>';
      } else {
        var str = '<span>已抢<b id="qing_name">'+qing_name+'</b>份</span>'+
                  '<span>限额送<b>1000</b>份</span>';
      }
      $("#ztc_title").html(str);
    }
  })      
}

$(".wrap").Liuzi({
  nameId  : "#user_name",
  phoneId : "#user_phone",
  yanzmId : "#user_yanzm",
  yanzmBtn: "#user_yanzmBtn",
  hdBtn   : "#ztc_cont_btn",
  huodongUrl   :'http://webapi.zeju.com/liuzi/lqhb1288',
  yanBtnColor  :'yanzm_btncolor',
  clue_type_id :'6',
  tgsb         :tgsb,
  yanzmText    : '获取验证码',
  layoutType   : 3,
  hd_alertArr  :{
    nameErrorText  : '请输入正确称呼！',
    phoneErrorText : '请输入正确的手机号！',
    yanErrorText   : '请输入正确的验证码！'
  }
});
})()