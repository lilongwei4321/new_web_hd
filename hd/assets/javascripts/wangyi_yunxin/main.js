/**
 * 主要业务逻辑相关
 */
///var userUID = readCookie("uid")
/**
 * 实例化
 * @see module/base/js
 */
var userUID= null;
var yunXin='';
var userUID='';
var guwen_data = '';
var cityzhi = decodeURI(window.location.search.split('=')[1]);
//悬停  咨询入口
//$(document).on('click',' #xuanting_btn',function(){
      guwen_data    =  readCookie('guwen_data');
  var login_phone   =  readCookie('login_phone')!=null?readCookie('login_phone'):'',
      loupan_ids    =  readCookie("browse_items")==null?'':readCookie("browse_items"),
      guwenId       =  '' ,//$(this).attr('adviser_id'),
      city_name     =  cityzhi!=null ?cityzhi : '杭州',
      advisor_async =  '0',
      logined_async =  login_phone!=''?'1':'0'; 
      userUID       =  userUID !=''?userUID:readCookie('accid');
      if(userUID==null){
        user_inajax (logined_async,login_phone)
        guwen_inajax (advisor_async,guwenId,logined_async,login_phone,city_name,loupan_ids)             
      } else {
        if (yunXin == ""){
          yunXin = new YX(userUID); 
        } 
        $('.wrapper').css({
          'display':'block'
        })
      }
    im_liuzi(userUID,'右侧悬停',guwen_data,'','');
//})
//请求ajax 
function guwen_inajax (advisor_async,guwen_id,logined_async,login_phone,city_name,loupan_ids) {
  $.ajax({
    type: "POST",
    url: 'http://webapi.zeju.com/neteaseim/advisor',
    data: { 
      advisor_choosed :  advisor_async, //  是否是固定顾问
      advisor_id      :  guwen_id ,  //顾问id
      logined         :  logined_async,   // 是否登录
      login_phone     :  login_phone,   //登录的账号
      city_name       :  city_name  , // 地区
      im_customer_id  :  userUID ,
      ids      :  loupan_ids,
      pc       : '1'
    },
    dataType: "json",
    async: false,
    success: function(data) {
     if(data.status == 0 && data.message == 'succeed'){
        var data = data.data;
          //顾问数据
          guwen_data = data.advisor_info.accid;
          setCookie('guwen_data',guwen_data);
         // yunXin.accid = guwen_data ;
          $('.wrapper').css({
            'display':'block'
          })     
      }       
    },
    error : function(data){
      console.log(data,'cuo')
    }
  })
}
//请求ajax 
function user_inajax (logined_async,login_phone) {
  $.ajax({
    type: "POST",
    url: 'http://webapi.zeju.com/neteaseim/customer',
    //url: 'http://imapi.zeju.com/neteaseim/customer',
    data: {
      logined         :  logined_async,   // 是否登录
      login_phone     :  login_phone   //登录的账号
    },
    dataType: "json",
    async: false,
    success: function(data) {
    //console.log(data,'用户')
     if(data.status == 0 && data.message == 'succeed'){
        var data = data.data;
            userUID = String(data.customer_info.accid);           
            setCookie('accid',userUID)
            setCookie('usertoken',data.customer_info.token)
            Login.requestLogin(String(data.customer_info.accid),String(data.customer_info.token));
            yunXin = new YX(userUID);  
            /*var str = JSON.stringify(yunXin); 
             sessionStorage.yunXin = str; */
            $('.wrapper').css({
              'display':'block'
            })
      }       
    },
    error : function(data){
      console.log(data,'cuo')
    }
  })
}
function im_liuzi(accid,page_name,advisor_id,loupan_id,loupan_name){
  $.ajax({
    type: "POST",
    url: 'http://bj.zeju.com/im_liuzi.json',
    data: {
      accid: accid,
      page_name: page_name,
      advisor_id: advisor_id,
      loupan_id: loupan_id,
      loupan_name: loupan_name
    },
    dataType: "json",
    async: false,
    success: function(data) {
     if(data.status == 0 && data.message == 'succeed'){
        console.log('success');
      }       
    },
    error : function(data){
      console.log(data,'sorry');
    }
  })
}