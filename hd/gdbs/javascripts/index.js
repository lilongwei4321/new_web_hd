(function(){
  var city_name = getQueryString('city')!=null?getQueryString('city'):'bj';
    //请求城市数据
    function cityJson (){
    	var lqhb_url  = "http://webapi.zeju.com/loupans/valla_index";
    	$.ajax({
          type: "POST",
          url: lqhb_url,
          data: {
              city_name: city_name
          },
          success: function(data) {
              if(data.message == 'succeed'){
              	var data = data.data;
              	var tuijianStr ='<ul>';
              	var remenStr = '<ul>';
              	$.each(data.hot_loupans,function(ind,item){
              			if(ind%2==0){
	              			remenStr+='<li>'
	              		}
	              		remenStr+='<dl>'+
													'<dt><a href="http://bj.zeju.com/loupan/'+item.item_spell+'/'+item.item_id+'.html" target="_blank" style="background-image:url(http://imgs.zeju.cn'+item.cover_pic+')"></a></dt>'+
													'<dd>'+
															'<h3>'+item.item_name+'</h3>'+
															'<p>'+item.sales_address+'</p>'+
															'<p><span>推荐理由</span></p>'+
															'<p>'+item.recommend+'</p>'+
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
																	'<dt><a href="http://bj.zeju.com/loupan/'+item.item_spell+'/'+item.item_id+'.html" target="_blank"><img src="http://imgs.zeju.cn'+item.cover_pic+'" alt=""></a></dt>'+
																	'<dd>'+
																			'<p>'+item.sales_address+'</p><p>';

											var obj =item.labels.split('、');
											$.each(obj,function(ind,m){
												tuijianStr+='<span>' + m + '</span>';
											});

										tuijianStr+='</p></dd></dl>';
	              		if(ind%3==2){
	              			tuijianStr+='</li>';
	              		}
              	})
              	remenStr+='</ul>';
              	$("#loupan_cont_remen").html(remenStr);
              	$("#loupan_cont_tuijian").html(tuijianStr);
              }
          },
          error : function(data){
          		console.log(data,'cuo')
          }
      })
    }

    cityJson ()
    //取得地址栏  指定参数
    function getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
})(jQuery)