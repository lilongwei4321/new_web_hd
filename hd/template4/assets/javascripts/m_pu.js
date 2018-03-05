;(function(win){
    function Public (id,opts){
      var obj = {
        tgsb   :'m'
      }
      for(var i in opts){
        obj[i] = opts[i]
      }
      this.tgsb       = obj.tgsb;
      this.city_name  = '';
      this.end_flag   = true;
      this.init() ;
    }
    Public.prototype = {
      init : function(){
        //获取地址栏参数
        this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'bj';
        //截取url 字段
        this.hd_name   = this.fieldUrl();
        //渲染楼盘页面
        this.itmeTab();
        //弹框
        this.alertInfo();
        //调用抽奖弹框
        this.choujiang(this.city_name);
        //页脚过期弹框
        this.footerBtn();
      },
      //调用抽奖弹框
      choujiang : function(city_name){
        var that = this;
        $("#zhuan_zhi_m").on('click',function(){
          //截止日期
          that.endTime()
          if(!that.end_flag){
            return false;
          }
          var refcode ='';
          //判断是否是推荐来的
          if(that.getQueryString('refcode')!=null){
            refcode = that.baseJia(that.getQueryString('refcode'),false);
          } else{
            refcode = '';
          }
          var phone = getCookie('zj_tow11_phone');
          // phone = '15076108182';
          if(phone!=null){
            //判断是否可以抽奖
            that.judgeChou({
              city_name : city_name,
              zjfrom    : that.getZjfrom() ,
              phone     : phone
            });
          } else{
            that.alertChoujiang(that.hd_name,refcode);
          }
        })
      },
      //抽奖弹框插件
      alertChoujiang : function(hd_name,refcode){
        // console.log(hd_name+'===='+refcode)
        //设置遮罩图的大小
        $('.message').css({
          height : window.innerHeight+'px',
          width  : window.innerWidth+'px',
        }).show();
        window.scrollTo(0,0);
        //禁止上下滑动
        $("body").on("touchmove",function(event){
          event.preventDefault;
        }, false);
        $(".wrap").Liuzi({
          nameId 		: $('#hd_name_info'),//用户称
          phoneId		: $('#hd_phone_info'),//用户手号
          yanzmId   : $('#hd_yanzm_info'),
          yanzmBtn	: $('#hd_yanzmBtn_info'),
          hdBtn			: $('#hd_btn_info'),
          nameError : $('#name_error_info'),
          yanError 	:	$('#yan_error_info'),
          phoneError   : $('#phone_error_info'),
          yanBtnColor  : 'yanzm_btncolor',
          huodongUrl   :'http://webapi.zeju.com/liuzi/hd_shoppingday_liuzi',
          tgsb         :'m',
          cityName     : this.city_name,
          hd_name      : hd_name,
          refcode      : refcode,
          yanzmText    : '获取',
          layoutType   : 5,
          hd_alertArr  :{
            succeedStr : '<p class="p1">您已领取1111元购房基金！！！已发放至您手机号，请注意查收。</p>',
            repeatStr  : '',
            yanErrorText : '请输入正确的验证码'
          }
        });
      },
      //判断是否可以抽奖
      judgeChou : function(obj){
        var  that= this;
        $.ajax({
          type: "POST",
          url: 'http://webapi.zeju.com/liuzi/hd_shoppingday_auth',
          data:{
            city_name : obj.city_name,
            zjfrom    : obj.zjfrom,
            phone     : obj.phone
          },
          success: function(data) {
            if(data.status==200){
              if(data.data.usable_count>0){
                var zhuanNum = $("#zhuan_yuan_m").attr('data-num');
                $('#wrap').Turntable({
                  oPointer   : "#zhuan_zhi_m",
                  oTurntable : "#zhuan_yuan_m",
                  cat        : 40 ,
                  temp       : zhuanNum,
                  time       : 8
                },function(num){
                  //将中奖信息发给后台
                  that.setJiangNum(obj,num);
                });
              } else{
                $('.shengyu').html('您最高抽中'+ data.data.lottery_money+'元，还剩'+ data.data.usable_count +'次')
                //没有次数，显示二维码
                that.alertJiang(data.data.lottery_money);
              }
            } else{
              //没有次数，显示二维码
              that.alertChoujiang(that.hd_name);
            }
          }
        });
      },
      // 中奖弹出弹框 
      alertJiang : function(data){
        var obj = {
            phone : getCookie('zj_tow11_phone'),
            url   :  window.location.origin+window.location.pathname
          }
          //弹框内容回调
          if(this.tgsb=='m'){
            //设置遮罩图的大小
            $('.message').css({
              height : window.innerHeight+'px',
              width  : window.innerWidth+'px',
            }).show();
            window.scrollTo(0,0);
            //禁止上下滑动
            $("body").on("touchmove",function(event){
              event.preventDefault;
            }, false);
            $('#liuzi2').hide();
            $('#box_alert,#statusId_info').css('display','block');//留资
            $('#money').html(data);
            //生成二维码
            this.newErweima (obj);
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
      //生成二维码
      newErweima : function(obj){
        // obj.phone = '15076108182';
        var phone = this.baseJia(obj.phone,true);
        $('#erweima_id').html('');
        $("#erweima_id").qrcode({
            render : "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
            text  : obj.url+"?refcode="+phone,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
            width : "140",               //二维码的宽度
            height : "140",              //二维码的高度
            background : "#ffffff",       //二维码的后景色
            foreground : "#000000",        //二维码的前景色
            src: '/hd/template4/assets/images/logo.png' //二维码中间的图片
        });
      },
      //将中奖信息发给后台
      setJiangNum : function(obj,num) {
        var that = this;
        var type ={
          '111' : 1,
          '222' : 2,
          '555' : 3
        }
        $.ajax({
          type: "POST",
          url: 'http://webapi.zeju.com/liuzi/hd_shoppingday_yj',
          data:{
            city_name : obj.city_name,
            zjfrom    : obj.zjfrom,
            phone     : obj.phone ,
            lottery_type : type[num]
          },
          success: function(data) {
            // 中奖弹出弹框 
            that.alertJiang(data.data.current_lottery);
            $('.shengyu').html('您最高抽中'+ data.data.lottery_money+'元，还剩'+ data.data.usable_count +'次')
          }

        })
      },
      //渲染楼盘页面
      itmeTab : function(){
        var that = this;
        var arrUrl = {
          'bj' : "http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=7363128495&storeType=2&storeCode=10000701",
          'cc' : "http://res.m.suning.com/project/zhaoji/activiteDetails_1.html?activityCode=1450333594&storeType=2&storeCode=10001725",
          'tj' : "http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=8217469660&storeType=2&storeCode=10000887",
          'cs' : "http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=2162075837&storeType=2&storeCode=10005020",
          'suzhou'   : "http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=7436942000&storeType=2&storeCode=10028764"}
        that.renderPage({
          city_name : 'bj'
        });
        $("#city_box").on('click','li',function(){
          $(this).addClass('on').siblings().removeClass('on');
          that.renderPage({
            city_name : $(this).attr('indexId')
          });
          var indexId = $(this).attr('indexId');
          // that.city_name = indexId;
          $('.suning a').attr('href',arrUrl[indexId]);
          $('.suning img').attr('src','assets/images/m_'+indexId+'.jpg');
        })
        // $('.itmeCity').each(function(index){
        //   $(this).click(function(){
        //     that.renderPage({
        //       city_name : $(this).attr('indexId')
        //     });
        //     var indexId = $(this).attr('indexId');
        //     that.city_name = indexId;
        //     $('.suning a').attr('href',arrUrl[index]);
        //     $('.suning img').attr('src','assets/images/m_'+indexId+'.jpg');
        //   })
        // })
      },
      //获取地址栏参数
      getQueryString : (name) => {
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
      fieldUrl : () => {
        var r = window.location.pathname.split('/');
        return r[1]=='hd'?'bj':r[1];
      },
      //调用留资插件
      liuzi : (tgsb,city_name,config) => {
        $(".wrap").Liuzi({
          yanBtnColor : 'yanzm_btncolor',
          huodongUrl   :'http://webapi.zeju.com/liuzi/hd_shoppingday_hb',
          tgsb         :'m',
          cityName     : city_name,
          yanzmText    : '获取',
          layoutType   : 0,
          hd_alertArr  :{
            succeedStr : '<p class="p1">您已领取1111元购房基金！！！已发放至您手机号，请注意查收。</p>',
            repeatStr  : '<p class="p1">您已领取1111元购房基金！！！已发放至您手机号，请注意查收。</p>',
            expireStr  : '<p class="p1">您来晚一步,红包已领完了。</p>'
          }
        });
      },
      //请求数据
      renderPage : function(obj){
        var that = this,city_name = obj.city_name;
        $.ajax({
          type: "GET",
          url: 'http://webapi.zeju.com/loupans/shoppingday',
          data:{
            city_name:city_name
          },
          success: function(data) {
            if(data.message=='fail'){
              that.failData(city_name,that.tgsb);
            } else if(data.message=='ok'){
              var obj = data.data;
              that.succeed_m_page(obj,that.getZjfrom(),city_name); //楼盘数据
              that.imPage('m',city_name);//调用IM网易云信
              that.liuzi(that.tgsb,city_name);//调用留资插件
            }
          }
        })
      },
      //请求数据失败
      failData : (city,tgsb) =>{
        var time= 3;
        setInterval(function(){
          let str404 = `<img src="/hd/assets/images/404.png"/><span><b>${time}</b>秒后跳转到首页...</span>`;
          $('#body').html(str404).addClass('body404');
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
      //m端渲染页面
      succeed_m_page : (data,zjfrom,city) =>{
        let str='';
        $.each(data,function(ind,m){
          str+=`<dl class="list">
              <dt>
                <a href="http://m.zeju.com/${city}/loupan/loupan_detail/${m.item_id}" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})"></a>`
                if(m.salse_status=='在售'){
                  str+=`<span class="state">【在售】</span>`;
                } else if(m.salse_status=='待售'){
                  str+=`<span class="state">【待售】</span>`;
                } else if(m.salse_status=='售罄'){
                  str+=`<span class="state">【售罄】</span>`;
                } else if(m.salse_status=='热销'){
                  str+=`<span class="state">【热销】</span>`;
                }
                if(m.price_type==null||m.current_average_price==0||m.current_average_price==null){
                  str+=`<p class="price"><span>价格 - 暂无</span>`;
                } else if(m.price_type==4){
                  str+=`<p><span>总价 <b>${m.current_average_price}</b> 元／套</span>`;
                } else {
                  str+=`<p><span>均价 <b>${m.current_average_price}</b> 元／m²</span>`;
                }
                str+=`<time>(${m.current_update_date})</time>`;
                str+=`</p>
                  </dt>
                  <dd class="text">
                    <p class="title">${m.item_name}</p>
                    <p class="address">售楼地址：${m.detail_addres}</p>
                    <p class="label_title">${m.current_lables}</p>`;

                if(m.ext_phone!=undefined && m.ext_phone!=null){
                  str+=`<p class="phone"><a href="tel:4006561188,${m.ext_phone+zjfrom}">`;
                } else{
                  str+=`<p class="phone"><a href="tel:4006561188,0">`;
                } 

                str+=`<img src="assets/images/rexian.png"></a></p>
                  </dd>
              </dl>`
        })
        $("#loupan_cont").html(str);
      },
      //弹框
      alertInfo : function() {
        var that = this;
        //活动规则弹框
        $('#activeRules').click(function(){
          $('.activeRuleClose').show();
        })
        //关闭活动规则弹框
        $('.activeRuleClose').click(function(){
          $(this).hide();
        })
        //关闭弹框
        $('.infoClose').click(function(){
          $('.message').hide();
          $("body").off("touchmove");
        })
      },
      //调用IM网易云信
      imPage : (tgsb,city_name) =>{
        setTimeout(function(){
          $("#html").css('opacity','1');
        },100);
        if(tgsb=='pc'){
          $("#zixun").on('click',function(){
            var iframe =$(`<iframe class="iframe" id="iframe" src="/hd/im.html?city=${city_name}"></iframe>`);
            $('#wrap').after(iframe);
  
            $('#iframe').show();
            $("#guan_iframe").show();
          })
          $("#guan_iframe").on('click',function(){
            $('#iframe').hide();
            $("#guan_iframe").hide();
          });
        } else{
          $("#online").attr('href',`http://m.zeju.com/m/index.html?city_name=${city_name}`).show()
        }
      },
      //zjfrom 值
      getZjfrom : function(){
        var zjf = this.getQueryString('zjfrom')!=null ? this.getQueryString('zjfrom') : getCookie('zjfrom');
          if(zjf!=null && zjf!=''){
            if(zjf<10){
              zjf = '0'+zjf
            }
          } else{
            zjf = '00'
          }
        return zjf;
      },
      //截止日期
      endTime : function(){
        var that= this;
        $.ajax({
          type: "GET",
          url: 'http://webapi.zeju.com/hd_templates/hd_shoppingday_flag',
          async : false,
          success: function(data) {
            if(data.status==200){
              that.end_flag = data.data.end_flag;
              if(!that.end_flag){
                $("#activeRuleClose").html('<div class="daoqi">活动已结束,请继续关注我们后续的活动！</div>').css('display','block');
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
                  <div class="boxM_text2">
                    <div class="erweima_id" style="font-size:16px;width:100%;margin:0 0 20px;">活动已结束,请继续关注我们后续的活动！</div>
                  </div>
                </div>`;
                return cont;
      },
      //页脚过期弹框
      footerBtn : function(){
        var that = this;
        $("#hd_btn").on('click',function(e){
          //截止日期
          that.endTime()
          if(!that.end_flag){
            $("#phone_error").html('');
            $("#name_error").html('');
            $("#yan_error").html('');
            return false;
          }
        })
      }
    }
    $.fn.extend({
      Public : (opts) => {
        return new Public(this,opts)
      }
    });
  })(window)