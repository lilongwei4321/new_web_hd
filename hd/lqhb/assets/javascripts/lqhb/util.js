(function(win){
/**
 * 生成一个用不重复的ID
 */
win.GenNonDuplicateID =function(randomLength){
  return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('4 7$=[\'\\m\\c\\s\\r\\q\',\'\\l\\k\\C\',"\\m\\c\\s\\r\\q","\\w\\b\\p\\v\\x\\6\\b\\t\\a\\b\\8"];4 i={u:7$[0],D:7$[1]};4 9={};9["\\E\\g\\8\\g"]=z();4 o=h["\\6\\8\\a\\5\\d\\e\\5\\j\\f"](i);4 n=h["\\6\\8\\a\\5\\d\\e\\5\\j\\f"](9);4 y=B["\\p\\A\\6"]["\\l\\k\\c"]["\\6\\5\\e\\d"](7$[2],o,n,7$[3]);',41,41,'||||var|x69|x73|_|x74|oPayload|x72|x65|x53|x6e|x67|x79|x61|JSON|oHeader|x66|x57|x4a|x48|sPayload|sHeader|x6a|x36|x35|x32|x63|alg|x75|x7a|x5f|sJWT|GenNonDuplicateID|x77|KJUR|x54|typ|x64'.split('|'),0,{}))
/*倒计时*/
win.daojishi = function(phone,sendBtn,disabled,timeout,time){
  $(sendBtn).val(timeout + "秒");
  if(timeout<=1){
    $(sendBtn).val("获取验证码").attr("disabled", false);
    $("#user_phone").attr('disabled',false);
    $(sendBtn).addClass('yanzm_btncolor');
    clearInterval(time);
  }
}
win.sendCode = function(phone,sendBtn,disabled,timeout){
  var phoneVal = $(phone).val();
  if (!disabled){
    $(sendBtn).attr("disabled", true);
    $.ajax({
      type:'POST',
      url:'http://webapi.zeju.com/vcode/send',
      data:{
        phone: phoneVal,
        authenticity_token: $("input[name='authenticity_token']").val(),
        token: sJWT
      },
      cache:false,
      dataType:'json',
      success:function(data){
        if (data.status==0) {
          $(sendBtn).removeClass('yanzm_btncolor');
          var time=setInterval(function(){
                --timeout;
                daojishi(phone,sendBtn,disabled,timeout,time); 
              },1000)
        }else{
          $(sendBtn).removeAttr("disabled");
          $(sendBtn).addClass('yanzm_btncolor');
          alert(data.message);
        }
      },
      error : function(data){
        console.log(data,'错');
      }
    });
  }
}
})(window)



