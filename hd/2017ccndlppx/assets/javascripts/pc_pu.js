
;(function(win){
  function Public (id,opts){
    var obj = {
      tgsb   :'pc',
      imgUrl :'_pc',
      data   : [],
      alertAsync : false
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.tgsb       = obj.tgsb;
    this.imgUrl     = obj.imgUrl;
    this.city_name  = '';
    this.type       = '';
    this.loupanId   = '';
    this.data       = obj.data;
    this.alertAsync = obj.alertAsync;
    this.zjfrom     = null;
    this.end_flag   = true;
    this.checkedData= [];
    this.cityNameobj={
      'bj' : '北京',
      'tj' : '天津',
      'cc' : '长春',
      'suzhou' : '苏州',
      'cs' : '长沙'
    };
    this.zhuanDong = true;
    this.init() ;
  }
  Public.prototype = {
    //初始化
    init () {
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'cc';
      //活动url;
      this.hd_name = this.fieldUrl();
      //调用城市数据
      this.switchCity();
      //点击抽奖
      this.clickChouBtn(this.city_name);
      //页脚留资
      this.quoteLiuzi_footer(this.tgsb,this.city_name,this.hd_name);
      //页脚过期弹框
      // this.footerBtn();
      //获取用户身份
      this.userName();
      //点击投票
      this.clickToupiao();
    },
    //获取地址栏参数
    getQueryString  (name)  {
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
    },
    //截取url 字段
    fieldUrl  ()  {
      var r = window.location.pathname.split('/');
      return r[1]=='hd'?'2017ccndlppx':r[1];
    },
    //获取用户身份
    userName (){
      if(getCookie('niandu_customer_id') == null){
        $.ajax({
          type: 'GET',
          url: 'http://webapi.zeju.com/pingxuan/visitor',
          success:function(data){
            if(data.status == 200){
              setCookie('niandu_customer_id', data.data.visitor_id);
            }
          }
        })
      }
    },
    //调用城市数据 
    switchCity : function (){
      var that = this;
      //默认
      this.renderPage(1,'loupan_box');
      this.renderPage(5,'loupan_box2');
      $("#city_nav").on('click','a',function(){
        var id = $(this).attr('data-id');
        $(this).addClass('on').siblings().removeClass('on');
        that.renderPage(id,'loupan_box');
      });
      $('#nian_nav').on('click','a',function(){
        var id = $(this).attr('data-id');
        $(this).addClass('on').siblings().removeClass('on');
        that.renderPage(id,'loupan_box2');
      })
    },
    //请求数据
    renderPage : function(type,loupanId){
      var that = this;
      $.ajax({
        type: "GET",
        url: 'http://webapi.zeju.com/loupans/cclppx',
        data:{
          type : type,
          visitor_id : getCookie('niandu_customer_id')
        },
        success: function(data) {
          if(data.status==200){
            that.clearHtml(data.data,loupanId,type);
            $('#hd_phone').on('keyup',function(){
              var reg = /^1[34578]\d{9}$/;
              if($(this).val().length==11 && reg.test($(this).val())){
                $('#hd_yanzmBtn').addClass('yanzm_btncolor').attr({"disabled": false,"style":''});
              } else{
                $('#hd_yanzmBtn').removeClass('yanzm_btncolor').attr({"disabled": true,"style":''});
              }
            })
          } else{
            that.failData('cc',that.tgsb);
          }
        }
      });
    },
    //渲染html
    clearHtml  (data,loupanId,type) {
      var str='';
      $.each(data,(i,m) =>{
        if(i%3==0){
          str+=`<section>`
        }
          str+=`	<dl>
            <dt>${m.item_name}</dt>
            <dd>
              <a href="http://cc.zeju.com/loupan/${m.item_spell}/${m.item_id}.html"  target="_blank" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})">
              <p>${m.detail_addres}</p>
              </a>
              <p class="piao">${m.polls}票</p>
              <p class="toupiao"><span class="toupiaoBtn ${m.is_voted?'':'jinzhi'}" indexId="${m.item_id}" typeId="${type}">投票</span></p>
            </dd>
            </dl>`;
        if(data.length%3!=0 && (i+1)==4*(data.length/4)){
          var hang = Math.ceil(data.length/3),
              ge   = (hang*3)-(i+1);
          for(var k=0;k<ge;k++){
            str+=`<dl style="background:transparent"><dd></dd></dl>`;
          }
        }
        if(i%3==2){
          str+=`</section>`;
        }
      })
      $("#"+loupanId).html(str);
    },
    //点击投票
    clickToupiao : function(){
      var that = this;
      $('.seascape_main').on('click','.toupiaoBtn',function(index){
        if($(this).attr('class').indexOf('jinzhi')<0){
          //截止日期
          that.endTime() ;
          if(!that.end_flag){
            return false;
          }
          var id = $(this).attr('indexId');
          var typeId = $(this).attr('typeId');
          var customer_id = getCookie('niandu_customer_id');
          var fn = $(this);
          $.ajax({
            type: 'POST',
            url : 'http://webapi.zeju.com/pingxuan/votes',
            data : {
              visitor_id : customer_id,
              item_id    : id,
              city_name  : that.city_name,
              item_type  : typeId
            },
            success:function(data){
              fn.addClass('jinzhi');
              fn.parent().prev('.piao').html(data.data.polls+'票');
            }
          })
        }
      })
    },
    //点击抽奖
    clickChouBtn : function(city_name){
      var that=this;
      $("#zhuan_zhi_pc").on('click',function(){
        //截止日期
        that.endTime() ;
        if(!that.end_flag){
          return false;
        }
        var customer_id = getCookie('niandu_customer_id');
        var phone = getCookie('niandu_phone');
        if(customer_id!=null){
          //判断是否可以抽奖
          that.judgeChou({
            city_name  : city_name,
            customer_id: customer_id,
            phone      : phone
          });
        } else{
          //引用弹框插件
          that.quoteAlert(that.tgsb,city_name,that.hd_name);
          $('#box_alert').css('display','block');
        }
      })
    },
    //判断是否可以抽奖
    judgeChou : function(obj){
      var  that= this;
        $.ajax({
          type: "POST",
          url: 'http://webapi.zeju.com/liuzi/hd_lppx_auth',
          data:{
            city_name  : obj.city_name,
            visitor_id : obj.customer_id,
            phone      : obj.phone
          },
          success: function(data) {
            if(data.status==200){
              if(data.data.usable_count>0){
                that.fanjiang();
                var zhuanNum = $("#zhuan_yuan_pc").attr('data-num');
                $('#seascape_wrap').Turntable({
                  oPointer   : "#zhuan_zhi_pc",
                  oTurntable : "#zhuan_yuan_pc",
                  cat        : 60 ,
                  temp       : zhuanNum,
                  time       : 6
                },function(num){
                  $('#box_alert').css('display','block');
                  var cont = that.alertHtml('3');//谢谢参与
                  $('#seascape_wrap').fromAlerts({
                    formAsync  : true,
                    cont     : cont
                  });
                });
              } else{
                //没有次数，显示二维码
                // that.alertJiang(data.data);
                $('#box_alert').css('display','block');
                var cont = that.alertHtml('4');//抽奖次数用尽
                $('#seascape_wrap').fromAlerts({
                  formAsync  : true,
                  cont     : cont
                });
              }
            } else if(data.status == 1){
              $('#box_alert').css('display','block');
              var cont = that.alertHtml('2');//先去投票
              $('#seascape_wrap').fromAlerts({
                formAsync  : true,
                cont     : cont
              });
            }
          }
        });
    },
    //将摇奖信息返回后台
    fanjiang : function(){
      var that = this;
      $.ajax({
        type: 'POST',
        url: 'http://webapi.zeju.com/liuzi/hd_lppx_yj',
        data: {
          phone : getCookie('niandu_phone'),
          city_name : that.city_name
        },
        success : function(data){
          if(data.status == 200){
            setCookie('sycishu',data.data.usable_count);
          }
        }
      })
    },
    //引用弹框插件
    quoteAlert : function(tgsb,city_name,hd_name){
      var cont=this.alertHtml(2);//先去留资
      if(tgsb=='pc'){
        $('#seascape_wrap').fromAlerts({
          formAsync  : true,
          cont     : cont
        });
        // this.quoteLiuzi_alert(tgsb,city_name,hd_name);
      }
    },
    //加密解密
    baseJia : function(phone,async){
      var base = new Base64();
      if(async){
        return base.encode(phone);
      } else{
        return base.decode(phone);  
      }
    },
    //弹框内容
    alertHtml : (async) =>{
      var str='';
      // if(async == 1){
      //   str+=`
      //   <div class="box_main box_main2" id="box_main">
      //     <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
      //     <div class="boxM_text3">
      //       <h4>前去投票</h4>
      //     </div>
      //   </div>`;
      // } else 
      if(async == 2){
        str+=`
        <div class="box_main box_main2" id="box_main">
          <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
          <div class="boxM_text3">
            <h4>前去提交投票信息，参与抽奖活动</h4>
          </div>
        </div>`;
      } else if(async == 3){
        var cishu = getCookie('sycishu');
        str+=`
        <div class="box_main box_main2" id="box_main">
          <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
          <div class="boxM_text3">
            <h4>谢谢参与！</h4>
            <p>剩余抽奖机会${cishu}次</p>
          </div>
        </div>`;
      } else if(async == 4){
        var cishu = getCookie('sycishu');
        str+=`
        <div class="box_main box_main2" id="box_main">
          <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
          <div class="boxM_text3">
            <h4>抽奖次数已用完，感谢您关注择居2017年度楼盘评选活动</h4>
          </div>
        </div>`;
      }
      return str;
    },
    //引用留资插件---页脚
    quoteLiuzi_footer : function(tgsb,city_name,hd_name){
      //页脚调用留资插件
      $("#seascape_wrap").Liuzi({
        huodongUrl   : 'http://webapi.zeju.com/liuzi/hd_lppx_liuzi',
        yanBtnColor  : 'yanzm_btncolor',
        clue_type_id : '6',
        tgsb         : tgsb,
        yanzmText    : '获取',
        cityName     : city_name,
        hd_name      : hd_name,
        layoutType   : 0,
        hd_alertArr  :{
          repeatStr  : '该手机号已参与活动',
          succeedStr : '投票成功，快去抽奖吧',
        }
      });
    },
    //请求数据失败
    failData : (city,tgsb) =>{
      var time= 3;
      setInterval(function(){
        let str404 = `<img src="/hd/assets/images/404.png"/><span><b>${time}</b>秒后跳转到首页...</span>`;
        $('#body').html(str404).addClass('body404');
        $('#html').css('background','#fff');
        time--;
        if(time==0){
          if(tgsb=='pc'){
            window.location.href = `http://${city}.zeju.com/index`
          } else{
            window.location.href = `http://m.zeju.com/${city}`
          }
        }
        $('#html').css('opacity','1');
      },1000);
    },
    //zjfrom 值
    getZjfrom : function(){
      var zjf = this.getQueryString('zjfrom')!=null ? this.getQueryString('zjfrom') : getCookie('zjfrom');
        if(zjf!=null && zjf!=''){
          if(zjf<10){
            zjf = '0'+zjf
          }
        } else{
          zjf = '16'
        }
        return zjf;
    },
    //截止日期
    endTime : function(){
      var that= this;
      $.ajax({
        type: "GET",
        url: 'http://webapi.zeju.com/pingxuan/end_flag',
        async : false,
        success: function(data) {
          if(data.status==200){
            that.end_flag = data.data.end_flag;
            if(!that.end_flag){
              var cont = that.tiXingText();
              $('#seascape_wrap').fromAlerts({
                formAsync  : false,
                cont       : cont
              });
              $('#box_alert').css('display','block');
            }
          } else{
            that.end_flag = true;
          }
        }
      });
    },
    //提醒弹框内容
    tiXingText : () =>{
      var cont =`
                <div class="box_main box_main2" id="box_main">
                <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
                <div class="boxM_text3">
                  <div class="erweima_id" style="font-size:16px;width:100%;margin:0 0 20px;">活动已结束,请继续关注我们后续的活动！</div>
                </div>
              </div>`;
              return cont;
    },
    //页脚过期弹框
    footerBtn : function(){
      // var that = this;
      // $("#hd_btn").on('click',function(e){
        //截止日期
        // that.endTime()
        // if(!that.end_flag){
        //   $("#phone_error").html('');
        //   $("#name_error").html('');
        //   $("#yan_error").html('');
        //   return false;
        // }
      // })
    }
  }
  $.fn.extend({
    Public : (opts) => {
      return new Public(this,opts)
    }
  })
})(window)