var zhuge_tgjh   = getCookieName('tgjh'), // 推广计划
zhuge_tgdy   = getCookieName('tgdy'), // 推广单元
zhuge_tgcy   = getCookieName('tgcy'), //推广创意
zhuge_gjc    = getCookieName('gjc'),  //点击关键词
zhuge_gjcppms= getCookieName('gjcppms'),//关键词匹配模式
zhuge_gjcpm  = getCookieName('gjcpm'),//关键词排名
zhuge_ggsc   = getCookieName('ggsc'), //广告素材
zhuge_ggw    = getCookieName('ggw'),  //广告位
zhuge_pd     = getCookieName('pd'),   //广告频道
zhuge_xq     = getCookieName('xq'),   //定向人群兴趣
zhuge_xb     = getCookieName('xb'),   //定向人群性别
zhuge_nld    = getCookieName('nld');  //定向人群年龄段

//获取诸葛属性
function getCookieName(name){
  return getCookie(name) != null ? getCookie(name) : '';
}

zhuge.track('打开活动页', {
  '所属页面' : fieldUrl()
});

function fieldUrl(){
  var r = window.location.pathname.split('/');
  return r[1]=='hd'?'17gwxs':r[1];
}
//默认属性
zhuge.setSuperProperty({
  '推广计划'  : zhuge_tgjh,
  '推广单元'  : zhuge_tgdy,
  '推广创意'  : zhuge_tgcy,
  '广告素材'  : zhuge_ggsc,
  '广告位'    : zhuge_ggw,
  '广告频道'  : zhuge_pd,
  '点击关键词': zhuge_gjc,
  '关键词排名': zhuge_gjcpm,
  '关键词匹配模式': zhuge_gjcppms,
  '定向人群 - 兴趣'  : zhuge_xq,
  '定向人群 - 性别'  : zhuge_xb,
  '定向人群 - 年龄段': zhuge_nld,
  '一级获客方式'  : '推广',
  '二级获客方式'  : levelMode(0),
  '三级获客方式'  : levelMode(1)
});
//获客级别
function levelMode(num){
  var val = getCookie('hkdfrom_pc')!=null?getCookie('hkdfrom_pc'):'00',
      obj = {
        '01' : ['付费推广','百度搜索M'],
        '06' : ['付费推广','百度搜索PC'],
        '09' : ['付费推广','百度直通车M'],
        '03' : ['付费推广','百度信息流M'],
        '02' : ['付费推广','百度DSP_M'],
        '15': ['付费推广','百度DSP_PC'],
        '07' : ['付费推广','360搜索PC'],
        '12': ['付费推广','搜狗搜索M'],
        '13': ['付费推广','搜狗搜索PC'],
        '14': ['付费推广','神马搜索M'],
        '04' : ['付费推广','一点资讯M'],
        '05' : ['付费推广','网易新闻M'],
        '16': ['自然流量','自然流量M'],
        '00' : ['自然流量','自然流量PC'],
        '08' : ['社群营销','618'],
        '10': ['渠道合作','淘宝房产'],
        '11': ['渠道合作','国美房产'],
        '17': ['付费推广','广点通'],
        '18': ['付费推广','智慧推']
      }
  if(num==1){
    return obj[val][num];
  }  else {
    return obj[val][num];
  }
}

/*cookie 存储hkdfrom 的值*/
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
//删除cookies  
function delCookie(name) {  
  var exp = new Date();  
  exp.setTime(exp.getTime() - 1);  
  var cval=getCookie(name);  
  if(cval!=null){
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();  
  }         
}