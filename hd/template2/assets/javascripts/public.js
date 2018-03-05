(function(win){
  function Public (id,opts){
    var obj = {
      tgsb   :'pc',
      hd_name:'gdbs',
      data   : [],
      alertAsync : false
		}
		for(var i in opts){
			obj[i] = opts[i]
    }
    this.tgsb       = obj.tgsb;
    this.city_name  = '';
    this.hd_name    = '';
    this.data       = obj.data;
    this.alertAsync = obj.alertAsync;
    this.init() ;
  }
  Public.prototype = {
    //初始化
    init : function(){
      this.city_name = this.getQueryString('city')!=null?this.getQueryString('city'):'bj';
      this.hd_name = this.getQueryString1();
      this.data = this.dataJson(this.city_name,this.hd_name);//请求数据渲染页面
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
    getQueryString1 : () =>{
      var r = window.location.pathname.split('/');
      return r[1]=='hd'?'gdbs':r[1];
    },
    //json数据
    dataJson :function (cityName,hdName){
      var that = this;
      $('body').css('overflow-y','hidden');
      $.ajax({
        type: "POST",
        url: "http://webapi.zeju.com/hd_templates/index",
        data: {
          city_name : cityName,
          hd_name   : hdName
        },
        dataType:"json",
        async:false,
        success: function(data) {
          if(data.message=='succeed'){
            $('body').css('overflow-y','auto').show();
            $('#title').html(data.data.hd_config.head_title);
            that.quoteLiuzi(that.tgsb,that.city_name,data.data.hd_config,hdName);//调用留资插件

            if(that.tgsb=='pc'){
              that.pcJsonData(data,that.zjfromFn());
            }else if(that.tgsb=='m'){
              that.mJsonData(data,that.zjfromFn());
            }
          }else if(data.message=='fail'){
            var time= 3;
            setInterval(function(){
              let str404 = `<img src="/hd/assets/images/404.png"/><span><b>${time}</b>秒后跳转到首页...</span>`
              $('body').html(str404).addClass('body404').show();
              time--;
              if(time==0){
                if(that.tgsb=='pc'){
                  window.location.href = 'http://'+that.city_name+'.zeju.com/index';
                }else if(that.tgsb=='m'){
                  window.location.href = 'http://m.zeju.com/'+that.city_name+'/';
                }
                time=3;
              }
            },1000);
            return false;
          }else{
            $('body').css('overflow-y','auto').show();
          }
        }
      })  
    },
    //pc渲染数据
    pcJsonData : (data,zjfrom) =>{
      var data = data.data;
      var tuijianStr ='<ul>';
      var remenStr = '<ul>';
      $.each(data.hot_loupans,function(ind,item){
        if(ind%2==0){
          remenStr+='<li>'
        }
        remenStr+='<dl>'+
        '<dt class="border_color"><a href="http://bj.zeju.com/loupan/'+item.item_spell+'/'+item.item_id+'.html" target="_blank" style="background-image:url(http://imgs.zeju.cn'+item.cover_pic+')"></a></dt>'+
        '<dd>'+
            '<h3 class="itme_color">'+item.item_name+'</h3>'+
            '<p>'+item.sales_address+'</p>'+
            '<p><span>推荐理由</span></p>'+
            '<p>'+item.summary+'</p>'+
        '</dd>'+
      '</dl>';
        if(ind%2==1){
          remenStr+='</li>'
        }
      })
      $.each(data.genaral_loupans,function(ind,item){
        if(ind%3==0){
          tuijianStr+='<li>';
        }
        tuijianStr+='<dl>'+
      '<dt class="border_color"><a href="http://bj.zeju.com/loupan/'+item.item_spell+'/'+item.item_id+'.html" target="_blank"><img src="http://imgs.zeju.cn'+item.cover_pic+'" alt=""></a></dt>'+
      '<dd>'+
      '<p class="itme_color2">'+item.sales_address+'</p><p>';

      var obj =item.labels.split('、');
      $.each(obj,function(ind,m){
        tuijianStr+='<span class="label">' + m + '</span>';
      });

      tuijianStr+='</p></dd></dl>';
        if(ind%3==2){
          tuijianStr+='</li>';
        }
      })
      remenStr+='</ul>';
      $("#loupan_cont_remen").html(remenStr);
      $("#loupan_cont_tuijian").html(tuijianStr);
      //banner图
      $('#banner').attr('src',data.colors.bg_pc_url);
      //list_bg_color
      $('.bshb_main').css('background',data.colors.list_div_bg_clor);
      //list_border
      $('.border_color').css('border','1px solid'+data.colors.border_color);
      //itme_color
      $('.itme_color').css('color',data.colors.hot_item_title_color);
      $('.itme_color2').css('color',data.colors.item_title_color);
      $('.label').css('border','1px solid'+data.colors.labels_border_bg_color);
      $('#tab_bar_img').attr('src',data.colors.bg_bottom_url);
      //报名电话
      $('#yuyue').html(data.colors.phone_content);
      //提醒
      $('#bshb_btn').val(data.hd_config.submit_btn_title).css('background',data.hd_config.submit_btn_color);
    },
    //m渲染数据
    mJsonData : (dataobj,zjfrom) =>{
      var hotJson=dataobj.data.hot_loupans;
      var genJson=dataobj.data.genaral_loupans;
      var colorJson=dataobj.data.colors;
      var code=``;
      var codeJson=``;
      $.each(hotJson,function(i,itme){
        code +=`<li>
                  <a href="http://m.zeju.com/bj/loupan/loupan_detail/${itme.item_id}">
                    <div class="box-left fl">
                      <img class="itme-img" src="http://imgs.zeju.cn${itme.cover_pic}">
                    </div>
                    <div class="box-right">
                      <ul>
                        <li class="name">${itme.item_name}</li>
                        <li class="address">${itme.sales_address}</li>
                        <li>`;
                  if(itme.ext_phone!=undefined && itme.ext_phone !=null){
                    code+=`<a class="phone" href="tel://4006561188,${itme.ext_phone}${zjfrom}">`;
                  } else{
                    code+=`<a class="phone" href="tel://4006561188,0">`;
                  }
                  code+=`<i class="iconfont">&#xe64c;</i>
                          </a>
                        </li>
                        <li class="tag-reason">推荐理由</li>
                        <li class="contains">${itme.summary}</li>
                      </ul>
                    </div>
                  </a>
                </li>`;
      });
      $.each(genJson,function(k,itmeInd){
        codeJson +='<li>'+
            '<a href="http://m.zeju.com/bj/loupan/loupan_detail/'+itmeInd.item_id+'">'+
              '<div class="box-left fl">'+
                '<img class="itme-img" src="http://imgs.zeju.cn'+itmeInd.cover_pic+'" alt="">'+
              '</div>'+
              '<div class="box-right">'+
                '<ul>'+
                  '<li class="name">'+itmeInd.item_name+'</li>'+
                  '<li>'+itmeInd.sales_address+'</li>';

                  if(itmeInd.ext_phone!=undefined && itmeInd.ext_phone !=null){
                    codeJson+='<li><a class="phone" href="tel://4006561188,'+itmeInd.ext_phone+zjfrom+'"><i class="iconfont">&#xe64c;</i></a></li>';
                  } else{
                    codeJson+='<li><a class="phone" href="tel://4006561188,0"><i class="iconfont">&#xe64c;</i></a></li>';
                  }

                  codeJson+='<li class="list_last">';
                  $.each(itmeInd.labels.split('、'),function(i,itme){
                    codeJson+='<label class="tag">'+itme+'</label>';
                  })
                  codeJson+='</li>'+
                '</ul>'+
              '</div>'+
            '</a>'+
          '</li>';
      })
      $('#itmeHot').html(code);
      $('#itmeTotal').html(codeJson);
      //banner图
      $('#banner').attr('src',colorJson.bg_m_url);
      //list_bg
      $('.bodyer').css('background',colorJson.list_div_bg_clor);
      //border_color
      $('.box-left').css("border",'1px solid'+colorJson.border_color);
      //itme_name
      $('.name').css('color',colorJson.hot_item_title_color);
      //label
      $('label').css('background',colorJson.labels_bg_color);
      //报名
      $('#hd_btn').html(dataobj.data.hd_config.submit_btn_title);
      $('.mobile').html('<a id="hour" href="tel://'+dataobj.data.hd_config.hotline+'">24h电话咨询</a>')
    },
    //引用留资插件
    quoteLiuzi : (tgsb,cityName,huodong,hdName) =>{
       //调用留资插件
      $("#seascape_wrap").Liuzi({
        huodongUrl   : huodong.liuzi_api_url,
        hd_name       : hdName,
        cityName     : cityName,
        yanBtnColor  : 'codered',
        yanzmText    : '获取',
        clue_type_id : huodong.clue_type_id,
        tgsb         : tgsb,
        layoutType   : (tgsb=='pc'?'1':huodong.alert_type),
        hd_alertArr  :{
          alertId    : '#hd_alert',
          succeedStr : huodong[`${tgsb}_succeed_alert`],
          repeatStr  : huodong[`${tgsb}_repeat_alert`]
        }
      });
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