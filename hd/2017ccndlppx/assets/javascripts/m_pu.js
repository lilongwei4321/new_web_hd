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
        this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'cc';
        //截取url 字段
        this.hd_name   = this.fieldUrl();
        //渲染楼盘页面
        this.itmeTab();
        //调用抽奖弹框
        this.choujiang(this.city_name);
        //页脚过期弹框
        this.footerBtn();
        //获取用户身份
        this.userName();
        //点击投票
        this.clickToupiao();
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
      //点击投票
      clickToupiao : function(){
        var that = this;
        $('#loupanList').on('touchstart','.toupiao',function(index){
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
                fn.prev('.piao').html(data.data.polls+'票');
              }
            })
          }
        })
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
            var str = '前去提交投票信息，参与抽奖活动';
            that.alertChoujiang(str);
          }
        })
      },
      //抽奖弹框插件
      alertChoujiang : function(str){
        var i = 2;
        $('#activeRuleClose').show();
        $('.daoqi').html(str);
        setInterval(function(){
          if(i == 0){
            $('#activeRuleClose').hide();
          }
          i--;
        },1000);
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
                var zhuanNum = $("#zhuan_yuan_m").attr('data-num');
                $('#wrap').Turntable({
                  oPointer   : "#zhuan_zhi_pc",
                  oTurntable : "#zhuan_yuan_m",
                  cat        : 60 ,
                  temp       : zhuanNum,
                  time       : 6
                },function(num){
                  var cishu = getCookie('sycishu');
                  var str = `<h4>谢谢参与！</h4><p>剩余抽奖机会${cishu}次</p>`
                  that.alertChoujiang(str);
                });
              } else{
                var str = `抽奖次数已用完，感谢您关注择居2017年度楼盘评选活动`
                that.alertChoujiang(str);
              }
            } else if(data.status == 1){
              var str = '前去提交投票信息，参与抽奖活动';
              that.alertChoujiang(str);
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
          }
      },
      //渲染楼盘页面
      itmeTab : function(){
        var that = this;
        that.renderPage('1');
        $("#city_box").on('click','.itmeCity',function(){
          $(this).addClass('on').siblings().removeClass('on');
          var indexId = $(this).attr('indexId');
          that.renderPage(indexId);
        })
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
        return r[1]=='hd'?'2017ccndlppx':r[1];
      },
      //调用留资插件
      liuzi : (tgsb,city_name,hd_name) => {
        $(".wrap").Liuzi({
          huodongUrl   : 'http://webapi.zeju.com/liuzi/hd_lppx_liuzi',
          yanBtnColor  :'yanzm_btncolor',
          // clue_type_id : '6',
          tgsb         : tgsb,
          yanzmText    : '获取',
          cityName     : city_name,
          hd_name      : hd_name,
          layoutType   : '0',
          hd_alertArr  :{
            repeatStr  : '该手机号已参与活动',
            succeedStr : '投票成功，快去抽奖吧',
          }
        });
      },
      //请求数据
      renderPage : function(type){
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
              var obj = data.data;
              that.succeed_m_page(obj,that.city_name,type); //楼盘数据
              that.liuzi(that.tgsb,that.city_name,that.hd_name);//调用留资插件
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
      succeed_m_page (data,city_name,type){
        let str='';
        $.each(data,(i,m) =>{
          if(i%2==0){
            str+=`<section>`
          }
          str+=`
            <dl>
              <dt>${m.item_name}</dt>
              <dd>
                <a href="http://m.zeju.com/${city_name}/loupan/loupan_detail/${m.item_id}" target="_blank" style="background-image:url(http://imgs.zeju.cn/${m.cover_pic})">
                  <p>${m.detail_addres}</p>
                </a>
                <div>
                    <p class="piao">${m.polls}票</p>
                    <p class="toupiao ${m.is_voted?'':'jinzhi'}" indexId="${m.item_id}" typeId="${type}">投票</p>
                </div>
              </dd>
            </dl>`
            if(data.length%2!=0 && (i+1)==3*(data.length/3)){
              var hang = Math.ceil(data.length/2),
                  ge   = (hang*2)-(i+1);
              for(var k=0;k<ge;k++){
                str+=`<dl style="background:transparent;"><dd style="border:none;"></dd></dl>`;
              }
            }
            if(i%2==1){
              str+=`</section>`;
            }
        })
        $("#loupanList").html(str);
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
          url: 'http://webapi.zeju.com/pingxuan/end_flag',
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
      //页脚过期弹框
      footerBtn : function(){
        var that = this;
        // $("#hd_btn").on('click',function(e){
        //   //截止日期
        //   that.endTime()
        //   if(!that.end_flag){
        //     $("#phone_error").html('');
        //     $("#name_error").html('');
        //     $("#yan_error").html('');
        //     return false;
        //   }
        // })
      }
    }
    $.fn.extend({
      Public : (opts) => {
        return new Public(this,opts)
      }
    });
  })(window)