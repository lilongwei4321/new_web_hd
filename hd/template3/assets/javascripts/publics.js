var loupan_id = '',loupan_name='';
(function(win){
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
    // this.loupan_id  = '';
    // this.loupan_name= '';
    this.data       = obj.data;
    this.alertAsync = obj.alertAsync;
    this.init() ;
  }
  Public.prototype = {
    //初始化
    init : function(){
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'bj';
      this.hd_name = this.fieldUrl();
      this.renderPage(this.city_name,this.hd_name);
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
      return r[1]=='hd'?'hjf':r[1];
    },
    //改变背景图片
    back_imgUrl : (obj,tgsb)  => {
      $('#back_top').attr('src',obj.colors[`bg_${tgsb}_url`].bantop);
      $('#loupan_apply').attr('src',obj.colors[`bg_${tgsb}_url`].bg_img1);
      $('#loupan_back').attr('src',obj.colors[`bg_${tgsb}_url`].bg_img2);
      $('#loupan_bottom').attr('src',obj.colors[`bg_${tgsb}_url`].bg_img3);
      // if(tgsb=='m'){$('#back_from').attr('src',obj.colors[`bg_${tgsb}_url`].bg_img4);}
      $('.baoming_btn').css('bacckground',obj.colors.submit_btn_color);
      $('.container_title').find('span').css('background',obj.colors.item_category_color);
      $('.kangenduo_btn').css({
        'border-color':obj.colors.more_info_color,
        'color'       :obj.colors.more_info_color
      });
      $('#footer_text').html(obj.hd_config.roles);
      setTimeout(function(){
        $('#html').css('opacity','1')
      },200)
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
            //zjfrom
            that.clearHtml(obj,that.zjfromFn());//渲染页面
            that.quoteAlert(that.tgsb); //弹框插件
            that.quoteLiuzi(that.tgsb,that.city_name,that.hd_name,obj.hd_config);//调用留资插件
            that.hrefPage(city_name,that.tgsb);//跳转楼盘详情页
            that.morePage(city_name,that.tgsb);
            //改变背景图片
            that.back_imgUrl(obj,that.tgsb);
          }
        }
      });
    },
    //渲染html
    clearHtml : function(data,zjfrom) {
      var str = '';
      $.each(data.loupans, function (ind, item) {
        str += `<div class="tuwen">
                    <h4 class="container_title"><span>${item.title}</span> </h4>
                    <div class="mainBox_contRow"> `;
        $.each(item.loupan, function (i, m) {
          var price = '';
          if(m.price_type!=4){
            price = `${m.average_price}元/㎡`;
          } else {
            price = `${m.average_price}元/套`;
          }
          if (i % 2 == 0) {
            str += `<div class="box"><dl class="divWei left">`;
          } else {
            str+=`<dl class="divWei right">`
          }
          str += `<dt>
                    <a href="javascript:;" data-id="${m.item_id}" data-name="${m.item_spell}" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})" class="loupan_xqbtn"></a>
                  </dt>
                  <dd>
                    <h2>${m.item_name}</h2>
                    <p><span class="price">${price}</span><span class="phone_btn">`;
              if(m.ext_phone!=undefined && m.ext_phone!=null){
                str+=`<a href="tel:4006561188,${m.ext_phone}${zjfrom}"></a>`;
              } else{
                str+=`<a href="tel:4006561188,0"></a>`;
              }  
              str+=`</span></p>
                    <div><input class="baoBtn baoming_btn" type="button" value="我要报名" data-id="${m.item_id}" data-name="${m.item_name}"></div>
                  </dd></dl>`;
          if(i%2==1){
            str += `</div>`;
          }
        });
        str += `</div>
                <h4 class="container_genduo">
                  <a href="javascript:;" >
                    <span class="kangenduo_btn" data-name="${item.title_spell}">查看更多</span>
                  </a>
                </h4>
              </div>`;
      });
      $('#mainBox_cont').html(str);
    },
    //引用弹框插件
    quoteAlert : function(tgsb){
      if(tgsb=='pc'){
        $('#seascape_wrap').fromAlerts({
          title : "预约看房",
          formAsync  : true,
          btns : ['预约免费专车']
        });
      }
      $('.baoming_btn').on('click',function(){
        loupan_id = $(this).attr('data-id');
        loupan_name = $(this).attr('data-name');
        if(loupan_id==undefined){loupan_id = '';}
        if(loupan_name==undefined){loupan_name = '';}
        if(tgsb=='pc'){
          $("#box_alert").show();
        } else{
         $(document).scrollTop($('#main_box_from')[0].offsetTop-100)
        }
      });
    },
    //引用留资插件
    quoteLiuzi : (tgsb,city_name,hd_name,obj) =>{
      //调用留资插件
      $("#seascape_wrap").Liuzi({
        cityName     : city_name,
        huodongUrl   : obj.liuzi_api_url,
        hd_name      : hd_name,
        yanBtnColor  : 'yanzm_btncolor',
        clue_type_id : '4',
        tgsb         : tgsb,
        yanzmText    : '获取验证码',
        layoutType   : 4,
        hd_alertArr  :{
          nameErrorText  : '请输入正确称呼！',
          phoneErrorText : '请输入正确的手机号！',
          yanErrorText   : '请输入正确的验证码！',
          repeatStr      : obj[`${tgsb}_repeat_alert`],
          succeedStr     : obj[`${tgsb}_succeed_alert`]
        }
      });
    },
    //跳转更多页面
    morePage  : (name,tgsb) =>{
      $('.kangenduo_btn').on('click', function () {
        var src = $(this).attr('data-name');
        if (tgsb=='pc') {
          window.open(`http://${name}.zeju.com/loupan/${src.split(',')[0]}/`);
        } else {
          location.href = `http://m.zeju.com/${name}/loupan/list/index?quyu=${src.split(',')[1]}/`;
        }
      });
    },
    //楼盘跳转详情
    hrefPage : (names,tgsb) => {
      $(".loupan_xqbtn").on('click', function () {
        var id = $(this).attr('data-id'),name = $(this).attr('data-name');
        if (tgsb=='pc') {
          window.open( `http://${names}.zeju.com/loupan/${name}/${id}.html`);
        } else {
          location.href = `http://m.zeju.com/${names}/loupan/loupan_detail/${id}`;
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
    zjfromFn : function(){
      var zjf = this.getQueryString('zjfrom');
      if(zjf !=null && zjf !=''){
        if(zjf <10){
          zjf = '0'+zjf
        }
      } else{
        if(this.tgsb =='m'){
          zjf = '00';
        }else{
          zjf = '16';
        }
      }
      return zjf ;
    }
  }
  $.fn.extend({
    Public : (opts) => {
      return new Public(this,opts)
    }
  })
})(window)