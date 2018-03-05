
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
    this.data       = obj.data;
    this.alertAsync = obj.alertAsync;
    this.zjfrom     = null;
    this.end_flag   = true;
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
    init : function(){
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'bj';
      //活动url;
      this.hd_name = this.fieldUrl();
      //调用城市数据
      this.switchCity(this.city_name);
      //点击抽奖
      this.clickChouBtn(this.city_name);
      //页脚留资
      this.quoteLiuzi_footer(this.tgsb,this.city_name,this.hd_name);
      //调用IM
      this.imPage(this.tgsb,this.cityNameobj[this.city_name]);
      //页脚过期弹框
      this.footerBtn();
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
    //调用城市数据 
    switchCity : function (city_name){
      var that = this;
      //默认
      this.renderPage(city_name);
      $("#city_nav").on('click','a',function(){
        var id = $(this).attr('data-id');
            $(this).addClass('on').siblings().removeClass('on');
            that.renderPage(id);
            //调用IM
            that.imPage(that.tgsb,that.cityNameobj[id]);
      });
    },
    //请求数据
    renderPage : function(city_name){
      var that = this,
          obj  = {
            'cs':'http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=2162075837&storeType=2&storeCode=10005020',
            'cc':'http://res.m.suning.com/project/zhaoji/activiteDetails_1.html?activityCode=1450333594&storeType=2&storeCode=10001725',
            'suzhou': 'http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=7436942000&storeType=2&storeCode=10028764',
            'tj': 'http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=8217469660&storeType=2&storeCode=10000887',
            'bj': 'http://mois.suning.com/signUpTemplet/sendRedirect.do?activityCode=7363128495&storeType=2&storeCode=10000701'
          }

      $("#guangao_box_a").attr('href',obj[city_name]).find('img').attr('src','assets/images/'+city_name+'_pc.jpg');
      $.ajax({
        type: "GET",
        url: 'http://webapi.zeju.com/loupans/shoppingday',
        data:{
          city_name : city_name,
          zjfrom    : that.getZjfrom()
        },
        success: function(data) {
          if(data.status==200){
            that.clearHtml(data.data,city_name,that.getZjfrom());
          } else{
            that.failData(city_name,that.tgsb);
          }
        }
      });
    },
    //渲染html
    clearHtml : (data,city_name,zjfrom)=> {
      var str='';
      $.each(data,function(i,m){
        if(i%4==0){
          str+=`<section>`
        }
          str+=`	<dl>
            <dt>${m.item_name}</dt>
            <dd>
              <a href="http://${city_name}.zeju.com/loupan/${m.item_spell}/${m.item_id}.html"  target="_blank" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})">
              </a>
              <p class="price">`;
              if(m.price_type==4){
                str+=`<span>均价 <b>${m.current_average_price}</b> 元／套</span>`;
              } else{
                if(m.current_average_price!=''){
                  str+=`<span>均价 <b>${m.current_average_price}</b> 元／㎡</span>`;
                } else{
                  str+=`<b>暂无价格       </b>`;
                }
              }
                str+=`<time>（${m.current_update_date})</time></p>`;
                
                if(m.ext_phone!=undefined && m.ext_phone!=null){
                  str+=`<p class="phone"><b>售楼电话：</b><span>400-656-1188 转 ${m.ext_phone}${zjfrom}</span></p>`;
                } else{
                  str+=`<p class="phone"><b>售楼电话：</b><span>400-656-1188 转 0</span></p>`;
                }
              
                str+=`<p class="dizhi duo"><b>售楼地址：</b><span>${m.detail_addres}</span></p>
                    <p class="liyou">
                      <a href="http://${city_name}.zeju.com/loupan/${m.item_spell}/${m.item_id}.html"  target="_blank">
                        <span>${m.current_lables}</span>
                      </a>
                    </p>
                  </dd>
                </dl>`;
        if(data.length%4!=0 && (i+1)==4*(data.length/4)){
          var hang = Math.ceil(data.length/4),
              ge   = (hang*4)-(i+1);
              for(var k=0;k<ge;k++){
                str+=`<dl style="background:transparent"><dd></dd></dl>`;
              }
        }
        if(i%4==3){
          str+=`</section>`;
        }
      })
      $("#loupan_box").html(str);
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
        var phone = getCookie('zj_tow11_phone');
        if(phone!=null){
          //判断是否可以抽奖
          that.judgeChou({
            city_name : city_name,
            zjfrom    : that.getZjfrom() ,
            phone     : phone
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
      if(!that.zhuanDong){return false};//是否可以转动
      that.zhuanDong = false;
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
              var zhuanNum = $("#zhuan_yuan_pc").attr('data-num');
              $('#seascape_wrap').Turntable({
                oPointer   : "#zhuan_zhi_pc",
                oTurntable : "#zhuan_yuan_pc",
                cat        : 40 ,
                temp       : zhuanNum,
                time       : 8
              },function(num){
                //将中奖信息发给后台
                that.setJiangNum(obj,num);
              });
            } else{
              //没有次数，显示二维码
              that.alertJiang(data.data);
            }

          } else{
            //状态不对，显示留资弹框
            var cont=that.alertHtml(false,'',obj.city_name);
            if(that.tgsb=='pc'){
              $('#seascape_wrap').fromAlerts({
                formAsync  : true,
                cont     : cont
              });
            }
            $('#box_alert').css('display','block');//留资
          }
        }
      });
    },
    //引用弹框插件
    quoteAlert : function(tgsb,city_name,hd_name){
      var cont=this.alertHtml(false,'',city_name);
      if(tgsb=='pc'){
        $('#seascape_wrap').fromAlerts({
          formAsync  : true,
          cont     : cont
        });
        this.quoteLiuzi_alert(tgsb,city_name,hd_name);
      }
    },
    // 中奖弹出弹框 
    alertJiang : function(data){
      var obj = {
          phone : getCookie('zj_tow11_phone'),
          url   : window.location.origin+window.location.pathname
        }
        //弹框内容回调
        var cont=this.alertHtml(true,data);
        if(this.tgsb=='pc'){
          $('#seascape_wrap').fromAlerts({
            formAsync  : true,
            cont       : cont
          });
          //生成二维码
          this.newErweima (obj);
        }
        $('#box_alert').css('display','block');//留资
        this.zhuanDong = true;
    },
		//生成二维码
		newErweima : function(obj){
      var phone = this.baseJia(obj.phone,true);
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
    alertHtml : (async,obj,city_name) =>{
      var str='';
      if(!async){
        str+=`<div class="box_main box_main1" id="box_main">
              <header class="boxM_title"><span>填写信息参与抽奖</span><b class="guan" id="alert_guan"></b></header>
              <div class="boxM_text">
                <p>
                  <input type="text" placeholder="怎么称呼您" id="al_hd_name" maxlength="16">
                </p>
                <p>
                  <input type="text" placeholder="请输入您的手机号" id="al_hd_phone" maxlength="11">
                </p>
                <p class="yan">
                  <input type="text" placeholder="请输入验证码" class="pop-input1" id="al_hd_yanzm" maxlength="4">
                  <input type="button" class="cod_btn"  value="获取验证码" id="al_hd_yanzmBtn" disabled="disabled">
                </p>
                <div class="city">
                  <span>城市</span>
                  <div id="select_city">
                    <p data-id="${city_name}">长春</p>
                    <ul>
                      <li data-id="bj">北京</li>
                      <li data-id="cc">长春</li>
                      <li data-id="tj">天津</li>
                      <li data-id="cs">长沙</li>
                      <li data-id="suzhou">苏州</li>
                    </ul>
                  </div>
                </div>
                <p id="al_user_error" class="user_error"></p>
                <p class="last_p">
                  <span class="box_alertBtn" id="al_hd_btn">立即领取抽奖机会</span>
                </p>
              </div>
            </div>`;
      } else{
        str+=`
            <div class="box_main box_main2" id="box_main">
              <header class="boxM_title"><b class="guan" id="alert_guan"></b></header>
              <div class="boxM_text2">
                <h4>恭喜您抽取${obj.current_lottery}元购房定金</h4>
                <p>（已发放至您手机号，请注意查收）</p>
                <div id="erweima_id" class="erweima_id"></div>
                <p>手机微信扫一扫将活动链接分享给好友<br>报名即可增加抽奖机会。（最多获取5次抽奖机会）</p>
                <p class="jihui">您最高抽中<b>${obj.lottery_money}元，</b>还剩<b>${obj.usable_count}</b>次机会</p>
              </div>
            </div>`;
      }
      return str;
    },
    //引用留资插件---页脚
    quoteLiuzi_footer : function(tgsb,city_name,hd_name){
      //页脚调用留资插件
      $("#seascape_wrap").Liuzi({
        cityName     : city_name,
        huodongUrl   : 'http://webapi.zeju.com/liuzi/hd_shoppingday_hb',
        hd_name      : hd_name,
        yanBtnColor  : 'yanzm_btncolor',
        clue_type_id : '4',
        tgsb         : tgsb,
        yanzmText    : '获取',
        layoutType   : 0,
        huidiao      : true,
        hd_alertArr  : {
          repeatStr  : '您已领取1111元购房基金！！！已发放至您手机号，请注意查收。',
          succeedStr : '您已领取1111元购房基金！！！已发放至您手机号，请注意查收。',
          expireStr  : '您来晚一步,红包已领完了。'
        }
      });
    },
    //弹框引用留资插件
    quoteLiuzi_alert : function(tgsb,city_name,hd_name){
      var refcode ='';
      //判断是否是推荐来的
      if(this.getQueryString('refcode')!=null){
        refcode = this.baseJia(this.getQueryString('refcode'),false)
      }
      //弹框调用留资插件
      $("#seascape_wrap").Liuzi({
        cityName     : city_name,
        nameId  	   : "#al_hd_name",
        phoneId 	   : "#al_hd_phone",
        yanzmId 	   : "#al_hd_yanzm",
        yanzmBtn	   : "#al_hd_yanzmBtn",
        hdBtn        : "#al_hd_btn",
        publicError  : "#al_user_error",
        huodongUrl   : 'http://webapi.zeju.com/liuzi/hd_shoppingday_liuzi',
        hd_name      : hd_name,
        yanBtnColor  : 'yanzm_btncolor',
        clue_type_id : '4',
        tgsb         : tgsb,
        yanzmText    : '获取验证码',
        layoutType   : 4,
        huidiao      : true,
        refcode      : refcode,
        hd_alertArr  :{
          nameErrorText  : '请输入正确称呼！',
          phoneErrorText : '请输入正确的手机号！',
          yanErrorText   : '请输入正确的验证码！',
          repeatStr      : '',
          succeedStr     : ''
        }
      },function(obj){
        if(obj.async){
          setCookie('zj_tow11_phone',obj.phone);
          $("#box_alert").css('display','none');
        }
      });
    },
    //将中奖信息发给后台
    setJiangNum : function(obj,num) {
      var type ={
            '111' : 1,
            '222' : 2,
            '555' : 3
          },
          that = this;
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
          if(data.status==200){
            // 中奖弹出弹框 
            that.alertJiang(data.data);
            that.zhuanDong = true;
          }
        }
      })
    },
    //请求数据失败
    failData : (city,tgsb) =>{
      var time= 3;
      setInterval(function(){
        let str404 = `<img src="/hd/assets/images/404.png"/><span><b>${time}</b>秒后跳转到首页...</span>`
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
    //调用IM网易云信
    imPage : (tgsb,city_name) =>{
      if(tgsb=='pc'){
        $("#zixun").on('click',function(){
          // $("#iframe").attr('src',`/hd/im.html?city=${city_name}`);
          var iframe =$(`<iframe class="iframe" id="iframe" src="/hd/im.html?city=${city_name}"></iframe>`);
          $('#iframe_box').html(iframe);
          $('#iframe_box').show();
          $("#guan_iframe").show();
        });

        $("#guan_iframe").on('click',function(){
          $('#iframe_box').hide();
          $("#guan_iframe").hide();
        });
      } else{
        $("#online").attr('href',`http://m.zeju.com/m/index.html?city_name=${city_name}`).show()
      }
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
  })
})(window)