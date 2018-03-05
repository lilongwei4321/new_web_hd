(function(win){
  function Public (id,opts){
    var obj = {
      tgsb   :'pc'
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.tgsb       = obj.tgsb;
    this.city_name  = '';
    this.hd_name    = '';
    this.init() ;
  }
  Public.prototype = {
    init : function(){
      //获取地址栏参数
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'hz';
      //截取url 字段
      this.hd_name   = this.fieldUrl();
      //渲染页面
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
      return r[1]=='hd'?'17gwxs':r[1];
    },
    //改变背景图片
    back_imgUrl : (colors,config,city,tgsb)  => {
      $("#banner").attr('src',colors[`bg_${tgsb}_url`]);
      setTimeout(function(){
        $("#html").css('opacity','1');
      },100);
      $("#online").css({'background':colors.im_bg_color});
      $("#loupanList").css('background',colors.list_div_bg_color);
      $(".list").css("background",colors.list_li_bg_color);
      $("#wrap").css("background",colors.bg_color);
      $("#hd_btn").html(config.submit_btn_title);
      $("#title").html(config.head_title);
      $('.loupan_item').css('background',colors.item_bg_color);
      $('.zixun_back').css('background',colors.im_bg_color);
      $('#gengduo,#hd_btn').css('background',colors.submit_btn_color);
      if(config.has_im){$("#zixun_back").show();}
      if(config.has_more_info){
        if(tgsb=='pc'){
          $("#More").css({height: '105px',paddingTop:0});
          $('#gengduo').show().attr('href',`http://${city.city_name_abbr}.zeju.com/loupan`);
        } else{
          $('#gengduo_back').addClass('flex');
          $("#gengduo").attr('href',`http://m.zeju.com/${city.city_name_abbr}/loupan/list/index`);
        }
      }
    },
    //调用留资插件
    liuzi : (tgsb,city_name,config,hd_name) => {
      $(".wrap").Liuzi({
        huodongUrl   :config.liuzi_api_url,
        yanBtnColor  :'yanzm_btncolor',
        clue_type_id :config.clue_type_id,
        tgsb         :tgsb,
        yanzmText    : '获取',
        cityName     : city_name,
        hd_name      : hd_name,
        layoutType   : config.alert_type,
        hd_alertArr  :{
          succeedStr : config[`${tgsb}_succeed_alert`],
          repeatStr  : config[`${tgsb}_repeat_alert`]
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
          city_name:city_name,
          hd_name:hd_name
        },
        success: function(data) {
          if(data.message=='fail'){
            that.failData(city_name,that.tgsb);
          } else if(data.message=='succeed'){
            var obj = data.data;
            if(that.tgsb=='pc'){
              that.succeed_pc_page(obj,that.zjfromFn(),that.getQueryString('city')); //楼盘数据
            } else {
              that.succeed_m_page(obj,that.zjfromFn(),that.getQueryString('city')); //楼盘数据
            }
            that.back_imgUrl(obj.colors,obj.hd_config,obj.city,that.tgsb);//改变背景
            that.liuzi(that.tgsb,that.city_name,obj.hd_config,hd_name);//调用留资插件
            that.imPage(that.tgsb,that.city_name);//调用IM网易云信
            $('#hd_phone').on('keyup',function(){
              var reg = /^1[34578]\d{9}$/;
              if($(this).val().length==11 && reg.test($(this).val())){
                $('#hd_yanzmBtn').addClass('yanzm_btncolor').css('background',obj.colors.submit_btn_color).attr("disabled", false);
              } else{
                $('#hd_yanzmBtn').removeClass('yanzm_btncolor').css('background','#c6c6c6').attr("disabled", true);
              }
            })
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
    //pc端渲染页面
    succeed_pc_page : (data,zjfrom,city) =>{
      let str='';
      $.each(data.loupans,function(ind,m){
        
        if(ind%2==0){
          str+=`<li>`;
        }
          str+=`<dl class="list">
              <dt>
                <h4 class="loupan_item">${m.item_name}</h4>
                <a href="http://${data.city.city_name_abbr}.zeju.com/loupan/${m.item_spell}/${m.item_id}.html"  target="_blank" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})">
                </a>
              </dt>
              <dd class="dd">`;
              if(m.price_type==null||m.average_price==0){
                str+=`<p class="price"><span>价格 - 暂无</span>`;
              } else if(m.price_type==4){
                str+=`<p class="price"><span>总价：<b>${m.average_price}</b>元／套</span>`;
              } else {
                str+=`<p class="price"><span>均价：<b>${m.average_price}</b>元／m²</span>`;
              }   
              let date  = m.update_date.substr(0,10).split('-');
                  str+=`<time>(${date[0]}.${date[1]}.${date[2]})</time>`;
                  str+=`</p>
                        <p class="Telephone"><span>售楼电话：</span>`;
                    if(m.ext_phone!=undefined && m.ext_phone !=null){
                      str+=`<span>400-656-1188 转 ${m.ext_phone}${zjfrom}</span></p>`;
                    } else{
                      str+=`<span>400-656-1188 转 0</span></p>`;
                    }
                    str+=`<p class="address"><span>售楼地址：</span><span>${m.sales_address}</span></p>
                    </dd>`;
                  if(m.salse_status=='在售'){
                    str+=`<dd class="state" style="background:${data.colors.sale_statuses[1]}">【在售】</dd>`;
                  } else if(m.salse_status=='待售'){
                    str+=`<dd class="state" style="background:${data.colors.sale_statuses[0]}">【待售】</dd>`;
                  } else if(m.salse_status=='售罄'){
                    str+=`<dd class="state" style="background:${data.colors.sale_statuses[2]}">【售罄】</dd>`;
                  } else if(m.salse_status=='热销'){
                    str+=`<dd class="state" style="background:${data.colors.sale_statuses[1]}">【热销】</dd>`;
                  }
                    str+=`</dl>`;
        if(data.length%2!= 0 && data.length-ind==1){
          str+=`<div class="list"></div>`
        }
        if(ind%2==1){
          str+=`</li>`;
        }
      });
      $("#loupan_cont").html(str);
    },
    //m端渲染页面
    succeed_m_page : (data,zjfrom,city) =>{
      let str='';
      $.each(data.loupans,function(ind,m){
        str+=`<dl class="list">
            <dt>
              <a href="http://m.zeju.com/${data.city.city_name_abbr}/loupan/loupan_detail/${m.item_id}" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})"></a>`
              if(m.salse_status=='在售'){
                str+=`<span class="state" style="background:${data.colors.sale_statuses[1]}">【在售】</span>`;
              } else if(m.salse_status=='待售'){
                str+=`<span class="state" style="background:${data.colors.sale_statuses[0]}">【待售】</span>`;
              } else if(m.salse_status=='售罄'){
                str+=`<span class="state" style="background:${data.colors.sale_statuses[2]}">【售罄】</span>`;
              } else if(m.salse_status=='热销'){
                str+=`<span class="state" style="background:${data.colors.sale_statuses[1]}">【热销】</span>`;
              }
              if(m.price_type==null||m.average_price==0||m.average_price==null){
                str+=`<p class="price"><span>价格 - 暂无</span>`;
              } else if(m.price_type==4){
                str+=`<p><span>总价 <b>${m.average_price}</b> 元／套</span>`;
              } else {
                str+=`<p><span>均价 <b>${m.average_price}</b> 元／m²</span>`;
              }   
              let date  = m.update_date.substr(0,10).split('-');
              str+=`<time>(${date[0]}.${date[1]}.${date[2]})</time>`;
              str+=`</p>
                </dt>
                <dd class="text">
                  <p class="title">${m.item_name}</p>
                  <p class="address">售楼地址：${m.sales_address}</p>`;
                  str+=`<p class="phone" style="background:${data.colors.rexian_color}">
                        <a href="tel:4006561188,${m.ext_phone}${zjfrom}">楼盘热线</a>
                      </p>`
        
                str+=`</dd>
            </dl>`
      })
      $("#loupan_cont").html(str);
    },
    //调用IM网易云信
    imPage : (tgsb,city_name) =>{
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
  });
})(window)