(function(win){
  function Public (id,opts){
    var obj = {
      tgsb   :'pc',
      imgUrl :''
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.tgsb       = obj.tgsb;
    this.imgUrl     = obj.imgUrl;
    this.city_name  = '';
    this.hd_name    = '';
    this.init() ;
  }
  Public.prototype = {
    init : function(){
      $("#geshu_title").hide();
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'tj';
      //截取url 字段
      this.hd_name   = this.fieldUrl();
      if(this.hd_name == 'lqhb128802' && this.tgsb == 'm'){ 
        //增加兑换码，隐藏称呼
        this.exchangeFN ();
        this.clickNameFN()
      }
      this.renderPage(this.city_name,this.hd_name );
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
      return r[1]=='hd'?'lqhb128802':r[1];
    },
    //改变背景图片
    back_imgUrl : (obj,tgsb)  => {
      $('#back').attr('src',obj.colors[`bg_${tgsb}_url`]);
      $('#html').css({'background':obj.colors.bg_color,'opacity':'1'});
      $('#cont_btn').html(obj.hd_config.submit_btn_title).css({'background':obj.colors.submit_btn_color,'cursor':'pointer'});
      $('.cont_title').css('color',obj.colors.roles_color);
      $("#cont_box_roles").html(obj.hd_config.roles);
      $("#header_title").html(obj.hd_config.head_title);
    },
    //计数已抢红包个数
    qiang_hongbao : (cityName,async,hd_name,colors) =>{
      if(!async){ 
        $('#html').css('background','#6A7CEC');
        $('.main').css({'height':'60%','bottom':'4%'});
        $('.cont').find('div').addClass('flex1')
        return false;
      };
      $.ajax({
        type: "GET",
        url: "http://webapi.zeju.com/liuzi/hd_count",
        data: { 
          hd_name   : hd_name,
          city_name : cityName
        },
        success: function(data) {
          if(data.message=='succeed'){
            var count = Number(data.data.count),
            qing_name = count +148;
            if(Number(qing_name)>=800){
              var num = 1000-Number(qing_name);
              var str =  `<span>还剩<b id="qing_name">${name}</b>份</span>
                        <span>限额送<b>1000</b>份</span>`;
            } else {
              var str = `<span>已抢<b id="qing_name">${qing_name}</b>份</span>
                        <span>限额送<b>1000</b>份</span>`;
            }
            $("#geshu_title").html(str).show();
            $("#geshu_title b").css('color',colors.bg_color);
            $("#user_error").css("color",colors.bg_color);
          }
        }
      })  
    },
    //调用留资插件
    liuzi : (tgsb,city_name,hd_name,obj,colors) => {
       //调用留资插件
      $(".wrap").Liuzi({
        nameId  : "#user_name",
        phoneId : "#user_phone",
        yanzmId : "#user_yanzm",
        yanzmBtn: "#user_yanzmBtn",
        hdBtn   : "#cont_btn",
        cityName: city_name,
        hd_name : hd_name,
        huodongUrl   : obj.liuzi_api_url,
        yanBtnColor  : colors.bg_color,
        clue_type_id : '6',
        tgsb         : tgsb,
        yanzmText    : '获取验证码',
        layoutType   : 3,
        hd_alertArr  :{
          nameErrorText  : '请输入正确称呼！',
          phoneErrorText : '请输入正确的手机号！',
          yanErrorText   : '请输入正确的验证码！',
          succeedStr     : obj[`${tgsb}_succeed_alert`],
          repeatStr      : obj[`${tgsb}_repeat_alert`]
        }
      });
    },
    //请求数据
    renderPage : function(city_name,hd_name){
      var that = this;
      $.ajax({
        type: "POST",
        url: 'http://webapi.zeju.com/hd_templates/index',
        data:{
          city_name : city_name,
          hd_name   : hd_name
        },
        success: function(data) {
          if(data.message=='fail'){
            that.failData(city_name,that.tgsb);
          } else if(data.message=='succeed'){
            var obj = data.data;
            that.liuzi(that.tgsb,that.city_name,hd_name,obj.hd_config,obj.colors);//调用留资插件
            //改变背景图片
            that.qiang_hongbao(that.city_name,obj.hd_config.red_packet_status,hd_name,obj.colors);

            that.back_imgUrl(obj,that.tgsb);
          }
        }
      });
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
    //增加兑换码，隐藏称呼
    exchangeFN () {
      var name_box = document.getElementById('name_box');
      var user_name = document.getElementById('user_name');
      var huan_box = document.getElementById('huan_box');
      name_box.style.height = '0px';
      name_box.style.overflow ='hidden';
      user_name.value='lqhb128802';
      huan_box.className =  "" ;
    },
    //称呼隐藏，有默认
    clickNameFN () {
      $("#cont_btn").on('click',()=>{
        $("#huan_text").val('');
        setTimeout(() => {
          $("#user_name").val('lqhb128802');
        },5000);
      });
    }
  }
  $.fn.extend({
    Public : (opts) => {
      return new Public(this,opts)
    }
  })

})(window)