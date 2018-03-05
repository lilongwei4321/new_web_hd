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
        this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'all';
        //截取url 字段
        this.hd_name   = this.fieldUrl();
        //渲染页面
				this.renderPage(this.city_name,this.hd_name );
				this.changeFn();
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
        return r[1]=='hd'?'homebuyers':r[1];
      },
      //改变背景图片
      back_imgUrl : (colors,config,city,tgsb)  => {
        $("#banner").attr('src',colors[`bg_${tgsb}_url`]);
        setTimeout(function(){
          $("#html").css('opacity','1');
        },100);
        // 公共样式
        $("#loupanList").css('background',colors.list_div_bg_color);
        $("#hd_btn").html(config.submit_btn_title);
        $("#title").html(config.head_title);
        
        $('.explain').css('border',`5px solid ${colors.style_color}`);
        $('.tab_btn').css('background',colors.style_color);
        if(tgsb == 'pc'){
          $("section dl").css("background",colors.list_li_bg_color);
          $('.juzhong .on').css({'background':colors.selected_color});
          $('section dt').css({'background':colors.style_color,'color':colors.item_names_color});
          $('.seascape_footer').css('background',colors.style_color);
          $('.juzhong p').css('color',colors.categories_color);
          $('.footer1').css('background',colors.style_color);
          $('#hd_btn').css('background',colors.submit_btn_color);
          $('#hd_btn').css('color',colors.style_color);
        } else{
          $('.juzhong .on').css({'color':colors.selected_color});
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
			//切换城市
			changeFn :function(){
        var that = this;
				$('.juzhong').on('click','.tabCity',function(){
          $(this).addClass('on').siblings().removeClass('on').attr('style','');
          //修改城市
          that.city_name = $(this).attr('indexId');
          that.setCookie("city_name",that.city_name);
          var id = $(this).attr('data-id');
          //渲染页面
          var obj = JSON.parse(localStorage.getItem("cunData"));
          if(that.tgsb == 'pc'){
            that.succeed_pc_page(obj[id],that.zjfromFn(),that.city_name); //楼盘数据
          } else{
            that.succeed_m_page(obj[id],that.zjfromFn(),that.city_name); //楼盘数据
          }
          that.imPage(that.tgsb,that.city_name);//调用IM网易云信
        })
      },
      /*cookie 存储zjfrom 的值*/
      setCookie(name,value,days){
        var Days = 1000 ;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ encodeURI (value) + ";expires=" + exp.toGMTString()+";domain = zeju.com"+";path=/";
      },
      //请求数据
      renderPage : function(city_name,hd_name){
        var that = this;
        $.ajax({
          type: "GET",
          url: 'http://webapi.zeju.com/hd_templates/index',
          data:{
            city_name:city_name,
            hd_name:hd_name
          },
          success: function(data) {
            if(that.city_name == 'all'){that.city_name = 'bj';city_name = 'bj'};
            if(data.message=='fail'){
              that.failData(city_name,that.tgsb);
            } else if(data.message=='succeed'){
              var obj = data.data;
              localStorage.setItem('cunData',JSON.stringify(obj));
              that.setCookie("city_name",that.city_name);
              if(that.tgsb=='pc'){
                that.succeed_pc_page(obj[0],that.zjfromFn(),that.city_name); //楼盘数据
              } else {
                that.succeed_m_page(obj[0],that.zjfromFn(),that.city_name); //楼盘数据
              }
              //活动说明
              $('#explain_info').html(data.data.hd_config.roles);
              that.back_imgUrl(obj.colors,obj.hd_config,obj.city,that.tgsb);//改变背景
              that.liuzi(that.tgsb,that.city_name,obj.hd_config,hd_name);//调用留资插件
              that.imPage(that.tgsb,that.city_name);//调用IM网易云信
              $('#hd_phone').on('keyup',function(){
                var reg = /^1[34578]\d{9}$/;
                if(that.tgsb == 'pc'){
                  if($(this).val().length==11 && reg.test($(this).val())){
                    $('#hd_yanzmBtn').addClass('yanzm_btncolor').css({'background':obj.colors.submit_btn_color,'color':obj.colors.style_color}).attr("disabled", false);
                  } else{
                    $('#hd_yanzmBtn').removeClass('yanzm_btncolor').css({'background':'#c6c6c6','color':'#333'}).attr("disabled", true);
                  }
                } else{
                  if($(this).val().length==11 && reg.test($(this).val())){
                    $('#hd_yanzmBtn').addClass('yanzm_btncolor').css('background','#F63').attr("disabled", false);
                  } else{
                    $('#hd_yanzmBtn').removeClass('yanzm_btncolor').css('background','#c6c6c6').attr("disabled", true);
                  }
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
      //pc端渲染页面
      succeed_pc_page : (data,zjfrom,city_name) =>{
        //渲染楼盘数据
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
                str+=`<span>总价 <b>${m.average_price/10000}</b> 万元／套</span>`;
              } else{
                if(m.average_price!=''){
                  str+=`<span>均价 <b>${m.average_price}</b> 元／㎡</span>`;
                } else{
                  str+=`<b>暂无价格</b>`;
                }
              }
              if(m.ext_phone!=undefined && m.ext_phone!=null){
                str+=`<p class="phone"><b>售楼电话：</b><span>400-656-1188 转 ${m.ext_phone}${zjfrom}</span></p>`;
              } else{
                str+=`<p class="phone"><b>售楼电话：</b><span>400-656-1188 转 0</span></p>`;
              }
              str+=`<p class="dizhi duo"><b>售楼地址：</b><span>${m.detail_addres}</span></p>
                  <p class="liyou">
                    <a href="http://${city_name}.zeju.com/loupan/${m.item_spell}/${m.item_id}.html"  target="_blank">
                      <span>${m.labels}</span>
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
        $("#loupan_cont").html(str);
      },
      //m端渲染页面
      succeed_m_page : (data,zjfrom,city) =>{
        let str='';
        $.each(data,function(ind,m){
          str+=`<dl class="list">
          <dt>
            <a href="http://m.zeju.com/${city}/loupan/loupan_detail/${m.item_id}" style="background-image:url(http://imgs.zeju.cn${m.cover_pic})"></a>`
            if(m.price_type==null||m.average_price==0||m.average_price==null){
              str+=`<p class="price"><span>价格 - 暂无</span>`;
            } else if(m.price_type==4){
              str+=`<p><span>总价 <b>${m.average_price/10000}</b> 万元／套</span>`;
            } else {
              str+=`<p><span>均价 <b>${m.average_price}</b> 元／m²</span>`;
            }
            str+=`</p>
              </dt>
              <dd class="text">
                <p class="title">${m.item_name}</p>
                <p class="address">售楼地址：${m.detail_addres}</p>
                <p class="label_title">${m.labels}</p>`;
            if(m.ext_phone!=undefined && m.ext_phone!=null){
              str+=`<p class="phone"><a href="tel:4006561188,${m.ext_phone+zjfrom}">`;
            } else{
              str+=`<p class="phone"><a href="tel:4006561188,0">`;
            } 
            str+=`<img src="assets/images/m_rexian.png"></a></p>
              </dd>
          </dl>`
        })
        $("#loupanList").html(str);
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